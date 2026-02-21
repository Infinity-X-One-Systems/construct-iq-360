#Requires -Version 5.1
<#
.SYNOPSIS
    Persistent memory management for construct-iq-360.

.DESCRIPTION
    Provides sync/read/write/set commands against .infinity/ACTIVE_MEMORY.md.
    Mutations commit and push only when actual changes are detected.

    IMPORTANT: Do NOT paste the #Requires line into an interactive PowerShell
    console. It is a script-file directive only. Run this file as a script:
        pwsh -File .infinity/memory.ps1 read

.PARAMETER Command
    sync  - Fetch and pull origin main.
    read  - Print ACTIVE_MEMORY.md to stdout.
    write - Append a UTC-timestamped bullet under the LOG section.
    set   - Replace (or create) a named markdown section body.

.PARAMETER Args
    write <text>              - Text to append as a log bullet.
    set <SectionName> <Body>  - Section name and replacement body text.

.EXAMPLE
    pwsh -File .infinity/memory.ps1 read
    pwsh -File .infinity/memory.ps1 write "Deployed v2.1 to GitHub Pages"
    pwsh -File .infinity/memory.ps1 set STATE "- Status: NOMINAL"
    pwsh -File .infinity/memory.ps1 sync
#>
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
$MemoryFile = Join-Path $PSScriptRoot 'ACTIVE_MEMORY.md'

# Secret-pattern blocklist — common token shapes that must not be logged.
# Policy: no credential material may enter the memory store.
$SecretPatterns = @(
    'ghp_[A-Za-z0-9]{36}',          # GitHub personal access tokens
    'github_pat_[A-Za-z0-9_]{82}',  # GitHub fine-grained PATs
    'sk-[A-Za-z0-9]{20,}',          # OpenAI API keys
    'AKIA[0-9A-Z]{16}',             # AWS access key IDs
    'AIza[0-9A-Za-z\-_]{35}',       # Google API keys
    'ey[A-Za-z0-9\-_]{20,}\.[A-Za-z0-9\-_]{20,}\.[A-Za-z0-9\-_]{20,}',  # JWTs
    'Bearer\s+[A-Za-z0-9\-_\.]{20,}',  # Bearer tokens
    '-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----'  # Private keys
)

# ---------------------------------------------------------------------------
# Helper: check text against the secret blocklist
# ---------------------------------------------------------------------------
function Assert-NoSecrets {
    param([string]$Text)
    foreach ($pattern in $SecretPatterns) {
        if ($Text -match $pattern) {
            Write-Error "BLOCKED: Input matches a known secret pattern ($pattern). Memory write refused."
        }
    }
}

# ---------------------------------------------------------------------------
# Helper: read the memory file content
# ---------------------------------------------------------------------------
function Get-Memory {
    if (-not (Test-Path $MemoryFile)) {
        Write-Error "ACTIVE_MEMORY.md not found at: $MemoryFile"
    }
    return Get-Content $MemoryFile -Raw -Encoding UTF8
}

# ---------------------------------------------------------------------------
# Helper: write content back and commit+push if changed
# ---------------------------------------------------------------------------
function Save-Memory {
    param([string]$NewContent)

    $current = Get-Memory
    if ($current -eq $NewContent) {
        Write-Host "[memory] No changes detected — skipping commit."
        return
    }

    # Normalise to LF for consistent cross-platform behaviour
    $normalised = $NewContent -replace "`r`n", "`n"
    [System.IO.File]::WriteAllText($MemoryFile, $normalised, [System.Text.Encoding]::UTF8)

    $relativePath = '.infinity/ACTIVE_MEMORY.md'
    $timestamp = (Get-Date -Format 'yyyy-MM-dd HH:mm') + ' UTC'

    & git add $relativePath
    & git commit -m "memory: update ACTIVE_MEMORY.md [$timestamp]"
    & git push origin HEAD
    Write-Host "[memory] Committed and pushed."
}

# ---------------------------------------------------------------------------
# Command: sync
# ---------------------------------------------------------------------------
function Invoke-Sync {
    Write-Host "[memory] Syncing with origin main..."
    & git fetch origin
    & git pull origin main
    Write-Host "[memory] Sync complete."
}

