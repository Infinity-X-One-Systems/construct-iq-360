/**
 * BILLING & INVOICE SYSTEM
 * Professional construction billing with line-item calculator
 */

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'void';

export interface LineItem {
  id: string;
  description: string;
  division?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  projectName: string;
  clientCompany: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  billingAddress: string;
  contractorName: string;
  contractorAddress: string;
  contractorLicense: string;
  contractorEmail: string;
  invoiceDate: string;
  dueDate: string;
  periodFrom: string;
  periodTo: string;
  lineItems: LineItem[];
  subtotal: number;
  retainagePercent: number;
  retainageAmount: number;
  taxPercent: number;
  taxAmount: number;
  previousPayments: number;
  totalDue: number;
  status: InvoiceStatus;
  notes: string;
  paymentTerms: string;
  createdAt: string;
}

export type PaymentStatus = 'pending' | 'paid' | 'partial' | 'overdue';

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: 'check' | 'wire' | 'ach' | 'credit-card' | 'cash';
  reference: string;
  status: PaymentStatus;
  notes: string;
}

export const STATUS_COLORS: Record<InvoiceStatus, string> = {
  'draft': 'bg-gray-500/10 text-gray-400 border-gray-500',
  'sent': 'bg-blue-500/10 text-blue-400 border-blue-500',
  'paid': 'bg-neon-green/10 text-neon-green border-neon-green',
  'overdue': 'bg-red-500/10 text-red-400 border-red-500',
  'void': 'bg-gray-700/10 text-gray-600 border-gray-700',
};

export function calculateInvoice(
  lineItems: LineItem[],
  retainagePercent: number,
  taxPercent: number,
  previousPayments: number,
): { subtotal: number; retainageAmount: number; taxAmount: number; totalDue: number } {
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const retainageAmount = subtotal * (retainagePercent / 100);
  const taxableAmount = subtotal - retainageAmount;
  const taxAmount = taxableAmount * (taxPercent / 100);
  const totalDue = subtotal - retainageAmount + taxAmount - previousPayments;
  return { subtotal, retainageAmount, taxAmount, totalDue };
}

export function nextInvoiceNumber(existing: Invoice[]): string {
  const year = new Date().getFullYear();
  const maxNum = existing.reduce((max, inv) => {
    const match = inv.invoiceNumber.match(/(\d+)$/);
    return match ? Math.max(max, parseInt(match[1], 10)) : max;
  }, 0);
  return `INV-${year}-${String(maxNum + 1).padStart(4, '0')}`;
}

export const SAMPLE_INVOICES: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2026-0001',
    projectName: 'Downtown Orlando Mixed-Use Tower',
    clientCompany: 'CNL Real Estate',
    clientName: 'Robert Thompson',
    clientEmail: 'info@cnl.com',
    clientAddress: '450 S Orange Ave, Orlando, FL 32801',
    billingAddress: '450 S Orange Ave, Orlando, FL 32801',
    contractorName: 'Infinity X One Construction',
    contractorAddress: 'Orlando, FL',
    contractorLicense: 'CGC-000000',
    contractorEmail: 'billing@construct-os.com',
    invoiceDate: '2026-02-19',
    dueDate: '2026-03-20',
    periodFrom: '2026-02-01',
    periodTo: '2026-02-19',
    lineItems: [
      { id: 'li-001', description: 'Foundation / Structural', division: 'Division 03', quantity: 1, unit: 'LS', unitPrice: 250000, amount: 250000 },
      { id: 'li-002', description: 'Steel Framing', division: 'Division 05', quantity: 1, unit: 'LS', unitPrice: 180000, amount: 180000 },
      { id: 'li-003', description: 'General Requirements', division: 'Division 01', quantity: 1, unit: 'LS', unitPrice: 45000, amount: 45000 },
    ],
    subtotal: 475000,
    retainagePercent: 10,
    retainageAmount: 47500,
    taxPercent: 0,
    taxAmount: 0,
    previousPayments: 0,
    totalDue: 427500,
    status: 'sent',
    notes: 'Progress billing — milestone 1: Foundation & Structural complete.',
    paymentTerms: 'Net 30',
    createdAt: '2026-02-19T08:00:00Z',
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2026-0002',
    projectName: 'Lake Nona Medical Plaza',
    clientCompany: 'Tavistock Development',
    clientName: 'Sarah Chen',
    clientEmail: 'development@tavistock.com',
    clientAddress: '6900 Tavistock Lakes Blvd, Orlando, FL 32827',
    billingAddress: '6900 Tavistock Lakes Blvd, Orlando, FL 32827',
    contractorName: 'Infinity X One Construction',
    contractorAddress: 'Orlando, FL',
    contractorLicense: 'CGC-000000',
    contractorEmail: 'billing@construct-os.com',
    invoiceDate: '2026-02-10',
    dueDate: '2026-03-12',
    periodFrom: '2026-01-15',
    periodTo: '2026-02-10',
    lineItems: [
      { id: 'li-004', description: 'Site Work & Earthwork', division: 'Division 31', quantity: 1, unit: 'LS', unitPrice: 120000, amount: 120000 },
      { id: 'li-005', description: 'Concrete — Slab & Footings', division: 'Division 03', quantity: 1, unit: 'LS', unitPrice: 95000, amount: 95000 },
    ],
    subtotal: 215000,
    retainagePercent: 10,
    retainageAmount: 21500,
    taxPercent: 0,
    taxAmount: 0,
    previousPayments: 0,
    totalDue: 193500,
    status: 'paid',
    notes: 'Site work and foundation phase complete.',
    paymentTerms: 'Net 30',
    createdAt: '2026-02-10T08:00:00Z',
  },
];

export const BILLING_CSV_HEADERS = [
  'Invoice #',
  'Project',
  'Client',
  'Invoice Date',
  'Due Date',
  'Subtotal',
  'Retainage %',
  'Retainage Amount',
  'Tax %',
  'Tax Amount',
  'Previous Payments',
  'Total Due',
  'Status',
  'Payment Terms',
  'Notes',
];

export function invoiceToCSVRow(inv: Invoice): string[] {
  return [
    inv.invoiceNumber,
    inv.projectName,
    inv.clientCompany,
    inv.invoiceDate,
    inv.dueDate,
    String(inv.subtotal),
    String(inv.retainagePercent),
    String(inv.retainageAmount),
    String(inv.taxPercent),
    String(inv.taxAmount),
    String(inv.previousPayments),
    String(inv.totalDue),
    inv.status,
    inv.paymentTerms,
    `"${inv.notes.replace(/"/g, '""')}"`,
  ];
}
