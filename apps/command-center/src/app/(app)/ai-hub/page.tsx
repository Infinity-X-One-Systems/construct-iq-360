'use client';

import { useState } from 'react';
import { getToken } from '@/lib/auth';

type Tab = 'chatgpt' | 'copilot' | 'orchestrator' | 'runner' | 'shadow' | 'plugin';

const SYSTEM_PROMPT = `You are the AI assistant for Construct-OS, an autonomous construction intelligence platform by Infinity X One Systems.

PLATFORM: Construct-OS Command Center
REPO: InfinityXOneSystems/construct-iq-360
URL: https://infinityxonesystems.github.io/construct-iq-360/
STACK: Next.js 15 (static export), TypeScript, Tailwind CSS, GitHub Pages, Python agents

ORCHESTRATION CHAIN:
  You (ChatGPT) -> Infinity Orchestrator GitHub App (Infinity-X-One-Systems/infinity-orchestrator)
    -> autonomous-invention.yml workflow_dispatch (goal: string)
    -> TAP Protocol validation (Policy > Authority > Truth)
    -> repository_dispatch to InfinityXOneSystems/construct-iq-360
    -> dispatch-bridge.yml routes to agent runner

TO TRIGGER AN ACTION: use the triggerOrchestrator action with a natural-language goal.
TO TRIGGER STRUCTURED AGENT COMMANDS: use systemControl with command=run-agent, agent=shadow|hunter|architect|orator|commander|vault.

AGENTS (6 autonomous agents):
- Hunter: Lead discovery (Orlando metro permit databases + Google Maps)
- Architect: CSI MasterFormat estimation + AIA G702/G703 billing + Vertex AI AutoML
- Orator: Document generation (11+ construction templates)
- Shadow: Headless browser automation — form fill, click, type, scroll, snapshot, extract, navigate. REST API at port 8080. Governance: rate limiting, robots.txt respected, full audit logging.
- Commander: GitHub Pages deployment + workflow health + Genesis Loop
- Vault: Enterprise memory, context rehydration, audit logging

SHADOW AGENT CAPABILITIES (use systemControl with agent=shadow):
- action=scrape: Extract data from URL(s) using CSS selectors
  Example goal: "Run Shadow agent to scrape https://permits.orangecountyfl.net and extract permit_number, address, value selectors"
- action=form-fill: Navigate to URL, fill form fields, submit, extract results
  Example goal: "Run Shadow agent to fill the permit search form at https://permits.orangecountyfl.net with zip=32801 and return results"
- action=snapshot: Full-page PNG screenshot + HTML capture, saved to data/snapshots/
  Example goal: "Run Shadow agent to take a full-page snapshot of https://permits.orangecountyfl.net"
- action=extract: Extract structured data from a page using selectors
- action=navigate: Navigate and return page state
Shadow governance: every action audit-logged, rate-limited (1000ms), max 100 instances, robots.txt respected.

MASTER SYSTEM CONTROL:
Use systemControl endpoint with any command to operate the entire system:
- command=run-agent + agent=shadow + action=scrape|form-fill|snapshot|extract
- command=run-agent + agent=hunter|architect|orator|commander|vault
- command=generate-document + doc_type=residential-bid|commercial-bid|change-order|...
- command=deploy-system
- command=genesis-command

DISPATCH COMMANDS (routed via Infinity Orchestrator):
- generate-document, build-project, create-agent, deploy-system, genesis-command, run-agent, shadow-scrape

CRM STATUSES: new > contacted > proposal-sent > negotiating > won/lost
TEMPLATES: residential-bid, commercial-bid, ti-bid, change-order, subcontractor-agreement, lien-waiver, pre-construction-checklist, site-safety-checklist, lead-qualification-runbook, bid-preparation-runbook
BILLING: AIA G702/G703 style, retainage 10% to 5% at 50% completion, CSV export

AUTH: Your token needs Actions:Write on Infinity-X-One-Systems/infinity-orchestrator.`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ORCHESTRATOR_DISPATCH_COMMANDS = [
  { label: 'Generate Residential Bid', goal: 'Generate a residential bid document using the residential-bid template in construct-iq-360 for a 2,500 sqft renovation project' },
  { label: 'Generate Commercial Bid', goal: 'Generate a commercial bid document using the commercial-bid template in construct-iq-360 for a commercial office renovation' },
  { label: 'Run Hunter Agent', goal: 'Run the Hunter lead sniper agent in construct-iq-360 to scrape new construction permit leads in Orlando metro area' },
  { label: 'Run Architect Agent', goal: 'Run the Architect agent in construct-iq-360 to generate an AIA G702 billing application' },
  { label: 'Genesis Self-Optimize', goal: 'Run genesis-command self-optimize on construct-iq-360 to run the Genesis Loop and improve agent performance' },
  { label: 'Deploy Command Center', goal: 'Deploy the construct-iq-360 Command Center to GitHub Pages via the Commander agent' },
];

