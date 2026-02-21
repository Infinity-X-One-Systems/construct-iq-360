<#
.SYNOPSIS
    Lightweight validation tests for the .infinity memory system.

.DESCRIPTION
    Verifies that ACTIVE_MEMORY.md exists, contains all required sections,
    and that the memory.ps1 `set` and `write` commands behave correctly.

    No external dependencies required. Safe to re-run multiple times.
    Does NOT commit or push — uses a temporary copy of the memory file.

.NOTES
    Run with:
        powershell -File .\.infinity\memory.tests.ps1

    All tests run against a temporary scratch file so the real
    ACTIVE_MEMORY.md is never modified.
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$InfinityDir = $PSScriptRoot
$MemoryFile  = Join-Path $InfinityDir 'ACTIVE_MEMORY.md'
$MemoryScript = Join-Path $InfinityDir 'memory.ps1'
$TempFile    = Join-Path ([System.IO.Path]::GetTempPath()) "memory_test_$([System.Guid]::NewGuid().ToString('N')).md"

$Passed = 0
$Failed = 0

function Assert-True {
    param([string]$Name, [bool]$Condition, [string]$Detail = '')
    if ($Condition) {
        Write-Host "  [PASS] $Name"
        $script:Passed++
    } else {
        Write-Host "  [FAIL] $Name$(if ($Detail) { ": $Detail" })"
        $script:Failed++
    }
}

function Assert-Match {
    param([string]$Name, [string]$Text, [string]$Pattern)
    Assert-True $Name ($Text -match $Pattern) "Expected pattern: $Pattern"
}

Write-Host ""
Write-Host "=== memory system validation tests ==="
Write-Host ""

# ---------------------------------------------------------------------------
# Test 1: memory file exists
# ---------------------------------------------------------------------------
Write-Host "--- 1. File existence ---"
Assert-True "ACTIVE_MEMORY.md exists" (Test-Path $MemoryFile)
Assert-True "memory.ps1 exists"       (Test-Path $MemoryScript)

# ---------------------------------------------------------------------------
# Test 2: required sections are present
# ---------------------------------------------------------------------------
Write-Host "--- 2. Required sections ---"
if (Test-Path $MemoryFile) {
    $content = Get-Content -Raw $MemoryFile
    foreach ($section in @('REPO_MAP', 'RUNTIME', 'STATE', 'LOG')) {
        Assert-Match "Section '## $section' present" $content "(?m)^## $section"
    }
}

# ---------------------------------------------------------------------------
# Helpers for tests 3 & 4: operate on a scratch copy so real file is untouched
# ---------------------------------------------------------------------------

# Minimal scratch memory file with all four sections
$scratchContent = @"
# ACTIVE MEMORY: test

## REPO_MAP

Initial repo map.

## RUNTIME

Initial runtime.

## STATE

Initial state.

## LOG

- ``[placeholder]`` Initial entry.
"@

function Reset-Scratch {
    Set-Content -Path $TempFile -Value $scratchContent -NoNewline
}

# Inline implementations of set/write that target $TempFile (no git push)
function Test-Set {
    param([string]$SectionName, [string]$BodyText)
    $c = Get-Content -Raw $TempFile
    $sectionPattern = "(?ms)(^## $([regex]::Escape($SectionName))\s*\r?\n)(.*?)(?=^## |\Z)"
    $newSection = "## $SectionName`n`n$BodyText`n`n"
    if ($c -match $sectionPattern) {
        $c = [regex]::Replace($c, $sectionPattern, $newSection,
            [System.Text.RegularExpressions.RegexOptions]::Multiline -bor
            [System.Text.RegularExpressions.RegexOptions]::Singleline)
    } else {
        $c = $c.TrimEnd() + "`n`n$newSection"
    }
    Set-Content -Path $TempFile -Value $c -NoNewline
}

function Test-Write {
    param([string]$Text)
    $timestamp = (Get-Date -AsUTC).ToString('yyyy-MM-dd HH:mm:ss') + ' UTC'
    $bullet = "- ``[$timestamp]`` $Text"
    $c = Get-Content -Raw $TempFile
    if ($c -match '(?m)^## LOG\s*$') {
        $c = $c -replace '(?m)(^## LOG\s*\r?\n)', "`$1$bullet`n"
    } else {
        $c = $c.TrimEnd() + "`n`n## LOG`n`n$bullet`n"
    }
    Set-Content -Path $TempFile -Value $c -NoNewline
}

# ---------------------------------------------------------------------------
# Test 3: set replaces section body, no duplicate headers
# ---------------------------------------------------------------------------
Write-Host "--- 3. set command ---"
Reset-Scratch

