# 📘 CONSTRUCT-OS RUNBOOK
Complete Execution Manual

**Version:** 2.0.0  
**Status:** ✅ PRODUCTION READY

## 🚀 Quick Access

**Dashboard:** https://infinityxonesystems.github.io/construct-iq-360/

## System Components

### 1. Hunter Agent (Lead Scraper)
```bash
cd apps/hunter-agent
python main.py
```

### 2. Scraper API (REST Interface)
```bash
cd apps/hunter-agent
python scraper_api.py
```

### 3. Command Center (Dashboard)
```bash
cd apps/command-center
npm run dev
```

## Autonomous Workflows

- **Hunter-Cron:** Daily at 08:00 UTC
- **Genesis Loop:** Every 6 hours
- **Auto-Merge:** On PR events
- **Heartbeat:** Every 5 minutes
- **Deploy Dashboard:** On push to main

## Zero-Touch Operations

System operates autonomously with:
- Auto-discovery of construction leads
- Self-healing on failures
- Autonomous PR merging
- Recursive self-improvement

## Monitoring

```bash
# System status
cat .infinity/ACTIVE_MEMORY.md

# Latest leads
cat data/raw-leads/$(date +%Y-%m-%d).json

# Workflow status
gh run list
```

---

**"Autonomous by design. Sovereign by nature. Built for scale."**
