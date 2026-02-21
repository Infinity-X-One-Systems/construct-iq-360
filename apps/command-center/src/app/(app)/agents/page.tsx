'use client';

import { useState } from 'react';

type AgentStatus = 'online' | 'idle' | 'running' | 'error';

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  skills: string[];
  llm: string;
  status: AgentStatus;
  lastRun: string;
  runs: number;
  successRate: number;
  blueprint: string;
  workflow: string;
}

const AGENTS: Agent[] = [
  {
    id: 'hunter',
    name: 'Hunter',
    role: 'Lead Acquisition',
    description: 'Autonomous lead discovery engine. Targets Orlando metro construction permit databases, government portals, and real estate indices. Integrates scraper orchestrator with stealth browser rotation.',
    skills: ['Headless Playwright scraping', 'Permit database parsing', 'Lead qualification scoring', 'Google Maps extraction', 'Rate-limit evasion', 'Auto-retry orchestration'],
    llm: 'GPT-4o — lead scoring + extraction rules',
    status: 'idle',
    lastRun: '2026-02-20T06:00:00Z',
    runs: 148,
    successRate: 96.2,
    blueprint: 'apps/hunter-agent/main.py',
    workflow: '.github/workflows/hunter-cron.yml',
  },
  {
    id: 'architect',
    name: 'Architect',
    role: 'Estimation & Design',
    description: 'Construction estimation engine with CSI MasterFormat Div 01-33 knowledge. Generates AIA-compliant bid packages, material takeoffs, and labor schedules. Vertex AI AutoML for cost prediction.',
    skills: ['CSI MasterFormat estimation', 'AIA G702/G703 billing', 'Material takeoff generation', 'Labor schedule computation', 'Vertex AI AutoML cost model', 'PDF/CSV export'],
    llm: 'Vertex AI (Gemini Pro) — cost prediction + AutoML',
    status: 'idle',
    lastRun: '2026-02-20T04:30:00Z',
    runs: 89,
    successRate: 98.9,
    blueprint: 'apps/architect-ai/estimator.py',
    workflow: '.github/workflows/dispatch-bridge.yml',
  },
  {
    id: 'orator',
    name: 'Orator',
    role: 'Document Generation',
    description: 'Generates professional construction documents: proposals, contracts, change orders, lien waivers, NTOs, subcontractor agreements. Pulls live data from CRM and billing systems.',
    skills: ['Template rendering (11+ templates)', 'Contract drafting', 'Proposal generation', 'Change order processing', 'Lien waiver generation', 'Google Workspace export'],
    llm: 'GPT-4o — document drafting + legal language',
    status: 'running',
    lastRun: '2026-02-20T08:15:00Z',
    runs: 312,
    successRate: 99.4,
    blueprint: 'apps/command-center/src/lib/templates.ts',
    workflow: '.github/workflows/document-pipeline.yml',
  },
  {
    id: 'shadow',
    name: 'Shadow',
    role: 'Headless Browser Agent',
    description: 'Governess-gated headless REST API agent. Full browser automation: form fill, type, click, scroll, snapshot, extract. Operates with guardrails, rate limiting, and audit logging. Used by all other agents for web-based data acquisition.',
    skills: ['Form fill & submit', 'Scroll & click automation', 'Page snapshot (PNG/HTML)', 'Stealth mode + user-agent rotation', 'Parallel instance pool (1-100)', 'Governance audit logging'],
    llm: 'Vertex AI — page content classification',
    status: 'idle',
    lastRun: '2026-02-20T07:45:00Z',
    runs: 1024,
    successRate: 94.7,
    blueprint: 'apps/hunter-agent/scraper_orchestrator.py',
    workflow: '.github/workflows/dispatch-bridge.yml',
  },
  {
    id: 'commander',
    name: 'Commander',
    role: 'Deployment & Ops',
    description: 'System deployment and operations commander. Manages GitHub Pages releases, monitors workflow health, triggers self-repair sequences, and handles the Genesis Loop for recursive self-improvement.',
    skills: ['GitHub Pages deployment', 'Workflow health monitoring', 'Self-repair orchestration', 'Genesis Loop execution', 'PR auto-merge', 'Branch lifecycle management'],
    llm: 'GPT-4o — ops decision-making',
    status: 'online',
    lastRun: '2026-02-20T08:00:00Z',
    runs: 567,
    successRate: 99.1,
    blueprint: '.github/workflows/genesis-loop.yml',
    workflow: '.github/workflows/auto-merge.yml',
  },
  {
    id: 'vault',
    name: 'Vault',
    role: 'Memory & Knowledge',
    description: 'Enterprise-grade memory system. Maintains agent context, lead history, decision logs, and system state. Rehydrates agents with domain knowledge before each run. Backs all data to GitHub Issues and data/ directory.',
    skills: ['Context rehydration', 'Lead history indexing', 'Decision audit logging', 'JSON state management', 'Cross-agent knowledge sync', 'Dispatch log archiving'],
    llm: 'Vertex AI embeddings — semantic search',
    status: 'online',
    lastRun: '2026-02-20T08:40:00Z',
    runs: 2341,
    successRate: 99.9,
    blueprint: '.infinity/ACTIVE_MEMORY.md',
    workflow: '.github/workflows/sync-validator.yml',
  },
];

const STATUS_COLORS: Record<AgentStatus, string> = {
  online: 'text-neon-green border-neon-green/30 bg-neon-green/5',
  idle: 'text-gray-400 border-gray-700 bg-gray-900/30',
  running: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
  error: 'text-red-400 border-red-400/30 bg-red-400/5',
};