const SHADOW_DISPATCH_COMMANDS = [
  {
    label: 'Scrape Permit Database',
    goal: 'Run Shadow headless agent to scrape https://permits.orangecountyfl.net/permit/search and extract all new residential and commercial construction permits over $100K — return permit_number, address, owner, value for each record',
  },
  {
    label: 'Form Fill — Permit Search',
    goal: 'Run Shadow agent to navigate to https://permits.orangecountyfl.net/permit/search, fill in zip=32801, permit_type=building, value_min=100000, click the submit button, and return all extracted permit records from the results table',
  },
  {
    label: 'Snapshot — Permit Portal',
    goal: 'Run Shadow agent to take a full-page screenshot and capture all HTML content from https://permits.orangecountyfl.net — save PNG and HTML to data/snapshots/ with timestamp',
  },
  {
    label: 'Extract — Lead Data',
    goal: 'Run Shadow agent to extract structured lead data from https://permits.orangecountyfl.net using selectors: permit_number=.permit-number, address=.permit-address, value=.permit-value, owner=.permit-owner',
  },
];

const GOAL_PREVIEW_LENGTH = 60;

const OPENAPI_SPEC = `openapi: 3.0.0
info:
  title: Construct-OS via Infinity Orchestrator
  version: 3.0.0
  description: >
    Master system-control bridge — ChatGPT/Copilot send goals or structured
    commands here; the Infinity Orchestrator routes them to Construct-OS.
    Includes Shadow headless browser control (scrape, form-fill, snapshot).

servers:
  - url: https://api.github.com

paths:
  /repos/Infinity-X-One-Systems/infinity-orchestrator/actions/workflows/autonomous-invention.yml/dispatches:
    post:
      operationId: triggerOrchestrator
      summary: Send any goal to the Orchestrator (natural-language master control)
      description: >
        Use natural language. Shadow examples: "Run Shadow agent to scrape
        https://permits.example.com", "Fill the permit search form at URL X
        with zip=32801", "Take a snapshot of https://example.com".
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [ref, inputs]
              properties:
                ref:
                  type: string
                  default: main
                inputs:
                  type: object
                  required: [goal]
                  properties:
                    goal:
                      type: string
                      description: Natural-language goal for the Orchestrator
      responses:
        '204':
          description: Orchestrator runner triggered

  /repos/Infinity-X-One-Systems/infinity-orchestrator/dispatches:
    post:
      operationId: systemControl
      summary: Master system-control endpoint — structured agent + shadow commands
      description: >
        Structured control for all agents. For Shadow browser operations:
        set command=run-agent, agent=shadow, then action=scrape|form-fill|snapshot|extract.
        Supports all 6 biz-ops agents and all construction workflows.
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [event_type]
              properties:
                event_type:
                  type: string
                  enum: [invention_trigger]
                client_payload:
                  type: object
                  properties:
                    goal:
                      type: string
                    command:
                      type: string
                      enum: [generate-document, run-agent, deploy-system, genesis-command, shadow-scrape]
                    agent:
                      type: string
                      enum: [hunter, architect, orator, shadow, commander, vault]
                    action:
                      type: string
                      enum: [run, scrape, form-fill, snapshot, extract, navigate, generate, billing, rehydrate, status]
                    urls:
                      type: array
                      items:
                        type: string
                    url:
                      type: string
                    snapshot_url:
                      type: string
                    selectors:
                      type: object
                      additionalProperties:
                        type: string
                    form_fields:
                      type: object
                      additionalProperties:
                        type: string
                    submit_selector:
                      type: string
                    result_selector:
                      type: string
                    output_dir:
                      type: string
                    doc_type:
                      type: string
                    project_name:
                      type: string
                  additionalProperties: true
      responses:
        '204':
          description: System-control dispatch accepted

  /repos/Infinity-X-One-Systems/infinity-orchestrator/actions/runs:
    get:
      operationId: listOrchestratorRuns
      summary: List recent Orchestrator runs
      security:
        - bearerAuth: []
      responses:
        '200':
          description: List of runs

  /repos/InfinityXOneSystems/construct-iq-360/actions/runs:
    get:
      operationId: listConstructRuns
      summary: List recent Construct-OS runner runs
      security:
        - bearerAuth: []
      responses:
        '200':
          description: List of runs

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      description: >
        Fine-Grained PAT with Actions: Read & Write on
        Infinity-X-One-Systems/infinity-orchestrator.
        Create at github.com/settings/tokens.`;

const PLUGIN_MANIFEST = `{
  "schema_version": "v1",
  "name_for_model": "construct_os_orchestrator",
  "name_for_human": "Construct-OS via Infinity Orchestrator",
  "description_for_model": "Master system-control for Construct-OS via Infinity Orchestrator (Infinity-X-One-Systems/infinity-orchestrator). Use triggerOrchestrator for natural-language goals. Use systemControl for structured agent commands — including Shadow headless browser (scrape, form-fill, snapshot, extract). Supports all 6 biz-ops agents: Hunter (leads), Architect (billing/estimation), Orator (documents), Shadow (browser automation), Commander (deployment), Vault (memory). Auth: Fine-Grained PAT with Actions:Write on Infinity-X-One-Systems/infinity-orchestrator.",
  "description_for_human": "Command the full Construct-OS system: run agents, scrape with Shadow headless browser, generate construction documents, manage leads and billing.",
  "auth": {
    "type": "user_http",
    "authorization_type": "bearer"
  },
  "api": {
    "type": "openapi",
    "url": "https://infinityxonesystems.github.io/construct-iq-360/openapi.yaml"
  },
  "logo_url": "https://infinityxonesystems.github.io/construct-iq-360/icons/icon-192.png",
  "contact_email": "admin@infinityxonesystems.com",
  "legal_info_url": "https://github.com/Infinity-X-One-Systems/infinity-orchestrator"
}`;

