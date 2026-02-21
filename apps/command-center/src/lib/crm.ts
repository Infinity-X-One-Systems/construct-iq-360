/**
 * CRM DATA TYPES & SAMPLE DATA
 * Professional construction CRM — syncs to Google Workspace via CSV
 */

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'proposal-sent'
  | 'negotiating'
  | 'won'
  | 'lost'
  | 'on-hold';

export type ProjectType =
  | 'Residential New Build'
  | 'Residential Renovation'
  | 'Commercial Ground-Up'
  | 'Tenant Improvement'
  | 'Office Renovation'
  | 'Retail Build-Out'
  | 'Restaurant Fit-Out'
  | 'Warehouse'
  | 'Medical Office'
  | 'Mixed-Use'
  | 'Industrial'
  | 'Infrastructure'
  | 'Other';

export type LeadSource =
  | 'Hunter Agent'
  | 'Permit Database'
  | 'Referral'
  | 'Website'
  | 'LinkedIn'
  | 'Cold Outreach'
  | 'Trade Show'
  | 'Other';

export interface CRMLead {
  id: string;
  company: string;
  contactName: string;
  title: string;
  email: string;
  phone: string;
  projectName: string;
  projectType: ProjectType;
  projectValue: number;
  projectAddress: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo: string;
  followUpDate: string;
  lastContactDate: string;
  notes: string;
  tags: string[];
  score: number;
  createdAt: string;
  updatedAt: string;
}

export interface CRMActivity {
  id: string;
  leadId: string;
  type: 'call' | 'email' | 'meeting' | 'proposal' | 'site-visit' | 'note';
  description: string;
  date: string;
  outcome: string;
  nextAction: string;
  createdBy: string;
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  'new': 'New',
  'contacted': 'Contacted',
  'proposal-sent': 'Proposal Sent',
  'negotiating': 'Negotiating',
  'won': 'Won',
  'lost': 'Lost',
  'on-hold': 'On Hold',
};

export const STATUS_COLORS: Record<LeadStatus, string> = {
  'new': 'bg-blue-500/10 text-blue-400 border-blue-500',
  'contacted': 'bg-yellow-500/10 text-yellow-400 border-yellow-500',
  'proposal-sent': 'bg-purple-500/10 text-purple-400 border-purple-500',
  'negotiating': 'bg-orange-500/10 text-orange-400 border-orange-500',
  'won': 'bg-neon-green/10 text-neon-green border-neon-green',
  'lost': 'bg-red-500/10 text-red-400 border-red-500',
  'on-hold': 'bg-gray-500/10 text-gray-400 border-gray-500',
};

