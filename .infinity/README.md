# .infinity — Repository-Local Memory System

This directory contains the persistent memory layer for **Construct-IQ-360**.
All autonomous agents and GitHub Actions workflows read from and write to this
directory to maintain shared context across runs.

---

## Files

| File | Purpose |
|------|---------|
| `ACTIVE_MEMORY.md` | Single source of truth — structured memory document |
| `memory.ps1` | PowerShell 5.1 CLI for reading/writing memory |
| `README.md` | This file |

---

## ACTIVE_MEMORY.md — Required Sections

The memory document must always contain the following four sections.
Any agent or workflow that updates the document must preserve them.

| Section | Purpose |
|---------|---------|
| `## REPO_MAP` | Directory index — every top-level path and its role |
| `## RUNTIME` | Environment constants (Node version, Python version, base path, etc.) |
| `## STATE` | Key/value pairs representing current system state |
| `## LOG` | Append-only timestamped event log (newest entry first) |

---

## memory.ps1 — Usage

### Prerequisites

> **#Requires -Version 5.1**
>
> The script targets **Windows PowerShell 5.1** for broadest compatibility.
> It also runs unmodified on **PowerShell 7+** (Linux/macOS/Windows).
> Execution Policy must allow local scripts. On a fresh Windows machine run:
>
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
> ```

### Commands

```powershell
# Print ACTIVE_MEMORY.md to stdout
.\.infinity\memory.ps1 read

# Re-stamp STATE.last_sync to the current UTC time
.\.infinity\memory.ps1 sync

# Append a timestamped entry to the LOG section
.\.infinity\memory.ps1 write "Hunter agent triggered — 12 leads found"

# Update (or insert) a key in the STATE section
.\.infinity\memory.ps1 set genesis_loop "every 3 hours"
.\.infinity\memory.ps1 set auto_merge disabled
```

### Running from any directory

The script resolves `ACTIVE_MEMORY.md` relative to its own location, so you can
invoke it from the repository root or from inside `.infinity/`:

```powershell
# From repo root
powershell -File .\.infinity\memory.ps1 sync

# From .infinity/
cd .infinity
.\memory.ps1 read
```

### Calling from GitHub Actions (bash)

```yaml
- name: Sync memory timestamp
  shell: pwsh
  run: ./.infinity/memory.ps1 sync

- name: Log event
  shell: pwsh
  run: ./.infinity/memory.ps1 write "Workflow ${{ github.workflow }} completed successfully"
```

---

## Strict Mode & Error Handling

`memory.ps1` enables strict mode and hard-exits on any error:

```powershell
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
```

All operations validate their inputs and return a non-zero exit code on
failure, making them safe to use in CI pipelines where `set -e` semantics
are expected.

---

## Updating This Document

When adding new agents, workflows, or runtime dependencies:

1. Add a row to the `REPO_MAP` table in `ACTIVE_MEMORY.md`.
2. Update the `RUNTIME` table if environment requirements change.
3. Run `.\.infinity\memory.ps1 sync` to update `last_sync`.
4. Append a `LOG` entry describing what changed.
