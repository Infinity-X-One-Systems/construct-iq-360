# 🏛️ Infinity X One Systems — Organization Architecture & Repo Consolidation Guide

**Document Authority:** Overseer-Prime — TAP Protocol v2
**Repository:** `InfinityXOneSystems/construct-iq-360`
**Status:** STRATEGIC ADVISORY — ACTIONABLE
**Generated:** 2026-02-19

---

## 1. Is This System Redundant?

**Short answer: No — but it needs to be properly positioned.**

`construct-iq-360` is a **vertical execution node**, not a general-purpose system. It specializes in construction. The concern about redundancy is valid at the *org level* — if other repos are trying to do the same thing (autonomous agent orchestration, self-healing workflows, dispatch routing), you have duplication. The fix is not to remove this repo, but to clearly assign every repo a single, non-overlapping role.

---

## 2. Your 12 Repositories — Assessed

| Repository | Language | Assessment | Recommended Fate |
|---|---|---|---|
| `infinity-orchestrator` | Shell | The GitHub App — command brain. Hub of the entire system. | **KEEP — Core Hub** |
| `infinity-core` | Python | Sovereign core runtime: shared agents, TAP enforcement, common libraries. | **KEEP — Protected Core** |
| `infinity-core-memory` | (none) | Likely an early attempt at what `infinity-core` now does. | **MERGE INTO infinity-core → ARCHIVE** |
| `infinity-vision` | Python | AI/vision capabilities. Could be a standalone vertical or a module inside `infinity-core`. | **KEEP — AI Vertical** |
| `infinity-knowledge` | (none) | Vault / knowledge base. Needs content. Strong concept. | **KEEP — Vault Vertical** |
| `construct-iq-360` | Python | Construction vertical execution node. Has mature autonomous workflows. | **KEEP — Construction Vertical** |
| `next-gen-ai` | JavaScript | Unclear scope. If it's a UI or LLM interface, it belongs in `infinity-core` or a new `infinity-studio` repo. | **EVALUATE → likely ARCHIVE** |
| `infinity-products` | (none) | Product registry? Needs definition. If it's a storefront/listing, it's a vertical. | **DEFINE or ARCHIVE** |
| `infinity-factory` | (none) | Sounds like the invention engine. Potentially the right home for genesis-builder logic. | **MERGE INTO infinity-core or DEFINE** |
| `infinity-matrix` | (none) | No clear definition. Matrix could be a cross-repo coordination tool — but `infinity-orchestrator` already fills that role. | **ARCHIVE** |
| `celebrity-ai` | (none) | Niche vertical. No current content. | **ARCHIVE or DEFER** |
| `_ARCHIVE_2026` | Shell | Already an archive. | **ARCHIVE (use for all archived repos)** |

---

## 3. Recommended Final Structure — 5 Core Repos

After cleaning, the organization should have exactly **5 active repositories** and 1 archive:

```
Infinity-X-One-Systems/
│
├── 🔐 infinity-core          ← PROTECTED SOVEREIGN CORE
├── 🧠 infinity-orchestrator  ← COMMAND HUB (GitHub App)
├── 🔭 infinity-vision        ← AI / Vision Vertical
├── 🏦 infinity-knowledge     ← Vault / Memory Vertical
├── 🏗️ construct-iq-360       ← Construction Vertical
│
└── 📦 _ARCHIVE_2026          ← Archive (all deprecated repos go here as subfolders or releases)
```

### Why exactly these 5?

| Repo | Role | Access Level |
|---|---|---|
| `infinity-core` | Protected sovereign core: shared libraries, TAP enforcer, agent base classes, common workflows | Maximum protection — changes require co-author approval + CI pass |
| `infinity-orchestrator` | GitHub App brain: receives human intent, dispatches to verticals via `repository_dispatch` | Write-protected — only App token can push |
| `infinity-vision` | AI/ML capabilities: vision models, LLM wrappers, RAG, fine-tuning | Standard autonomous |
| `infinity-knowledge` | Persistent knowledge base: vector DB, historical outcomes, market data | Standard autonomous |
| `construct-iq-360` | Construction vertical: leads, estimation, proposals, billing | Standard autonomous |

**Future verticals** (SaaS engine, mobile builder, etc.) are created on demand as new repos wired to the same hub — they do not pollute the core 5.

---

## 4. The Protected Core (`infinity-core`) — Design

This is the most important repo in your organization. It must be:

### 4.1 Branch Protection Rules (Apply in Settings → Branches)

