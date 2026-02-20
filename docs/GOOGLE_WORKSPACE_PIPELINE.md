# 📊 Google Workspace Pipeline — Construct-OS

**Purpose**: CSV export → Google Sheets → Google Docs automation  
**Last Updated**: 2026-02-20

---

## Overview

The Google Workspace Pipeline connects Construct-OS data to your Google Workspace suite:

```
Construct-OS CRM → Export CSV → Google Sheets (Leads) → Dashboard → Google Docs (Reports)
Construct-OS Billing → Export CSV → Google Sheets (Invoices) → AR Aging → Statements
```

---

## Step 1: Export CSV from Command Center

### CRM Export
1. Navigate to **Command Center → CRM**
2. Apply any filters (status, search)
3. Click **Export CSV** (top right)
4. File: `crm-leads-YYYY-MM-DD.csv`

### Billing Export
1. Navigate to **Command Center → Billing**
2. Click **Export CSV**
3. File: `billing-invoices-YYYY-MM-DD.csv`

---

## Step 2: Google Sheets — CRM Lead Pipeline

### Column Structure
| Column | Type | Formula |
|--------|------|---------|
| A: ID | Text | — |
| B: Company | Text | — |
| C: Contact Name | Text | — |
| D: Title | Text | — |
| E: Email | Text | — |
| F: Phone | Text | — |
| G: Project Name | Text | — |
| H: Project Type | Dropdown | `Data Validation → List` |
| I: Project Value | Currency | `=VALUE(I2)` → format as $# |
| J: Project Address | Text | — |
| K: Status | Dropdown | New, Contacted, Proposal Sent, Negotiating, Won, Lost |
| L: Source | Text | — |
| M: Assigned To | Text | — |
| N: Follow-Up Date | Date | — |
| O: Last Contact Date | Date | — |
| P: Score | Number (0-100) | — |
| Q: Tags | Text | — |
| R: Notes | Text | — |
| S: Created At | DateTime | — |
| T: Updated At | DateTime | — |

### Summary Row Formulas (Row 2 of Summary Sheet)
```excel
Total Leads:    =COUNTA(CRM!A:A)-1
Pipeline Value: =SUMIF(CRM!K:K,"<>Won",CRM!I:I)-SUMIF(CRM!K:K,"Lost",CRM!I:I)
Hot Leads:      =COUNTIF(CRM!P:P,">79")
Won Value:      =SUMIF(CRM!K:K,"Won",CRM!I:I)
Win Rate:       =COUNTIF(CRM!K:K,"Won")/COUNTA(CRM!A:A)
Avg Deal Size:  =AVERAGE(CRM!I:I)
```

### Conditional Formatting
- Status = "Won" → Green fill
- Status = "Lost" → Red fill  
- Score ≥ 80 → Orange fill (hot lead)
- Follow-Up Date < TODAY() → Yellow fill (overdue)
- Project Value ≥ $1,000,000 → Bold text

---

## Step 3: Google Sheets — Billing Tracker

### Column Structure
| Column | Type | Formula |
|--------|------|---------|
| A: Invoice # | Text | — |
| B: Project | Text | — |
| C: Client | Text | — |
| D: Invoice Date | Date | — |
| E: Due Date | Date | — |
| F: Subtotal | Currency | — |
| G: Retainage % | Percent | — |
| H: Retainage Amount | Currency | `=F2*G2` |
| I: Tax % | Percent | — |
| J: Tax Amount | Currency | `=(F2-H2)*I2` |
| K: Previous Payments | Currency | — |
| L: Total Due | Currency | `=F2-H2+J2-K2` |
| M: Status | Dropdown | Draft, Sent, Paid, Overdue |
| N: Payment Terms | Text | — |
| O: Notes | Text | — |

### Summary Formulas
```excel
Total Billed:       =SUM(F:F)
Total Paid:         =SUMIF(M:M,"Paid",L:L)
Outstanding AR:     =SUMIF(M:M,"Sent",L:L)+SUMIF(M:M,"Overdue",L:L)
Overdue Amount:     =SUMIF(M:M,"Overdue",L:L)
Overdue Count:      =COUNTIF(M:M,"Overdue")
Days Sales Outstnd: =Outstanding_AR / (Total_Billed/30)
```

---

## Step 4: AR Aging Report (Pivot Table)

Create a pivot table from the Billing sheet:

