# 📖 Operational Runbooks — Construct-OS

**Purpose**: Step-by-step operational procedures for the Construct-OS platform  
**Last Updated**: 2026-02-20

---

## 1. Lead Qualification Runbook

### Trigger
Hunter Agent discovers a new lead, or manual entry in CRM module.

### Process

**Step 1: CAPTURE**
- Lead source: Hunter Agent, permit database, referral, website
- Required fields: company, contact, project type, value, address
- Enter in CRM module or auto-imported from Hunter Agent

**Step 2: VERIFY**
- Cross-reference permit database for validity
- Confirm permit status: active, not expired
- Verify project address exists

**Step 3: SCORE** (0-100)
```
Project Value $100K-$500K:  +15 points
Project Value $500K-$2M:    +20 points
Project Value $2M+:         +25 points
Commercial Project:         +10 points
Active Permit:              +15 points
Decision Maker Contact:     +15 points
Previous Customer:          +20 points
Referral Source:            +10 points
```

**Step 4: ROUTE**
- Score ≥ 70 (Hot): Same-day outreach required
- Score 50-69 (Warm): 24-hour outreach target
- Score < 50 (Cold): Weekly batch outreach

**Step 5: RESEARCH**
- Company: website, LinkedIn, news
- Decision maker: LinkedIn profile, title, tenure
- Recent projects: news, permit history
- Competitors working with them

**Step 6: OUTREACH**
- First contact: email + call within target timeframe
- Subject line: `[Project Name] — Construction Partnership Opportunity`
- Personalize with specific project details
- Clear call-to-action: site visit, meeting, or call

**Step 7: LOG**
- Update CRM status to "Contacted"
- Log contact method, date, and outcome
- Set follow-up date (5-7 days)
- Add notes on key findings

**Step 8: FOLLOW-UP CADENCE**
```
Day 1:  Initial email + call
Day 5:  Follow-up email if no response
Day 10: Second call + LinkedIn message
Day 15: Final touchpoint ("closing the loop" email)
Day 30: Nurture sequence (monthly touches)
```

### KPIs
- Leads per week: ≥ 5
- Contact rate: ≥ 60%
- Proposal rate: ≥ 30%
- Win rate: ≥ 15%
- Average deal size: ≥ $500K

---

## 2. Bid Preparation Runbook

### Trigger
Qualified lead requests a proposal, or an RFP/ITB is received.

### Phase 1: Bid Decision (Day 0)
- [ ] Review bid documents for completeness
- [ ] Identify scope and complexity
- [ ] Assess win probability
- [ ] Calculate bid/no-bid based on:
  - Relationship with client
  - Project fit with capabilities
  - Competitive landscape
  - Current workload
- [ ] Schedule site visit

### Phase 2: Plan Review (Day 1-2)
- [ ] Download all drawings and specifications
- [ ] Review plan set for scope understanding
- [ ] Identify long-lead items
- [ ] Note all addenda
- [ ] Perform preliminary quantity survey
- [ ] Create scope matrix

### Phase 3: Estimating (Day 2-5)
- [ ] Detailed quantity takeoff by CSI division
- [ ] Request material pricing from suppliers
- [ ] Identify all required subcontractors
- [ ] Send scope packages to 3+ subs per trade
- [ ] Follow up on sub pricing 48h before due date
- [ ] Calculate direct labor hours
- [ ] Apply labor rates (journeyman, foreman, superintendent)
- [ ] Calculate equipment costs
- [ ] Calculate general conditions costs

### Phase 4: Pricing (Day 5-6)
- [ ] Compile all costs into bid form
- [ ] Apply overhead (10-15%)
- [ ] Apply profit (5-10%)
- [ ] Review with principal/estimator
- [ ] Value engineering pass
- [ ] Risk review (site conditions, weather, escalation)

### Phase 5: Proposal Assembly (Day 6-7)
- [ ] Select template: `com-construction-bid` or `res-new-build-bid`
- [ ] Fill in all template variables
- [ ] Include proper exclusions and clarifications
- [ ] Attach required forms (bond, license, insurance)
- [ ] Proof-read for completeness and accuracy
- [ ] Principal review and signature

### Phase 6: Submission (Day 7)
- [ ] Submit at least 1 hour before deadline
- [ ] Confirm receipt (email or portal)
- [ ] Log submission in CRM with all details
- [ ] Schedule follow-up call (5 days post-bid)

---

## 3. Project Kickoff Runbook

### Trigger
Proposal accepted; contract executed; Notice to Proceed (NTP) received.

### Week 1: Mobilization
- [ ] Project team assembled and introduced
- [ ] Project schedule developed (CPM)
- [ ] Subcontractor contracts issued
- [ ] Permit applications submitted
- [ ] Site setup: fence, utilities, signage, safety
- [ ] Pre-construction meeting scheduled
- [ ] Subcontractor pre-qualification completed

### Week 2-3: Pre-Construction
- [ ] Pre-construction meeting held (all parties)
- [ ] Submittals log created; first submittals distributed
- [ ] RFI log created
- [ ] Procurement schedule developed
- [ ] Long-lead items ordered
- [ ] Preliminary safety plan issued

### Week 4+: Construction Phase
- [ ] Daily site logs maintained
- [ ] Weekly owner meetings (OAC meetings)
- [ ] Weekly subcontractor coordination calls
- [ ] Monthly payment applications (AIA G702/G703)
- [ ] Continuous RFI management
- [ ] Submittal review and approval tracking
- [ ] Quality control inspections
- [ ] Safety audits (weekly)

---

## 4. System Operations Runbook

### Daily Operations (Automated)
The following run automatically without human intervention:

| Time (UTC) | Action | Workflow |
|-----------|--------|---------|
| 08:00 | Lead hunting — Orlando permit database | hunter-cron.yml |
| Continuous | Heartbeat monitoring (every 5 min) | heartbeat.yml |
| On PR creation | Auto-merge validation | auto-merge.yml |
| On failure | Self-repair diagnosis | self-repair.yml |

### Every 6 Hours (Automated)
| Action | Workflow |
|--------|---------|
| Genesis Loop self-improvement | genesis-loop.yml |
| Agent validation | genesis-loop.yml |
| System health check | genesis-loop.yml |

### Manual Operations
| Action | How |
|--------|-----|
| Generate a document | Actions → Document Pipeline → Run workflow |
| Deploy the app | Push to main or Actions → Deploy Command Center |
| Send Orchestrator command | AI Hub → Orchestrator → Trigger Dispatch |
| View lead data | Command Center → CRM |
| Export CRM to Google Sheets | CRM → Export CSV → Import to Sheets |
| Create an invoice | Billing → New Invoice |

---

## 5. Incident Response Runbook

### P1 — Critical (System Down)
1. Check GitHub Actions for failed workflows
2. Check `docs/HEALTH_CHECK_REPORT.md` for last health check
3. Review `self-repair.yml` logs for auto-repair attempts
4. Manually trigger `genesis-loop.yml` to re-validate
5. If app is down: Check deploy logs, verify GitHub Pages status
6. Create issue labeled `critical` with full details

### P2 — High (Key Feature Broken)
1. Identify affected module (CRM, Billing, Templates, Auth)
2. Check browser console for JavaScript errors
3. Check network tab for failed API calls
4. Review recent commits for the affected file
5. Revert if needed: `git revert` and push

### P3 — Medium (Non-Critical Issue)
1. Create GitHub Issue with `bug` label
2. Hunter Agent and dispatch bridge continue operating
3. Fix in next PR

---

*Maintained by Overseer-Prime · Infinity X One Systems*
