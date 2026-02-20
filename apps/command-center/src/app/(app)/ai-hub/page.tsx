'use client';

import { useState } from 'react';
import { getToken } from '@/lib/auth';

type Tab = 'chatgpt' | 'copilot' | 'orchestrator' | 'runner';

const SYSTEM_PROMPT = `You are the AI assistant for Construct-OS, an autonomous construction intelligence platform built by Infinity X One Systems.

SYSTEM CONTEXT:
- Platform: Construct-OS Command Center
- Repository: InfinityXOneSystems/construct-iq-360
- Deployed at: https://infinityxonesystems.github.io/construct-iq-360/
- Stack: Next.js 15 (static export), TypeScript, Tailwind CSS, GitHub Pages
- Backend: GitHub Actions (autonomous agents), Python agents, dispatch-bridge.yml

CAPABILITIES:
1. Lead Generation: Hunter Agent discovers construction leads from permit databases (Orlando metro)
2. CRM: Full lead pipeline with status tracking and CSV export to Google Sheets
3. Templates: 11+ construction document templates (proposals, contracts, checklists, runbooks)
4. Billing: AIA-style progress billing with retainage and CSV export
5. AI Hub: ChatGPT, GitHub Copilot, and Infinity Orchestrator connectors
6. Dispatch Bridge: Receives repository_dispatch commands from Infinity Orchestrator

AGENT CAPABILITIES (via GitHub Actions):
- generate-document: Creates documents in data/documents/
- build-project: Scaffolds new sub-projects in apps/
- create-agent: Initializes new autonomous agents
- deploy-system: Deploys via GitHub Pages
- genesis-command: Triggers Genesis Loop for self-improvement

DOCUMENT TEMPLATES (in src/lib/templates.ts):
- Residential New Construction Bid
- Residential Renovation/Remodel Bid
- Commercial Construction Bid (CSI divisions)
- Tenant Improvement Bid
- Change Order Form
- Subcontractor Agreement
- Lien Waiver (Conditional)
- Pre-Construction Checklist
- Site Safety Inspection Checklist
- Lead Qualification Runbook
- Bid Preparation Runbook

CRM LEAD STATUSES: new → contacted → proposal-sent → negotiating → won/lost
BILLING: AIA G702/G703 style, retainage support, CSV export for Google Workspace

When users ask you to:
- Generate a proposal/bid → Use the template system, fill in the variables, and output the document
- Qualify a lead → Apply the scoring matrix (project value, permit status, contact availability)
- Create an invoice → Use the billing module structure with line items and retainage
- Update the system → Suggest GitHub commits or workflow_dispatch commands
- Write code → Follow the TypeScript strict mode, Tailwind CSS conventions

GITHUB API ACCESS: You have read/write access via the user's PAT token. You can:
- Read files: GET /repos/InfinityXOneSystems/construct-iq-360/contents/{path}
- Create/update files: PUT /repos/InfinityXOneSystems/construct-iq-360/contents/{path}
- Trigger workflows: POST /repos/InfinityXOneSystems/construct-iq-360/dispatches
- Create issues: POST /repos/InfinityXOneSystems/construct-iq-360/issues`;

