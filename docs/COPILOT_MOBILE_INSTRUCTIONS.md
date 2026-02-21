# 📱 Copilot Mobile Instructions — Construct-OS

**For**: GitHub Copilot on iOS / Android  
**Repo**: InfinityXOneSystems/construct-iq-360  
**Last Updated**: 2026-02-20

---

## What Copilot Mobile Can Do

With this repo open, GitHub Copilot Mobile has full context of the Construct-OS system and can:

- ✅ Answer questions about construction leads, CRM, billing, and templates
- ✅ Generate construction proposals, bids, and contracts
- ✅ Explain how the system works (agents, workflows, architecture)
- ✅ Help debug TypeScript and Python code
- ✅ Create new documents and suggest code changes
- ✅ Trigger workflow dispatches (requires GitHub write access)

---

## Setup Steps

### iOS
1. Download **GitHub** from the App Store
2. Sign in with your GitHub account (must have Copilot access)
3. Navigate to **InfinityXOneSystems/construct-iq-360**
4. Tap the **chat bubble icon** (Copilot) in the top right
5. Copilot is now ready with full repo context

### Android
1. Download **GitHub** from Google Play
2. Sign in with your GitHub account
3. Open **InfinityXOneSystems/construct-iq-360**
4. Tap the **Copilot** icon in the navigation bar
5. Begin chatting

---

## Recommended Mobile Queries

### Lead & CRM Queries
```
"List the current leads in the pipeline"
"What are our hot leads (score ≥ 80)?"
"How do I add a new lead to the CRM?"
"Qualify this lead: $800K commercial project, Orange County permit #12345"
```

### Document Generation
```
"Generate a quick residential bid for 2-story home, $450K, client: John Smith"
"Create a pre-construction checklist for the Tavistock project"
"Write a change order for a $25K HVAC upgrade on the CNL Tower project"
"Draft a subcontractor agreement for ABC Electrical, $150K scope"
```

### System Queries
```
"How does the Hunter Agent work?"
"What workflows run automatically?"
"How do I trigger the document pipeline?"
"What does the dispatch bridge do?"
"How do I connect ChatGPT to this system?"
```

### Code & Template Editing
```
"Add a new residential roofing template to src/lib/templates.ts"
"What variables does the commercial bid template use?"
"Fix any TypeScript errors in the CRM page"
"Add a restaurant fit-out bid template"
```

---

## Copilot System Instructions Location

The system instructions file is at:
```
.github/copilot-instructions.md
```

Copilot Mobile reads this file automatically when the repo is open. It contains:
- Full tech stack documentation
- Key file reference table
- Styling conventions
- Construction domain knowledge
- What NOT to do (static export constraints)

---

## Quick Command Reference

| What You Want | What to Say |
|--------------|-------------|
| Generate a proposal | *"Generate a [type] bid for [client], $[value] project"* |
| Check pipeline | *"What's in our lead pipeline?"* |
| Trigger a workflow | *"Trigger the document pipeline for [document type]"* |
| Update a template | *"Add [section] to the [template name] template"* |
| Debug code | *"Why is this TypeScript error happening in [file]?"* |
| Create a checklist | *"Create a pre-construction checklist for [project]"* |
| Invoice questions | *"How is retainage calculated in the billing module?"* |
| Architecture help | *"Explain how the dispatch bridge works"* |

---

## Permissions Required for Write Operations

To have Copilot commit files or trigger workflows, your GitHub account needs:
- **Write** access to `InfinityXOneSystems/construct-iq-360`
- A PAT with `repo` scope (for dispatch commands)

---

*This file is read by GitHub Copilot Mobile automatically when the repo is open.*  
*Maintained by Overseer-Prime · Infinity X One Systems*
