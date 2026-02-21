# .infinity — Persistent Memory System

This directory contains the persistent memory system for `construct-iq-360`.

---

## Files

| File | Purpose |
|------|---------|
| `ACTIVE_MEMORY.md` | The memory store — sections: REPO_MAP, RUNTIME, STATE, LOG |
| `memory.ps1` | PowerShell management script (sync / read / write / set) |
| `validate-memory.ps1` | Local validation script — verifies sections and basic behavior |
| `README.md` | This file |

---

## Requirements

- **PowerShell 5.1** (Windows) or **PowerShell 7+** (cross-platform / macOS / Linux)
- **Git** available on `PATH` and the working directory must be the repository root (or any subdirectory)
- **Authentication:** `git push` requires write access to the repository. Configure one of:
  - SSH key (`git remote set-url origin git@github.com:InfinityXOneSystems/construct-iq-360.git`)
  - HTTPS with a stored credential / GitHub CLI (`gh auth login`)
  - `GH_TOKEN` / `GITHUB_TOKEN` environment variable when running in CI

---

## Usage

Run `memory.ps1` as a **script file**, not interactively:

```powershell
# From the repository root:
pwsh -File .infinity/memory.ps1 read
pwsh -File .infinity/memory.ps1 write "Deployed v2.1 to GitHub Pages"
pwsh -File .infinity/memory.ps1 set STATE "- Status: NOMINAL`n- Last: $(Get-Date -Format u)"
pwsh -File .infinity/memory.ps1 sync
```

### Commands

| Command | Syntax | Description |
|---------|--------|-------------|
| `read` | `memory.ps1 read` | Print `ACTIVE_MEMORY.md` to stdout |
| `write` | `memory.ps1 write <text>` | Append a UTC-timestamped bullet under the **LOG** section |
| `set` | `memory.ps1 set <SectionName> <BodyText>` | Deterministically replace (or create) a named `##` section |
| `sync` | `memory.ps1 sync` | Fetch and pull `origin main` |

Mutations commit and push only when changes are detected (idempotent).

---

## IMPORTANT — Do NOT paste `#Requires` into an interactive console

The first line of `memory.ps1` is:

```powershell
#Requires -Version 5.1
```

This is a **script-file directive** processed by the PowerShell parser when the file is loaded. It does **not** work when typed or pasted into an interactive session (`pwsh` / `powershell.exe` prompt). Doing so will cause a syntax error.

Always invoke the script with `-File`:

```powershell
# CORRECT
pwsh -File .infinity/memory.ps1 read

# WRONG — do not do this
#Requires -Version 5.1    ← do not paste this into a console
```

---

## Security Policy — Secret Blocking

`write` and `set` scan input against common secret patterns before writing:

- GitHub PATs (`ghp_…`, `github_pat_…`)
- OpenAI keys (`sk-…`)
- AWS access key IDs (`AKIA…`)
- Google API keys (`AIza…`)
- JWTs (`ey….ey….`)
- Bearer tokens
- PEM private key blocks

Any match causes the command to abort with an error. **No credential material should ever enter the memory store.**

---

## Line Endings

`memory.ps1` normalises content to **LF** (`\n`) before writing `ACTIVE_MEMORY.md`.  
`.gitattributes` at the repository root enforces:

- `*.ps1` — `text eol=crlf` on checkout for Windows PowerShell 5.1 compatibility
- `*.md`  — `text eol=lf` for consistent rendering

If you see unexpected `^M` characters on Linux/macOS after cloning, run:

```bash
git config core.autocrlf false
git rm --cached -r .
git reset --hard
```

---

## Validation

Run the local validation script (no external dependencies required):

```powershell
pwsh -File .infinity/validate-memory.ps1
```

A passing run exits with code `0` and prints `[PASS]` for each check.
