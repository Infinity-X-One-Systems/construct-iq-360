'use client';

import { useState, useMemo } from 'react';
import {
  SAMPLE_INVOICES, Invoice, LineItem, InvoiceStatus,
  STATUS_COLORS, calculateInvoice, BILLING_CSV_HEADERS, invoiceToCSVRow,
} from '@/lib/billing';
import { arrayToCSV, downloadCSV, formatCurrency } from '@/lib/csv';

export default function BillingPage() {
  const [invoices] = useState<Invoice[]>(SAMPLE_INVOICES);
  const [selected, setSelected] = useState<Invoice | null>(null);

  const totalBilled = invoices.reduce((s, i) => s + i.subtotal, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.totalDue, 0);
  const totalAR = invoices.filter(i => ['sent', 'overdue'].includes(i.status)).reduce((s, i) => s + i.totalDue, 0);
  const totalDraft = invoices.filter(i => i.status === 'draft').reduce((s, i) => s + i.totalDue, 0);

  const handleExport = () => {
    const rows = invoices.map(invoiceToCSVRow);
    downloadCSV(`billing-invoices-${new Date().toISOString().split('T')[0]}.csv`, arrayToCSV(BILLING_CSV_HEADERS, rows));
  };

  const statusBadge = (status: InvoiceStatus) => (
    <span className={`text-xs px-2 py-0.5 rounded border ${STATUS_COLORS[status]}`}>{status}</span>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neon-green glow-text">Billing & Invoices</h1>
          <p className="text-gray-400 text-sm mt-1">Invoice management with AIA-style progress billing</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 bg-dark-surface border border-neon-green/30 text-neon-green px-4 py-2 rounded-lg text-sm hover:bg-neon-green hover:text-black transition-colors font-bold"
          >
            <span>⬇</span><span>Export CSV</span>
          </button>
          <button className="flex items-center space-x-2 bg-neon-green text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-white transition-colors">
            <span>+</span><span>New Invoice</span>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Billed', value: formatCurrency(totalBilled), icon: '📊', color: 'text-white' },
          { label: 'Paid', value: formatCurrency(totalPaid), icon: '✅', color: 'text-neon-green' },
          { label: 'Outstanding A/R', value: formatCurrency(totalAR), icon: '⏳', color: 'text-yellow-400' },
          { label: 'Draft', value: formatCurrency(totalDraft), icon: '📝', color: 'text-gray-400' },
        ].map(m => (
          <div key={m.label} className="bg-dark-surface border border-dark-border rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xl">{m.icon}</span>
              <p className="text-xs text-gray-400 uppercase tracking-wider">{m.label}</p>
            </div>
            <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Invoice Table */}
      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-dark-border">
          <h2 className="text-sm font-bold text-neon-green uppercase tracking-wider">Invoices</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border bg-black/30">
                {['Invoice #', 'Project / Client', 'Date', 'Due Date', 'Subtotal', 'Retainage', 'Total Due', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => (
                <tr
                  key={inv.id}
                  className={`border-b border-dark-border hover:bg-neon-green/5 cursor-pointer transition-colors ${i % 2 ? 'bg-black/20' : ''}`}
                  onClick={() => setSelected(inv)}
                >
                  <td className="px-4 py-3 font-mono text-neon-green text-xs">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3">
                    <p className="text-white text-sm">{inv.projectName}</p>
                    <p className="text-gray-400 text-xs">{inv.clientCompany}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{inv.invoiceDate}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{inv.dueDate}</td>
                  <td className="px-4 py-3 font-mono text-white">{formatCurrency(inv.subtotal)}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{inv.retainagePercent}% / {formatCurrency(inv.retainageAmount)}</td>
                  <td className="px-4 py-3 font-mono text-neon-green font-bold">{formatCurrency(inv.totalDue)}</td>
                  <td className="px-4 py-3">{statusBadge(inv.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail Panel */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSelected(null)} />
          <div className="fixed inset-y-0 right-0 w-[32rem] bg-dark-surface border-l border-neon-green/30 z-50 overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-neon-green">{selected.invoiceNumber}</h2>
                  <p className="text-gray-400 text-sm">{selected.projectName}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {statusBadge(selected.status)}
                  <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white text-2xl">×</button>
                </div>
              </div>

              {/* From / To */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">From</p>
                  <p className="text-sm text-white font-medium">{selected.contractorName}</p>
                  <p className="text-xs text-gray-400">{selected.contractorEmail}</p>
                  <p className="text-xs text-gray-400">Lic# {selected.contractorLicense}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bill To</p>
                  <p className="text-sm text-white font-medium">{selected.clientCompany}</p>
                  <p className="text-xs text-gray-400">{selected.clientName}</p>
                  <p className="text-xs text-gray-400">{selected.clientEmail}</p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-3 gap-3 mb-6 text-xs">
                <div><p className="text-gray-500 uppercase">Invoice Date</p><p className="text-white">{selected.invoiceDate}</p></div>
                <div><p className="text-gray-500 uppercase">Due Date</p><p className="text-white">{selected.dueDate}</p></div>
                <div><p className="text-gray-500 uppercase">Terms</p><p className="text-white">{selected.paymentTerms}</p></div>
              </div>

              {/* Line Items */}
              <div className="mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Line Items</p>
                <div className="space-y-2">
                  {selected.lineItems.map(item => (
                    <div key={item.id} className="bg-dark-bg rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-white">{item.description}</p>
                          {item.division && <p className="text-xs text-gray-500">{item.division}</p>}
                          <p className="text-xs text-gray-400 mt-1">{item.quantity} {item.unit} × {formatCurrency(item.unitPrice)}</p>
                        </div>
                        <p className="text-sm text-neon-green font-mono font-bold">{formatCurrency(item.amount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Calculator */}
              <div className="bg-dark-bg rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatCurrency(selected.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Retainage ({selected.retainagePercent}%)</span>
                  <span className="font-mono text-yellow-400">-{formatCurrency(selected.retainageAmount)}</span>
                </div>
                {selected.taxAmount > 0 && (
                  <div className="flex justify-between text-gray-400">
                    <span>Tax ({selected.taxPercent}%)</span>
                    <span className="font-mono">+{formatCurrency(selected.taxAmount)}</span>
                  </div>
                )}
                {selected.previousPayments > 0 && (
                  <div className="flex justify-between text-gray-400">
                    <span>Previous Payments</span>
                    <span className="font-mono text-neon-green">-{formatCurrency(selected.previousPayments)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neon-green font-bold text-lg pt-2 border-t border-dark-border">
                  <span>TOTAL DUE</span>
                  <span className="font-mono">{formatCurrency(selected.totalDue)}</span>
                </div>
              </div>

              {/* Notes */}
              {selected.notes && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 uppercase mb-1">Notes</p>
                  <p className="text-sm text-gray-300 bg-dark-bg rounded p-3">{selected.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex space-x-2">
                <button className="flex-1 bg-neon-green text-black font-bold py-2 rounded-lg text-sm hover:bg-white transition-colors" onClick={() => window.print()}>
                  🖨 Print / PDF
                </button>
                <button
                  className="flex-1 border border-neon-green text-neon-green font-bold py-2 rounded-lg text-sm hover:bg-neon-green hover:text-black transition-colors"
                  onClick={() => {
                    const rows = [invoiceToCSVRow(selected)];
                    downloadCSV(`${selected.invoiceNumber}.csv`, arrayToCSV(BILLING_CSV_HEADERS, rows));
                  }}
                >
                  ⬇ CSV
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Google Workspace Pipeline Info */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
        <h2 className="text-sm font-bold text-neon-green uppercase tracking-wider mb-3">📊 Google Workspace Pipeline</h2>
        <p className="text-sm text-gray-400 mb-4">Export invoices as CSV to import into Google Sheets for automated billing calculations, payment tracking, and financial reporting.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Billing Tracker Sheet', desc: 'Import CSV → Google Sheets with auto-calculated totals, retainage, and tax formulas', icon: '📊' },
            { title: 'Client Statement', desc: 'Google Docs template auto-populated from Sheets data via Apps Script', icon: '📄' },
            { title: 'AR Aging Report', desc: 'Pivot table showing overdue invoices by age bucket (30/60/90 days)', icon: '⏳' },
          ].map(item => (
            <div key={item.title} className="bg-dark-bg rounded-lg p-4">
              <span className="text-2xl mb-2 block">{item.icon}</span>
              <p className="text-sm font-medium text-white mb-1">{item.title}</p>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
        <a
          href="https://github.com/InfinityXOneSystems/construct-iq-360/blob/main/docs/GOOGLE_WORKSPACE_PIPELINE.md"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 text-neon-green text-xs mt-4 hover:underline"
        >
          <span>View full Google Workspace setup guide</span>
          <span>↗</span>
        </a>
      </div>
    </div>
  );
}
