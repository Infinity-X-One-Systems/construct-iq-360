'use client';

import { useState } from 'react';

type Module = {
  id: string;
  label: string;
  category: string;
  icon: string;
  duration: string;
  sections: { heading: string; body: string; code?: string; note?: string }[];
};

const MODULES: Module[] = [
  {
    id: 'quickstart',
    label: 'Quick Start',
    category: 'Getting Started',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    duration: '5 min',
    sections: [
      {
        heading: '1. Get a GitHub Personal Access Token',
        body: 'Go to GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens. Create a token with the following permissions on InfinityXOneSystems/construct-iq-360:\n• Contents: Read\n• Actions: Read & Write (for dispatching workflows)\n• Pull requests: Read\n\nFor Infinity Orchestrator commands also add Actions: R/W on Infinity-X-One-Systems/infinity-orchestrator.',
        note: 'Your token is stored only in your browser (localStorage). It is never sent to any server — only to api.github.com.',
      },
      {
        heading: '2. Log in to the Command Center',
        body: 'Navigate to the login page. Paste your PAT into the token field and click "Sign In". The system calls api.github.com/user to verify your token and stores your GitHub username and avatar.',
        code: '# The Command Center is deployed at:\nhttps://infinityxonesystems.github.io/construct-iq-360/',
      },
      {
        heading: '3. Explore the dashboard',
        body: 'Once authenticated, you are redirected to the Dashboard. It shows:\n• System metrics (leads, invoices, agents, templates)\n• Agent pipeline status\n• Recent activity feed\n• Quick-action links to every module',
      },
    ],
  },
  {
    id: 'crm',
    label: 'CRM / Leads',
    category: 'Operations',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    duration: '8 min',
    sections: [
      {
        heading: 'Lead Pipeline Overview',
        body: 'All construction leads move through a five-stage pipeline:\n• New — freshly discovered by the Hunter agent\n• Qualified — value confirmed above $100K threshold\n• Proposal — proposal or bid sent to prospect\n• Won — contract awarded\n• Lost — opportunity closed',
      },
      {
        heading: 'Sorting and Filtering',
        body: 'Click any column header to sort. Use the search box to filter by company name, contact or location. The status badge filter narrows results to a single pipeline stage.',
      },
      {
        heading: 'Lead Detail Panel',
        body: 'Click any row to open the detail panel on the right. It shows all lead metadata, contact info, notes and the full activity timeline.',
      },
      {
        heading: 'CSV Export for Google Workspace',
        body: 'Click "Export CSV" to download all leads in the Google Workspace schema. Import directly into Google Sheets using File → Import → Upload.',
        code: '# CSV column schema:\nID, Company, Contact, Email, Phone, Value,\nStatus, Source, Location, Date, Notes',
      },
      {
        heading: 'Hunter Agent Integration',
        body: 'The Hunter agent (apps/hunter-agent/main.py) scrapes Orlando-area construction permits daily via hunter-cron.yml and writes results to data/raw-leads/YYYY-MM-DD.json. Leads appear in the CRM automatically.',
      },
    ],
  },
  {
    id: 'templates',
    label: 'Templates',
    category: 'Operations',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    duration: '10 min',
    sections: [
      {
        heading: 'Available Templates (11)',
        body: 'Residential:\n• Residential Bid Proposal\n• Residential Change Order\n• Residential Lien Waiver\n\nCommercial:\n• Commercial Bid Proposal (CSI MasterFormat Div 01-33)\n• Tenant Improvement (TI) Bid\n• Commercial Change Order\n• Subcontractor Agreement\n\nBilling:\n• AIA G702 Application for Payment\n• AIA G703 Continuation Sheet\n\nDocumentation:\n• Pre-Construction Checklist\n• Project Closeout Checklist',
      },
      {
        heading: 'Generating a Document',
        body: '1. Select a template from the grid on the left.\n2. Fill in the variable form that appears on the right — all fields are labelled and include example values.\n3. Click "Generate Document" to see the filled document in the preview panel.\n4. Copy the output or download it as plain text.',
      },
      {
        heading: 'Agent-Editable Templates',
        body: 'Every template is stored as a JSON file in public/data/templates/. Any agent with write access can modify these files to update template variables, add new sections, or change default values. The Orator agent is responsible for document generation.',
        code: '# Template JSON structure:\n{\n  "id": "residential-bid",\n  "name": "Residential Bid Proposal",\n  "variables": ["CLIENT_NAME", "PROJECT_ADDRESS", ...],\n  "body": "...template with {{VARIABLE}} placeholders..."\n}',
      },
      {
        heading: 'Adding a Custom Template',
        body: 'Create a new JSON file in public/data/templates/ following the schema above. The template will appear automatically in the Templates page on next deployment.',
      },
    ],
  },
  {
    id: 'billing',
    label: 'Billing',
    category: 'Operations',
    icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    duration: '8 min',
    sections: [
      {
        heading: 'Invoice Management',
        body: 'The billing module manages all project invoices. Click any invoice row to view the full detail panel with line items, retainage, tax and payment history.',
      },
      {
        heading: 'Retainage Calculator',
        body: 'Retainage follows industry standard:\n• 10% withheld from all payments until 50% completion\n• Reduced to 5% from 50% completion to substantial completion\n• Released at final completion and punch-list sign-off\n\nThe calculator on the billing page computes retainage automatically from the contract value and percent complete.',
        code: '# Retainage formula:\nif (pctComplete < 50)  retainage = amount * 0.10\nif (pctComplete >= 50) retainage = amount * 0.05',
      },
      {
        heading: 'AIA G702 / G703 Export',
        body: 'The AIA billing template generates G702 (Application for Payment) and G703 (Continuation Sheet) formatted output compatible with standard construction billing practices.',
      },
      {
        heading: 'CSV Export for QuickBooks / Google Sheets',
        body: 'Export invoices as CSV with QuickBooks-compatible column headers. Import directly into QuickBooks via File → Utilities → Import → IIF Files, or into Google Sheets via File → Import.',
      },
    ],
  },
  {
    id: 'documents',
    label: 'Documents',
    category: 'Operations',
    icon: 'M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z',
    duration: '6 min',
    sections: [
      {
        heading: 'Document Library Categories',
        body: '• Blueprints — CSI MasterFormat specification blueprints for Div 01-33\n• Checklists — 9 phase-specific construction checklists (pre-con, site, framing, MEP, drywall, finishes, commissioning, punch-list, closeout)\n• Runbooks — 5 operational runbooks (Hunter, Architect, Shadow, Commander, Vault)\n• Contracts — 7 contract templates (NTO, lien waivers, subcontract, etc.)\n• Roadmap — system v2.0 → v3.5 development roadmap',
      },
      {
        heading: 'Searching Documents',
        body: 'Use the search bar to filter by title, category or keyword. Use the category filter buttons to narrow by document type.',
      },
      {
        heading: 'Source Files',
        body: 'All documents are markdown files in the docs/ directory:\n• docs/BLUEPRINTS.md\n• docs/CHECKLISTS.md\n• docs/RUNBOOKS.md\n• docs/CONTRACT_TEMPLATES.md\n• docs/ROADMAP.md\n• docs/GOOGLE_WORKSPACE_PIPELINE.md\n• docs/AI_CONNECTORS.md',
      },
    ],
  },
  {
    id: 'agents',
    label: 'Agents',
    category: 'Automation',
    icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-1',
    duration: '12 min',
    sections: [
      {
        heading: 'The Six-Agent Biz-Ops Team',
        body: '• Hunter — Scrapes Orlando-area permits (Playwright + BeautifulSoup). Target: $100K+ commercial projects. Output: data/raw-leads/YYYY-MM-DD.json\n• Architect — CSI estimation, AIA billing, Vertex AI AutoML prediction. Generates cost estimates and project schedules.\n• Orator — Document generation from 11 templates. Produces proposals, contracts, checklists.\n• Shadow — Headless browser (Playwright). Form-fill, scrape, snapshot, extract, navigate. Governed by guardrails.\n• Commander — Deployment, workflow health, Genesis Loop execution. System orchestration.\n• Vault — Enterprise memory, rehydration, semantic search. Context persistence across sessions.',
      },
      {
        heading: 'Running an Agent Manually',
        body: 'Use the agent manager CLI from the repo root:',
        code: 'python apps/biz-ops/agent_manager.py --agent hunter --action run\npython apps/biz-ops/agent_manager.py --agent architect --action estimate\npython apps/biz-ops/agent_manager.py --agent orator --action generate \\\n  --payload \'{"doc_type":"residential-bid","client":"Smith Residence"}\'\npython apps/biz-ops/agent_manager.py --agent vault --action rehydrate',
      },
      {
        heading: 'Agent Blueprints',
        body: 'Each agent has a JSON blueprint in apps/biz-ops/blueprints/:\n• hunter.json — skills, data sources, output schema, LLM prompt\n• architect.json — CSI divisions, estimation model, Vertex AI config\n• orator.json — template list, variable mapping, output format\n• shadow.json — capabilities, guardrails, governance rules\n• vault.json — memory schema, rehydration strategy, semantic index',
      },
      {
        heading: 'LLM Integration',
        body: 'Every agent has LLM capability via the Orchestrator. Send a natural-language goal through the AI Hub → Orchestrator tab. The Orchestrator translates the goal into agent commands and dispatches them via repository_dispatch.',
      },
      {
        heading: 'Vertex AI + AutoML',
        body: 'The Architect agent integrates with GCP Vertex AI for bid price prediction and project schedule forecasting. Configure credentials in infra/terraform/terraform.tfvars from the example file, then run terraform apply to provision the infrastructure.',
      },
    ],
  },
  {
    id: 'ai-hub',
    label: 'AI Hub',
    category: 'AI Integration',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    duration: '15 min',
    sections: [
      {
        heading: 'ChatGPT Custom GPT — Setup',
        body: '1. Open ChatGPT → Explore GPTs → Create a GPT\n2. In the "Configure" tab, go to Actions → Create new action\n3. Import the schema from: https://infinityxonesystems.github.io/construct-iq-360/openapi.yaml\n4. Authentication: set to API Key, type Bearer, paste your Fine-Grained PAT with Actions:R/W on infinity-orchestrator\n5. Save the GPT\n\nThe Custom GPT can now send natural-language goals directly to the Infinity Orchestrator.',
        code: '# Example goals for ChatGPT:\n"Run the Hunter agent to find commercial leads in Orlando over $100K"\n"Generate a residential bid proposal for Smith Residence at 123 Oak St"\n"Take a screenshot of https://permits.orangecountyfl.net"\n"Fill the permit search form at [URL] with zip=32801 and submit"',
      },
      {
        heading: 'Copilot Mobile — Setup',
        body: '1. On iOS/Android, open GitHub Mobile → tap the Copilot icon\n2. The app automatically reads .github/copilot-instructions.md for system context\n3. To dispatch commands, use the curl format below in a Copilot message',
        code: 'curl -X POST \\\n  https://api.github.com/repos/Infinity-X-One-Systems/infinity-orchestrator/actions/workflows/autonomous-invention.yml/dispatches \\\n  -H "Authorization: Bearer YOUR_FINE_GRAINED_PAT" \\\n  -H "Accept: application/vnd.github.v3+json" \\\n  -d \'{"ref":"main","inputs":{"goal":"Run Hunter agent in construct-iq-360 for Orlando leads"}}\'',
        note: 'Auth requirement: Fine-Grained PAT with Actions: Read & Write on Infinity-X-One-Systems/infinity-orchestrator',
      },
      {
        heading: 'Orchestration Chain',
        body: 'Every command follows this exact chain:\n1. ChatGPT / Copilot → POST workflow_dispatch (goal)\n2. Infinity Orchestrator (infinity-orchestrator) → autonomous-invention.yml\n3. TAP Protocol validation (Policy → Authority → Truth)\n4. repository_dispatch: invention_trigger → InfinityXOneSystems/construct-iq-360\n5. dispatch-bridge.yml → routes to correct agent module\n6. Agent runner → apps/biz-ops/agent_manager.py\n7. Output committed to data/ or docs/\n8. Vault memory updated',
      },
      {
        heading: 'Shadow Agent via AI Hub',
        body: 'From the AI Hub → Shadow tab, use the quick-dispatch buttons:\n• Scrape Permits — runs Hunter + Shadow on Orange County permit portal\n• Form Fill — fills a search form with custom parameters\n• Snapshot — takes full-page screenshot and saves to data/snapshots/\n• System Control — sends a fully structured systemControl command',
      },
    ],
  },
  {
    id: 'shadow',
    label: 'Shadow Agent',
    category: 'Automation',
    icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
    duration: '10 min',
    sections: [
      {
        heading: 'Capabilities',
        body: '• scrape — Load a URL with headless Chromium, extract HTML and structured data\n• form_fill — Locate form fields by CSS selector, type values, submit\n• snapshot — Capture full-page PNG screenshot, save to data/snapshots/\n• extract — Extract structured data matching a CSS selector or XPath\n• navigate — Multi-step navigation sequence (click, scroll, wait, extract)',
      },
      {
        heading: 'Governance Guardrails',
        body: '• Rate limit: maximum 2 requests per second per domain\n• No authentication bypass or credential injection\n• No PII storage — extracted data is anonymised before commit\n• All requests logged to data/shadow-jobs/{request_id}.json\n• Human-readable audit trail in data/dispatch-log/commands.jsonl',
      },
      {
        heading: 'Dispatch via Orchestrator',
        body: 'Use the systemControl operation to dispatch shadow commands:',
        code: '# ChatGPT systemControl payload:\n{\n  "event_type": "invention_trigger",\n  "client_payload": {\n    "agent": "shadow",\n    "action": "scrape",\n    "url": "https://permits.orangecountyfl.net",\n    "result_selector": "table.permits tr",\n    "capture_html": true\n  }\n}',
      },
      {
        heading: 'Shadow API (Docker)',
        body: 'When running the full Docker stack (docker compose up), the Shadow agent exposes a REST API on port 8080:\n• POST /scrape/submit — start a scrape job\n• GET /scrape/{job_id} — check job status\n• GET /snapshot/{job_id} — retrieve snapshot PNG\n• GET /health — health check',
      },
    ],
  },
  {
    id: 'workspace',
    label: 'Google Workspace',
    category: 'Integrations',
    icon: 'M3 10h18M3 14h18M10 3v18M14 3v18M3 3h18a0 0 0 010 18H3a0 0 0 010-18z',
    duration: '8 min',
    sections: [
      {
        heading: 'CSV Export Pipeline',
        body: 'Every module that manages structured data supports CSV export:\n• CRM → leads.csv (Google Contacts / Sheets compatible)\n• Billing → invoices.csv (QuickBooks / Sheets compatible)\n• Templates → generate documents and export as text\n\nCSV column schemas are documented in docs/GOOGLE_WORKSPACE_PIPELINE.md.',
      },
      {
        heading: 'Google Sheets Import',
        body: '1. Download CSV from the Command Center\n2. Open Google Sheets → File → Import → Upload\n3. Select "Replace spreadsheet" or "Insert new sheet"\n4. All column headers map directly to the exported CSV',
      },
      {
        heading: 'Index Sheet with Calculators',
        body: 'docs/GOOGLE_WORKSPACE_PIPELINE.md includes an Apps Script snippet that creates an Index sheet linking all related tabs (Leads, Invoices, Templates) with cross-tab formula references and built-in calculators:\n• Lead value sum by status\n• Invoice total with retainage\n• Win rate by lead source',
        code: '// Apps Script: create cross-tab INDEX\nfunction createIndexSheet() {\n  const ss = SpreadsheetApp.getActiveSpreadsheet();\n  let idx = ss.getSheetByName("INDEX") || ss.insertSheet("INDEX");\n  idx.clear();\n  idx.appendRow(["Module", "Sheet", "Total Rows", "Last Updated"]);\n  for (const name of ["Leads","Invoices","Templates"]) {\n    const sh = ss.getSheetByName(name);\n    if (sh) idx.appendRow([name, name, sh.getLastRow()-1, new Date()]);\n  }\n}',
      },
    ],
  },
  {
    id: 'infra',
    label: 'Infrastructure',
    category: 'Infrastructure',
    icon: 'M5 12H3l9-9 9 9h-2M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7M9 21v-6a2 2 0 012-2h2a2 2 0 012 2v6',
    duration: '12 min',
    sections: [
      {
        heading: 'Docker Compose Stack',
        body: 'The docker-compose.yml at the repo root defines 5 services on the infinity-mesh network:\n• command-center — Next.js app (port 3000)\n• shadow-api — Playwright headless browser REST API (port 8080)\n• biz-ops — Agent manager + all 6 biz-ops agents\n• vault — Enterprise memory service (port 8090)\n• redis — Session and job queue cache',
        code: '# Start the full stack:\ndocker compose up -d\n\n# Check all service health:\ndocker compose ps\n\n# View agent logs:\ndocker compose logs -f biz-ops\n\n# Rebuild after code changes:\ndocker compose build --no-cache && docker compose up -d',
      },
      {
        heading: 'Terraform — GCP Infrastructure',
        body: 'infra/terraform/main.tf provisions:\n• Vertex AI Workbench instance (e2-standard-4)\n• AutoML Tables dataset for bid prediction\n• Cloud Run service for the Command Center (auto-scaling)\n• GCS bucket for agent data storage\n• Service accounts with least-privilege IAM\n• GitHub Actions Runner group (optional)',
        code: '# Configure credentials:\ncp infra/terraform/terraform.tfvars.example infra/terraform/terraform.tfvars\n# Edit terraform.tfvars with your GCP project ID and region\n\n# Deploy:\ncd infra/terraform\nterraform init\nterraform plan\nterraform apply',
      },
      {
        heading: 'GitHub Pages Deployment',
        body: '1. Go to repository Settings → Pages\n2. Source: GitHub Actions\n3. Push to main — deploy-command-center.yml will build the Next.js app (static export) and deploy automatically\n4. Dashboard is live at: https://infinityxonesystems.github.io/construct-iq-360/',
      },
      {
        heading: 'Required Secrets',
        body: 'Add these in Settings → Secrets and variables → Actions:\n• GOOGLE_MAPS_API_KEY — Hunter agent (permit scraping)\n• OPENAI_API_KEY — AI Hub live ChatGPT integration\n• VERTEX_AI_KEY — Architect agent Vertex AI prediction\n• GCP_PROJECT_ID — Terraform GCP project\n\nAll secrets are injected via ${{ secrets.* }} — never hardcoded.',
      },
    ],
  },
];

