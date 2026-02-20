'use client';

import { useState, useMemo } from 'react';
import {
  SAMPLE_LEADS, CRMLead, LeadStatus, STATUS_LABELS, STATUS_COLORS,
  formatCurrency, getPipelineMetrics, CRM_CSV_HEADERS, leadToCSVRow,
} from '@/lib/crm';
import { arrayToCSV, downloadCSV } from '@/lib/csv';

type SortField = 'projectValue' | 'score' | 'followUpDate' | 'company' | 'updatedAt';

export default function CRMPage() {
  const [leads, setLeads] = useState<CRMLead[]>(SAMPLE_LEADS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null);

  const metrics = useMemo(() => getPipelineMetrics(leads), [leads]);

  const filtered = useMemo(() => {
    let data = leads;
    if (statusFilter !== 'all') data = data.filter(l => l.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(l =>
        l.company.toLowerCase().includes(q) ||
        l.contactName.toLowerCase().includes(q) ||
        l.projectName.toLowerCase().includes(q) ||
        l.projectType.toLowerCase().includes(q)
      );
    }
    data = [...data].sort((a, b) => {
      let av: string | number = a[sortField] ?? '';
      let bv: string | number = b[sortField] ?? '';
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      av = String(av); bv = String(bv);
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return data;
  }, [leads, search, statusFilter, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const handleExportCSV = () => {
    const rows = filtered.map(leadToCSVRow);
    const csv = arrayToCSV(CRM_CSV_HEADERS, rows);
    downloadCSV(`crm-leads-${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  const updateStatus = (id: string, status: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status, updatedAt: new Date().toISOString() } : l));
  };

  const SortBtn = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => toggleSort(field)}
      className={`flex items-center space-x-1 hover:text-neon-green transition-colors ${sortField === field ? 'text-neon-green' : 'text-gray-400'}`}
    >
      <span>{label}</span>
      <span className="text-xs">{sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : '⇅'}</span>
    </button>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neon-green glow-text">CRM / Lead Pipeline</h1>
          <p className="text-gray-400 text-sm mt-1">Track, qualify, and convert construction leads</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-2 bg-neon-green text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-white transition-colors"
        >
          <span>⬇</span>
          <span>Export CSV</span>
        </button>
      </div>

      {/* Metric Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: String(metrics.total), icon: '👥' },
          { label: 'Active', value: String(metrics.activeLeads), icon: '🔄' },
          { label: 'Hot (≥80)', value: String(metrics.hotLeads), icon: '🔥' },
          { label: 'Pipeline Value', value: formatCurrency(metrics.totalValue), icon: '💰' },
        ].map(m => (
          <div key={m.label} className="bg-dark-surface border border-dark-border rounded-lg p-4 flex items-center space-x-3">
            <span className="text-2xl">{m.icon}</span>
            <div>
              <p className="text-neon-green font-bold text-xl">{m.value}</p>
              <p className="text-gray-400 text-xs uppercase tracking-wider">{m.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search leads..."
          className="bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-green w-64"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as LeadStatus | 'all')}
          className="bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-green"
        >
          <option value="all">All Statuses</option>
          {(Object.keys(STATUS_LABELS) as LeadStatus[]).map(s => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
        <span className="text-xs text-gray-500 self-center">{filtered.length} records</span>
      </div>

      {/* Table */}
      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border bg-black/40">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider"><SortBtn field="company" label="Company / Lead" /></th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-400">Type</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider"><SortBtn field="projectValue" label="Value" /></th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider"><SortBtn field="score" label="Score" /></th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider"><SortBtn field="followUpDate" label="Follow-Up" /></th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => (
                <tr
                  key={lead.id}
                  className={`border-b border-dark-border hover:bg-neon-green/5 transition-colors cursor-pointer ${i % 2 === 0 ? '' : 'bg-black/20'}`}
                  onClick={() => setSelectedLead(lead)}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-white">{lead.company}</p>
                      <p className="text-xs text-gray-400">{lead.contactName} · {lead.projectName}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{lead.projectType}</td>
                  <td className="px-4 py-3 text-neon-green font-mono">{formatCurrency(lead.projectValue)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded border ${STATUS_COLORS[lead.status]}`}>
                      {STATUS_LABELS[lead.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-12 bg-dark-bg rounded-full h-1.5">
                        <div className="bg-neon-green h-1.5 rounded-full" style={{ width: `${lead.score}%` }} />
                      </div>
                      <span className="text-xs text-gray-300">{lead.score}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{lead.followUpDate || '—'}</td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <select
                      value={lead.status}
                      onChange={e => updateStatus(lead.id, e.target.value as LeadStatus)}
                      className="bg-dark-bg border border-dark-border rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-neon-green"
                    >
                      {(Object.keys(STATUS_LABELS) as LeadStatus[]).map(s => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedLead && (
        <div className="fixed inset-y-0 right-0 w-96 bg-dark-surface border-l border-neon-green/30 shadow-2xl z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-neon-green">Lead Detail</h2>
              <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
            </div>
            <div className="space-y-4">
              <Field label="Company" value={selectedLead.company} />
              <Field label="Contact" value={`${selectedLead.contactName} · ${selectedLead.title}`} />
              <Field label="Email" value={selectedLead.email} />
              <Field label="Phone" value={selectedLead.phone} />
              <Field label="Project" value={selectedLead.projectName} />
              <Field label="Type" value={selectedLead.projectType} />
              <Field label="Value" value={formatCurrency(selectedLead.projectValue)} highlight />
              <Field label="Address" value={selectedLead.projectAddress} />
              <Field label="Source" value={selectedLead.source} />
              <Field label="Score" value={`${selectedLead.score}/100`} />
              <Field label="Assigned" value={selectedLead.assignedTo} />
              <Field label="Follow-Up" value={selectedLead.followUpDate || '—'} />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Notes</p>
                <p className="text-sm text-gray-300 bg-dark-bg rounded p-3">{selectedLead.notes}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {selectedLead.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 bg-neon-green/10 text-neon-green border border-neon-green/30 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <a href="/templates" className="block w-full text-center bg-neon-green text-black font-bold py-2 rounded-lg text-sm hover:bg-white transition-colors mt-4">
                📋 Create Proposal
              </a>
            </div>
          </div>
        </div>
      )}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSelectedLead(null)} />
      )}
    </div>
  );
}

function Field({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`text-sm ${highlight ? 'text-neon-green font-bold' : 'text-gray-200'}`}>{value}</p>
    </div>
  );
}
