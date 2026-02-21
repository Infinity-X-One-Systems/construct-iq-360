# 🗺️ System Roadmap — Construct-OS

**Platform**: Construct-OS Command Center  
**Version**: 2.0  
**Last Updated**: 2026-02-20

---

## Current Status: v2.0 ✅

### Completed in v2.0
- ✅ Professional app UI with sidebar navigation
- ✅ GitHub PAT authentication (static export compatible)
- ✅ CRM module with sortable/filterable lead table + CSV export
- ✅ Document template system (11 templates: residential, commercial, all types)
- ✅ Billing module with AIA-style invoicing and calculator
- ✅ AI Hub: ChatGPT (GPT-4o), Copilot, Orchestrator, Runner status
- ✅ Document library with all docs linked
- ✅ `.github/copilot-instructions.md` for system-wide Copilot context
- ✅ Document Pipeline workflow (`document-pipeline.yml`)
- ✅ Google Workspace pipeline documentation
- ✅ All construction document templates (proposals, contracts, checklists, runbooks)
- ✅ GitHub Pages deployment with `configure-pages` step
- ✅ Infinity Orchestrator dispatch bridge

---

## Roadmap

### v2.1 — Data Persistence (Q1 2026)
- [ ] GitHub Gist integration for persistent CRM data (no server needed)
- [ ] Lead data sync between Hunter Agent and CRM module
- [ ] Invoice PDF generation (using browser print API)
- [ ] Real permit data integration (Orange County, Seminole County APIs)

### v2.2 — Enhanced CRM (Q2 2026)
- [ ] Contact activity log / notes history per lead
- [ ] Email integration (mailto: links with pre-filled templates)
- [ ] Lead import from CSV (drag-and-drop)
- [ ] Custom lead fields / tags management
- [ ] Follow-up reminder notifications (browser notifications)

### v2.3 — Advanced Templates (Q2 2026)
- [ ] Additional template types: Material Takeoff, RFI Form, Submittal Log
- [ ] Template version history
- [ ] Team-editable templates via GitHub PR workflow
- [ ] PDF download for generated documents (html2pdf or similar)
- [ ] Google Docs auto-publish via Apps Script

### v2.4 — Billing Advanced (Q3 2026)
- [ ] Real-time tax rate lookup by jurisdiction
- [ ] Retainage release tracking
- [ ] AIA G703 Schedule of Values (full implementation)
- [ ] QuickBooks integration (export QBO format)
- [ ] Stripe payment links for invoices

### v2.5 — Mobile & PWA (Q3 2026)
- [ ] Full PWA implementation (offline support)
- [ ] Mobile-optimized layouts for all pages
- [ ] Push notifications for lead alerts
- [ ] Camera integration for site photos
- [ ] GPS location for site tracking

### v3.0 — AI-Native Platform (Q4 2026)
- [ ] AI-powered lead scoring (GPT-4o analysis)
- [ ] Auto-generated proposal first drafts
- [ ] Intelligent follow-up scheduling
- [ ] Voice-to-notes for site logs
- [ ] Competitive intelligence from permit data
- [ ] Market analysis and trend reports

### v3.5 — Multi-Tenant (2027)
- [ ] Team accounts (multiple users per company)
- [ ] Role-based access control
- [ ] White-label deployment
- [ ] API access for third-party integrations
- [ ] Webhook notifications

---

## Architecture Evolution

### Current (v2.0)
```
GitHub Pages (Static) → Next.js App → localStorage (auth)
                              ↓
                       GitHub API (data r/w)
                              ↓
                    GitHub Actions (automation)
```

### Target (v3.0)
```
GitHub Pages (Static) → Next.js App → GitHub API
                              ↓               ↓
                     OpenAI API       GitHub Gist (data)
                              ↓
                    Supabase (if needed for team features)
```

---

## Agent Roadmap

### Current Agents
| Agent | Status | Location |
|-------|--------|---------|
| Hunter Agent | ✅ Active | `apps/hunter-agent/` |
| Architect AI | ✅ Active | `apps/architect-ai/` |
| Dispatch Bridge | ✅ Active | `.github/workflows/dispatch-bridge.yml` |
| Document Pipeline | ✅ Active | `.github/workflows/document-pipeline.yml` |
| Genesis Loop | ✅ Active | `.github/workflows/genesis-loop.yml` |
| Self Repair | ✅ Active | `.github/workflows/self-repair.yml` |

### Planned Agents
| Agent | Priority | Description |
|-------|----------|-------------|
| Proposal Agent | High | Auto-generates proposals from CRM lead data |
| Follow-Up Agent | High | Automated outreach sequence management |
| Pricing Agent | Medium | Market-based cost estimating using permit data |
| Report Agent | Medium | Weekly pipeline and billing reports |
| Integration Agent | Low | Syncs with QuickBooks, Google Workspace |

---

## Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Rendering | Static export | Free hosting on GitHub Pages, no server cost |
| Auth | GitHub PAT | Matches user base, no server required |
| State | localStorage | Simplest for static site, sufficient for single-user |
| Styling | Tailwind CSS | Rapid development, consistent design system |
| Language | TypeScript strict | Catch errors at compile time, better DX |
| Deploy | GitHub Pages | Free, integrated with GitHub, CI/CD built-in |
| AI | GPT-4o + Copilot | Best-in-class for code and construction domain |

---

*Maintained by Overseer-Prime · Infinity X One Systems*  
*TAP Protocol: Policy > Authority > Truth*
