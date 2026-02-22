#Requires -Version 5.1
<#
.SYNOPSIS
    Repository-local memory management for Construct-IQ-360.

.DESCRIPTION
    Provides four commands to manage .infinity/ACTIVE_MEMORY.md:
      sync  - Re-timestamp the STATE.last_sync field to the current UTC time.
      read  - Print the contents of ACTIVE_MEMORY.md to stdout.
      write - Append a timestamped entry to the LOG section.
      set   - Update (or insert) a key=value pair in the STATE section.

    All operations are idempotent and safe to re-run.

.PARAMETER Command
    One of: sync | read | write | set

.PARAMETER Key
    (set only) The STATE key to update, e.g. "auto_merge".

.PARAMETER Value
    (set/write) The value to store or the log message to append.

.EXAMPLE
    # Print current memory
    .\memory.ps1 read

.EXAMPLE
    # Synchronise the last_sync timestamp
    .\memory.ps1 sync

.EXAMPLE
    # Append a log entry
    .\memory.ps1 write "Hunter agent triggered — 12 leads found"

.EXAMPLE
    # Update a STATE key
    .\memory.ps1 set genesis_loop "every 3 hours"

.NOTES
    #Requires -Version 5.1
    This script targets Windows PowerShell 5.1 for broadest compatibility.
    It also runs on PowerShell 7+ (cross-platform).
    Run from the repository root or from the .infinity/ directory.
#>

param(
    [Parameter(Mandatory = $true, Position = 0)]
    [ValidateSet('sync', 'read', 'write', 'set')]
    [string]$Command,

    [Parameter(Position = 1)]
    [string]$Key = '',

    [Parameter(Position = 2)]
    [string]$Value = ''
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ---------------------------------------------------------------------------
# Resolve the path to ACTIVE_MEMORY.md regardless of working directory
# ---------------------------------------------------------------------------
$ScriptDir   = Split-Path -Parent $MyInvocation.MyCommand.Definition
$MemoryFile  = Join-Path $ScriptDir 'ACTIVE_MEMORY.md'

if (-not (Test-Path $MemoryFile)) {
    Write-Error "ACTIVE_MEMORY.md not found at: $MemoryFile"
    exit 1
}

# ---------------------------------------------------------------------------
# Helper: read all lines
# ---------------------------------------------------------------------------
function Read-Memory {
    return [System.IO.File]::ReadAllLines($MemoryFile)
}

# ---------------------------------------------------------------------------
# Helper: write all lines (preserves Unix LF when possible)
# ---------------------------------------------------------------------------
function Write-Memory {
    param([string[]]$Lines)
    [System.IO.File]::WriteAllLines($MemoryFile, $Lines)
}

# ---------------------------------------------------------------------------
# COMMAND: read
# ---------------------------------------------------------------------------
function Invoke-Read {
    Get-Content -Path $MemoryFile -Raw | Write-Host
}

# ---------------------------------------------------------------------------
# COMMAND: sync  — update STATE.last_sync to now (UTC ISO-8601)
# ---------------------------------------------------------------------------
function Invoke-Sync {
    $now   = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
    $lines = Read-Memory
    $found = $false

    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '^\|\s*last_sync\s*\|') {
            $lines[$i] = "| last_sync | $now |"
            $found = $true
            break
        }
    }

    if (-not $found) {
        Write-Warning "STATE section key 'last_sync' not found — no changes written."
        exit 1
    }

    Write-Memory $lines
    Write-Host "sync: last_sync updated to $now"
}

# ---------------------------------------------------------------------------
# COMMAND: write  — append a LOG entry
# ---------------------------------------------------------------------------
function Invoke-Write {
    param([string]$Message)

    if ([string]::IsNullOrWhiteSpace($Message)) {
        Write-Error "write: a non-empty message is required (Position 1)."
        exit 1
    }

    $ts    = (Get-Date).ToUniversalTime().ToString('yyyy-MM-dd HH:mm:ss')
    $entry = "| $ts | $Message |"
    $lines = Read-Memory

    # Find the LOG section header, then insert after the table header + separator row
    $logHeaderIdx = -1
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '^##\s+LOG') {
            $logHeaderIdx = $i
            break
        }
    }

    if ($logHeaderIdx -lt 0) {
        Write-Error "write: LOG section not found in ACTIVE_MEMORY.md."
        exit 1
    }

    # Find the separator row (|----|) after the header
    $insertIdx = -1
    for ($i = $logHeaderIdx + 1; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '^\|[-| ]+\|') {
            $insertIdx = $i + 1   # insert immediately after separator
            break
        }
    }

    if ($insertIdx -lt 0) {
        Write-Error "write: LOG table separator not found."
        exit 1
    }

    $newLines = New-Object 'System.Collections.Generic.List[string]'
    $newLines.AddRange([string[]]$lines)
    $newLines.Insert($insertIdx, $entry)
    Write-Memory $newLines.ToArray()
    Write-Host "write: log entry added — $entry"
}

# ---------------------------------------------------------------------------
# COMMAND: set  — update or insert a STATE key=value
# ---------------------------------------------------------------------------
function Invoke-Set {
    param([string]$K, [string]$V)

    if ([string]::IsNullOrWhiteSpace($K)) {
        Write-Error "set: Key (Position 1) is required."
        exit 1
    }
    if ([string]::IsNullOrWhiteSpace($V)) {
        Write-Error "set: Value (Position 2) is required."
        exit 1
    }

    $lines    = Read-Memory
    $newEntry = "| $K | $V |"
    $found    = $false

    for ($i = 0; $i -lt $lines.Count; $i++) {
        # Match existing key row inside STATE table (key is first column)
        if ($lines[$i] -match "^\|\s*$([regex]::Escape($K))\s*\|") {
            $lines[$i] = $newEntry
            $found = $true
            break
        }
    }

    if (-not $found) {
        # Insert before the closing blank line of the STATE section
        $stateHeaderIdx = -1
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match '^##\s+STATE') {
                $stateHeaderIdx = $i
                break
            }
        }

        if ($stateHeaderIdx -lt 0) {
            Write-Error "set: STATE section not found in ACTIVE_MEMORY.md."
            exit 1
        }

        # Find end of STATE table (first blank line or next ## section after header)
        $insertIdx = -1
        for ($i = $stateHeaderIdx + 1; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match '^##\s' -or ($lines[$i].Trim() -eq '' -and $i -gt $stateHeaderIdx + 3)) {
                $insertIdx = $i
                break
            }
        }

        if ($insertIdx -lt 0) { $insertIdx = $lines.Count }

        $newLines = New-Object 'System.Collections.Generic.List[string]'
        $newLines.AddRange([string[]]$lines)
        $newLines.Insert($insertIdx, $newEntry)
        Write-Memory $newLines.ToArray()
        Write-Host "set: key '$K' inserted with value '$V'"
        return
    }

    Write-Memory $lines
    Write-Host "set: key '$K' updated to '$V'"
}

# ---------------------------------------------------------------------------
# Dispatch
# ---------------------------------------------------------------------------
switch ($Command) {
    'read'  { Invoke-Read }
    'sync'  { Invoke-Sync }
    'write' { Invoke-Write -Message $Key }   # Key slot doubles as message when no Key needed
    'set'   { Invoke-Set   -K $Key -V $Value }
}