| Category | Formula | Description |
|----------|---------|-------------|
| Current (0-30) | `=SUMPRODUCT((M2:M1000="Sent")*(TODAY()-E2:E1000<=30)*L2:L1000)` | Not yet overdue |
| 31-60 Days | `=SUMPRODUCT((M2:M1000="Overdue")*(TODAY()-E2:E1000>30)*(TODAY()-E2:E1000<=60)*L2:L1000)` | 31-60 days past due |
| 61-90 Days | `=SUMPRODUCT((M2:M1000="Overdue")*(TODAY()-E2:E1000>60)*(TODAY()-E2:E1000<=90)*L2:L1000)` | 61-90 days past due |
| 90+ Days | `=SUMPRODUCT((M2:M1000="Overdue")*(TODAY()-E2:E1000>90)*L2:L1000)` | Critical — 90+ days |

---

## Step 5: Pipeline Dashboard Sheet

Create a "Dashboard" sheet with these auto-calculated KPIs:

```
A1: CONSTRUCT-OS PIPELINE DASHBOARD
A2: Updated: =NOW()

[KPI Cards using SPARKLINE charts]
B5: Total Pipeline Value    C5: =SUM(CRM!I:I)
B6: Active Deals            C6: =COUNTIFS(CRM!K:K,"<>Won",CRM!K:K,"<>Lost")
B7: Hot Leads               C7: =COUNTIF(CRM!P:P,">79")
B8: Win Rate                C8: =COUNTIF(CRM!K:K,"Won")/COUNTA(CRM!A2:A1000)
B9: Avg Deal Size           C9: =AVERAGE(CRM!I:I)
B10: Outstanding A/R        C10: =[Billing Summary formula]
```

---

## Step 6: Google Apps Script Automation

Auto-import CSV on Drive upload:

```javascript
// Paste in Extensions → Apps Script

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Construct-OS')
    .addItem('Import CRM CSV', 'importCRM')
    .addItem('Import Billing CSV', 'importBilling')
    .addItem('Refresh Dashboard', 'refreshDashboard')
    .addToUi();
}

function importCRM() {
  const folder = DriveApp.getFoldersByName('Construct-OS Exports').next();
  const files = folder.getFilesByType('text/csv');
  while (files.hasNext()) {
    const file = files.next();
    if (file.getName().startsWith('crm-leads-')) {
      const content = file.getBlob().getDataAsString();
      const data = Utilities.parseCsv(content);
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('CRM');
      sheet.clearContents();
      sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
      Logger.log('CRM imported: ' + file.getName());
    }
  }
}

function importBilling() {
  const folder = DriveApp.getFoldersByName('Construct-OS Exports').next();
  const files = folder.getFilesByType('text/csv');
  while (files.hasNext()) {
    const file = files.next();
    if (file.getName().startsWith('billing-invoices-')) {
      const content = file.getBlob().getDataAsString();
      const data = Utilities.parseCsv(content);
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Billing');
      sheet.clearContents();
      sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
      Logger.log('Billing imported: ' + file.getName());
    }
  }
}

function refreshDashboard() {
  importCRM();
  importBilling();
  SpreadsheetApp.flush();
  Logger.log('Dashboard refreshed at ' + new Date());
}
```

---

## Step 7: Google Docs Templates

### Invoice Template
1. Create a Google Doc: **Construct-OS Invoice Template**
2. Use `{{variable}}` placeholders
3. Use Apps Script to auto-fill from Billing sheet:

```javascript
function generateInvoice(invoiceNumber) {
  const template = DriveApp.getFileById('YOUR_TEMPLATE_DOC_ID');
  const copy = template.makeCopy('Invoice ' + invoiceNumber);
  const doc = DocumentApp.openById(copy.getId());
  const body = doc.getBody();
  
  // Get invoice data from Billing sheet
  const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getSheetByName('Billing');
  const data = sheet.getDataRange().getValues();
  const invoice = data.find(row => row[0] === invoiceNumber);
  
  if (invoice) {
    body.replaceText('{{invoice_number}}', invoice[0]);
    body.replaceText('{{project}}', invoice[1]);
    body.replaceText('{{client}}', invoice[2]);
    body.replaceText('{{total_due}}', '$' + invoice[11].toLocaleString());
  }
  
  doc.saveAndClose();
  return copy.getUrl();
}
```

---

## Complete Google Workspace Suite Structure

```
📁 Construct-OS (Google Drive Folder)
├── 📁 Exports/                    ← CSV files from Command Center
│   ├── crm-leads-YYYY-MM-DD.csv
│   └── billing-invoices-YYYY-MM-DD.csv
├── 📊 Construct-OS Master Sheet   ← Main Google Sheets workbook
│   ├── Sheet: Dashboard
│   ├── Sheet: CRM Leads
│   ├── Sheet: Billing Tracker
│   ├── Sheet: AR Aging
│   └── Sheet: Pipeline Summary
├── 📁 Proposals/                  ← Generated proposal docs
├── 📁 Invoices/                   ← Generated invoice docs
└── 📁 Contracts/                  ← Executed contracts
```

---

*Maintained by Overseer-Prime · Infinity X One Systems*