const STATUS_DOT: Record<AgentStatus, string> = {
  online: 'bg-neon-green animate-pulse',
  idle: 'bg-gray-500',
  running: 'bg-yellow-400 animate-pulse',
  error: 'bg-red-400',
};

export default function AgentsPage() {
  const [selected, setSelected] = useState<Agent | null>(AGENTS[0]);

  return (
    <div className="h-full flex">
      {/* Agent List */}
      <div className="w-72 shrink-0 border-r border-neon-green/10 flex flex-col">
        <div className="px-5 py-4 border-b border-neon-green/10">
          <h1 className="text-xs font-bold text-white uppercase tracking-widest">Agent Roster</h1>
          <p className="text-xs text-gray-600 mt-0.5">{AGENTS.filter(a => a.status !== 'error').length} of {AGENTS.length} operational</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {AGENTS.map(agent => (
            <button
              key={agent.id}
              onClick={() => setSelected(agent)}
              className={`w-full text-left px-5 py-4 border-b border-neon-green/5 transition-all ${
                selected?.id === agent.id
                  ? 'bg-neon-green/5 border-l-2 border-l-neon-green'
                  : 'hover:bg-white/2 border-l-2 border-l-transparent'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white uppercase tracking-widest">{agent.name}</span>
                <div className="flex items-center space-x-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[agent.status]}`} />
                  <span className={`text-xs border rounded px-1 py-0.5 uppercase tracking-wider font-mono ${STATUS_COLORS[agent.status]}`}>
                    {agent.status}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500">{agent.role}</p>
              <div className="mt-2 flex items-center space-x-3 text-xs text-gray-700">
                <span>{agent.runs} runs</span>
                <span>{agent.successRate}% success</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Agent Detail */}
      {selected && (
        <div className="flex-1 overflow-y-auto">
          <div className="px-8 py-6 border-b border-neon-green/10 flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-bold text-white uppercase tracking-widest">{selected.name}</h2>
                <span className={`text-xs border rounded px-2 py-0.5 uppercase tracking-wider font-mono ${STATUS_COLORS[selected.status]}`}>
                  {selected.status}
                </span>
              </div>
              <p className="text-xs text-neon-green mt-1 uppercase tracking-widest">{selected.role}</p>
            </div>
            <div className="text-right text-xs text-gray-600">
              <div>Last run: {new Date(selected.lastRun).toLocaleString()}</div>
              <div className="mt-1">Total runs: {selected.runs}</div>
            </div>
          </div>

          <div className="px-8 py-6 grid grid-cols-3 gap-4 border-b border-neon-green/5">
            <div className="bg-dark-surface border border-neon-green/10 rounded p-4">
              <div className="text-xs text-gray-600 uppercase tracking-widest mb-1">Success Rate</div>
              <div className="text-2xl font-bold text-neon-green font-mono">{selected.successRate}%</div>
            </div>
            <div className="bg-dark-surface border border-neon-green/10 rounded p-4">
              <div className="text-xs text-gray-600 uppercase tracking-widest mb-1">Total Runs</div>
              <div className="text-2xl font-bold text-white font-mono">{selected.runs.toLocaleString()}</div>
            </div>
            <div className="bg-dark-surface border border-neon-green/10 rounded p-4">
              <div className="text-xs text-gray-600 uppercase tracking-widest mb-1">LLM</div>
              <div className="text-xs font-bold text-white font-mono mt-1">{selected.llm.split(' — ')[0]}</div>
              <div className="text-xs text-gray-600 mt-0.5">{selected.llm.split(' — ')[1]}</div>
            </div>
          </div>

          <div className="px-8 py-6 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{selected.description}</p>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Capabilities</h3>
              <div className="grid grid-cols-2 gap-2">
                {selected.skills.map(skill => (
                  <div key={skill} className="flex items-center space-x-2 text-xs text-gray-400">
                    <div className="w-1 h-1 bg-neon-green rounded-full shrink-0" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Blueprint */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Blueprint</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 bg-dark-surface border border-neon-green/10 rounded p-3">
                  <div className="text-xs text-gray-500 uppercase tracking-widest w-20 shrink-0">Source</div>
                  <a
                    href={`https://github.com/InfinityXOneSystems/construct-iq-360/blob/main/${selected.blueprint}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-neon-green font-mono hover:underline"
                  >
                    {selected.blueprint}
                  </a>
                </div>
                <div className="flex items-center space-x-3 bg-dark-surface border border-neon-green/10 rounded p-3">
                  <div className="text-xs text-gray-500 uppercase tracking-widest w-20 shrink-0">Workflow</div>
                  <a
                    href={`https://github.com/InfinityXOneSystems/construct-iq-360/blob/main/${selected.workflow}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-neon-green font-mono hover:underline"
                  >
                    {selected.workflow}
                  </a>
                </div>
              </div>
            </div>

            {/* Orchestration */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Orchestration</h3>
              <div className="bg-dark-surface border border-neon-green/10 rounded p-4 font-mono text-xs text-gray-400 space-y-1">
                <div><span className="text-neon-green">Orchestrator</span> → repository_dispatch → dispatch-bridge.yml</div>
                <div><span className="text-neon-green">ChatGPT</span> → GitHub API → runner → {selected.id} agent</div>
                <div><span className="text-neon-green">Copilot Mobile</span> → .github/copilot-instructions.md → {selected.id} agent</div>
                <div><span className="text-neon-green">Memory</span> → Vault agent → data/dispatch-log/commands.jsonl</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
