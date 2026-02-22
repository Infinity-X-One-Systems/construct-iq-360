<#
.SYNOPSIS
    Repository-local persistent memory management for construct-iq-360.

.DESCRIPTION
    Manages .infinity/ACTIVE_MEMORY.md — a Git-backed, structured memory file.
    Provides idempotent commands: sync, read, write, set.

    SECURITY POLICY: This script will refuse to write any line that matches
    common secret patterns (tokens, API keys, passwords). Never store credentials
    in the memory file. Use GitHub Secrets for all sensitive values.

.NOTES
    To run as administrator add `#Requires -RunAsAdministrator` at the top of
    the calling script. Do NOT paste that directive into an interactive console —
    it only works when loaded from a file.

    Usage:
        powershell -File .\.infinity\memory.ps1 sync
        powershell -File .\.infinity\memory.ps1 read
        powershell -File .\.infinity\memory.ps1 write "Deployed agent v2"
        powershell -File .\.infinity\memory.ps1 set STATE "| Key | Value |`n|-----|-------|`n| Mode | ACTIVE |"

.PARAMETER Command
    sync  - Fetch and pull from origin main.
    read  - Print ACTIVE_MEMORY.md to stdout.
    write - Append a UTC-timestamped bullet to the LOG section.
    set   - Replace or create a named markdown section.

.EXAMPLE
    powershell -File .\.infinity\memory.ps1 write "Hunter agent completed run"

.EXAMPLE
    powershell -File .\.infinity\memory.ps1 set RUNTIME "| Key | Value |`n|-----|-------|`n| Mode | ACTIVE |"
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
$RepoRoot   = Split-Path -Parent $PSScriptRoot
$MemoryFile = Join-Path $PSScriptRoot 'ACTIVE_MEMORY.md'

# Regex patterns that look like secrets — writing these is blocked.
# Policy: never store credentials, tokens, or keys in ACTIVE_MEMORY.md.
$SecretPatterns = @(
    '(?i)(password|passwd|secret|api[_\-]?key|auth[_\-]?token|access[_\-]?token|private[_\-]?key)\s*[=:]\s*\S+',
    'ghp_[A-Za-z0-9]{36,}',              # GitHub Personal Access Token
    'github_pat_[A-Za-z0-9_]{80,}',      # GitHub fine-grained PAT
    'sk-[A-Za-z0-9]{32,}',               # OpenAI-style key
    'Bearer\s+[A-Za-z0-9\-_\.]{20,}',    # Bearer token
    'AIza[0-9A-Za-z\-_]{35}',            # Google API key
    'AKIA[0-9A-Z]{16}'                    # AWS access key ID
)

# ---------------------------------------------------------------------------
# Helper: check text for secret patterns
# ---------------------------------------------------------------------------
function Test-ContainsSecret {
    param([string]$Text)
    foreach ($pattern in $SecretPatterns) {
        if ($Text -match $pattern) {
            return $true
        }
    }
    return $false
}

# ---------------------------------------------------------------------------
# Helper: commit and push if there are staged/unstaged changes
# ---------------------------------------------------------------------------
function Invoke-CommitAndPush {
    param([string]$Message)
    Push-Location $RepoRoot
    try {
        git add (Join-Path '.infinity' 'ACTIVE_MEMORY.md')
        $staged = git diff --staged --quiet; $hasStagedChanges = ($LASTEXITCODE -ne 0)
        if ($hasStagedChanges) {
            git commit -m $Message
            git push origin HEAD
            Write-Host "[memory] Committed and pushed: $Message"
        } else {
            Write-Host "[memory] No changes to commit."
        }
    } finally {
        Pop-Location
    }
}

# ---------------------------------------------------------------------------
# Command: sync
# ---------------------------------------------------------------------------
function Invoke-Sync {
    Push-Location $RepoRoot
    try {
        Write-Host "[memory] Fetching from origin..."
        git fetch origin
        Write-Host "[memory] Pulling origin main..."
        git pull origin main --ff-only
        Write-Host "[memory] Sync complete."
    } finally {
        Pop-Location
    }
}

# ---------------------------------------------------------------------------
# Command: read
# ---------------------------------------------------------------------------
function Invoke-Read {
    if (-not (Test-Path $MemoryFile)) {
        Write-Error "Memory file not found: $MemoryFile"
    }
    Get-Content -Raw $MemoryFile
}

