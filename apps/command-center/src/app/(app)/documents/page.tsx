'use client';

import { useState } from 'react';

interface DocEntry {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  githubPath: string;
  tags: string[];
}

const DOCS: DocEntry[] = [
  // System Documentation
  { id: 'index', title: 'Document Package Index', category: 'System', description: 'Master index of all documents, templates, and resources in the system.', icon: '📑', githubPath: 'docs/DOCUMENT_PACKAGE_INDEX.md', tags: ['index', 'master', 'system'] },
  { id: 'roadmap', title: 'System Roadmap', category: 'System', description: 'Full product roadmap — current features, planned enhancements, and long-term vision.', icon: '🗺️', githubPath: 'docs/ROADMAP.md', tags: ['roadmap', 'planning', 'features'] },
  { id: 'architecture', title: 'System Architecture', category: 'System', description: 'Technical architecture, agent design, data flows, and integration map.', icon: '🏗️', githubPath: 'ARCHITECTURE.md', tags: ['architecture', 'technical', 'agents'] },
  { id: 'runbook', title: 'Operations Runbook', category: 'System', description: 'Day-to-day operational procedures, troubleshooting, and incident response.', icon: '📖', githubPath: 'docs/RUNBOOKS.md', tags: ['runbook', 'operations', 'procedures'] },

  // AI & Connectors
  { id: 'ai-connectors', title: 'AI Connectors Guide', category: 'AI & Integrations', description: 'Setup for ChatGPT Custom GPT, GitHub Copilot, and Infinity Orchestrator integration.', icon: '🤖', githubPath: 'docs/AI_CONNECTORS.md', tags: ['AI', 'ChatGPT', 'Copilot', 'GPT'] },
  { id: 'copilot-mobile', title: 'Copilot Mobile Instructions', category: 'AI & Integrations', description: 'Custom instructions for GitHub Copilot mobile with this system\'s full context.', icon: '📱', githubPath: 'docs/COPILOT_MOBILE_INSTRUCTIONS.md', tags: ['Copilot', 'mobile', 'instructions'] },
  { id: 'orchestrator', title: 'Infinity Orchestrator Integration', category: 'AI & Integrations', description: 'How the dispatch bridge connects to Infinity Orchestrator, command types, and payload formats.', icon: '🔗', githubPath: 'docs/INFINITY_ORCHESTRATOR_INTEGRATION.md', tags: ['orchestrator', 'dispatch', 'API'] },

  // Construction Documents
  { id: 'blueprints', title: 'Project Blueprints', category: 'Construction', description: 'Blueprint templates and specification guides for residential and commercial projects.', icon: '📐', githubPath: 'docs/BLUEPRINTS.md', tags: ['blueprints', 'plans', 'specifications'] },
  { id: 'checklists', title: 'Construction Checklists', category: 'Construction', description: 'Pre-construction, safety, quality control, and closeout checklists.', icon: '✅', githubPath: 'docs/CHECKLISTS.md', tags: ['checklist', 'safety', 'QC', 'closeout'] },
  { id: 'contracts', title: 'Contract Templates', category: 'Construction', description: 'Residential and commercial construction contracts, subcontractor agreements, lien waivers.', icon: '📜', githubPath: 'docs/CONTRACT_TEMPLATES.md', tags: ['contract', 'legal', 'agreement'] },

  // Data & Pipelines
  { id: 'google-workspace', title: 'Google Workspace Pipeline', category: 'Data & Pipelines', description: 'CSV import/export schemas, Google Sheets templates, Apps Script automations.', icon: '📊', githubPath: 'docs/GOOGLE_WORKSPACE_PIPELINE.md', tags: ['Google', 'Sheets', 'CSV', 'pipeline'] },
  { id: 'health-check', title: 'System Health Report', category: 'Data & Pipelines', description: 'Latest automated system health check including workflow status and security audit.', icon: '💊', githubPath: 'docs/HEALTH_CHECK_REPORT.md', tags: ['health', 'monitoring', 'security'] },
];

const CATEGORIES = [...new Set(DOCS.map(d => d.category))];

const BASE_GITHUB = 'https://github.com/InfinityXOneSystems/construct-iq-360/blob/main/';

export default function DocumentsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered = DOCS.filter(doc => {
    const matchCategory = activeCategory === 'all' || doc.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || doc.title.toLowerCase().includes(q) || doc.description.toLowerCase().includes(q) || doc.tags.some(t => t.toLowerCase().includes(q));
    return matchCategory && matchSearch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neon-green glow-text">Document Library</h1>
        <p className="text-gray-400 text-sm mt-1">Blueprints, checklists, runbooks, contracts, and system documentation</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search documents..."
          className="bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-green w-64"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-medium transition-colors ${activeCategory === 'all' ? 'bg-neon-green text-black' : 'bg-dark-surface text-gray-400 border border-dark-border hover:border-neon-green hover:text-neon-green'}`}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-medium transition-colors ${activeCategory === cat ? 'bg-neon-green text-black' : 'bg-dark-surface text-gray-400 border border-dark-border hover:border-neon-green hover:text-neon-green'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-500 ml-auto">{filtered.length} documents</span>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(doc => (
          <a
            key={doc.id}
            href={`${BASE_GITHUB}${doc.githubPath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-dark-surface border border-dark-border rounded-xl p-5 hover:border-neon-green transition-all group"
          >
            <div className="flex items-start space-x-4">
              <div className="text-3xl flex-shrink-0">{doc.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-sm font-bold text-white group-hover:text-neon-green transition-colors">{doc.title}</h3>
                  <span className="text-gray-600 text-xs ml-2 group-hover:text-neon-green transition-colors">↗</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{doc.category}</p>
                <p className="text-xs text-gray-400 mb-3">{doc.description}</p>
                <div className="flex flex-wrap gap-1">
                  {doc.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs px-1.5 py-0.5 bg-dark-bg rounded text-gray-500">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Template Quick Links */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
        <h2 className="text-sm font-bold text-neon-green uppercase tracking-wider mb-4">📋 Template Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Residential Bid', href: '/templates', icon: '🏠' },
            { label: 'Commercial Bid', href: '/templates', icon: '🏢' },
            { label: 'Change Order', href: '/templates', icon: '🔄' },
            { label: 'Subcontractor Agreement', href: '/templates', icon: '🤝' },
            { label: 'Lien Waiver', href: '/templates', icon: '🔏' },
            { label: 'Pre-Construction Checklist', href: '/templates', icon: '✅' },
            { label: 'Safety Inspection', href: '/templates', icon: '⛑️' },
            { label: 'Bid Preparation Runbook', href: '/templates', icon: '📖' },
          ].map(item => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center space-x-2 bg-dark-bg rounded-lg p-3 hover:border-neon-green border border-dark-border transition-colors group"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs text-gray-400 group-hover:text-neon-green transition-colors">{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