```
Branch: main
✅ Require a pull request before merging
✅ Require approvals: 1 (from Infinity Orchestrator App token)
✅ Require status checks to pass:
   - validate-core / lint
   - validate-core / type-check
   - validate-core / security-scan
✅ Require branches to be up to date before merging
✅ Do not allow bypassing the above settings
✅ Restrict who can push to matching branches:
   - Allow: Infinity Orchestrator App
   - Allow: InfinityXOneSystems (owner, emergency only)
✅ Require signed commits (optional but recommended)
```

### 4.2 Required Secrets (in infinity-core only)

```
# Master credentials — stored ONLY in infinity-core
MASTER_TAP_TOKEN          — Signs all cross-repo dispatch commands
OPENAI_API_KEY            — Shared AI access key
ANTHROPIC_API_KEY         — Fallback LLM
DATABASE_URL              — Shared Vault DB
REDIS_URL                 — Shared cache
```

All other repos receive credentials by being dispatched FROM infinity-core — they never hold master keys.

### 4.3 What Lives in `infinity-core`

```
infinity-core/
├── agents/
│   ├── base_agent.py          ← Abstract base class for ALL agents across all repos
│   ├── tap_enforcer.py        ← TAP Protocol v2 runtime
│   └── memory_client.py       ← Interface to infinity-knowledge vault
├── workflows/
│   ├── reusable/
│   │   ├── validate.yml       ← Called by all repos via workflow_call
│   │   ├── security-scan.yml  ← Called by all repos
│   │   └── deploy.yml         ← Called by all repos
│   └── core/
│       ├── genesis-loop.yml   ← Master genesis loop
│       └── tap-guardian.yml   ← Policy enforcement on all dispatch commands
├── config/
│   ├── tap-policy.json        ← TAP rules DSL
│   └── org-registry.json      ← Map of all active repos and their roles
├── .github/
│   └── copilot-instructions.md ← Master governance (synced to all repos)
└── README.md
```

### 4.4 Reusable Workflow Pattern

Every vertical repo (construct-iq-360, infinity-vision, etc.) calls core workflows instead of duplicating them:

```yaml
# In construct-iq-360/.github/workflows/validate.yml
jobs:
  validate:
    uses: Infinity-X-One-Systems/infinity-core/.github/workflows/reusable/validate.yml@main
    secrets: inherit
```

This means governance logic lives in ONE place and is enforced everywhere automatically.

---

## 5. Hub-and-Spoke Architecture (Full System Map)

```
                    ┌─────────────────────────────┐
                    │   OPERATOR / INTENT INPUT   │
                    │  (GitHub Issue, CLI, App UI) │
                    └──────────────┬──────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │     infinity-orchestrator    │
                    │   (GitHub App — Hub Brain)   │
                    │                              │
                    │  • Receives operator intent  │
                    │  • Routes to correct vertical│
                    │  • Tracks all executions     │
                    │  • Enforces TAP at boundary  │
                    └──────────────┬──────────────┘
                                   │ repository_dispatch
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
          ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
          │infinity-vision│ │construct-iq  │ │  [future]    │
          │  AI Vertical  │ │  -360        │ │  verticals   │
          │               │ │ Construction │ │              │
          └──────┬────────┘ └──────┬───────┘ └──────────────┘
                 │                 │
                 └────────┬────────┘
                          │ reads/writes
                          ▼
             ┌─────────────────────────┐
             │    infinity-knowledge   │
             │  (Vault — Shared Brain) │
             │  vector DB, outcomes,   │
             │  market data, memory    │
             └─────────────────────────┘
                          │
                          │ base classes, policies
                          ▼
             ┌─────────────────────────┐
             │      infinity-core      │
             │  (Protected Foundation) │
             │  shared agents, TAP,    │
             │  reusable workflows     │
             └─────────────────────────┘
```

---

## 6. How `construct-iq-360` Fits (No Redundancy)

This repository is **not** the orchestrator. It does not duplicate `infinity-orchestrator`. Its role is:

| What it does | What it does NOT do |
|---|---|
| Executes construction-domain tasks | Send commands to other repos |
| Runs Hunter / Architect / Orator agents | Manage org-level governance |
| Holds construction-specific data | Hold master secrets |
| Listens for dispatch commands | Dispatch commands |
| Reports results back to Orchestrator | Make architectural decisions |

The Dispatch Bridge (`dispatch-bridge.yml`) is the **one connection point** — it receives commands from `infinity-orchestrator` and executes them. All other communication goes through that bridge.

**This repo has zero redundancy with any other repo** once the org is cleaned up as described.

---

## 7. Redundancy Analysis — What Is Actually Duplicated Today

Before the cleanup, here is where real duplication exists:

