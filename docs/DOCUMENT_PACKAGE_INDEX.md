# 📑 Document Package Index — Construct-OS

**Repository**: InfinityXOneSystems/construct-iq-360  
**Live App**: https://infinityxonesystems.github.io/construct-iq-360/  
**Last Updated**: 2026-02-20

---

## Overview

The Construct-OS document package provides every document type needed for professional construction operations — residential and commercial. All documents are agent-editable and can be generated automatically via the Document Pipeline workflow or through the Template module in the Command Center.

---

## Document Categories

### 1. System Documentation
| Document | Path | Description |
|----------|------|-------------|
| **Master Index** | `docs/DOCUMENT_PACKAGE_INDEX.md` | This file |
| **System Architecture** | `ARCHITECTURE.md` | Technical architecture and agent design |
| **System Identity** | `SYSTEM_IDENTITY.md` | Platform identity and mission |
| **System Roadmap** | `docs/ROADMAP.md` | Product roadmap and planned features |
| **Operations Runbook** | `docs/RUNBOOKS.md` | Operational procedures and incident response |
| **Health Check Report** | `docs/HEALTH_CHECK_REPORT.md` | Latest automated health audit |
| **Deployment Summary** | `DEPLOYMENT_SUMMARY.md` | Deployment history and procedures |

### 2. AI & Integration Guides
| Document | Path | Description |
|----------|------|-------------|
| **AI Connectors Guide** | `docs/AI_CONNECTORS.md` | ChatGPT Custom GPT + Copilot setup |
| **Copilot Mobile Instructions** | `docs/COPILOT_MOBILE_INSTRUCTIONS.md` | Step-by-step mobile Copilot config |
| **Copilot System Instructions** | `.github/copilot-instructions.md` | Codebase context for all Copilot sessions |
| **Infinity Orchestrator Integration** | `docs/INFINITY_ORCHESTRATOR_INTEGRATION.md` | Dispatch bridge and command reference |
| **Infinity Mesh Integration** | `docs/INFINITY_MESH_INTEGRATION.md` | Docker mesh network integration |
| **Infinity Vision Integration** | `docs/INFINITY_VISION_INTEGRATION.md` | Vision cortex sync guide |

### 3. Construction Templates (Interactive)
Access via Command Center → Templates module

| Template ID | Name | Category | Types |
|-------------|------|----------|-------|
| `res-new-build-bid` | Residential New Construction Bid | Proposal | Residential |
| `res-renovation-bid` | Residential Renovation / Remodel Bid | Proposal | Residential |
| `com-construction-bid` | Commercial Construction Bid | Proposal | Commercial, Mixed-Use |
| `com-ti-bid` | Tenant Improvement (TI) Bid | Proposal | Commercial |
| `change-order-form` | Change Order (CO) | Change Order | All Types |
| `subcontractor-agreement` | Subcontractor Agreement | Contract | All Types |
| `lien-waiver-conditional` | Conditional Lien Waiver | Lien Waiver | All Types |
| `checklist-preconstruction` | Pre-Construction Checklist | Checklist | All Types |
| `checklist-site-safety` | Site Safety Inspection | Checklist | All Types |
| `runbook-lead-qualification` | Lead Qualification Runbook | Runbook | All Types |
| `runbook-bid-preparation` | Bid Preparation Runbook | Runbook | All Types |

### 4. Construction Reference Documents
| Document | Path | Description |
|----------|------|-------------|
| **Project Blueprints** | `docs/BLUEPRINTS.md` | Blueprint templates and spec guides |
| **Construction Checklists** | `docs/CHECKLISTS.md` | All construction phase checklists |
| **Contract Templates** | `docs/CONTRACT_TEMPLATES.md` | Full contract template library |

### 5. Data & Pipeline Documents
| Document | Path | Description |
|----------|------|-------------|
| **Google Workspace Pipeline** | `docs/GOOGLE_WORKSPACE_PIPELINE.md` | CSV/Sheets import guide with formulas |
| **PR Sync Report** | `docs/PR_SYNC_REPORT.md` | Live PR synchronization audit |
| **Org Architecture** | `docs/ORG_ARCHITECTURE.md` | GitHub organization structure |

---

## Auto-Generated Documents

The Document Pipeline (`document-pipeline.yml`) generates documents on-demand to `data/documents/`:

### Generate via GitHub Actions UI
1. Go to **Actions** → **Document Pipeline**
2. Click **Run workflow**
3. Select document type and fill in variables
4. Documents committed automatically to `data/documents/`

### Generate via Dispatch (AI/Copilot)
```json
POST /repos/InfinityXOneSystems/construct-iq-360/dispatches
{
  "event_type": "generate-document",
  "client_payload": {
    "document_type": "proposal-commercial",
    "client_name": "ABC Development Corp",
    "project_name": "Downtown Office Tower",
    "project_value": "2500000"
  }
}
```

### Available Document Types
| Type | Description |
|------|-------------|
| `proposal-residential` | Residential construction bid |
| `proposal-commercial` | Commercial CSI-format bid |
| `proposal-ti` | Tenant improvement bid |
| `contract-subcontractor` | Subcontractor agreement |
| `checklist-preconstruction` | Pre-construction checklist |
| `checklist-safety` | Site safety inspection |
| `change-order` | Change order form |
| `lien-waiver` | Conditional lien waiver |
| `runbook-lead-qualification` | Lead qualification process |
| `runbook-bid-prep` | Bid preparation process |
| `report-pipeline-summary` | CRM pipeline summary |
| `report-billing-summary` | Billing/AR summary |

---

## Google Workspace Template Suite

### Sheets
1. **CRM Lead Pipeline** — Import from CRM module CSV export
2. **Billing Tracker** — Import from Billing module CSV export  
3. **Pipeline Summary Dashboard** — Auto-calculated from CRM + Billing sheets
4. **AR Aging Report** — 30/60/90-day aging pivot table

### Docs
1. **Construction Proposal Template** — Google Docs linked to Sheets data
2. **Invoice Template** — Google Docs for client-facing invoices
3. **Change Order Template** — Google Docs with approval workflow

See `docs/GOOGLE_WORKSPACE_PIPELINE.md` for complete setup instructions.

---

## Template Editing by Agents

All templates in `src/lib/templates.ts` have `agentEditable: true`. Agents can modify templates via:

1. **GitHub API**: `PUT /repos/InfinityXOneSystems/construct-iq-360/contents/apps/command-center/src/lib/templates.ts`
2. **Copilot Chat**: `@workspace Update the commercial bid template to add a Division 27 Communications line item`
3. **Dispatch Bridge**: Send `generate-document` with custom payload

---

*Auto-generated and maintained by Overseer-Prime. TAP Protocol: Policy > Authority > Truth.*