const COPILOT_INSTRUCTIONS = `# Copilot Mobile - Construct-OS System Context

## Repository
InfinityXOneSystems/construct-iq-360
Live: https://infinityxonesystems.github.io/construct-iq-360/

## Orchestration Chain
Copilot Mobile -> Infinity Orchestrator GitHub App
  (Infinity-X-One-Systems/infinity-orchestrator)
  -> autonomous-invention.yml workflow_dispatch
  -> TAP Protocol validation
  -> repository_dispatch to InfinityXOneSystems/construct-iq-360
  -> dispatch-bridge.yml -> agent runner

## Your Capabilities in This Repo
When working in this repository via Copilot Mobile, you can:

### Read & Understand
- Full codebase: Next.js frontend, Python agents, GitHub Actions workflows
- Agent blueprints: Hunter, Architect, Orator, Shadow, Commander, Vault
- Construction domain: CSI MasterFormat Div 01-33, AIA G702/G703, retainage

### Write & Execute
- TypeScript pages in apps/command-center/src/app/(app)/
- Python agents in apps/hunter-agent/ or apps/biz-ops/agents/
- Workflow YAML in .github/workflows/
- Templates in apps/command-center/src/lib/templates.ts
- CRM data in apps/command-center/src/lib/crm.ts

### Trigger Runners (via Infinity Orchestrator)
curl -X POST \\
  https://api.github.com/repos/Infinity-X-One-Systems/infinity-orchestrator/actions/workflows/autonomous-invention.yml/dispatches \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Accept: application/vnd.github.v3+json" \\
  -d '{"ref":"main","inputs":{"goal":"Generate a residential bid document in construct-iq-360"}}'

## Auth Requirements
- Token needs repo scope on Infinity-X-One-Systems/infinity-orchestrator
- Fine-Grained PAT: github.com/settings/tokens
  - Repository: Infinity-X-One-Systems/infinity-orchestrator
  - Permissions: Read & Write: Actions

## System Architecture
- Static export app (no API routes - all backend via GitHub Actions)
- Auth: GitHub PAT in localStorage (ciq360_gh_token, ciq360_gh_user)
- Styling: Tailwind - bg-dark-bg (#000), border-neon-green (#39FF14), NO emojis in UI

## Key Files
- src/lib/auth.ts            GitHub PAT auth
- src/lib/templates.ts       11 construction templates
- src/lib/crm.ts             CRM types + sample data
- src/lib/billing.ts         Invoice calculator
- src/lib/plugin-adapter.ts  Plugin system for external connectors
- apps/hunter-agent/main.py  Lead sniper agent
- apps/biz-ops/agents/       Full biz-ops agent team`;