const COPILOT_INSTRUCTIONS = `# Construct-OS Copilot Instructions

You are working on the construct-iq-360 repository — an autonomous construction intelligence platform.

## Stack
- **Frontend**: Next.js 15, TypeScript (strict), Tailwind CSS, static export to GitHub Pages
- **Backend**: Python agents in apps/, GitHub Actions workflows
- **Deployed at**: https://infinityxonesystems.github.io/construct-iq-360/
- **Base path**: /construct-iq-360 (production)

## Architecture
- \`apps/command-center/\` — Next.js app with app router, static export
- \`apps/hunter-agent/\` — Python lead scraping agent
- \`apps/architect-ai/\` — Python cost estimation AI
- \`.github/workflows/\` — GitHub Actions: genesis-loop, hunter-cron, auto-merge, dispatch-bridge
- \`data/\` — Lead data, dispatch logs, documents
- \`docs/\` — System documentation

## Key Files
- \`src/lib/templates.ts\` — ALL construction templates (agent-editable)
- \`src/lib/crm.ts\` — CRM types and sample data
- \`src/lib/billing.ts\` — Invoice/billing types
- \`src/lib/auth.ts\` — GitHub PAT auth (localStorage-based)
- \`src/app/(app)/\` — Authenticated app pages (dashboard, crm, templates, billing, documents, ai-hub)

## Conventions
- Use 'use client' for components that use hooks or browser APIs
- All async operations wrapped in try/catch
- Tailwind classes only (no CSS modules)
- Dark theme: bg-dark-bg (#000), bg-dark-surface (#0a0a0a), text-neon-green (#39FF14)
- Prefer named exports
- datetime.now(timezone.utc) for Python timestamps

## Construction Domain Knowledge
- CSI MasterFormat division structure
- AIA G702/G703 billing applications
- Retainage (typically 10% until 50% complete, 5% thereafter)
- Lien rights and conditional/unconditional waivers
- Pre-qualification criteria: project value ≥ $100K, valid permit

## What NOT to do
- Don't use output: undefined (must stay as 'export' for GitHub Pages)
- Don't add API routes (static export)
- Don't use Server Actions
- Don't commit secrets or tokens`;