# ---------------------------------------------------------------------------
# Command: write <text>
# ---------------------------------------------------------------------------
function Invoke-Write {
    param([string]$Text)

    if ([string]::IsNullOrWhiteSpace($Text)) {
        Write-Error "Usage: memory.ps1 write <text>"
    }

    if (Test-ContainsSecret $Text) {
        Write-Error "SECURITY POLICY VIOLATION: The text appears to contain a secret or credential. Aborting. Never store secrets in memory."
    }

    if (-not (Test-Path $MemoryFile)) {
        Write-Error "Memory file not found: $MemoryFile"
    }

    $timestamp = (Get-Date -AsUTC).ToString('yyyy-MM-dd HH:mm:ss') + ' UTC'
    $bullet    = "- ``[$timestamp]`` $Text"

    $content = Get-Content -Raw $MemoryFile

    # Find the LOG section and append bullet after the section header line
    if ($content -match '(?m)^## LOG\s*$') {
        # Insert the new bullet immediately after the "## LOG" header (and a blank line if present)
        $content = $content -replace '(?m)(^## LOG\s*\r?\n)', "`$1$bullet`n"
    } else {
        # LOG section missing — append it
        $content = $content.TrimEnd() + "`n`n## LOG`n`n$bullet`n"
    }

    Set-Content -Path $MemoryFile -Value $content -NoNewline
    Invoke-CommitAndPush "memory: log entry at $timestamp"
}

# ---------------------------------------------------------------------------
# Command: set <SectionName> <BodyText>
# ---------------------------------------------------------------------------
function Invoke-Set {
    param(
        [string]$SectionName,
        [string]$BodyText
    )

    if ([string]::IsNullOrWhiteSpace($SectionName) -or [string]::IsNullOrWhiteSpace($BodyText)) {
        Write-Error "Usage: memory.ps1 set <SectionName> <BodyText>"
    }

    if (Test-ContainsSecret $BodyText) {
        Write-Error "SECURITY POLICY VIOLATION: The body text appears to contain a secret or credential. Aborting. Never store secrets in memory."
    }

    if (-not (Test-Path $MemoryFile)) {
        Write-Error "Memory file not found: $MemoryFile"
    }

    $content = Get-Content -Raw $MemoryFile
    $header  = "## $SectionName"

    # Pattern: ## SECTION_NAME followed by everything up to the next ## heading or end-of-file
    $sectionPattern = "(?ms)(^## $([regex]::Escape($SectionName))\s*\r?\n)(.*?)(?=^## |\Z)"

    $newSection = "$header`n`n$BodyText`n`n"

    if ($content -match $sectionPattern) {
        # Replace existing section body (keep the header, replace body)
        $content = [regex]::Replace($content, $sectionPattern, $newSection, [System.Text.RegularExpressions.RegexOptions]::Multiline -bor [System.Text.RegularExpressions.RegexOptions]::Singleline)
    } else {
        # Section not found — append it before the last trailing newlines
        $content = $content.TrimEnd() + "`n`n$newSection"
    }

    Set-Content -Path $MemoryFile -Value $content -NoNewline
    $timestamp = (Get-Date -AsUTC).ToString('yyyy-MM-dd HH:mm:ss') + ' UTC'
    Invoke-CommitAndPush "memory: set section '$SectionName' at $timestamp"
}

# ---------------------------------------------------------------------------
# Entry point — parse arguments
# ---------------------------------------------------------------------------
if ($args.Count -eq 0) {
    Write-Host @"
Usage:
  powershell -File .\.infinity\memory.ps1 <command> [args]

Commands:
  sync               Fetch and pull from origin main
  read               Print ACTIVE_MEMORY.md to stdout
  write <text>       Append a UTC-timestamped entry to the LOG section
  set <Name> <Body>  Replace or create a named markdown section

Examples:
  powershell -File .\.infinity\memory.ps1 read
  powershell -File .\.infinity\memory.ps1 write "Hunter agent completed run"
  powershell -File .\.infinity\memory.ps1 set STATE "| Key | Value |"
"@
    exit 0
}

$command = $args[0]

switch ($command) {
    'sync'  { Invoke-Sync }
    'read'  { Invoke-Read }
    'write' {
        if ($args.Count -lt 2) {
            Write-Error "Usage: memory.ps1 write <text>"
        }
        Invoke-Write ($args[1..($args.Count - 1)] -join ' ')
    }
    'set' {
        if ($args.Count -lt 3) {
            Write-Error "Usage: memory.ps1 set <SectionName> <BodyText>"
        }
        Invoke-Set $args[1] ($args[2..($args.Count - 1)] -join ' ')
    }
    default {
        Write-Error "Unknown command: '$command'. Valid commands: sync, read, write, set"
    }
}
