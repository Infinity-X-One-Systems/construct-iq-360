# 🏗️ Construct-OS: The Sovereign Construction Intelligence

[![Build Status](https://github.com/InfinityXOneSystems/construct-iq-360/workflows/Heartbeat/badge.svg)](https://github.com/InfinityXOneSystems/construct-iq-360/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Autonomous](https://img.shields.io/badge/Status-Autonomous-brightgreen.svg)](https://github.com/InfinityXOneSystems/construct-iq-360)

**A fully autonomous, self-correcting enterprise system for construction lead generation, estimation, and project management.**

> "Zero human intervention. Infinite scale. Built on GitHub. Powered by AI."

---

## 🌟 What is Construct-OS?

Construct-OS is a revolutionary autonomous system that transforms construction business development from a manual, time-consuming process into a fully automated, AI-powered operation. It runs entirely on GitHub Actions, using workflows as its "operating system" and issues as its database.

### Key Features

- 🎯 **Autonomous Lead Discovery** - Scrapes and qualifies construction projects from multiple sources daily
- 📐 **AI-Powered Estimation** - Generates detailed cost estimates using machine learning and historical data
- 🗣️ **Automatic Proposal Generation** - Creates client-ready proposals with zero human input
- 🔧 **Self-Healing Architecture** - Automatically recovers from failures and maintains system health
- 🤖 **Genesis Auto-Merge** - Autonomous PR merging with squash (zero human approval needed)
- 🔄 **Recursive Self-Improvement** - Genesis Loop optimizes codebase every 6 hours
- 📊 **Real-Time Dashboard** - Monitor all operations from a centralized command center
- 💚 **Continuous Operation** - Runs 24/7 on CRON schedules and event triggers

## 🏛️ The Pentarchy Architecture

Construct-OS operates through five specialized autonomous agents:

| Agent | Role | Technology | Trigger |
|-------|------|------------|---------|
| 🎯 **Hunter** | Lead Discovery | Python + Playwright | Daily CRON |
| 📐 **Architect** | Cost Estimation | Python + AI/ML | New Lead Event |
| 🗣️ **Orator** | Proposal Generation | Python + GPT-4 | Estimate Complete |
| 🎛️ **Commander** | Orchestration Dashboard | Next.js | Continuous |
| 🏦 **Vault** | Knowledge Base | Python + Database | State Changes |

Each agent operates independently but communicates through GitHub's infrastructure (issues, comments, labels).

## 🚀 Quick Start

### Prerequisites

- GitHub repository (this one!)
- GitHub Actions enabled
- API keys configured (OpenAI, etc.)

### Setup

1. **Configure Secrets** (Settings → Secrets → Actions):
   ```
   OPENAI_API_KEY=your_key_here
   GITHUB_TOKEN=auto_provided
   ```

2. **Enable Workflows** (Actions tab):
   - Enable all workflows in `.github/workflows/`
   - Run Heartbeat workflow manually to verify setup

3. **Verify System Health**:
   - Check `data/active_memory.md` for system status
   - View GitHub Actions logs for agent activity

That's it! The system is now autonomous and will:
- Scrape for leads daily at 8:00 AM UTC
- Monitor health every 5 minutes
- Self-repair on any failures

## 📁 Repository Structure

```
construct-iq-360/
├── .github/
│   ├── workflows/           # Autonomous job definitions
│   │   ├── heartbeat.yml    # System health (every 5 min)
│   │   ├── hunter-cron.yml  # Lead scraper (daily)
│   │   └── self-repair.yml  # Auto-recovery (on failure)
│   └── ISSUE_TEMPLATE/      # Standardized issue formats
│       ├── lead.md          # Lead capture template
│       └── bug_report.md    # Error reporting
├── apps/
│   ├── command-center/      # Next.js Dashboard (stub)
│   ├── hunter-agent/        # Python Lead Scraper
│   └── architect-ai/        # AI Estimation Engine
├── data/
│   └── active_memory.md     # System state persistence
├── ARCHITECTURE.md          # Detailed system design
└── README.md               # You are here
```

## 🔄 Autonomous Workflow

### Genesis Loop (Every 6 Hours - Zero Human Intervention)

```
Genesis Loop triggers automatically
  ↓
  🔍 Scan repository for improvements
  ↓
  📋 Plan autonomous enhancements
  ↓
  ✅ Validate system health (all agents)
  ↓
  🚀 Optimize operations & update memory
  ↓
  Recursive self-improvement complete
```

### Auto-Merge Workflow (On PR Events)

```
Autonomous agent creates PR
  ↓
  Auto-Merge workflow triggered
  ↓
  ✅ Verify CI checks pass
  ↓
  ✅ Confirm no merge conflicts
  ↓
  🏷️ Add autonomous-verified label
  ↓
  🚀 Squash and merge automatically
  ↓
  🗑️ Delete branch
  ↓
  Zero human approval needed
```

### Daily Operations (No Human Required)

```
08:00 UTC → Hunter Agent runs
  ↓
  Discovers 50 projects → Qualifies 10 → Creates Issues
  ↓
  GitHub Webhook → Architect Agent triggered
  ↓
  Analyzes leads → Generates estimates → Posts comments
  ↓
  Estimate complete → Orator Agent triggered
  ↓
  Creates proposals → Uploads PDFs → Awaits client response
```

### Every 5 Minutes

```
Heartbeat runs → Checks system health → Updates active_memory.md
  ↓
  If failure detected → Self-Repair triggered → Auto-recovery
```

## 📊 Command Center Dashboard

Access real-time system metrics (when deployed):

- **Active Leads**: Live count of qualified opportunities
- **Estimates Generated**: AI-powered cost calculations
- **Proposals Sent**: Client-ready documents created
- **System Health**: Agent status and uptime
- **Conversion Rates**: Win/loss analytics

## 🛠️ Development

### Hunter Agent
```bash
cd apps/hunter-agent
pip install -r requirements.txt
python main.py
```

### Architect AI
```bash
cd apps/architect-ai
python estimator.py --lead-id 123
```

### Command Center
```bash
cd apps/command-center
npm install
npm run dev
```

## 📖 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Detailed system design and data flows
- **Agent READMEs** - Individual agent documentation in `apps/*/README.md`
- **Workflows** - Inline documentation in `.github/workflows/*.yml`

## 🔐 Security

- No credentials in code (GitHub Secrets only)
- Minimal permissions (scoped tokens)
- Audit logs for all operations
- Private issues for sensitive data

## 🌱 Current Status

**Version:** 1.0.0 - Genesis Enhanced  
**Status:** 🟢 ONLINE (Autonomous Mode)  
**Last Scan:** See `.infinity/ACTIVE_MEMORY.md`  
**Genesis Protocol:** ✅ ACTIVE

### Implemented
- ✅ Monorepo structure
- ✅ GitHub Actions workflows (heartbeat, hunter, self-repair, auto-merge, genesis-loop)
- ✅ Agent stubs (Hunter, Architect)
- ✅ Issue templates
- ✅ Self-healing infrastructure
- ✅ Active memory persistence
- ✅ **Genesis Auto-Merge** - Zero human PR approval
- ✅ **Recursive Self-Improvement** - Genesis Loop every 6 hours
- ✅ **Autonomous Squash Merge** - Clean git history
- ✅ **Branch Auto-Delete** - Automatic cleanup

### Roadmap
- [ ] Full Hunter Agent implementation (web scraping)
- [ ] Architect AI model training
- [ ] Orator Agent (proposal generation)
- [ ] Command Center dashboard deployment
- [ ] Vault knowledge base
- [ ] Email integration
- [ ] CRM synchronization
- [ ] DevOps Team integration (auto-heal, auto-diagnose)

## 🤝 Contributing

While Construct-OS is designed to be autonomous, human contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make improvements (especially to AI models!)
4. Submit PR with tests
5. Automated CI will validate

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Support

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and community
- **Documentation**: See `/docs` directory (when available)

## 🙏 Acknowledgments

Built with:
- GitHub Actions (runtime infrastructure)
- OpenAI GPT-4 (AI capabilities)
- Python + Next.js (agent implementations)
- Open source community

---

**"Autonomous by design. Sovereign by nature. Built for scale."**

*Last updated: 2024-01-15 | Built by InfinityXOneSystems*