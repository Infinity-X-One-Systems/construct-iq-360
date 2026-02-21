'use client';

import { useMemo } from 'react';
import { SAMPLE_LEADS, formatCurrency, getPipelineMetrics } from '@/lib/crm';
import { SAMPLE_INVOICES } from '@/lib/billing';
import Terminal from '@/components/Terminal';
import LeadMap from '@/components/LeadMap';

const LEAD_MAP_DATA = SAMPLE_LEADS.map(l => ({
  project_name: l.projectName,
  developer: l.company,
  project_value: l.projectValue,
  location: l.projectAddress,
  contact: l.email,
  project_type: l.projectType,
  permit_date: l.createdAt.split('T')[0],
  lat: [28.4255, 28.3852, 28.5383, 28.5946, 28.5947][SAMPLE_LEADS.indexOf(l)] ?? 28.5,
  lng: [-81.4688, -81.2765, -81.3792, -81.3473, -81.1942][SAMPLE_LEADS.indexOf(l)] ?? -81.3,
  qualified: true,
}));

export default function DashboardPage() {
  const metrics = useMemo(() => getPipelineMetrics(SAMPLE_LEADS), []);
  const receivablesTotal = SAMPLE_INVOICES
    .filter(i => i.status === 'sent' || i.status === 'overdue')
    .reduce((s, i) => s + i.totalDue, 0);

  const statCards = [
    { label: 'Active Leads', value: String(metrics.activeLeads), sub: `of ${metrics.total} total`, icon: '👥', trend: 'up' },
    { label: 'Pipeline Value', value: formatCurrency(metrics.totalValue), sub: 'Qualified projects', icon: '💰', trend: 'up' },
    { label: 'Hot Leads', value: String(metrics.hotLeads), sub: 'Score ≥ 80', icon: '🔥', trend: 'up' },
    { label: 'A/R Outstanding', value: formatCurrency(receivablesTotal), sub: 'Unpaid invoices', icon: '📄', trend: 'neutral' },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neon-green glow-text">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Live system overview — Construct-OS Command Center</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
          <span className="text-xs text-neon-green font-mono">LIVE</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-dark-surface border border-dark-border rounded-xl p-5 hover:border-neon-green/40 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-neon-green glow-text">{card.value}</p>
                <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
              </div>
              <span className="text-3xl opacity-20">{card.icon}</span>
            </div>
            <div className="mt-3 flex items-center space-x-1">
              <span className={`text-xs ${card.trend === 'up' ? 'text-neon-green' : 'text-gray-400'}`}>
                {card.trend === 'up' ? '↑' : '→'}
              </span>
              <span className="text-xs text-gray-500">
                {card.trend === 'up' ? 'Trending up' : 'Stable'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Pipeline */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
          <h2 className="text-sm font-bold text-neon-green uppercase tracking-wider mb-4">Lead Pipeline</h2>
          <div className="space-y-3">
            {[
              { status: 'New', count: SAMPLE_LEADS.filter(l => l.status === 'new').length, color: 'bg-blue-500' },
              { status: 'Contacted', count: SAMPLE_LEADS.filter(l => l.status === 'contacted').length, color: 'bg-yellow-500' },
              { status: 'Proposal Sent', count: SAMPLE_LEADS.filter(l => l.status === 'proposal-sent').length, color: 'bg-purple-500' },
              { status: 'Negotiating', count: SAMPLE_LEADS.filter(l => l.status === 'negotiating').length, color: 'bg-orange-500' },
              { status: 'Won', count: SAMPLE_LEADS.filter(l => l.status === 'won').length, color: 'bg-neon-green' },
            ].map(row => (
              <div key={row.status} className="flex items-center space-x-3">
                <span className="text-xs text-gray-400 w-28 flex-shrink-0">{row.status}</span>
                <div className="flex-1 bg-dark-bg rounded-full h-2">
                  <div
                    className={`${row.color} h-2 rounded-full`}
                    style={{ width: `${(row.count / SAMPLE_LEADS.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-300 w-4 text-right">{row.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
          <h2 className="text-sm font-bold text-neon-green uppercase tracking-wider mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { time: '08:00', action: 'Hunter Agent discovered 5 new leads', type: 'success' },
              { time: '08:02', action: 'Lead qualified: CNL Real Estate — $2.5M', type: 'success' },
              { time: '08:05', action: 'Proposal sent to Tavistock Development', type: 'info' },
              { time: '08:10', action: 'Invoice INV-2026-0001 sent to CNL Real Estate', type: 'info' },
              { time: '08:15', action: 'Follow-up scheduled: Unicorp (Feb 21)', type: 'warning' },
            ].map((item, i) => (
              <div key={i} className="flex items-start space-x-3">
                <span className="text-xs text-gray-500 w-12 flex-shrink-0 pt-0.5">{item.time}</span>
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                  item.type === 'success' ? 'bg-neon-green' :
                  item.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-400'
                }`} />
                <p className="text-xs text-gray-300">{item.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lead Map */}
      <div>
        <h2 className="text-sm font-bold text-neon-green uppercase tracking-wider mb-4">Active Leads Map — Orlando Metro</h2>
        <LeadMap leads={LEAD_MAP_DATA} />
      </div>

      {/* System Terminal */}
      <div>
        <h2 className="text-sm font-bold text-neon-green uppercase tracking-wider mb-4">System Terminal</h2>
        <Terminal />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6">
        {[
          { label: 'New Proposal', icon: '📋', href: '/templates' },
          { label: 'Add Lead', icon: '➕', href: '/crm' },
          { label: 'Create Invoice', icon: '💳', href: '/billing' },
          { label: 'AI Assistant', icon: '🤖', href: '/ai-hub' },
        ].map(action => (
          <a key={action.label} href={action.href}
            className="bg-dark-surface border border-dark-border rounded-xl p-4 text-center hover:border-neon-green transition-colors group"
          >
            <div className="text-2xl mb-2">{action.icon}</div>
            <p className="text-xs text-gray-400 group-hover:text-neon-green transition-colors uppercase tracking-wider">{action.label}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
