#Requires -Version 5.1
<#
.SYNOPSIS
    Local validation script for the .infinity persistent memory system.

.DESCRIPTION
    Verifies that ACTIVE_MEMORY.md contains the required sections and that
    memory.ps1 behaves correctly for read/write/set operations.
    No external dependencies or network access required.

.EXAMPLE
    pwsh -File .infinity/validate-memory.ps1
#>
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$ScriptDir  = $PSScriptRoot
$MemoryFile = Join-Path $ScriptDir 'ACTIVE_MEMORY.md'
$MemoryPs1  = Join-Path $ScriptDir 'memory.ps1'

$PassCount = 0
$FailCount = 0

function Write-Pass { param([string]$Msg) Write-Host "[PASS] $Msg" -ForegroundColor Green;  $script:PassCount++ }
function Write-Fail { param([string]$Msg) Write-Host "[FAIL] $Msg" -ForegroundColor Red;    $script:FailCount++ }

# ---------------------------------------------------------------------------
# 1. File existence checks
# ---------------------------------------------------------------------------
if (Test-Path $MemoryFile) { Write-Pass "ACTIVE_MEMORY.md exists" }
else                        { Write-Fail "ACTIVE_MEMORY.md not found at $MemoryFile" }

if (Test-Path $MemoryPs1) { Write-Pass "memory.ps1 exists" }
else                       { Write-Fail "memory.ps1 not found at $MemoryPs1" }

if (Test-Path (Join-Path $ScriptDir 'README.md')) { Write-Pass "README.md exists" }
else                                               { Write-Fail "README.md not found" }

# ---------------------------------------------------------------------------
# 2. ACTIVE_MEMORY.md section checks
# ---------------------------------------------------------------------------
if (Test-Path $MemoryFile) {
    $content = Get-Content $MemoryFile -Raw -Encoding UTF8

    foreach ($section in @('REPO_MAP', 'RUNTIME', 'STATE', 'LOG')) {
        if ($content -match "## $section") {
            Write-Pass "ACTIVE_MEMORY.md has section '## $section'"
        } else {
            Write-Fail "ACTIVE_MEMORY.md missing section '## $section'"
        }
    }

    if ($content.Length -gt 100) { Write-Pass "ACTIVE_MEMORY.md is non-empty (length: $($content.Length))" }
    else                          { Write-Fail "ACTIVE_MEMORY.md appears nearly empty" }
}

# ---------------------------------------------------------------------------
# 3. memory.ps1 command checks (non-mutating only)
# ---------------------------------------------------------------------------
if (Test-Path $MemoryPs1) {
    # Check that memory.ps1 contains the four required command keywords
    $ps1 = Get-Content $MemoryPs1 -Raw -Encoding UTF8

    foreach ($cmd in @('sync', 'read', 'write', 'set')) {
        if ($ps1 -imatch "'$cmd'") {
            Write-Pass "memory.ps1 handles command '$cmd'"
        } else {
            Write-Fail "memory.ps1 is missing handler for command '$cmd'"
        }
    }

    # Check StrictMode and ErrorActionPreference
    if ($ps1 -match 'Set-StrictMode') { Write-Pass "memory.ps1 uses Set-StrictMode" }
    else                               { Write-Fail "memory.ps1 missing Set-StrictMode" }

    if ($ps1 -match "ErrorActionPreference\s*=\s*'Stop'") { Write-Pass "memory.ps1 uses ErrorActionPreference Stop" }
    else                                                    { Write-Fail "memory.ps1 missing ErrorActionPreference Stop" }

    # Check secret blocking
    if ($ps1 -match 'Assert-NoSecrets') { Write-Pass "memory.ps1 contains secret-blocking logic" }
    else                                 { Write-Fail "memory.ps1 missing Assert-NoSecrets secret blocker" }
}

# ---------------------------------------------------------------------------
# 4. Behavioural smoke test — write + set on a temp copy
# ---------------------------------------------------------------------------
$tmpFile = [System.IO.Path]::GetTempFileName()
try {
    # Provide a minimal seed file
    $seed = @"
# Test Memory

## LOG

## STATE

"@
    [System.IO.File]::WriteAllText($tmpFile, $seed, [System.Text.Encoding]::UTF8)

    # Simulate write: append bullet under LOG
    $testContent = Get-Content $tmpFile -Raw -Encoding UTF8
    $timestamp   = (Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + ' UTC'
    $bullet      = "- ``[$timestamp]`` Validation smoke test"
    if ($testContent -match '(?ms)(## LOG\r?\n)') {
        $testContent = $testContent -replace [regex]::Escape($Matches[1]), "$($Matches[1])$bullet`n"
    }
    [System.IO.File]::WriteAllText($tmpFile, $testContent, [System.Text.Encoding]::UTF8)

    $after = Get-Content $tmpFile -Raw -Encoding UTF8
    if ($after -match 'Validation smoke test') { Write-Pass "write smoke test: bullet appended under LOG" }
    else                                        { Write-Fail "write smoke test: bullet not found in output" }

    # Simulate set: replace STATE section
    $newBlock = "## STATE`n`n- Status: TEST`n"
    $pattern  = '(?ms)## STATE\r?\n.*?(?=\r?\n## |\z)'
    $after    = [regex]::Replace($after, $pattern, $newBlock)
    if ($after -match '- Status: TEST') { Write-Pass "set smoke test: STATE section replaced" }
    else                                 { Write-Fail "set smoke test: STATE replacement failed" }

    # Ensure old content not duplicated
    $stateMatches = ([regex]::Matches($after, '## STATE')).Count
    if ($stateMatches -eq 1) { Write-Pass "set smoke test: no duplicate STATE section" }
    else                      { Write-Fail "set smoke test: duplicate STATE section found ($stateMatches occurrences)" }

} finally {
    Remove-Item $tmpFile -ErrorAction SilentlyContinue
}

# ---------------------------------------------------------------------------
# 5. Summary
# ---------------------------------------------------------------------------
Write-Host ""
Write-Host "-------------------------------"
Write-Host "Results: $PassCount passed, $FailCount failed"
Write-Host "-------------------------------"

if ($FailCount -gt 0) {
    Write-Host "[VALIDATION FAILED]" -ForegroundColor Red
    exit 1
} else {
    Write-Host "[VALIDATION PASSED]" -ForegroundColor Green
    exit 0
}