export default function AiHubPage() {
  const [tab, setTab] = useState<Tab>('chatgpt');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<string>('');
  const [dispatchLoading, setDispatchLoading] = useState(false);
  const [copiedSpec, setCopiedSpec] = useState(false);
  const [copiedManifest, setCopiedManifest] = useState(false);
  const [shadowGoal, setShadowGoal] = useState('');

  const token = getToken();

  const sendMessage = async () => {
    if (!input.trim() || !apiKey.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...newMessages.map(m => ({ role: m.role, content: m.content })),
          ],
        }),
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content ?? 'No response.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: Unable to reach OpenAI API.' }]);
    } finally {
      setLoading(false);
    }
  };

  const dispatchViaOrchestrator = async (cmd: typeof ORCHESTRATOR_DISPATCH_COMMANDS[0]) => {
    if (!token) { setDispatchStatus('No GitHub token found. Please log in.'); return; }
    setDispatchLoading(true);
    setDispatchStatus('');
    try {
      const res = await fetch(
        'https://api.github.com/repos/Infinity-X-One-Systems/infinity-orchestrator/actions/workflows/autonomous-invention.yml/dispatches',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ref: 'main', inputs: { goal: cmd.goal } }),
        }
      );
      if (res.status === 204) {
        setDispatchStatus(`Goal dispatched via Infinity Orchestrator: ${cmd.label}. Runner triggered.`);
      } else {
        const err = await res.json().catch(() => ({}));
        const msg = (err as { message?: string }).message ?? 'Dispatch failed.';
        if (res.status === 403 || res.status === 404) {
          setDispatchStatus(`Error ${res.status}: ${msg} — Ensure your token has repo scope on Infinity-X-One-Systems/infinity-orchestrator.`);
        } else {
          setDispatchStatus(`Error ${res.status}: ${msg}`);
        }
      }
    } catch {
      setDispatchStatus('Network error. Check connection and token.');
    } finally {
      setDispatchLoading(false);
    }
  };

  const copy = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 1500);
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: 'chatgpt', label: 'ChatGPT' },
    { id: 'copilot', label: 'Copilot Mobile' },
    { id: 'orchestrator', label: 'Orchestrator' },
    { id: 'runner', label: 'Runner' },
    { id: 'shadow', label: 'Shadow Agent' },
    { id: 'plugin', label: 'Plugin Adapter' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-8 py-5 border-b border-neon-green/10">
        <h1 className="text-xs font-bold text-white uppercase tracking-widest">AI Hub</h1>
        <p className="text-xs text-gray-600 mt-0.5">ChatGPT, Copilot Mobile, Orchestrator, Runner, Plugin Connectors</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neon-green/10 px-8">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-3 text-xs uppercase tracking-widest transition-colors border-b-2 -mb-px ${
              tab === t.id
                ? 'border-neon-green text-neon-green'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">

        {/* ChatGPT */}
        {tab === 'chatgpt' && (
          <div className="flex flex-col h-full">
            <div className="px-8 py-4 border-b border-neon-green/5">
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2">OpenAI API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full max-w-md bg-black border border-neon-green/10 rounded px-3 py-2 text-white text-xs font-mono placeholder-gray-700 focus:outline-none focus:border-neon-green/40"
              />
              <p className="text-xs text-gray-700 mt-1">Key stays in-browser. Never sent to any server other than OpenAI.</p>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-xs text-gray-600 uppercase tracking-widest mb-6">GPT-4o — Construct-OS Context Loaded</div>
                  <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                    {[
                      'Generate a residential bid for a 3,500 sqft home renovation',
                      'Qualify this lead: $250K commercial TI, permit pending',
                      'Draft a change order for $15,000 HVAC scope addition',
                      'Show me AIA retainage rules for a $2M project',
                    ].map(s => (
                      <button
                        key={s}
                        onClick={() => setInput(s)}
                        className="text-left text-xs text-gray-500 border border-neon-green/10 rounded p-3 hover:border-neon-green/30 hover:text-gray-300 transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-2xl rounded px-4 py-3 ${
                    m.role === 'user'
                      ? 'bg-neon-green/10 border border-neon-green/20 text-white'
                      : 'bg-dark-surface border border-neon-green/10 text-gray-300'
                  }`}>
                    <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${m.role === 'user' ? 'text-neon-green' : 'text-gray-600'}`}>
                      {m.role === 'user' ? 'You' : 'GPT-4o'}
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-sm">{m.content}</pre>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-dark-surface border border-neon-green/10 rounded px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-8 py-4 border-t border-neon-green/10">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Ask GPT-4o about construction, leads, billing..."
                  className="flex-1 bg-black border border-neon-green/10 rounded px-4 py-2.5 text-white text-sm placeholder-gray-700 focus:outline-none focus:border-neon-green/40"
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !apiKey || !input.trim()}
                  className="px-5 py-2.5 bg-neon-green text-black text-xs font-bold uppercase tracking-widest rounded hover:bg-white transition-colors disabled:opacity-40"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Copilot Mobile */}
        {tab === 'copilot' && (
          <div className="px-8 py-6 max-w-3xl space-y-6">
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-widest mb-1">Copilot Mobile — Infinity Orchestrator Connection</h2>
              <p className="text-xs text-gray-500">Configure GitHub Copilot Mobile to send commands through the Infinity Orchestrator GitHub App, which routes them to Construct-OS runners.</p>
            </div>

            <div className="bg-amber-400/5 border border-amber-400/20 rounded p-4">
              <p className="text-xs text-amber-400 font-bold uppercase tracking-widest mb-1">Auth Requirement</p>
              <p className="text-xs text-amber-300">Your token needs <span className="font-bold">repo scope on Infinity-X-One-Systems/infinity-orchestrator</span> — not construct-iq-360 directly. Create a Fine-Grained PAT at github.com/settings/tokens with Actions: Read & Write on that repo.</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  step: 'Step 1',
                  title: 'Connect Both Repositories',
                  items: [
                    'Open GitHub Mobile app — tap Copilot',
                    'Tap "+" → Add repository context',
                    'Add InfinityXOneSystems/construct-iq-360 (read context)',
                    'Add Infinity-X-One-Systems/infinity-orchestrator (dispatch runner)',
                    'Grant read/write permissions on both',
                  ],
                },
                {
                  step: 'Step 2',
                  title: 'System Instructions File',
                  items: [
                    'Copilot Mobile reads .github/copilot-instructions.md automatically',
                    'This file contains full system context, agent list, orchestration chain, and dispatch curl commands',
                    'The file is maintained by the Commander agent and updated each Genesis Loop',
                    'All curl commands in the file route through the Infinity Orchestrator',
                  ],
                },
              ].map(section => (
                <div key={section.step} className="bg-dark-surface border border-neon-green/10 rounded p-5">
                  <h3 className="text-xs font-bold text-neon-green uppercase tracking-widest mb-3">{section.step} — {section.title}</h3>
                  <ol className="text-xs text-gray-400 space-y-2 list-decimal list-inside">
                    {section.items.map(item => <li key={item}>{item}</li>)}
                  </ol>
                </div>
              ))}

              <div className="bg-dark-surface border border-neon-green/10 rounded p-5">
                <h3 className="text-xs font-bold text-neon-green uppercase tracking-widest mb-3">Step 3 — Trigger via Infinity Orchestrator from Mobile</h3>
                <p className="text-xs text-gray-500 mb-3">Ask Copilot to run this curl command — routes through the Orchestrator GitHub App, not directly to construct-iq-360:</p>
                <div className="bg-black rounded p-3 font-mono text-xs text-gray-400 overflow-x-auto leading-relaxed">
                  <span className="text-neon-green">curl</span> -X POST \<br/>
                  {'  '}https://api.github.com/repos/Infinity-X-One-Systems/infinity-orchestrator/actions/workflows/autonomous-invention.yml/dispatches \<br/>
                  {'  '}-H &quot;Authorization: Bearer {'$'}{'{YOUR_TOKEN}'}&quot; \<br/>
                  {'  '}-H &quot;Accept: application/vnd.github.v3+json&quot; \<br/>
                  {'  '}-d &apos;&#123;&quot;ref&quot;:&quot;main&quot;,&quot;inputs&quot;:&#123;&quot;goal&quot;:&quot;Generate a residential bid in construct-iq-360 for Smith Residence&quot;&#125;&#125;&apos;
                </div>
              </div>

              <div className="bg-dark-surface border border-neon-green/10 rounded p-5">
                <h3 className="text-xs font-bold text-neon-green uppercase tracking-widest mb-3">Copilot-Instructions.md Preview</h3>
                <pre className="bg-black rounded p-4 font-mono text-xs text-gray-400 overflow-y-auto max-h-64 whitespace-pre-wrap">{COPILOT_INSTRUCTIONS}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Orchestrator */}
        {tab === 'orchestrator' && (
          <div className="px-8 py-6 max-w-3xl space-y-6">
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-widest mb-1">ChatGPT Custom GPT — Infinity Orchestrator Bridge</h2>
              <p className="text-xs text-gray-500">
                The bridge: ChatGPT Custom GPT sends goals to the Infinity Orchestrator GitHub App
                (<span className="text-white font-mono">Infinity-X-One-Systems/infinity-orchestrator</span>).
                The Orchestrator runs TAP validation, multi-agent phases, then dispatches to Construct-OS runners.
                No separate server required — the GitHub Actions runner IS the bridge.
              </p>
            </div>

            <div className="bg-dark-surface border border-neon-green/10 rounded p-4">
              <div className="font-mono text-xs text-gray-400 space-y-0.5 leading-relaxed">
                <div><span className="text-neon-green">ChatGPT Custom GPT  /  Copilot Mobile</span></div>
                <div className="ml-4">↓  POST workflow_dispatch (goal: natural language)  (token: Infinity-X-One-Systems scope)</div>
                <div className="ml-4"><span className="text-white">Infinity Orchestrator</span>  →  autonomous-invention.yml  (ubuntu-latest runner)</div>
                <div className="ml-8">↓  TAP Protocol validation (Policy &gt; Authority &gt; Truth)</div>
                <div className="ml-8">↓  repository_dispatch  →  InfinityXOneSystems/construct-iq-360</div>
                <div className="ml-12"><span className="text-white">dispatch-bridge.yml</span>  routes by event_type</div>
                <div className="ml-16 text-gray-600">generate-document  →  Orator agent</div>
                <div className="ml-16 text-gray-600">run-agent          →  Hunter / Architect / Shadow</div>
                <div className="ml-16 text-gray-600">genesis-command    →  genesis-loop.yml</div>
                <div className="ml-12">↓  Output committed to data/ or docs/</div>
                <div className="ml-8"><span className="text-neon-green">Vault</span>  archives to data/dispatch-log/commands.jsonl</div>
              </div>
            </div>

            <div className="bg-dark-surface border border-neon-green/10 rounded p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-neon-green uppercase tracking-widest">OpenAPI Action Spec (v2 — Orchestrator Bridge)</h3>
                <button
                  onClick={() => copy(OPENAPI_SPEC, setCopiedSpec)}
                  className="text-xs text-gray-500 hover:text-neon-green transition-colors uppercase tracking-widest border border-neon-green/10 rounded px-2 py-1"
                >
                  {copiedSpec ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="bg-black rounded p-4 text-xs text-gray-400 overflow-x-auto font-mono whitespace-pre max-h-72 overflow-y-auto">{OPENAPI_SPEC}</pre>
            </div>

            <div className="bg-dark-surface border border-neon-green/10 rounded p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-neon-green uppercase tracking-widest">Plugin Manifest (ai-plugin.json)</h3>
                <button
                  onClick={() => copy(PLUGIN_MANIFEST, setCopiedManifest)}
                  className="text-xs text-gray-500 hover:text-neon-green transition-colors uppercase tracking-widest border border-neon-green/10 rounded px-2 py-1"
                >
                  {copiedManifest ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="bg-black rounded p-4 text-xs text-gray-400 overflow-x-auto font-mono whitespace-pre">{PLUGIN_MANIFEST}</pre>
            </div>

            <div className="bg-dark-surface border border-neon-green/10 rounded p-5">
              <h3 className="text-xs font-bold text-neon-green uppercase tracking-widest mb-4">Setup in ChatGPT — Step by Step</h3>
              <ol className="text-xs text-gray-400 space-y-3 list-decimal list-inside">
                <li>
                  <span className="text-white font-bold">Create GitHub Token</span> — Fine-Grained PAT at{' '}
                  <span className="text-neon-green font-mono">github.com/settings/tokens</span>{' '}
                  with repository access to <span className="text-white font-mono">Infinity-X-One-Systems/infinity-orchestrator</span>,
                  permission: <span className="text-white">Actions: Read & Write</span>
                </li>
                <li>
                  <span className="text-white font-bold">ChatGPT</span> → Explore GPTs → Create a GPT →
                  Name it <span className="text-white font-bold">Construct-OS Operator</span>
                </li>
                <li>Instructions: paste the system prompt from the ChatGPT tab (includes orchestration chain)</li>
                <li>Configure → <span className="text-white font-bold">Add Action</span></li>
                <li>Paste the OpenAPI spec above (v2 — targets Infinity Orchestrator, not construct-iq-360 directly)</li>
                <li>Authentication: <span className="text-white font-bold">Bearer Token</span> — paste your Fine-Grained PAT (scoped to infinity-orchestrator)</li>
                <li>Save and publish (private)</li>
                <li>
                  <span className="text-white font-bold">Test it:</span> Ask{' '}
                  <span className="text-neon-green font-mono">&quot;Generate a residential bid for Smith Residence&quot;</span>{' '}
                  — ChatGPT will call <span className="font-mono text-gray-300">triggerOrchestrator</span>, runner fires, Orchestrator dispatches to construct-iq-360
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Runner */}
        {tab === 'runner' && (
          <div className="px-8 py-6 max-w-3xl space-y-6">
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-widest mb-1">Runner — Dispatch via Infinity Orchestrator</h2>
              <p className="text-xs text-gray-500">Send goals to the Infinity Orchestrator GitHub App runner from this dashboard. Your session token must have repo scope on Infinity-X-One-Systems/infinity-orchestrator.</p>
            </div>

            {!token && (
              <div className="border border-red-400/20 rounded p-4 text-xs text-red-400 bg-red-400/5">
                No GitHub token found. Sign in to dispatch runner commands.
              </div>
            )}

            {dispatchStatus && (
              <div className={`border rounded p-4 text-xs ${
                dispatchStatus.toLowerCase().includes('error')
                  ? 'border-red-400/20 text-red-400 bg-red-400/5'
                  : 'border-neon-green/20 text-neon-green bg-neon-green/5'
              }`}>
                {dispatchStatus}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {ORCHESTRATOR_DISPATCH_COMMANDS.map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => dispatchViaOrchestrator(cmd)}
                  disabled={dispatchLoading || !token}
                  className="text-left bg-dark-surface border border-neon-green/10 rounded p-4 hover:border-neon-green/30 hover:bg-neon-green/5 transition-all disabled:opacity-40 group"
                >
                  <div className="text-xs font-bold text-white uppercase tracking-widest mb-1 group-hover:text-neon-green transition-colors">{cmd.label}</div>
                  <div className="text-xs text-gray-500 mt-2 font-mono truncate">{cmd.goal.substring(0, GOAL_PREVIEW_LENGTH)}...</div>
                </button>
              ))}
            </div>

            <div className="bg-dark-surface border border-neon-green/10 rounded p-5">
              <h3 className="text-xs font-bold text-neon-green uppercase tracking-widest mb-4">Runner Architecture — via Infinity Orchestrator</h3>
              <div className="font-mono text-xs text-gray-400 space-y-0.5 leading-relaxed">
                <div><span className="text-neon-green">Dashboard / ChatGPT GPT / Copilot Mobile</span></div>
                <div className="ml-4">↓  POST workflow_dispatch (goal: string)  →  Bearer token (infinity-orchestrator scope)</div>
                <div className="ml-4"><span className="text-white">Infinity Orchestrator</span>  →  autonomous-invention.yml  (ubuntu-latest)</div>
                <div className="ml-8">↓  TAP Protocol (Policy &gt; Authority &gt; Truth)</div>
                <div className="ml-8">↓  repository_dispatch: invention_trigger</div>
                <div className="ml-8"><span className="text-white">InfinityXOneSystems/construct-iq-360</span>  →  dispatch-bridge.yml</div>
                <div className="ml-12 text-gray-600">generate-document  →  Orator / document-pipeline.yml</div>
                <div className="ml-12 text-gray-600">run-agent          →  biz-ops/agent_manager.py  (Hunter / Architect / Shadow / Vault)</div>
                <div className="ml-12 text-gray-600">shadow-scrape      →  Shadow headless agent  (form-fill, snapshot, extract)</div>
                <div className="ml-12 text-gray-600">genesis-command    →  genesis-loop.yml</div>
                <div className="ml-12 text-gray-600">deploy-system      →  deploy-command-center.yml</div>
                <div className="ml-8">↓  Output committed to data/ or docs/</div>
                <div className="ml-4"><span className="text-neon-green">Vault</span>  archives to data/dispatch-log/commands.jsonl</div>
              </div>
            </div>
          </div>
        )}

        {/* Shadow Agent */}
        {tab === 'shadow' && (
          <div className="px-8 py-6 max-w-3xl space-y-6">
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-widest mb-1">Shadow Headless Agent — System Control</h2>
              <p className="text-xs text-gray-500">
                ChatGPT and Copilot can command the Shadow headless browser agent directly through the Infinity Orchestrator.
                All operations route through <span className="text-white font-mono">dispatch-bridge.yml</span> → <span className="text-white font-mono">biz-ops/agent_manager.py</span>.
                Shadow REST API: <span className="text-neon-green font-mono">apps/hunter-agent/scraper_api.py</span> (port 8080).
              </p>
            </div>

            <div className="bg-dark-surface border border-neon-green/10 rounded p-4">
              <div className="font-mono text-xs text-gray-400 space-y-0.5 leading-relaxed">
                <div><span className="text-neon-green">ChatGPT / Copilot Mobile</span></div>
                <div className="ml-4">↓  triggerOrchestrator (goal: natural language)  OR  systemControl (structured)</div>
                <div className="ml-4"><span className="text-white">Infinity Orchestrator</span>  →  autonomous-invention.yml</div>
                <div className="ml-8">↓  repository_dispatch: run-agent / shadow-scrape</div>
                <div className="ml-8"><span className="text-white">dispatch-bridge.yml</span>  →  biz-ops-agent module</div>
                <div className="ml-12"><span className="text-white">agent_manager.py</span>  →  run_shadow(action, payload)</div>
                <div className="ml-16 text-gray-600">scraper_orchestrator.py  →  Playwright browser pool</div>
                <div className="ml-16 text-gray-600">scraper_api.py  →  REST API (port 8080)</div>
                <div className="ml-12">Shadow job manifest  →  data/shadow-jobs/{'{request_id}'}.json</div>
                <div className="ml-8">↓  Results committed to data/  |  Snapshot → data/snapshots/</div>
                <div className="ml-4"><span className="text-neon-green">Vault</span>  audit logs to data/dispatch-log/commands.jsonl</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                { label: 'Capabilities', items: ['Form fill and submit', 'Click, type, scroll, keyboard interaction', 'Full-page screenshot (PNG) + HTML capture', 'Structured data extraction via CSS/XPath selectors', 'Stealth mode with user-agent rotation', 'Parallel instance pool (1–100 browsers)', 'Auto-retry with exponential backoff', 'REST API wrapper (FastAPI on port 8080)', 'Governance audit logging to data/dispatch-log/'] },
                { label: 'Governance Guardrails', items: ['robots.txt checked before every scrape', 'Rate limiting enforced (default: 1000ms between requests)', 'Every action audit-logged with request ID and timestamp', 'No credential storage in code — all via env secrets', 'User-agent rotation enabled by default', 'Max concurrent instances capped by config (default: 10)', 'Snapshot output sanitized — no PII in filenames'] },
              ].map(section => (
                <div key={section.label} className="bg-dark-surface border border-neon-green/10 rounded p-4">
                  <h3 className="text-xs font-bold text-neon-green uppercase tracking-widest mb-3">{section.label}</h3>
                  <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                    {section.items.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-xs font-bold text-neon-green uppercase tracking-widest mb-3">Quick Dispatch — Shadow Commands via Orchestrator</h3>
              {!token && (
                <div className="border border-red-400/20 rounded p-3 text-xs text-red-400 bg-red-400/5 mb-3">
                  No GitHub token. Sign in to dispatch shadow commands.
                </div>
              )}
              {dispatchStatus && (
                <div className={`border rounded p-3 text-xs mb-3 ${
                  dispatchStatus.toLowerCase().includes('error')
                    ? 'border-red-400/20 text-red-400 bg-red-400/5'
                    : 'border-neon-green/20 text-neon-green bg-neon-green/5'
                }`}>{dispatchStatus}</div>
              )}
              <div className="grid grid-cols-2 gap-3">
                {SHADOW_DISPATCH_COMMANDS.map((cmd, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setShadowGoal(cmd.goal);
                      dispatchViaOrchestrator(cmd);
                    }}
                    disabled={dispatchLoading || !token}
                    className="text-left bg-dark-surface border border-neon-green/10 rounded p-4 hover:border-neon-green/30 hover:bg-neon-green/5 transition-all disabled:opacity-40 group"
                  >
                    <div className="text-xs font-bold text-white uppercase tracking-widest mb-1 group-hover:text-neon-green transition-colors">{cmd.label}</div>
                    <div className="text-xs text-gray-500 mt-2 font-mono truncate">{cmd.goal.substring(0, GOAL_PREVIEW_LENGTH)}...</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-dark-surface border border-neon-green/10 rounded p-5">
              <h3 className="text-xs font-bold text-neon-green uppercase tracking-widest mb-3">Custom Shadow Goal</h3>
              <p className="text-xs text-gray-500 mb-3">Send a custom natural-language goal directly to the Shadow agent via the Infinity Orchestrator runner.</p>
              <textarea
                value={shadowGoal}
                onChange={e => setShadowGoal(e.target.value)}
                rows={3}
                placeholder="Run Shadow agent to scrape https://example.com and extract..."
                className="w-full bg-black border border-neon-green/10 rounded px-3 py-2 text-white text-xs font-mono placeholder-gray-700 focus:outline-none focus:border-neon-green/40 resize-none mb-3"
              />
              <button
                onClick={() => dispatchViaOrchestrator({ label: 'Custom Shadow Goal', goal: shadowGoal })}
                disabled={dispatchLoading || !token || !shadowGoal.trim()}
                className="px-5 py-2 bg-neon-green text-black text-xs font-bold uppercase tracking-widest rounded hover:bg-white transition-colors disabled:opacity-40"
              >
                Dispatch via Orchestrator
              </button>
            </div>

            <div className="bg-dark-surface border border-neon-green/10 rounded p-5">
              <h3 className="text-xs font-bold text-neon-green uppercase tracking-widest mb-3">Shadow API Endpoints (scraper_api.py)</h3>
              <div className="space-y-2">
                {[
                  { method: 'POST', path: '/orchestrator/start', desc: 'Start the Playwright browser instance pool' },
                  { method: 'POST', path: '/orchestrator/stop', desc: 'Stop and cleanup all browser instances' },
                  { method: 'GET',  path: '/orchestrator/metrics', desc: 'Instance pool metrics and success rate' },
                  { method: 'POST', path: '/scrape/submit', desc: 'Submit a scrape job (returns job_id)' },
                  { method: 'GET',  path: '/scrape/results/{job_id}', desc: 'Get results for a completed scrape job' },
                  { method: 'GET',  path: '/health', desc: 'Health check and orchestrator status' },
                ].map(ep => (
                  <div key={ep.path} className="flex items-center space-x-3 bg-black rounded p-2.5">
                    <span className={`text-xs font-bold font-mono w-10 shrink-0 ${ep.method === 'GET' ? 'text-neon-green' : 'text-amber-400'}`}>{ep.method}</span>
                    <span className="text-xs font-mono text-white flex-1">{ep.path}</span>
                    <span className="text-xs text-gray-600 text-right">{ep.desc}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-3 font-mono">Run locally: <span className="text-neon-green">cd apps/hunter-agent && python scraper_api.py</span></p>
              <p className="text-xs text-gray-600 font-mono">Docker: <span className="text-neon-green">docker-compose up shadow-api</span> (port 8080)</p>
            </div>

            <div className="bg-dark-surface border border-neon-green/10 rounded p-5">
              <h3 className="text-xs font-bold text-neon-green uppercase tracking-widest mb-3">ChatGPT — systemControl Shadow Examples</h3>
              <p className="text-xs text-gray-500 mb-3">Use the <span className="text-white font-mono">systemControl</span> action in your Custom GPT for structured shadow commands:</p>
              <div className="space-y-3">
                {[
                  {
                    title: 'Scrape with selectors',
                    code: `{
  "event_type": "invention_trigger",
  "client_payload": {
    "goal": "Scrape permit data",
    "command": "run-agent",
    "agent": "shadow",
    "action": "scrape",
    "urls": ["https://permits.orangecountyfl.net/search"],
    "selectors": {
      "permit_number": ".permit-number",
      "value": ".permit-value"
    }
  }
}`,
                  },
                  {
                    title: 'Form fill and extract',
                    code: `{
  "event_type": "invention_trigger",
  "client_payload": {
    "goal": "Fill permit search form",
    "command": "run-agent",
    "agent": "shadow",
    "action": "form-fill",
    "url": "https://permits.example.com/search",
    "form_fields": { "zip": "32801", "type": "residential" },
    "submit_selector": "#search-submit"
  }
}`,
                  },
                ].map(ex => (
                  <div key={ex.title}>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">{ex.title}</div>
                    <pre className="bg-black rounded p-3 text-xs text-gray-400 font-mono overflow-x-auto whitespace-pre">{ex.code}</pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Plugin Adapter */}
        {tab === 'plugin' && (
          <div className="px-8 py-6 max-w-3xl space-y-6">
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-widest mb-1">Plugin Adapter System</h2>
              <p className="text-xs text-gray-500">Connect Construct-OS to external sites and services. Each plugin is a typed connector registered with the adapter. See <code className="text-neon-green font-mono text-xs">src/lib/plugin-adapter.ts</code>.</p>
            </div>

            <div className="bg-dark-surface border border-neon-green/10 rounded p-5">
              <h3 className="text-xs font-bold text-neon-green uppercase tracking-widest mb-4">Registered Plugins</h3>
              <div className="space-y-2">
                {[
                  { name: 'Dodge Data & Analytics', type: 'leads', status: 'available', description: 'Commercial construction project leads from Dodge database' },
                  { name: 'ConstructConnect', type: 'leads', status: 'available', description: 'Bid management and project tracking integration' },
                  { name: 'Google Workspace', type: 'export', status: 'active', description: 'CSV export to Sheets, Docs generation to Drive' },
                  { name: 'DocuSign', type: 'contracts', status: 'available', description: 'Contract signature automation' },
                  { name: 'Procore', type: 'project-management', status: 'available', description: 'Project management sync via Procore API' },
                  { name: 'QuickBooks', type: 'billing', status: 'available', description: 'Invoice and billing export to QuickBooks Online' },
                  { name: 'Stripe', type: 'payments', status: 'available', description: 'Payment processing for proposals and invoices' },
                ].map(plugin => (
                  <div key={plugin.name} className="flex items-center justify-between bg-black border border-neon-green/5 rounded p-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white">{plugin.name}</div>
                      <div className="text-xs text-gray-600 mt-0.5">{plugin.description}</div>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0 ml-4">
                      <span className="text-xs text-gray-600 uppercase tracking-wider border border-neon-green/10 rounded px-2 py-0.5">{plugin.type}</span>
                      <span className={`text-xs uppercase tracking-wider border rounded px-2 py-0.5 ${
                        plugin.status === 'active'
                          ? 'text-neon-green border-neon-green/20'
                          : 'text-gray-600 border-gray-800'
                      }`}>{plugin.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-dark-surface border border-neon-green/10 rounded p-5">
              <h3 className="text-xs font-bold text-neon-green uppercase tracking-widest mb-3">Plugin Adapter API</h3>
              <div className="bg-black rounded p-4 font-mono text-xs text-gray-400 leading-relaxed">
                <div><span className="text-neon-green">import</span> {'{ PluginAdapter }'} <span className="text-neon-green">from</span> <span className="text-gray-300">&apos;@/lib/plugin-adapter&apos;</span>;</div>
                <div className="mt-3 text-gray-600">{/* Register an external connector */}</div>
                <div>PluginAdapter.register({'{ id: "procore", type: "project-management", ... }'});</div>
                <div className="mt-3 text-gray-600">{/* Execute a plugin action */}</div>
                <div>await PluginAdapter.execute(<span className="text-gray-300">&quot;procore&quot;</span>, <span className="text-gray-300">&quot;syncProject&quot;</span>, payload);</div>
                <div className="mt-3 text-gray-600">{/* List registered plugins */}</div>
                <div>PluginAdapter.list();</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