| Duplicated Capability | Where | Consolidation Action |
|---|---|---|
| "Core memory" | `infinity-core-memory` AND `infinity-core` | Merge `infinity-core-memory` content into `infinity-core`, then archive |
| "Orchestration/dispatch" | `infinity-orchestrator` AND `infinity-matrix` | `infinity-matrix` has no definition — archive it |
| "AI/vision" | `infinity-vision` AND `next-gen-ai` | Evaluate `next-gen-ai`; if it's just a UI prototype, absorb into `infinity-vision` or archive |
| "Factory/builder" | `infinity-factory` AND dispatch-bridge in this repo | Define `infinity-factory` clearly OR merge its intent into `infinity-core`'s genesis-builder module |
| "Products" | `infinity-products` (undefined) | Define as a product registry vertical OR archive |

---

## 8. Org Cleanup Action Plan (Ordered)

```
Step 1: PROTECT infinity-core
  → Apply branch protection rules (Section 4.1)
  → Move master secrets into infinity-core only
  → Create reusable workflow directory

Step 2: DEFINE infinity-orchestrator as GitHub App
  → Ensure it has write access (repository_dispatch) to all 5 repos
  → Remove any duplicated orchestration logic from other repos

Step 3: MERGE infinity-core-memory → infinity-core
  → Extract any unique content from infinity-core-memory
  → Commit it into infinity-core under /memory/ or /vault/
  → Archive infinity-core-memory

Step 4: EVALUATE next-gen-ai and infinity-factory
  → If next-gen-ai = UI layer → merge into infinity-vision or create infinity-studio
  → If infinity-factory = genesis-builder → merge intent into infinity-core
  → Archive both after migration

Step 5: ARCHIVE low-priority repos
  → celebrity-ai → _ARCHIVE_2026
  → infinity-matrix → _ARCHIVE_2026
  → infinity-products → _ARCHIVE_2026 (or define it)

Step 6: WIRE remaining 5 repos
  → Add dispatch-bridge.yml to: infinity-vision, infinity-knowledge
  → All 5 repos use reusable workflows from infinity-core
  → Verify org-registry.json in infinity-core lists all 5

Step 7: VALIDATE
  → Run sync-validator on all 5 repos
  → Confirm dispatch commands flow end-to-end
  → Confirm no repo holds duplicate logic
```

---

## 9. Cross-Repo Access: Local, Remote, Cloud

To give the system access to your local machine, remote servers, and cloud environments, configure these in `infinity-orchestrator`:

```yaml
# In infinity-orchestrator — environment access matrix
environments:
  local:
    method: GitHub Actions self-hosted runner
    runner_label: local-machine
    setup: Install GitHub Actions runner on your machine
    docs: https://docs.github.com/en/actions/hosting-your-own-runners

  remote:
    method: Self-hosted runner on VPS / cloud VM
    runner_label: remote-vps
    setup: Install GitHub Actions runner on remote server

  cloud:
    method: GitHub-hosted runners (ubuntu-latest, windows-latest, macos-latest)
    runner_label: ubuntu-latest (default)

  all_personal_repos:
    method: Fine-grained PAT with repo:all scope
    secret: PERSONAL_REPO_TOKEN
    note: Store in infinity-core secrets only
```

**Self-hosted runner setup** (for local access):
```bash
# On your local machine
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.321.0.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.321.0/actions-runner-linux-x64-2.321.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.321.0.tar.gz
./config.sh --url https://github.com/Infinity-X-One-Systems --token YOUR_RUNNER_TOKEN
./run.sh
```

Once registered, any workflow can target your local machine:
```yaml
runs-on: [self-hosted, local-machine]
```

---

## 10. Decision Summary

| Question | Answer |
|---|---|
| Should I clone this into the Orchestrator? | No — wire it via dispatch-bridge.yml (already done) |
| Is construct-iq-360 redundant? | No — it is a correctly-scoped vertical node |
| How many repos should I keep? | 5 active + 1 archive |
| Which repo is the protected core? | `infinity-core` (apply branch protection + hold master secrets) |
| What is actually redundant? | `infinity-core-memory`, `infinity-matrix`, `infinity-factory` (undefined), `celebrity-ai` (undefined) |
| How do I give system access everywhere? | Self-hosted runners (local + remote) + fine-grained PAT in infinity-core |
| What enforces all this? | TAP Protocol v2 in every dispatch command + reusable workflows from infinity-core |

---

*Document generated by Overseer-Prime. TAP Protocol: Policy > Authority > Truth.*
*Zero Human Intervention. Infinite Scale. Built on GitHub.*
