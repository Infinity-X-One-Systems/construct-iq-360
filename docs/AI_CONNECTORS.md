# 🤖 AI Connectors Guide — Construct-OS

**Platform**: Construct-OS Command Center  
**AI Integrations**: ChatGPT (GPT-4o), GitHub Copilot, Infinity Orchestrator  
**Last Updated**: 2026-02-20

---

## Overview

Construct-OS has three AI connector points:

| Connector | Purpose | Access Level |
|-----------|---------|--------------|
| **ChatGPT (GPT-4o)** | Construction AI assistant with full system context | Read + Write |
| **GitHub Copilot** | Code generation, document editing, system queries | Read + Write |
| **Infinity Orchestrator** | Autonomous command dispatch | Write (commands) |

---

## 1. ChatGPT Custom GPT Setup

### Method A: AI Hub (Recommended)
1. Navigate to **Command Center → AI Hub → ChatGPT**
2. Enter your OpenAI API key (stored in browser only)
3. Chat with GPT-4o directly — full Construct-OS system prompt loaded
4. Sample queries:
   - *"Generate a residential bid for a $500K 2-story home"*
   - *"Qualify this lead: $1.2M medical office, valid permit, verified contact"*
   - *"Write a subcontractor agreement for ABC Electrical"*

### Method B: Custom GPT Creation
1. Go to **https://chat.openai.com/gpts/create**
2. Configure:
   - **Name**: Construct-OS Assistant
   - **Description**: Construction intelligence AI for lead generation, proposals, CRM, and billing
3. **Instructions**: Copy the system prompt from AI Hub → ChatGPT tab
4. **Actions**: Add GitHub API as an action:
   ```yaml
   openapi: 3.1.0
   info:
     title: GitHub Repository API
     version: 1.0.0
   servers:
     - url: https://api.github.com
   paths:
     /repos/InfinityXOneSystems/construct-iq-360/contents/{path}:
       get:
         operationId: getFileContents
         parameters:
           - name: path
             in: path
             required: true
             schema:
               type: string
       put:
         operationId: updateFile
         parameters:
           - name: path
             in: path
             required: true
             schema:
               type: string
         requestBody:
           required: true
           content:
             application/json:
               schema:
                 type: object
                 properties:
                   message:
                     type: string
                   content:
                     type: string
                   sha:
                     type: string
     /repos/InfinityXOneSystems/construct-iq-360/dispatches:
       post:
         operationId: triggerDispatch
         requestBody:
           required: true
           content:
             application/json:
               schema:
                 type: object
   ```
5. **Authentication**: OAuth with GitHub (or API key)

### ChatGPT Capabilities
With the system prompt and GitHub API action, GPT-4o can:
- ✅ Read any file from the repository
- ✅ Generate documents and commit them
- ✅ Update template variables in `src/lib/templates.ts`
- ✅ Add new leads to `src/lib/crm.ts`
- ✅ Trigger workflow dispatches
- ✅ Generate construction proposals, contracts, and checklists

---

## 2. GitHub Copilot Setup

### Copilot Chat (VS Code)
1. Install **GitHub Copilot** + **GitHub Copilot Chat** extensions
2. Open the `construct-iq-360` repository
3. Copilot automatically reads `.github/copilot-instructions.md` for full context
4. Use `@workspace` prefix for repo-specific queries:
   ```
   @workspace Add a new CRM lead for Skyline Development with a $2M commercial project
   @workspace Generate a residential bid template for a 3-story home
   @workspace Fix the TypeScript error in the billing page
   @workspace What workflow handles document generation?
   ```

### Copilot Mobile (iOS / Android)
1. Install **GitHub Mobile** from App Store / Google Play
2. Sign in with your GitHub account
3. Open the `construct-iq-360` repo
4. Tap **Copilot** button (chat icon)
5. Copilot reads `.github/copilot-instructions.md` automatically
6. Example mobile queries:
   - *"What leads are in the pipeline right now?"*
   - *"Generate a quick proposal for John Smith, $750K renovation"*
   - *"What does the dispatch bridge do?"*
   - *"Add a pre-construction checklist for the Tavistock project"*

### Copilot Agent Mode (VS Code Insiders)
For autonomous multi-step tasks:
```
@workspace /agent Generate a complete residential bid proposal for Client: ABC Corp, Project: Luxury Villa, Value: $1.5M, and commit it to data/documents/
```

---

## 3. Infinity Orchestrator Connection

### How It Works
The Infinity Orchestrator (external system) sends `repository_dispatch` events to this repo via the GitHub API. The `dispatch-bridge.yml` workflow receives and routes commands.

### Dispatch Bridge Command Reference

| Command | Module | Description |
|---------|--------|-------------|
| `generate-document` | orator-engine | Creates documents in `data/documents/` |
| `build-project` | genesis-builder | Scaffolds new projects in `apps/` |
| `create-agent` | agent-factory | Initializes new autonomous agents |
| `deploy-system` | commander | Triggers deployment pipeline |
| `synthesize-media` | media-synthesizer | Media generation |
| `run-invention-cycle` | invention-engine | Full invention pipeline |
| `genesis-command` | genesis-loop | Self-improvement cycle |
| `tap-override` | tap-governor | Policy enforcement |

### Sending Commands
```bash
# Via GitHub API (with PAT token)
curl -X POST \
  -H "Authorization: Bearer YOUR_PAT_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/InfinityXOneSystems/construct-iq-360/dispatches \
  -d '{
    "event_type": "generate-document",
    "client_payload": {
      "document_type": "proposal-commercial",
      "client_name": "CNL Real Estate",
      "project_name": "Downtown Tower",
      "project_value": "2500000"
    }
  }'
```

### From AI Hub (UI)
1. Navigate to **Command Center → AI Hub → Orchestrator**
2. Select a command type or write custom JSON
3. Click **Trigger Dispatch**
4. Monitor at **GitHub → Actions → Dispatch Bridge**

---

## 4. Runner Configuration

The **Document Pipeline** runner (`document-pipeline.yml`) handles autonomous document generation. Configure via:

1. **Manual**: Actions → Document Pipeline → Run workflow
2. **API**: Send `generate-document` dispatch event
3. **Scheduled**: Add cron trigger to the workflow

### Runner Status
Monitor all runners at: https://github.com/InfinityXOneSystems/construct-iq-360/actions

| Runner | Schedule | Purpose |
|--------|----------|---------|
| Hunter Agent | Daily 08:00 UTC | Lead discovery |
| Genesis Loop | Every 6h | Self-improvement |
| Deploy Command Center | On push | App deployment |
| Document Pipeline | On dispatch | Document generation |
| Auto Merge | On PR events | PR management |
| Self Repair | On failure | Auto-healing |

---

## Security Notes

- **PAT tokens**: Stored in browser localStorage only, never transmitted to any server other than GitHub
- **OpenAI keys**: Stored in browser localStorage only, never transmitted to any server other than OpenAI
- **Dispatch commands**: Authenticated via GitHub token — only authorized users can trigger
- **All workflows**: Run with minimum required permissions
- **No secrets in code**: All sensitive values via `${{ secrets.* }}`

---

*Maintained by Overseer-Prime · Infinity X One Systems*
