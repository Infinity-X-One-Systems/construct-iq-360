# .infinity Memory System

This directory contains the repository-local persistent memory system for `construct-iq-360`.

## Overview

The memory system provides a durable, Git-backed mechanism for persisting system state, runtime configuration, and an append-only log — all inside this repository. It is entirely independent of any external service.

The canonical memory file is `.infinity/ACTIVE_MEMORY.md`, which contains four structured sections:

| Section | Purpose |
|---------|---------|
| `REPO_MAP` | Repository structure reference |
| `RUNTIME` | Scheduled jobs, workflow settings |
| `STATE` | Current agent/system status |
| `LOG` | Append-only timestamped event log |

## Management Script: `memory.ps1`

### Prerequisites

- PowerShell 5.1 or PowerShell 7+ (Windows, macOS, or Linux)
- Git configured with push access (required only for `write` and `set`)

### Running the Script

Always run from a PowerShell terminal using `-File`, **not** by dot-sourcing:

```powershell
powershell -File .\.infinity\memory.ps1 <command> [args]
```

> **Note on `#Requires -RunAsAdministrator`**
> If your policy requires the script to run as administrator, add `#Requires -RunAsAdministrator` as the very first line of the *calling* script (e.g., a wrapper `.ps1` file). Do **not** paste `#Requires` directives into an interactive PowerShell console — the `#Requires` statement is only evaluated when loading a file, not in interactive sessions.

### Commands

#### `sync` — Fetch and pull from origin main

```powershell
powershell -File .\.infinity\memory.ps1 sync
```

Runs `git fetch origin` and `git pull origin main --ff-only`. Idempotent — safe to run at any time.

#### `read` — Print memory file to stdout

```powershell
powershell -File .\.infinity\memory.ps1 read
```

Outputs the full contents of `.infinity/ACTIVE_MEMORY.md`.

#### `write <text>` — Append to LOG

```powershell
powershell -File .\.infinity\memory.ps1 write "Hunter agent completed run"
```

Appends a UTC-timestamped bullet to the `## LOG` section, then commits and pushes (only if there are changes).

#### `set <SectionName> <BodyText>` — Replace a section

```powershell
powershell -File .\.infinity\memory.ps1 set STATE "| Key | Value |`n|-----|-------|`n| Mode | ACTIVE |"
```

Deterministically replaces the body of `## <SectionName>` without duplicating the header. Creates the section if it does not exist. Commits and pushes (only if there are changes).

### Idempotency

All commands are safe to re-run:
- `sync` is a standard pull — always safe.
- `read` is read-only.
- `write` with identical text will still produce a unique commit because timestamps differ.
- `set` with identical body text produces no commit (git detects no diff).

## Security Policy

**Never store secrets, API keys, tokens, or passwords in `.infinity/ACTIVE_MEMORY.md`.**

`memory.ps1` enforces this policy by scanning all input for patterns that look like credentials before writing. If a match is found, the write is rejected with an error. Patterns blocked include:

- GitHub Personal Access Tokens (`ghp_...`, `github_pat_...`)
- OpenAI API keys (`sk-...`)
- AWS access key IDs (`AKIA...`)
- Google API keys (`AIza...`)
- Generic `password=`, `api_key=`, `secret=` assignments
- `Bearer <token>` values

Use [GitHub Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) for all sensitive values.

## Validation / Tests

Run the validation script to verify the memory system is working correctly:

```powershell
powershell -File .\.infinity\memory.tests.ps1
```

This script requires no external dependencies and validates:
- Memory file exists and contains all required sections
- `set` replaces section body without duplicating headers
- `write` appends a timestamped bullet to LOG
- Secret guard blocks credential-like strings

## Line Endings on Windows

The `.gitattributes` file at the repository root configures PowerShell scripts to use `CRLF` line endings on Windows checkout. This ensures `memory.ps1` and `memory.tests.ps1` execute correctly on all platforms.

## File Structure

```
.infinity/
├── ACTIVE_MEMORY.md      # Canonical persistent memory (Git-tracked)
├── memory.ps1            # Management CLI
├── memory.tests.ps1      # Validation/test script
└── README.md             # This file
```