export const SAMPLE_LEADS: CRMLead[] = [
  {
    id: 'lead-001',
    company: 'Orange County Government',
    contactName: 'Michael Rivera',
    title: 'Facilities Director',
    email: 'permits@orangecountyfl.net',
    phone: '(407) 836-5515',
    projectName: 'Orange County Convention Center Expansion',
    projectType: 'Commercial Ground-Up',
    projectValue: 850000,
    projectAddress: '9800 International Dr, Orlando, FL 32819',
    status: 'contacted',
    source: 'Hunter Agent',
    assignedTo: 'Hunter Agent',
    followUpDate: '2026-02-25',
    lastContactDate: '2026-02-19',
    notes: 'Permit filed 2026-02-19. Initial email sent. Decision maker is Facilities Director.',
    tags: ['commercial', 'government', 'high-value'],
    score: 88,
    createdAt: '2026-02-19T03:28:20Z',
    updatedAt: '2026-02-19T03:28:20Z',
  },
  {
    id: 'lead-002',
    company: 'Tavistock Development Company',
    contactName: 'Sarah Chen',
    title: 'VP of Development',
    email: 'development@tavistock.com',
    phone: '(407) 903-1234',
    projectName: 'Lake Nona Medical Plaza',
    projectType: 'Medical Office',
    projectValue: 1200000,
    projectAddress: '6900 Tavistock Lakes Blvd, Orlando, FL 32827',
    status: 'proposal-sent',
    source: 'Hunter Agent',
    assignedTo: 'Hunter Agent',
    followUpDate: '2026-02-22',
    lastContactDate: '2026-02-20',
    notes: 'High-value medical office. Proposal sent 2/20. Follow up Friday.',
    tags: ['commercial', 'medical', 'high-value', 'active'],
    score: 95,
    createdAt: '2026-02-19T03:28:20Z',
    updatedAt: '2026-02-20T08:00:00Z',
  },
  {
    id: 'lead-003',
    company: 'CNL Real Estate',
    contactName: 'Robert Thompson',
    title: 'Development Manager',
    email: 'info@cnl.com',
    phone: '(407) 650-1234',
    projectName: 'Downtown Orlando Mixed-Use Tower',
    projectType: 'Mixed-Use',
    projectValue: 2500000,
    projectAddress: '450 S Orange Ave, Orlando, FL 32801',
    status: 'negotiating',
    source: 'Hunter Agent',
    assignedTo: 'Hunter Agent',
    followUpDate: '2026-02-21',
    lastContactDate: '2026-02-20',
    notes: 'Major mixed-use project. In active negotiation. Price is the sticking point.',
    tags: ['commercial', 'mixed-use', 'flagship', 'hot'],
    score: 97,
    createdAt: '2026-02-19T03:28:20Z',
    updatedAt: '2026-02-20T10:00:00Z',
  },
  {
    id: 'lead-004',
    company: 'Unicorp National Developments',
    contactName: 'Jennifer Walsh',
    title: 'Project Director',
    email: 'projects@unicorpnational.com',
    phone: '(407) 555-7890',
    projectName: 'Winter Park Retail Center Renovation',
    projectType: 'Retail Build-Out',
    projectValue: 450000,
    projectAddress: '1750 Lee Rd, Winter Park, FL 32789',
    status: 'new',
    source: 'Hunter Agent',
    assignedTo: 'Hunter Agent',
    followUpDate: '2026-02-21',
    lastContactDate: '',
    notes: 'New lead. Retail renovation. Need to make initial contact.',
    tags: ['commercial', 'retail', 'renovation'],
    score: 72,
    createdAt: '2026-02-19T03:28:20Z',
    updatedAt: '2026-02-19T03:28:20Z',
  },
  {
    id: 'lead-005',
    company: 'University of Central Florida',
    contactName: 'Dr. James Martinez',
    title: 'Director of Real Estate',
    email: 'realestate@ucf.edu',
    phone: '(407) 823-2455',
    projectName: 'UCF Research & Technology Park Building',
    projectType: 'Commercial Ground-Up',
    projectValue: 1800000,
    projectAddress: '3259 Progress Dr, Orlando, FL 32826',
    status: 'contacted',
    source: 'Hunter Agent',
    assignedTo: 'Hunter Agent',
    followUpDate: '2026-02-24',
    lastContactDate: '2026-02-19',
    notes: 'University project — longer procurement cycle. Need to respond to their RFP format.',
    tags: ['commercial', 'education', 'government', 'rfp'],
    score: 85,
    createdAt: '2026-02-19T03:28:20Z',
    updatedAt: '2026-02-19T12:00:00Z',
  },
];

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function getPipelineMetrics(leads: CRMLead[]) {
  const total = leads.length;
  const totalValue = leads.reduce((sum, l) => sum + l.projectValue, 0);
  const activeLeads = leads.filter(l => !['won', 'lost'].includes(l.status));
  const wonLeads = leads.filter(l => l.status === 'won');
  const wonValue = wonLeads.reduce((sum, l) => sum + l.projectValue, 0);
  const hotLeads = leads.filter(l => l.score >= 80 && !['won', 'lost'].includes(l.status));

  return { total, totalValue, activeLeads: activeLeads.length, wonLeads: wonLeads.length, wonValue, hotLeads: hotLeads.length };
}

/** CSV column definitions for Google Workspace pipeline */
export const CRM_CSV_HEADERS = [
  'ID',
  'Company',
  'Contact Name',
  'Title',
  'Email',
  'Phone',
  'Project Name',
  'Project Type',
  'Project Value',
  'Project Address',
  'Status',
  'Source',
  'Assigned To',
  'Follow-Up Date',
  'Last Contact Date',
  'Score',
  'Tags',
  'Notes',
  'Created At',
  'Updated At',
];

export function leadToCSVRow(lead: CRMLead): string[] {
  return [
    lead.id,
    lead.company,
    lead.contactName,
    lead.title,
    lead.email,
    lead.phone,
    lead.projectName,
    lead.projectType,
    String(lead.projectValue),
    lead.projectAddress,
    STATUS_LABELS[lead.status],
    lead.source,
    lead.assignedTo,
    lead.followUpDate,
    lead.lastContactDate,
    String(lead.score),
    lead.tags.join('; '),
    `"${lead.notes.replace(/"/g, '""')}"`,
    lead.createdAt,
    lead.updatedAt,
  ];
}
