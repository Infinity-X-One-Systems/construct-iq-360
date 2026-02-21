/**
 * CSV EXPORT UTILITIES
 * Google Workspace / Sheets pipeline integration
 */

/**
 * Convert a 2D array of strings into a CSV string
 */
export function arrayToCSV(headers: string[], rows: string[][]): string {
  const escape = (val: string) => {
    if (val.includes(',') || val.includes('\n') || val.includes('"')) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const headerRow = headers.map(escape).join(',');
  const dataRows = rows.map(row => row.map(escape).join(','));
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Trigger a browser download of a CSV string
 */
export function downloadCSV(filename: string, csvContent: string): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Format a date string to YYYY-MM-DD
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Generate a Google Sheets import URL from a CSV string
 * (Opens a pre-formatted CSV in Google Sheets via data URL)
 */
export function openInGoogleSheets(csvContent: string): void {
  if (typeof window === 'undefined') return;
  // Download CSV first — user can then import to Google Sheets
  downloadCSV(`construct-iq-${Date.now()}.csv`, csvContent);
}

/**
 * GOOGLE WORKSPACE PIPELINE SCHEMA
 * Standard column definitions for each data type
 */
export const GOOGLE_SHEETS_SCHEMAS = {
  crm: {
    sheetName: 'CRM - Leads',
    description: 'Construction lead pipeline — import from CRM module CSV export',
    columns: [
      { name: 'ID', type: 'Text', formula: '' },
      { name: 'Company', type: 'Text', formula: '' },
      { name: 'Contact Name', type: 'Text', formula: '' },
      { name: 'Title', type: 'Text', formula: '' },
      { name: 'Email', type: 'Text', formula: '' },
      { name: 'Phone', type: 'Text', formula: '' },
      { name: 'Project Name', type: 'Text', formula: '' },
      { name: 'Project Type', type: 'Dropdown', formula: '' },
      { name: 'Project Value', type: 'Currency', formula: '' },
      { name: 'Project Address', type: 'Text', formula: '' },
      { name: 'Status', type: 'Dropdown', formula: '' },
      { name: 'Source', type: 'Text', formula: '' },
      { name: 'Assigned To', type: 'Text', formula: '' },
      { name: 'Follow-Up Date', type: 'Date', formula: '' },
      { name: 'Last Contact Date', type: 'Date', formula: '' },
      { name: 'Score', type: 'Number', formula: '' },
      { name: 'Tags', type: 'Text', formula: '' },
      { name: 'Notes', type: 'Text', formula: '' },
      { name: 'Created At', type: 'DateTime', formula: '' },
      { name: 'Updated At', type: 'DateTime', formula: '' },
    ],
  },
  billing: {
    sheetName: 'Billing - Invoices',
    description: 'Invoice tracker — import from Billing module CSV export',
    columns: [
      { name: 'Invoice #', type: 'Text', formula: '' },
      { name: 'Project', type: 'Text', formula: '' },
      { name: 'Client', type: 'Text', formula: '' },
      { name: 'Invoice Date', type: 'Date', formula: '' },
      { name: 'Due Date', type: 'Date', formula: '' },
      { name: 'Subtotal', type: 'Currency', formula: '' },
      { name: 'Retainage %', type: 'Percent', formula: '' },
      { name: 'Retainage Amount', type: 'Currency', formula: '=F{row}*G{row}' },
      { name: 'Tax %', type: 'Percent', formula: '' },
      { name: 'Tax Amount', type: 'Currency', formula: '=(F{row}-H{row})*I{row}' },
      { name: 'Previous Payments', type: 'Currency', formula: '' },
      { name: 'Total Due', type: 'Currency', formula: '=F{row}-H{row}+J{row}-K{row}' },
      { name: 'Status', type: 'Dropdown', formula: '' },
      { name: 'Payment Terms', type: 'Text', formula: '' },
      { name: 'Notes', type: 'Text', formula: '' },
    ],
  },
  pipeline_summary: {
    sheetName: 'Pipeline Summary',
    description: 'Auto-calculated summary dashboard — links to CRM and Billing sheets',
    columns: [
      { name: 'Metric', type: 'Text', formula: '' },
      { name: 'Value', type: 'Number', formula: '' },
      { name: 'Change', type: 'Percent', formula: '' },
      { name: 'Target', type: 'Number', formula: '' },
      { name: 'Status', type: 'Text', formula: '' },
    ],
  },
};