const CATEGORIES = ['All', ...Array.from(new Set(MODULES.map((m) => m.category)))];

function SvgIcon({ path, size = 20 }: { path: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

export default function LearnPage() {
  const [activeModule, setActiveModule] = useState<string>(MODULES[0].id);
  const [activeCategory, setActiveCategory] = useState('All');

  const current = MODULES.find((m) => m.id === activeModule) ?? MODULES[0];
  const filtered = activeCategory === 'All'
    ? MODULES
    : MODULES.filter((m) => m.category === activeCategory);

  return (
    <div className="flex h-full min-h-screen bg-dark-bg text-white">
      {/* Module List */}
      <aside className="w-72 shrink-0 border-r border-neon-green/10 flex flex-col">
        <div className="px-4 py-4 border-b border-neon-green/10">
          <div className="text-neon-green font-mono text-xs tracking-widest uppercase mb-1">Learning Center</div>
          <div className="text-gray-500 text-xs font-mono">System Operations Guide</div>
        </div>

        {/* Category filter */}
        <div className="px-4 py-3 border-b border-neon-green/10 flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2 py-0.5 rounded text-xs font-mono border transition-colors ${
                activeCategory === cat
                  ? 'bg-neon-green/10 border-neon-green text-neon-green'
                  : 'border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Module list */}
        <nav className="flex-1 overflow-y-auto py-2">
          {filtered.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors group ${
                activeModule === mod.id
                  ? 'bg-neon-green/5 border-r-2 border-neon-green'
                  : 'hover:bg-white/[0.02]'
              }`}
            >
              <span className={activeModule === mod.id ? 'text-neon-green' : 'text-gray-600 group-hover:text-gray-400'}>
                <SvgIcon path={mod.icon} size={16} />
              </span>
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-mono truncate ${
                  activeModule === mod.id ? 'text-neon-green' : 'text-gray-300 group-hover:text-white'
                }`}>
                  {mod.label}
                </div>
                <div className="text-gray-600 text-xs font-mono">{mod.duration}</div>
              </div>
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-8">
          {/* Module header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-neon-green/60 font-mono text-xs tracking-widest uppercase">{current.category}</span>
              <span className="text-gray-700 font-mono text-xs">·</span>
              <span className="text-gray-600 font-mono text-xs">{current.duration}</span>
            </div>
            <h1 className="text-2xl font-mono text-white tracking-tight">{current.label}</h1>
            <div className="mt-3 h-px bg-neon-green/10" />
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {current.sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-neon-green font-mono text-sm tracking-wide mb-3">{section.heading}</h2>
                <div className="text-gray-300 text-sm leading-relaxed font-mono whitespace-pre-line">
                  {section.body}
                </div>
                {section.code && (
                  <pre className="mt-3 bg-dark-surface border border-neon-green/10 rounded p-4 text-xs text-neon-green/80 font-mono overflow-x-auto leading-relaxed">
                    {section.code}
                  </pre>
                )}
                {section.note && (
                  <div className="mt-3 flex gap-2 bg-neon-green/5 border border-neon-green/20 rounded p-3">
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                      strokeLinecap="round" strokeLinejoin="round" className="text-neon-green mt-0.5 shrink-0">
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                      <path d="M12 8v4m0 4h.01" />
                    </svg>
                    <span className="text-neon-green/80 text-xs font-mono">{section.note}</span>
                  </div>
                )}
                {i < current.sections.length - 1 && (
                  <div className="mt-8 h-px bg-white/[0.04]" />
                )}
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-6 border-t border-neon-green/10 flex items-center justify-between">
            {(() => {
              const allIds = MODULES.map((m) => m.id);
              const idx = allIds.indexOf(current.id);
              const prev = idx > 0 ? MODULES[idx - 1] : null;
              const next = idx < MODULES.length - 1 ? MODULES[idx + 1] : null;
              return (
                <>
                  <div>
                    {prev && (
                      <button
                        onClick={() => setActiveModule(prev.id)}
                        className="flex items-center gap-2 text-gray-500 hover:text-neon-green font-mono text-xs transition-colors"
                      >
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                          strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 18l-6-6 6-6" />
                        </svg>
                        {prev.label}
                      </button>
                    )}
                  </div>
                  <div>
                    {next && (
                      <button
                        onClick={() => setActiveModule(next.id)}
                        className="flex items-center gap-2 text-gray-500 hover:text-neon-green font-mono text-xs transition-colors"
                      >
                        {next.label}
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                          strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </main>
    </div>
  );
}