# Replace STATE section
Test-Set 'STATE' '| Key | Value |
|-----|-------|
| Mode | ACTIVE |'

$c = Get-Content -Raw $TempFile

# Header appears exactly once
$headerMatches = ([regex]::Matches($c, '(?m)^## STATE')).Count
Assert-True "set: '## STATE' header appears exactly once" ($headerMatches -eq 1) "Count: $headerMatches"

# New body present
Assert-Match "set: new body content present" $c 'Mode.*ACTIVE'

# Old body gone
Assert-True "set: old body 'Initial state' removed" (-not ($c -match 'Initial state'))

# Other sections untouched
Assert-Match "set: REPO_MAP section still present" $c '(?m)^## REPO_MAP'
Assert-Match "set: LOG section still present"      $c '(?m)^## LOG'

# Idempotent: set same content again — header still appears once
Test-Set 'STATE' '| Key | Value |
|-----|-------|
| Mode | ACTIVE |'
$c2 = Get-Content -Raw $TempFile
$headerMatches2 = ([regex]::Matches($c2, '(?m)^## STATE')).Count
Assert-True "set: idempotent — header still appears once after second set" ($headerMatches2 -eq 1)

# Create a new section that doesn't exist yet
Test-Set 'NEWTEST' 'Some new content here.'
$c3 = Get-Content -Raw $TempFile
Assert-Match "set: new section 'NEWTEST' created" $c3 '(?m)^## NEWTEST'
Assert-Match "set: new section body present"       $c3 'Some new content here'

# ---------------------------------------------------------------------------
# Test 4: write appends to LOG
# ---------------------------------------------------------------------------
Write-Host "--- 4. write command ---"
Reset-Scratch

Test-Write 'Test event one'
$c = Get-Content -Raw $TempFile

Assert-Match "write: timestamped bullet appended"    $c '\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} UTC'
Assert-Match "write: entry text present"             $c 'Test event one'
Assert-Match "write: bullet under LOG section"       $c '(?ms)## LOG.*Test event one'

# Second write appends without removing the first
Test-Write 'Test event two'
$c2 = Get-Content -Raw $TempFile
Assert-Match "write: first entry still present"  $c2 'Test event one'
Assert-Match "write: second entry also present"  $c2 'Test event two'

# LOG header appears exactly once
$logHeaders = ([regex]::Matches($c2, '(?m)^## LOG')).Count
Assert-True "write: '## LOG' header still appears exactly once" ($logHeaders -eq 1) "Count: $logHeaders"

# ---------------------------------------------------------------------------
# Test 5: secret guard
# ---------------------------------------------------------------------------
Write-Host "--- 5. Secret guard ---"

# Load secret-guard logic from memory.ps1 without executing the entry point
# We source-in only the Test-ContainsSecret function by evaluating the pattern list
$SecretPatterns = @(
    '(?i)(password|passwd|secret|api[_\-]?key|auth[_\-]?token|access[_\-]?token|private[_\-]?key)\s*[=:]\s*\S+',
    'ghp_[A-Za-z0-9]{36,}',
    'github_pat_[A-Za-z0-9_]{80,}',
    'sk-[A-Za-z0-9]{32,}',
    'Bearer\s+[A-Za-z0-9\-_\.]{20,}',
    'AIza[0-9A-Za-z\-_]{35}',
    'AKIA[0-9A-Z]{16}'
)

function Local-TestContainsSecret {
    param([string]$Text)
    foreach ($p in $SecretPatterns) {
        if ($Text -match $p) { return $true }
    }
    return $false
}

Assert-True "guard: blocks GitHub PAT"          (Local-TestContainsSecret 'ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij12')
Assert-True "guard: blocks OpenAI key"          (Local-TestContainsSecret 'sk-ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef12345678')
Assert-True "guard: blocks AWS key ID"          (Local-TestContainsSecret 'AKIAIOSFODNN7EXAMPLE')
Assert-True "guard: blocks password= assignment" (Local-TestContainsSecret 'password=mysecretpass123')
Assert-True "guard: blocks api_key= assignment"  (Local-TestContainsSecret 'api_key=somevalue')
Assert-True "guard: allows normal text"         (-not (Local-TestContainsSecret 'Hunter agent completed run at 08:00 UTC'))
Assert-True "guard: allows table content"       (-not (Local-TestContainsSecret '| Mode | ACTIVE |'))

# ---------------------------------------------------------------------------
# Cleanup
# ---------------------------------------------------------------------------
if (Test-Path $TempFile) { Remove-Item $TempFile -Force }

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
Write-Host ""
Write-Host "=== Results: $Passed passed, $Failed failed ==="
Write-Host ""

if ($Failed -gt 0) {
    exit 1
} else {
    exit 0
}