# ---------------------------------------------------------------------------
# Command: read
# ---------------------------------------------------------------------------
function Invoke-Read {
    Write-Host (Get-Memory)
}

# ---------------------------------------------------------------------------
# Command: write  <text>
# ---------------------------------------------------------------------------
function Invoke-Write {
    param([string]$Text)

    if ([string]::IsNullOrWhiteSpace($Text)) {
        Write-Error "Usage: memory.ps1 write <text>"
    }

    Assert-NoSecrets -Text $Text

    $content = Get-Memory
    $timestamp = (Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + ' UTC'
    $bullet    = "- ``[$timestamp]`` $Text"

    # Find the LOG section and append the bullet after the section heading.
    # Pattern: ## LOG followed by optional blank line.
    if ($content -match '(?ms)(## LOG\r?\n)') {
        $logHeader = $Matches[1]
        $content   = $content -replace [regex]::Escape($logHeader), "$logHeader$bullet`n"
    } else {
        # LOG section missing — append it at the end.
        $content = $content.TrimEnd() + "`n`n## LOG`n`n$bullet`n"
    }

    Save-Memory -NewContent $content
    Write-Host "[memory] Log entry appended."
}

# ---------------------------------------------------------------------------
# Command: set  <SectionName>  <BodyText>
# ---------------------------------------------------------------------------
function Invoke-Set {
    param(
        [string]$SectionName,
        [string]$BodyText
    )

    if ([string]::IsNullOrWhiteSpace($SectionName) -or [string]::IsNullOrWhiteSpace($BodyText)) {
        Write-Error "Usage: memory.ps1 set <SectionName> <BodyText>"
    }

    Assert-NoSecrets -Text $BodyText

    $content = Get-Memory

    # Build the replacement block: heading + blank line + body + trailing newline.
    $newBlock = "## $SectionName`n`n$BodyText`n"

    # Match ## SectionName followed by everything up to (but not including)
    # the next ## heading or end-of-string.  (?ms) = multiline + single-line.
    $pattern = "(?ms)## $([regex]::Escape($SectionName))\r?\n.*?(?=\r?\n## |\z)"

    if ($content -match $pattern) {
        $content = [regex]::Replace($content, $pattern, $newBlock)
    } else {
        # Section does not exist — append at the end.
        $content = $content.TrimEnd() + "`n`n$newBlock"
    }

    Save-Memory -NewContent $content
    Write-Host "[memory] Section '$SectionName' updated."
}

# ---------------------------------------------------------------------------
# Entry point — parse command and dispatch
# ---------------------------------------------------------------------------
$command = if ($args.Count -gt 0) { $args[0] } else { '' }

switch ($command.ToLower()) {
    'sync'  { Invoke-Sync }
    'read'  { Invoke-Read }
    'write' {
        if ($args.Count -lt 2) {
            Write-Error "Usage: memory.ps1 write <text>"
        }
        $text = ($args[1..($args.Count - 1)] -join ' ')
        Invoke-Write -Text $text
    }
    'set' {
        if ($args.Count -lt 3) {
            Write-Error "Usage: memory.ps1 set <SectionName> <BodyText>"
        }
        $section  = $args[1]
        $bodyText = ($args[2..($args.Count - 1)] -join ' ')
        Invoke-Set -SectionName $section -BodyText $bodyText
    }
    default {
        Write-Host @"
Usage: pwsh -File .infinity/memory.ps1 <command> [arguments]

Commands:
  sync               Fetch and pull origin main
  read               Print ACTIVE_MEMORY.md
  write <text>       Append timestamped log bullet under LOG section
  set <Name> <Body>  Replace or create a markdown section

Examples:
  pwsh -File .infinity/memory.ps1 read
  pwsh -File .infinity/memory.ps1 write "Deployed v2.1"
  pwsh -File .infinity/memory.ps1 set STATE "- Status: NOMINAL"
  pwsh -File .infinity/memory.ps1 sync
"@
        exit 1
    }
}