export default function AIHubPage() {
  const [activeTab, setActiveTab] = useState<Tab>('chatgpt');
  const [copied, setCopied] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{role: string; content: string}>>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [openaiKey, setOpenaiKey] = useState('');
  const [dispatchPayload, setDispatchPayload] = useState('{\n  "type": "generate-document",\n  "title": "My Document",\n  "format": "markdown"\n}');
  const [dispatchStatus, setDispatchStatus] = useState('');

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const sendChat = async () => {
    if (!chatInput.trim() || !openaiKey) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatLoading(true);

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...chatMessages,
            { role: 'user', content: userMsg },
          ],
          max_tokens: 2000,
        }),
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content ?? 'No response.';
      setChatMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Error connecting to OpenAI. Check your API key.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const triggerDispatch = async () => {
    const token = getToken();
    if (!token) { setDispatchStatus('Not authenticated. Please sign in.'); return; }
    try {
      const payload = JSON.parse(dispatchPayload);
      const res = await fetch('https://api.github.com/repos/InfinityXOneSystems/construct-iq-360/dispatches', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event_type: payload.type || 'genesis-command', client_payload: payload }),
      });
      setDispatchStatus(res.ok ? '✅ Dispatch sent successfully! Check GitHub Actions.' : `❌ Failed: ${res.status} ${res.statusText}`);
    } catch (e: unknown) {
      setDispatchStatus(`❌ Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  };

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'chatgpt', label: 'ChatGPT', icon: '💬' },
    { id: 'copilot', label: 'Copilot', icon: '🤖' },
    { id: 'orchestrator', label: 'Orchestrator', icon: '🔗' },
    { id: 'runner', label: 'Runner', icon: '⚡' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neon-green glow-text">AI Hub</h1>
        <p className="text-gray-400 text-sm mt-1">ChatGPT, Copilot, Infinity Orchestrator, and workflow runner connectors</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b border-dark-border">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
              ${activeTab === tab.id ? 'border-neon-green text-neon-green' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ChatGPT Tab */}
      {activeTab === 'chatgpt' && (
        <div className="space-y-6">
          {/* API Key */}
          <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
            <h3 className="text-sm font-bold text-neon-green uppercase tracking-wider mb-3">OpenAI API Key</h3>
            <div className="flex space-x-2">
              <input
                type="password"
                value={openaiKey}
                onChange={e => setOpenaiKey(e.target.value)}
                placeholder="sk-..."
                className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-green font-mono"
              />
              <button
                onClick={() => { if (openaiKey) localStorage.setItem('ciq360_openai_key', openaiKey); }}
                className="bg-neon-green text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-white transition-colors"
              >
                Save
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Key stored locally in browser only. Never sent to any server other than OpenAI.</p>
          </div>

          {/* System Prompt */}
          <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-neon-green uppercase tracking-wider">System Prompt (Construct-OS Context)</h3>
              <button
                onClick={() => copyText(SYSTEM_PROMPT, 'system-prompt')}
                className="text-xs px-3 py-1 border border-neon-green/30 text-neon-green rounded hover:bg-neon-green/10 transition-colors"
              >
                {copied === 'system-prompt' ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
            <pre className="text-xs text-gray-400 bg-dark-bg rounded-lg p-4 overflow-x-auto max-h-48 overflow-y-auto">
              {SYSTEM_PROMPT}
            </pre>
          </div>

          {/* Live Chat */}
          <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-dark-border flex items-center justify-between">
              <h3 className="text-sm font-bold text-neon-green">Live Chat (GPT-4o)</h3>
              {chatMessages.length > 0 && (
                <button onClick={() => setChatMessages([])} className="text-xs text-gray-500 hover:text-white">Clear</button>
              )}
            </div>
            <div className="p-4 h-64 overflow-y-auto space-y-3">
              {chatMessages.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  <p className="mb-2">Ask me anything about construction, leads, or this system.</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Generate a residential bid for a 2-story home in Orlando', 'Qualify this lead: $500K commercial TI', 'Write a subcontractor agreement for electrical'].map(q => (
                      <button
                        key={q}
                        onClick={() => { setChatInput(q); }}
                        className="text-xs px-3 py-1 bg-dark-bg border border-dark-border rounded hover:border-neon-green text-gray-400 hover:text-neon-green transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${m.role === 'user' ? 'bg-neon-green text-black' : 'bg-dark-bg text-gray-200 border border-dark-border'}`}>
                    <pre className="whitespace-pre-wrap font-mono text-xs">{m.content}</pre>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex items-center space-x-2 text-gray-400">
                  <div className="w-3 h-3 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">GPT-4o is thinking...</span>
                </div>
              )}
            </div>
            <div className="px-4 pb-4 flex space-x-2 border-t border-dark-border pt-3">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendChat()}
                placeholder="Ask about construction, leads, templates..."
                disabled={!openaiKey}
                className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-green disabled:opacity-50"
              />
              <button
                onClick={sendChat}
                disabled={!openaiKey || !chatInput.trim() || chatLoading}
                className="bg-neon-green text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-white transition-colors disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copilot Tab */}
      {activeTab === 'copilot' && (
        <div className="space-y-6">
          <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-neon-green uppercase tracking-wider">GitHub Copilot Instructions</h3>
                <p className="text-xs text-gray-400 mt-1">System-wide context for Copilot in VS Code, Mobile, and Workspaces. Stored at <code className="text-neon-green">.github/copilot-instructions.md</code></p>
              </div>
              <button
                onClick={() => copyText(COPILOT_INSTRUCTIONS, 'copilot')}
                className="text-xs px-3 py-1 border border-neon-green/30 text-neon-green rounded hover:bg-neon-green/10 transition-colors whitespace-nowrap"
              >
                {copied === 'copilot' ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
            <pre className="text-xs text-gray-400 bg-dark-bg rounded-lg p-4 overflow-x-auto max-h-72 overflow-y-auto">
              {COPILOT_INSTRUCTIONS}
            </pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'VS Code Setup', icon: '💻', steps: ['Install GitHub Copilot extension', 'Sign in with GitHub account', 'Open this repo — Copilot auto-reads .github/copilot-instructions.md', 'Use Copilot Chat with full system context'] },
              { title: 'Mobile Setup', icon: '📱', steps: ['Install GitHub Mobile app', 'Enable Copilot in Settings → Copilot', 'Navigate to this repo to chat with Copilot', 'Copilot reads the repo instructions file automatically'] },
            ].map(card => (
              <div key={card.title} className="bg-dark-surface border border-dark-border rounded-xl p-5">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center space-x-2">
                  <span>{card.icon}</span><span>{card.title}</span>
                </h4>
                <ol className="space-y-2">
                  {card.steps.map((step, i) => (
                    <li key={i} className="flex items-start space-x-2 text-sm text-gray-400">
                      <span className="text-neon-green text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
            <h4 className="text-sm font-bold text-neon-green uppercase tracking-wider mb-3">Example Copilot Commands</h4>
            <div className="space-y-2">
              {[
                'Generate a residential bid proposal for a $500K new construction in Orlando',
                'Add a new CRM lead for Acme Construction with a $1.2M commercial project',
                'Create a change order template for a $50K HVAC upgrade',
                'Write a Python lead scraping function for Orange County permit data',
                'Fix the TypeScript error in src/app/(app)/crm/page.tsx',
              ].map(cmd => (
                <div key={cmd} className="bg-dark-bg rounded-lg px-4 py-2.5 flex items-center space-x-2">
                  <span className="text-neon-green text-xs">@workspace</span>
                  <span className="text-gray-300 text-sm font-mono">{cmd}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Orchestrator Tab */}
      {activeTab === 'orchestrator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { type: 'generate-document', desc: 'Generate a document via the orator engine', icon: '📄' },
              { type: 'build-project', desc: 'Scaffold a new project or agent', icon: '🏗️' },
              { type: 'create-agent', desc: 'Initialize a new autonomous agent', icon: '🤖' },
              { type: 'deploy-system', desc: 'Trigger a deployment pipeline', icon: '🚀' },
              { type: 'genesis-command', desc: 'Run the Genesis Loop for self-improvement', icon: '🔄' },
              { type: 'run-invention-cycle', desc: 'Execute a full invention cycle', icon: '⚡' },
            ].map(cmd => (
              <button
                key={cmd.type}
                onClick={() => setDispatchPayload(`{\n  "type": "${cmd.type}",\n  "title": "My Task",\n  "description": "Add details here"\n}`)}
                className="bg-dark-surface border border-dark-border rounded-xl p-4 text-left hover:border-neon-green transition-colors group"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{cmd.icon}</span>
                  <div>
                    <p className="text-sm font-mono text-neon-green">{cmd.type}</p>
                    <p className="text-xs text-gray-400 mt-1">{cmd.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
            <h3 className="text-sm font-bold text-neon-green uppercase tracking-wider mb-3">Dispatch Payload</h3>
            <textarea
              value={dispatchPayload}
              onChange={e => setDispatchPayload(e.target.value)}
              rows={6}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-neon-green"
            />
            <div className="flex items-center space-x-3 mt-3">
              <button
                onClick={triggerDispatch}
                className="bg-neon-green text-black font-bold px-6 py-2 rounded-lg text-sm hover:bg-white transition-colors"
              >
                ⚡ Trigger Dispatch
              </button>
              {dispatchStatus && (
                <p className={`text-sm ${dispatchStatus.startsWith('✅') ? 'text-neon-green' : 'text-red-400'}`}>
                  {dispatchStatus}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Runner Tab */}
      {activeTab === 'runner' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Hunter Agent', file: 'hunter-cron.yml', schedule: 'Daily @ 08:00 UTC', status: 'active', icon: '🎯' },
              { name: 'Genesis Loop', file: 'genesis-loop.yml', schedule: 'Every 6 hours', status: 'active', icon: '🔄' },
              { name: 'Deploy Command Center', file: 'deploy-command-center.yml', schedule: 'On push to main', status: 'active', icon: '🚀' },
              { name: 'Auto Merge', file: 'auto-merge.yml', schedule: 'On PR events', status: 'active', icon: '🔀' },
              { name: 'Document Pipeline', file: 'document-pipeline.yml', schedule: 'On dispatch', status: 'active', icon: '📄' },
              { name: 'Self Repair', file: 'self-repair.yml', schedule: 'On workflow failure', status: 'active', icon: '🔧' },
            ].map(runner => (
              <div key={runner.name} className="bg-dark-surface border border-dark-border rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{runner.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{runner.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{runner.file}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
                    <span className="text-xs text-neon-green">Active</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">{runner.schedule}</p>
                <a
                  href={`https://github.com/InfinityXOneSystems/construct-iq-360/actions/workflows/${runner.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center space-x-1 text-xs text-neon-green hover:underline"
                >
                  <span>View on GitHub Actions</span>
                  <span>↗</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
