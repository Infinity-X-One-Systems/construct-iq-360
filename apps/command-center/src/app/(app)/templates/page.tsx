'use client';

import { useState, useMemo } from 'react';
import {
  ALL_TEMPLATES, ConstructionTemplate, TemplateCategory,
  renderTemplate, getTemplatesByCategory,
} from '@/lib/templates';
import { downloadCSV } from '@/lib/csv';

const CATEGORY_ICONS: Record<TemplateCategory, string> = {
  proposal: '📋',
  contract: '📜',
  checklist: '✅',
  runbook: '📖',
  blueprint: '🔵',
  'change-order': '🔄',
  'lien-waiver': '🔏',
};

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  proposal: 'Proposals & Bids',
  contract: 'Contracts',
  checklist: 'Checklists',
  runbook: 'Runbooks',
  blueprint: 'Blueprints',
  'change-order': 'Change Orders',
  'lien-waiver': 'Lien Waivers',
};

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<ConstructionTemplate | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState('');
  const [copied, setCopied] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(ALL_TEMPLATES.map(t => t.category));
    return Array.from(cats) as TemplateCategory[];
  }, []);

  const visible = useMemo(() =>
    selectedCategory === 'all'
      ? ALL_TEMPLATES
      : ALL_TEMPLATES.filter(t => t.category === selectedCategory),
    [selectedCategory]
  );

  const selectTemplate = (t: ConstructionTemplate) => {
    setSelectedTemplate(t);
    const defaults: Record<string, string> = {};
    t.variables.forEach(v => { defaults[v.key] = v.defaultValue ?? ''; });
    setFormValues(defaults);
    setPreview('');
  };

  const handleGenerate = () => {
    if (!selectedTemplate) return;
    const rendered = renderTemplate(selectedTemplate, formValues);
    setPreview(rendered);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(preview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([preview], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate?.id ?? 'template'}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-full">
      {/* Template Library Sidebar */}
      <div className="w-72 border-r border-dark-border bg-dark-surface/50 flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-dark-border">
          <h2 className="text-sm font-bold text-neon-green uppercase tracking-wider">Template Library</h2>
          <p className="text-xs text-gray-500 mt-1">{ALL_TEMPLATES.length} templates available</p>
        </div>

        {/* Category Filter */}
        <div className="p-3 border-b border-dark-border">
          <div className="space-y-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`w-full text-left px-3 py-2 rounded text-xs uppercase tracking-wider transition-colors
                ${selectedCategory === 'all' ? 'bg-neon-green/10 text-neon-green border border-neon-green/30' : 'text-gray-400 hover:text-neon-green'}`}
            >
              All Templates ({ALL_TEMPLATES.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded text-xs uppercase tracking-wider transition-colors flex items-center space-x-2
                  ${selectedCategory === cat ? 'bg-neon-green/10 text-neon-green border border-neon-green/30' : 'text-gray-400 hover:text-neon-green'}`}
              >
                <span>{CATEGORY_ICONS[cat]}</span>
                <span className="flex-1">{CATEGORY_LABELS[cat]}</span>
                <span className="text-gray-600">{ALL_TEMPLATES.filter(t => t.category === cat).length}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Template List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {visible.map(t => (
            <button
              key={t.id}
              onClick={() => selectTemplate(t)}
              className={`w-full text-left p-3 rounded-lg border transition-all
                ${selectedTemplate?.id === t.id
                  ? 'bg-neon-green/10 border-neon-green text-neon-green'
                  : 'bg-dark-surface border-dark-border text-gray-300 hover:border-neon-green/40'}`}
            >
              <div className="flex items-start space-x-2">
                <span className="text-lg flex-shrink-0">{CATEGORY_ICONS[t.category]}</span>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{t.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.projectType.join(', ')}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {!selectedTemplate ? (
          <div className="h-full flex items-center justify-center text-center p-8">
            <div>
              <div className="text-5xl mb-4">📋</div>
              <h2 className="text-xl font-bold text-neon-green mb-2">Select a Template</h2>
              <p className="text-gray-400 text-sm">Choose a template from the library to fill in variables and generate a professional document.</p>
              <div className="mt-6 grid grid-cols-2 gap-3 max-w-sm mx-auto">
                {categories.slice(0, 4).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="bg-dark-surface border border-dark-border rounded-lg p-3 hover:border-neon-green transition-colors text-center"
                  >
                    <span className="text-2xl block mb-1">{CATEGORY_ICONS[cat]}</span>
                    <span className="text-xs text-gray-400">{CATEGORY_LABELS[cat]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Template Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-2xl">{CATEGORY_ICONS[selectedTemplate.category]}</span>
                  <h1 className="text-xl font-bold text-neon-green">{selectedTemplate.name}</h1>
                </div>
                <p className="text-gray-400 text-sm">{selectedTemplate.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedTemplate.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-neon-green/10 text-neon-green border border-neon-green/20 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">v{selectedTemplate.version}</span>
            </div>

            {/* Variable Form */}
            {selectedTemplate.variables.length > 0 && (
              <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
                <h3 className="text-sm font-bold text-neon-green uppercase tracking-wider mb-4">Fill In Variables</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTemplate.variables.map(v => (
                    <div key={v.key}>
                      <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">
                        {v.label}{v.required && <span className="text-red-400 ml-1">*</span>}
                      </label>
                      {v.type === 'select' ? (
                        <select
                          value={formValues[v.key] ?? ''}
                          onChange={e => setFormValues(prev => ({ ...prev, [v.key]: e.target.value }))}
                          className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-green"
                        >
                          <option value="">Select...</option>
                          {v.options?.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input
                          type={v.type === 'date' ? 'date' : v.type === 'number' || v.type === 'currency' ? 'number' : 'text'}
                          value={formValues[v.key] ?? ''}
                          onChange={e => setFormValues(prev => ({ ...prev, [v.key]: e.target.value }))}
                          placeholder={v.placeholder ?? ''}
                          className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-green"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleGenerate}
                  className="mt-4 bg-neon-green text-black font-bold px-6 py-2 rounded-lg text-sm hover:bg-white transition-colors"
                >
                  ⚡ Generate Document
                </button>
              </div>
            )}

            {/* Template Sections Preview */}
            {!preview && (
              <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
                <h3 className="text-sm font-bold text-neon-green uppercase tracking-wider mb-4">
                  Sections ({selectedTemplate.sections.length})
                </h3>
                <div className="space-y-2">
                  {selectedTemplate.sections.map((s, i) => (
                    <div key={s.id} className="flex items-center space-x-3 py-2 border-b border-dark-border last:border-0">
                      <span className="text-xs text-gray-600 w-5">{i + 1}</span>
                      <span className="text-sm text-gray-300">{s.title}</span>
                      {s.variables.length > 0 && (
                        <span className="text-xs text-neon-green/60">{s.variables.length} var{s.variables.length !== 1 ? 's' : ''}</span>
                      )}
                    </div>
                  ))}
                </div>
                {selectedTemplate.variables.length === 0 && (
                  <button
                    onClick={handleGenerate}
                    className="mt-4 bg-neon-green text-black font-bold px-6 py-2 rounded-lg text-sm hover:bg-white transition-colors"
                  >
                    ⚡ Generate Document
                  </button>
                )}
              </div>
            )}

            {/* Generated Preview */}
            {preview && (
              <div className="bg-dark-surface border border-neon-green/30 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-neon-green/20 bg-neon-green/5">
                  <h3 className="text-sm font-bold text-neon-green">Generated Document</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCopy}
                      className="text-xs px-3 py-1 border border-neon-green/30 text-neon-green rounded hover:bg-neon-green/10 transition-colors"
                    >
                      {copied ? '✓ Copied' : '📋 Copy'}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="text-xs px-3 py-1 bg-neon-green text-black rounded font-bold hover:bg-white transition-colors"
                    >
                      ⬇ Download .md
                    </button>
                    <button
                      onClick={() => setPreview('')}
                      className="text-gray-400 hover:text-white ml-2"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <pre className="p-5 text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto font-mono">
                  {preview}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
