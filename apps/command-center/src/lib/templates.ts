/**
 * CONSTRUCTION TEMPLATE DEFINITIONS
 * Agent-editable via GitHub API — stored as JSON in public/data/templates/
 * All residential & commercial construction types included.
 */

export type TemplateCategory = 'proposal' | 'contract' | 'checklist' | 'runbook' | 'blueprint' | 'change-order' | 'lien-waiver';
export type ProjectType = 'residential' | 'commercial' | 'mixed-use' | 'industrial' | 'infrastructure';

export interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'select';
  required: boolean;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
}

export interface TemplateSection {
  id: string;
  title: string;
  content: string;
  variables: string[];
}

export interface ConstructionTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  projectType: ProjectType[];
  description: string;
  version: string;
  lastModified: string;
  agentEditable: boolean;
  variables: TemplateVariable[];
  sections: TemplateSection[];
  tags: string[];
}

// ─── RESIDENTIAL TEMPLATES ───────────────────────────────────────────────────

export const RESIDENTIAL_NEW_BUILD_BID: ConstructionTemplate = {
  id: 'res-new-build-bid',
  name: 'Residential New Construction Bid',
  category: 'proposal',
  projectType: ['residential'],
  description: 'Comprehensive bid proposal for new residential construction projects.',
  version: '2.1',
  lastModified: '2026-02-19',
  agentEditable: true,
  tags: ['residential', 'new-build', 'bid', 'proposal'],
  variables: [
    { key: 'client_name', label: 'Client Name', type: 'text', required: true, placeholder: 'John & Jane Doe' },
    { key: 'client_address', label: 'Client Address', type: 'text', required: true, placeholder: '123 Main St, Orlando, FL' },
    { key: 'project_address', label: 'Project Address', type: 'text', required: true, placeholder: '456 Build Site Dr' },
    { key: 'project_value', label: 'Total Project Value', type: 'currency', required: true, placeholder: '500000' },
    { key: 'sq_footage', label: 'Square Footage', type: 'number', required: true, placeholder: '2500' },
    { key: 'stories', label: 'Number of Stories', type: 'select', required: true, options: ['1', '2', '3', 'Split-Level'], defaultValue: '2' },
    { key: 'start_date', label: 'Proposed Start Date', type: 'date', required: true },
    { key: 'completion_date', label: 'Estimated Completion', type: 'date', required: true },
    { key: 'contractor_name', label: 'Contractor Name', type: 'text', required: true, placeholder: 'Infinity X One Construction' },
    { key: 'license_number', label: 'License #', type: 'text', required: true },
    { key: 'bid_date', label: 'Bid Date', type: 'date', required: true },
    { key: 'bid_valid_days', label: 'Bid Valid For (Days)', type: 'number', required: true, defaultValue: '30' },
  ],
  sections: [
    {
      id: 'cover',
      title: 'Cover Page',
      content: 'RESIDENTIAL CONSTRUCTION PROPOSAL\n\nPrepared For: {{client_name}}\nProject Location: {{project_address}}\nPrepared By: {{contractor_name}} | Lic. #{{license_number}}\nDate: {{bid_date}} | Valid for {{bid_valid_days}} days',
      variables: ['client_name', 'project_address', 'contractor_name', 'license_number', 'bid_date', 'bid_valid_days'],
    },
    {
      id: 'project-scope',
      title: 'Project Scope & Description',
      content: 'SCOPE OF WORK\n\nThis proposal covers the complete construction of a new {{stories}}-story single-family residence at {{project_address}}, approximately {{sq_footage}} sq ft, including:\n\n• Site preparation & excavation\n• Foundation (concrete slab/stem wall per plans)\n• Framing (walls, floors, roof structure)\n• Roofing (shingles/tile per selection)\n• Exterior envelope (siding, windows, doors)\n• Rough MEP (mechanical, electrical, plumbing)\n• Insulation\n• Drywall & interior finishes\n• Cabinets, countertops, fixtures\n• Flooring\n• Painting (interior & exterior)\n• Final MEP trim-out\n• Landscaping (basic)\n• Final clean & certificate of occupancy',
      variables: ['stories', 'project_address', 'sq_footage'],
    },
    {
      id: 'cost-breakdown',
      title: 'Cost Breakdown',
      content: 'DETAILED COST ESTIMATE\n\n| Division | Description | Amount |\n|----------|-------------|--------|\n| 01 | General Requirements & Permits | $\n| 02 | Site Work & Demolition | $\n| 03 | Concrete | $\n| 04 | Masonry | $\n| 05 | Steel/Metals | $\n| 06 | Wood Framing & Carpentry | $\n| 07 | Thermal & Moisture Protection | $\n| 08 | Doors, Windows & Glazing | $\n| 09 | Finishes | $\n| 10 | Specialties | $\n| 11 | Equipment | $\n| 15 | Mechanical/Plumbing | $\n| 16 | Electrical | $\n|  | **SUBTOTAL** | **$** |\n|  | Contractor Fee (15%) | $\n|  | **TOTAL CONTRACT AMOUNT** | **{{project_value}}** |',
      variables: ['project_value'],
    },
    {
      id: 'payment-schedule',
      title: 'Payment Schedule',
      content: 'PAYMENT SCHEDULE\n\n| Milestone | % | Amount | Due |\n|-----------|---|--------|-----|\n| Contract Signing | 10% | $ | Upon execution |\n| Foundation Complete | 15% | $ | Within 5 days of milestone |\n| Framing Complete | 20% | $ | Within 5 days of milestone |\n| Rough MEP Rough-In | 15% | $ | Within 5 days of milestone |\n| Drywall Complete | 15% | $ | Within 5 days of milestone |\n| Finishes 50% Complete | 10% | $ | Within 5 days of milestone |\n| Substantial Completion | 10% | $ | Within 5 days of milestone |\n| Final/CO | 5% | $ | Upon Certificate of Occupancy |\n\nAll payments due within 5 business days of milestone completion.',
      variables: [],
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      content: 'TERMS & CONDITIONS\n\n1. PERMITS: Contractor will obtain all required permits unless noted.\n2. CHANGES: All changes must be in writing via a Change Order before work begins.\n3. INSURANCE: Contractor carries GL, Workers\' Comp, and Builder\'s Risk insurance.\n4. WARRANTY: 1-year labor warranty. Manufacturer warranties pass through.\n5. DISPUTE RESOLUTION: Mediation first, then binding arbitration.\n6. GOVERNING LAW: State of Florida.\n7. PRICE VALIDITY: This proposal is valid for {{bid_valid_days}} days from {{bid_date}}.',
      variables: ['bid_valid_days', 'bid_date'],
    },
    {
      id: 'acceptance',
      title: 'Acceptance & Signature',
      content: 'PROPOSAL ACCEPTANCE\n\nBy signing below, {{client_name}} accepts this proposal and authorizes {{contractor_name}} to proceed.\n\nClient Signature: _________________________ Date: _________\n\nClient Print Name: _________________________ \n\nContractor Signature: _________________________ Date: _________\n\nContractor Print Name: _________________________\nTitle: _________________________',
      variables: ['client_name', 'contractor_name'],
    },
  ],
};

export const RESIDENTIAL_RENOVATION_BID: ConstructionTemplate = {
  id: 'res-renovation-bid',
  name: 'Residential Renovation / Remodel Bid',
  category: 'proposal',
  projectType: ['residential'],
  description: 'Proposal template for home renovation, remodeling, and additions.',
  version: '1.5',
  lastModified: '2026-02-19',
  agentEditable: true,
  tags: ['residential', 'renovation', 'remodel', 'addition', 'bid'],
  variables: [
    { key: 'client_name', label: 'Client Name', type: 'text', required: true },
    { key: 'project_address', label: 'Project Address', type: 'text', required: true },
    { key: 'scope_type', label: 'Scope Type', type: 'select', required: true, options: ['Kitchen Remodel', 'Bathroom Remodel', 'Addition', 'Full Renovation', 'Deck/Patio', 'Roofing', 'HVAC', 'Electrical Upgrade', 'Plumbing', 'Other'] },
    { key: 'project_value', label: 'Total Contract Amount', type: 'currency', required: true },
    { key: 'start_date', label: 'Start Date', type: 'date', required: true },
    { key: 'duration_weeks', label: 'Estimated Duration (Weeks)', type: 'number', required: true },
    { key: 'contractor_name', label: 'Contractor Name', type: 'text', required: true },
    { key: 'bid_date', label: 'Bid Date', type: 'date', required: true },
  ],
  sections: [
    {
      id: 'summary',
      title: 'Project Summary',
      content: 'RENOVATION PROPOSAL SUMMARY\n\nClient: {{client_name}}\nProject: {{scope_type}} at {{project_address}}\nContractor: {{contractor_name}}\nDate: {{bid_date}}\nTotal: {{project_value}}\nDuration: {{duration_weeks}} weeks\nStart: {{start_date}}',
      variables: ['client_name', 'scope_type', 'project_address', 'contractor_name', 'bid_date', 'project_value', 'duration_weeks', 'start_date'],
    },
    { id: 'scope', title: 'Detailed Scope of Work', content: 'SCOPE: Describe all work included in detail...', variables: [] },
    { id: 'exclusions', title: 'Exclusions', content: 'EXCLUSIONS (Not Included in This Bid):\n• Work not specifically listed above\n• Hazardous material removal (asbestos, lead) unless noted\n• Unforeseen conditions behind walls/under slabs\n• Permit fees beyond standard allowance\n• Owner-furnished materials unless noted', variables: [] },
    { id: 'payment', title: 'Payment Terms', content: 'Payment: 1/3 at signing, 1/3 at rough-in complete, 1/3 at final completion.', variables: [] },
    { id: 'acceptance', title: 'Acceptance', content: 'Client: _________________________ Date: _________\nContractor: _________________________ Date: _________', variables: [] },
  ],
};

export const COMMERCIAL_BID: ConstructionTemplate = {
  id: 'com-construction-bid',
  name: 'Commercial Construction Bid',
  category: 'proposal',
  projectType: ['commercial', 'mixed-use'],
  description: 'Full commercial construction bid proposal including CSI divisions.',
  version: '3.0',
  lastModified: '2026-02-19',
  agentEditable: true,
  tags: ['commercial', 'bid', 'CSI', 'tenant-improvement', 'ground-up'],
  variables: [
    { key: 'client_company', label: 'Client Company', type: 'text', required: true },
    { key: 'project_name', label: 'Project Name', type: 'text', required: true },
    { key: 'project_address', label: 'Project Address', type: 'text', required: true },
    { key: 'project_type', label: 'Project Type', type: 'select', required: true, options: ['Ground-Up Construction', 'Tenant Improvement', 'Office Renovation', 'Retail Build-Out', 'Restaurant Fit-Out', 'Warehouse', 'Medical Office', 'Data Center'] },
    { key: 'gross_sq_ft', label: 'Gross Square Footage', type: 'number', required: true },
    { key: 'project_value', label: 'Total Bid Amount', type: 'currency', required: true },
    { key: 'bid_bond', label: 'Bid Bond %', type: 'number', required: false, defaultValue: '5' },
    { key: 'performance_bond', label: 'Performance Bond Required', type: 'select', required: true, options: ['Yes', 'No'] },
    { key: 'start_date', label: 'Proposed Start Date', type: 'date', required: true },
    { key: 'substantial_completion', label: 'Substantial Completion Date', type: 'date', required: true },
    { key: 'contractor_name', label: 'GC Company Name', type: 'text', required: true },
    { key: 'gc_license', label: 'GC License #', type: 'text', required: true },
    { key: 'bid_date', label: 'Bid Date', type: 'date', required: true },
  ],
  sections: [
    { id: 'cover', title: 'Bid Cover Sheet', content: 'COMMERCIAL BID PROPOSAL\n\nTo: {{client_company}}\nProject: {{project_name}}\nLocation: {{project_address}}\nType: {{project_type}}\nGC: {{contractor_name}} | Lic# {{gc_license}}\nDate: {{bid_date}}\n\nTOTAL BID: {{project_value}}', variables: ['client_company', 'project_name', 'project_address', 'project_type', 'contractor_name', 'gc_license', 'bid_date', 'project_value'] },
    { id: 'csi-summary', title: 'CSI Division Summary', content: 'DIVISION BREAKDOWN (CSI MasterFormat)\n\nDiv 01 – General Requirements\nDiv 02 – Existing Conditions\nDiv 03 – Concrete\nDiv 04 – Masonry\nDiv 05 – Metals\nDiv 06 – Wood/Plastics/Composites\nDiv 07 – Thermal/Moisture Protection\nDiv 08 – Openings\nDiv 09 – Finishes\nDiv 10 – Specialties\nDiv 11 – Equipment\nDiv 12 – Furnishings\nDiv 14 – Conveying Equipment\nDiv 21 – Fire Suppression\nDiv 22 – Plumbing\nDiv 23 – HVAC\nDiv 26 – Electrical\nDiv 27 – Communications\nDiv 28 – Electronic Safety\nDiv 31 – Earthwork\nDiv 32 – Exterior Improvements\nDiv 33 – Utilities\n\nSubtotal: $\nOH&P (12%): $\nContingency (5%): $\nTOTAL: {{project_value}}', variables: ['project_value'] },
    { id: 'schedule', title: 'Schedule & Milestones', content: 'PROJECT SCHEDULE\n\nStart: {{start_date}}\nSubstantial Completion: {{substantial_completion}}\n\nKey Milestones:\n1. Mobilization & Site Preparation\n2. Foundation / Structural\n3. Building Enclosure\n4. MEP Rough-In\n5. Interior Buildout\n6. Finishes & Closeout\n7. Commissioning & Turnover', variables: ['start_date', 'substantial_completion'] },
    { id: 'bonds', title: 'Bonds & Insurance', content: 'BONDS & INSURANCE\n\nBid Bond: {{bid_bond}}% of bid amount\nPerformance Bond: {{performance_bond}}\nPayment Bond: Matching Performance Bond\nGeneral Liability: $2M per occurrence / $4M aggregate\nWorkers Compensation: Statutory limits\nBuilder\'s Risk: Full replacement value', variables: ['bid_bond', 'performance_bond'] },
    { id: 'terms', title: 'Commercial Terms', content: 'COMMERCIAL TERMS\n\nPayment: AIA G702/G703 Applications for Payment, Net 30\nRetainage: 10% until 50% complete, 5% thereafter\nChanges: Change Order approval required before work\nLiquidated Damages: Per contract documents\nSubstantial Completion: Per AIA definition\nWarranty: 1 year from substantial completion\nGoverning Law: State of Florida', variables: [] },
    { id: 'subcontractor-list', title: 'Subcontractor List', content: 'MAJOR SUBCONTRACTORS\n\n| Trade | Company | License # | Amount |\n|-------|---------|-----------|--------|\n| Concrete | | | $ |\n| Steel | | | $ |\n| Mechanical | | | $ |\n| Electrical | | | $ |\n| Plumbing | | | $ |\n| Fire Protection | | | $ |\n| Roofing | | | $ |', variables: [] },
  ],
};

export const TENANT_IMPROVEMENT_BID: ConstructionTemplate = {
  id: 'com-ti-bid',
  name: 'Tenant Improvement (TI) Bid',
  category: 'proposal',
  projectType: ['commercial'],
  description: 'Bid proposal for commercial tenant improvement and build-out projects.',
  version: '1.2',
  lastModified: '2026-02-19',
  agentEditable: true,
  tags: ['commercial', 'tenant-improvement', 'build-out', 'TI'],
  variables: [
    { key: 'tenant_name', label: 'Tenant Name', type: 'text', required: true },
    { key: 'landlord_name', label: 'Landlord / Property Owner', type: 'text', required: true },
    { key: 'suite_address', label: 'Suite Address', type: 'text', required: true },
    { key: 'ti_allowance', label: 'TI Allowance ($/sqft)', type: 'number', required: false },
    { key: 'project_value', label: 'Total TI Cost', type: 'currency', required: true },
    { key: 'sq_footage', label: 'Suite Square Footage', type: 'number', required: true },
    { key: 'completion_date', label: 'Required Completion Date', type: 'date', required: true },
    { key: 'contractor_name', label: 'Contractor', type: 'text', required: true },
    { key: 'bid_date', label: 'Bid Date', type: 'date', required: true },
  ],
  sections: [
    { id: 'summary', title: 'TI Summary', content: 'TENANT IMPROVEMENT BID\n\nTenant: {{tenant_name}}\nLandlord: {{landlord_name}}\nSuite: {{suite_address}}\nSize: {{sq_footage}} SF\nTI Allowance: ${{ti_allowance}}/SF\nTotal TI Cost: {{project_value}}\nRequired Completion: {{completion_date}}\nContractor: {{contractor_name}}\nDate: {{bid_date}}', variables: ['tenant_name', 'landlord_name', 'suite_address', 'sq_footage', 'ti_allowance', 'project_value', 'completion_date', 'contractor_name', 'bid_date'] },
    { id: 'scope', title: 'TI Scope of Work', content: 'SCOPE:\n□ Demolition of existing\n□ Framing (new partitions)\n□ Drywall\n□ Ceiling (ACT/GWB)\n□ Flooring\n□ Paint\n□ Millwork/Casework\n□ Doors & Hardware\n□ Electrical (panels, circuits, fixtures)\n□ Plumbing (if applicable)\n□ HVAC (balancing, new zones)\n□ Fire Sprinkler (modification)\n□ Low Voltage / Data', variables: [] },
    { id: 'allowances', title: 'Allowances', content: 'ALLOWANCES (Owner Selections Pending)\n\nFlooring: $ /SF allowance\nLight Fixtures: $ each allowance\nPlumbing Fixtures: $ each allowance\nCasework: $ LF allowance', variables: [] },
    { id: 'acceptance', title: 'Acceptance', content: 'Tenant: _________________________ Date: _________\nLandlord: _________________________ Date: _________\nContractor: _________________________ Date: _________', variables: [] },
  ],
};

export const CHANGE_ORDER: ConstructionTemplate = {
  id: 'change-order-form',
  name: 'Change Order (CO)',
  category: 'change-order',
  projectType: ['residential', 'commercial', 'mixed-use', 'industrial', 'infrastructure'],
  description: 'Standard change order form for scope additions, deductions, and time extensions.',
  version: '1.0',
  lastModified: '2026-02-19',
  agentEditable: true,
  tags: ['change-order', 'CO', 'scope-change', 'all-types'],
  variables: [
    { key: 'project_name', label: 'Project Name', type: 'text', required: true },
    { key: 'contract_number', label: 'Original Contract #', type: 'text', required: true },
    { key: 'co_number', label: 'Change Order #', type: 'number', required: true },
    { key: 'co_date', label: 'CO Date', type: 'date', required: true },
    { key: 'change_amount', label: 'Change Amount (+/-)', type: 'currency', required: true },
    { key: 'original_contract', label: 'Original Contract Amount', type: 'currency', required: true },
    { key: 'previous_cos', label: 'Previous CO Total', type: 'currency', required: true, defaultValue: '0' },
    { key: 'new_contract', label: 'New Contract Total', type: 'currency', required: true },
    { key: 'time_extension', label: 'Time Extension (Calendar Days)', type: 'number', required: true, defaultValue: '0' },
    { key: 'description', label: 'Description of Change', type: 'text', required: true },
    { key: 'client_name', label: 'Owner / Client', type: 'text', required: true },
    { key: 'contractor_name', label: 'Contractor', type: 'text', required: true },
  ],
  sections: [
    { id: 'co-header', title: 'Change Order', content: 'CHANGE ORDER #{{co_number}}\n\nProject: {{project_name}}\nContract #: {{contract_number}}\nDate: {{co_date}}\n\nDESCRIPTION OF CHANGE:\n{{description}}\n\nCONTRACT AMOUNT SUMMARY:\nOriginal Contract:        {{original_contract}}\nPrevious Change Orders:   {{previous_cos}}\nThis Change Order:        {{change_amount}}\nNEW CONTRACT TOTAL:       {{new_contract}}\n\nTIME EXTENSION: {{time_extension}} calendar days\n\nAGREED AND ACCEPTED:\n\nOwner: _________________________ Date: _________\n{{client_name}}\n\nContractor: _________________________ Date: _________\n{{contractor_name}}', variables: ['co_number', 'project_name', 'contract_number', 'co_date', 'description', 'original_contract', 'previous_cos', 'change_amount', 'new_contract', 'time_extension', 'client_name', 'contractor_name'] },
  ],
};

export const SUBCONTRACTOR_AGREEMENT: ConstructionTemplate = {
  id: 'subcontractor-agreement',
  name: 'Subcontractor Agreement',
  category: 'contract',
  projectType: ['residential', 'commercial', 'mixed-use', 'industrial', 'infrastructure'],
  description: 'Standard subcontractor agreement for all trades.',
  version: '1.3',
  lastModified: '2026-02-19',
  agentEditable: true,
  tags: ['contract', 'subcontractor', 'sub-agreement', 'all-trades'],
  variables: [
    { key: 'gc_name', label: 'General Contractor', type: 'text', required: true },
    { key: 'sub_name', label: 'Subcontractor', type: 'text', required: true },
    { key: 'project_name', label: 'Project Name', type: 'text', required: true },
    { key: 'trade', label: 'Trade / Scope', type: 'text', required: true },
    { key: 'sub_amount', label: 'Subcontract Amount', type: 'currency', required: true },
    { key: 'start_date', label: 'Start Date', type: 'date', required: true },
    { key: 'completion_date', label: 'Completion Date', type: 'date', required: true },
    { key: 'retention', label: 'Retainage %', type: 'number', required: true, defaultValue: '10' },
    { key: 'contract_date', label: 'Contract Date', type: 'date', required: true },
  ],
  sections: [
    { id: 'agreement', title: 'Agreement', content: 'SUBCONTRACTOR AGREEMENT\n\nDate: {{contract_date}}\n\nBetween:\nGeneral Contractor: {{gc_name}} ("GC")\nSubcontractor: {{sub_name}} ("Sub")\n\nProject: {{project_name}}\nTrade: {{trade}}\nSubcontract Amount: {{sub_amount}}\nRetainage: {{retention}}%\nStart: {{start_date}}\nCompletion: {{completion_date}}\n\nARTICLE 1 – SCOPE\nSub shall furnish all labor, materials, tools, and equipment to complete the {{trade}} scope per contract documents.\n\nARTICLE 2 – PAYMENT\nPayments made monthly per AIA G702 application. Retainage {{retention}}% withheld until substantial completion.\n\nARTICLE 3 – INSURANCE\nSub shall maintain: GL $1M/$2M, Workers Comp statutory, Auto $1M. GC named as additional insured.\n\nARTICLE 4 – SCHEDULE\nSub shall commence by {{start_date}} and complete by {{completion_date}}. Time is of the essence.\n\nARTICLE 5 – CHANGES\nNo changes without written Change Order. Unauthorized work performed at Sub\'s risk.\n\nARTICLE 6 – SAFETY\nSub responsible for safety of its employees and OSHA compliance.\n\nARTICLE 7 – LIEN WAIVERS\nConditional/unconditional lien waivers required with each payment application.\n\nARTICLE 8 – DISPUTE RESOLUTION\nMediation then binding arbitration per AAA Construction Rules.\n\nSIGNATURES:\n\nGC: _________________________ Date: _________\n{{gc_name}}\n\nSub: _________________________ Date: _________\n{{sub_name}}', variables: ['contract_date', 'gc_name', 'sub_name', 'project_name', 'trade', 'sub_amount', 'retention', 'start_date', 'completion_date'] },
  ],
};

export const LIEN_WAIVER: ConstructionTemplate = {
  id: 'lien-waiver-conditional',
  name: 'Conditional Lien Waiver (Upon Payment)',
  category: 'lien-waiver',
  projectType: ['residential', 'commercial', 'mixed-use', 'industrial', 'infrastructure'],
  description: 'Conditional waiver and release upon receipt of payment.',
  version: '1.0',
  lastModified: '2026-02-19',
  agentEditable: true,
  tags: ['lien-waiver', 'conditional', 'payment', 'legal'],
  variables: [
    { key: 'claimant_name', label: 'Claimant (Contractor/Sub)', type: 'text', required: true },
    { key: 'owner_name', label: 'Property Owner', type: 'text', required: true },
    { key: 'project_name', label: 'Project Name / Address', type: 'text', required: true },
    { key: 'through_date', label: 'Through Date', type: 'date', required: true },
    { key: 'payment_amount', label: 'Payment Amount', type: 'currency', required: true },
    { key: 'waiver_date', label: 'Waiver Date', type: 'date', required: true },
  ],
  sections: [
    { id: 'waiver', title: 'Conditional Lien Waiver', content: 'CONDITIONAL WAIVER AND RELEASE UPON RECEIPT OF PAYMENT\n\nUpon receipt by the undersigned of a check from [Paying Party] in the sum of {{payment_amount}}, payable to {{claimant_name}}, and when the check has been properly endorsed and has been paid by the bank upon which it is drawn, this document shall become effective to release any mechanic\'s lien, stop payment notice, or bond right the undersigned has on the job located at {{project_name}} to the following extent.\n\nThis release covers a progress payment for all labor, services, equipment, or material furnished through {{through_date}} ONLY, and does not cover any retentions retained before or after that date.\n\nClaimant: {{claimant_name}}\nOwner: {{owner_name}}\nProject: {{project_name}}\nThrough Date: {{through_date}}\nPayment: {{payment_amount}}\n\nSignature: _________________________ Date: {{waiver_date}}\nTitle: _________________________', variables: ['payment_amount', 'claimant_name', 'project_name', 'through_date', 'owner_name', 'waiver_date'] },
  ],
};

export const PRE_CONSTRUCTION_CHECKLIST: ConstructionTemplate = {
  id: 'checklist-preconstruction',
  name: 'Pre-Construction Checklist',
  category: 'checklist',
  projectType: ['residential', 'commercial', 'mixed-use', 'industrial', 'infrastructure'],
  description: 'Comprehensive pre-construction checklist to verify all requirements before breaking ground.',
  version: '1.1',
  lastModified: '2026-02-19',
  agentEditable: true,
  tags: ['checklist', 'pre-construction', 'kickoff', 'permits'],
  variables: [
    { key: 'project_name', label: 'Project Name', type: 'text', required: true },
    { key: 'pm_name', label: 'Project Manager', type: 'text', required: true },
    { key: 'check_date', label: 'Check Date', type: 'date', required: true },
  ],
  sections: [
    { id: 'permits', title: 'Permits & Approvals', content: 'PERMITS & APPROVALS — Project: {{project_name}} | PM: {{pm_name}} | Date: {{check_date}}\n\n□ Building permit obtained\n□ Electrical permit obtained\n□ Plumbing permit obtained\n□ Mechanical/HVAC permit obtained\n□ Fire sprinkler permit obtained\n□ Civil/grading permit obtained\n□ Environmental permits (if required)\n□ HOA/ARB approval (if residential)\n□ Utility notification (811 call placed)\n□ Right-of-way permits\n□ Special use permits', variables: ['project_name', 'pm_name', 'check_date'] },
    { id: 'contracts', title: 'Contracts & Insurance', content: 'CONTRACTS & INSURANCE\n\n□ Owner-Contractor agreement signed\n□ All subcontractor agreements executed\n□ Owner insurance requirements met\n□ GC insurance certificates current\n□ All sub insurance certificates collected\n□ Builder\'s risk policy active\n□ Bond(s) in place (if required)\n□ Notice of Commencement recorded', variables: [] },
    { id: 'site-prep', title: 'Site Preparation', content: 'SITE PREPARATION\n\n□ Site survey complete\n□ Soil borings / geotech report reviewed\n□ Demolition complete (if applicable)\n□ Temporary power connected\n□ Temporary water connected\n□ Site fence / security established\n□ Construction signage posted\n□ Dust control plan in place\n□ Stormwater prevention plan (SWPPP) posted\n□ Tree protection measures in place\n□ Existing utilities located & marked\n□ Staging area established\n□ Temporary restrooms on site', variables: [] },
    { id: 'project-docs', title: 'Project Documents', content: 'PROJECT DOCUMENTS\n\n□ Construction drawings (100% CD set) on site\n□ Approved permit set on site\n□ Geotechnical report on site\n□ Project schedule distributed\n□ Subcontractor list complete\n□ Material submittal log started\n□ RFI log started\n□ Daily log started\n□ Safety plan posted\n□ Emergency contact list posted\n□ Pre-construction meeting held\n□ Meeting minutes distributed', variables: [] },
  ],
};

export const SITE_SAFETY_CHECKLIST: ConstructionTemplate = {
  id: 'checklist-site-safety',
  name: 'Site Safety Inspection Checklist',
  category: 'checklist',
  projectType: ['residential', 'commercial', 'mixed-use', 'industrial', 'infrastructure'],
  description: 'Daily/weekly site safety inspection checklist (OSHA compliant).',
  version: '1.0',
  lastModified: '2026-02-19',
  agentEditable: true,
  tags: ['safety', 'OSHA', 'inspection', 'daily', 'weekly'],
  variables: [
    { key: 'project_name', label: 'Project Name', type: 'text', required: true },
    { key: 'inspector_name', label: 'Inspector Name', type: 'text', required: true },
    { key: 'inspection_date', label: 'Inspection Date', type: 'date', required: true },
  ],
  sections: [
    { id: 'general', title: 'General Site Safety', content: 'SITE SAFETY INSPECTION — {{project_name}}\nInspector: {{inspector_name}} | Date: {{inspection_date}}\n\nGENERAL\n□ Hard hats worn by all on site\n□ Safety vests worn\n□ Steel-toed boots worn\n□ OSHA 300 log current\n□ First aid kit stocked\n□ Emergency contacts posted\n□ Safety plan accessible\n□ No alcohol / drugs observed', variables: ['project_name', 'inspector_name', 'inspection_date'] },
    { id: 'fall-protection', title: 'Fall Protection', content: 'FALL PROTECTION\n□ All openings > 6" guarded or covered\n□ Guardrails on elevated work areas\n□ Harnesses worn when required\n□ Ladders properly secured\n□ Scaffolding properly erected\n□ Leading edge protection in place', variables: [] },
    { id: 'electrical', title: 'Electrical Safety', content: 'ELECTRICAL\n□ GFCIs on all outdoor/wet cords\n□ Extension cords in good condition\n□ No damaged cords\n□ Panels properly covered\n□ Lock-out/tag-out procedures followed', variables: [] },
    { id: 'housekeeping', title: 'Housekeeping & Hazmat', content: 'HOUSEKEEPING & HAZMAT\n□ Walkways clear of debris\n□ Materials properly stacked\n□ Waste disposed properly\n□ SDS sheets available\n□ Hazardous materials labeled\n□ Fire extinguishers present & charged\n□ No smoking violations observed', variables: [] },
    { id: 'corrective-actions', title: 'Corrective Actions', content: 'CORRECTIVE ACTIONS REQUIRED\n\n| Item | Description | Responsible | Due Date | Resolved |\n|------|-------------|-------------|----------|----------|\n| | | | | □ |\n| | | | | □ |\n| | | | | □ |\n\nInspector Signature: _________________________ Date: _________', variables: [] },
  ],
};

export const LEAD_QUALIFICATION_RUNBOOK: ConstructionTemplate = {
  id: 'runbook-lead-qualification',
  name: 'Lead Qualification Runbook',
  category: 'runbook',
  projectType: ['residential', 'commercial', 'mixed-use', 'industrial', 'infrastructure'],
  description: 'Operational runbook for qualifying construction leads.',
  version: '1.0',
  lastModified: '2026-02-19',
  agentEditable: true,
  tags: ['runbook', 'lead', 'qualification', 'sales', 'CRM'],
  variables: [],
  sections: [
    { id: 'criteria', title: 'Qualification Criteria', content: 'LEAD QUALIFICATION CRITERIA\n\nMINIMUM THRESHOLDS:\n• Project value ≥ $100,000\n• Valid permit filed within 90 days\n• Commercial or residential new construction\n• Project within service area (100-mile radius)\n• Contact information available\n\nDISQUALIFIERS:\n• Project value < $100,000\n• Permit expired or cancelled\n• Outside service area\n• No contact information available\n• Already under contract with competitor', variables: [] },
    { id: 'process', title: 'Qualification Process', content: 'PROCESS STEPS\n\n1. CAPTURE: Lead received from Hunter Agent / manual entry\n2. VERIFY: Cross-reference permit database\n3. SCORE: Apply qualification criteria (0-100 score)\n4. RESEARCH: Company background, decision-maker\n5. ENRICH: Add LinkedIn, website, phone\n6. ASSIGN: Route to sales rep based on territory/type\n7. OUTREACH: First contact within 24 hours\n8. LOG: Update CRM with all activity\n9. FOLLOW-UP: Schedule next touchpoint\n10. CONVERT: Move to proposal stage if qualified', variables: [] },
    { id: 'scoring', title: 'Lead Scoring Matrix', content: 'LEAD SCORING MATRIX (0-100)\n\n| Criteria | Weight | Score |\n|----------|--------|-------|\n| Project Value $100K-$500K | 15 | |\n| Project Value $500K-$2M | 20 | |\n| Project Value $2M+ | 25 | |\n| Commercial Project | +10 | |\n| Active Permit | +15 | |\n| Decision Maker Contact | +15 | |\n| Previous Customer | +20 | |\n| Referred | +10 | |\n\nSCORE 70+: Hot Lead — Same-day outreach\nSCORE 50-69: Warm Lead — 24hr outreach\nSCORE <50: Cold Lead — Weekly batch', variables: [] },
  ],
};

export const BID_PREP_RUNBOOK: ConstructionTemplate = {
  id: 'runbook-bid-preparation',
  name: 'Bid Preparation Runbook',
  category: 'runbook',
  projectType: ['residential', 'commercial', 'mixed-use', 'industrial', 'infrastructure'],
  description: 'Step-by-step process for preparing and submitting construction bids.',
  version: '1.0',
  lastModified: '2026-02-19',
  agentEditable: true,
  tags: ['runbook', 'bid', 'proposal', 'estimating', 'process'],
  variables: [],
  sections: [
    { id: 'process', title: 'Bid Preparation Process', content: 'BID PREPARATION PROCESS\n\nPHASE 1: REVIEW (Day 1-2)\n□ Download/receive all bid documents\n□ Review plans and specifications\n□ Identify scope of work\n□ Note all addenda\n□ Determine bid date/time/location\n□ Schedule site visit\n\nPHASE 2: ESTIMATE (Day 2-5)\n□ Perform quantity takeoff\n□ Obtain material pricing\n□ Solicit subcontractor pricing\n□ Calculate labor hours\n□ Apply labor rates\n□ Add equipment costs\n□ Apply overhead + profit\n□ Review for completeness\n□ Value engineering review\n\nPHASE 3: PROPOSAL (Day 5-6)\n□ Select appropriate bid template\n□ Populate all variables\n□ Include proper exclusions/clarifications\n□ Attach required documents (bond, license, insurance)\n□ Principal review and approval\n□ Format and proofread\n\nPHASE 4: SUBMISSION (Day 6-7)\n□ Submit before deadline\n□ Confirm receipt\n□ Log submission in CRM\n□ Schedule follow-up call (5 days post-submission)\n□ Update bid status in tracker', variables: [] },
  ],
};

// ─── TEMPLATE REGISTRY ───────────────────────────────────────────────────────

export const ALL_TEMPLATES: ConstructionTemplate[] = [
  RESIDENTIAL_NEW_BUILD_BID,
  RESIDENTIAL_RENOVATION_BID,
  COMMERCIAL_BID,
  TENANT_IMPROVEMENT_BID,
  CHANGE_ORDER,
  SUBCONTRACTOR_AGREEMENT,
  LIEN_WAIVER,
  PRE_CONSTRUCTION_CHECKLIST,
  SITE_SAFETY_CHECKLIST,
  LEAD_QUALIFICATION_RUNBOOK,
  BID_PREP_RUNBOOK,
];

export function getTemplateById(id: string): ConstructionTemplate | undefined {
  return ALL_TEMPLATES.find(t => t.id === id);
}

export function getTemplatesByCategory(category: TemplateCategory): ConstructionTemplate[] {
  return ALL_TEMPLATES.filter(t => t.category === category);
}

export function getTemplatesByProjectType(type: ProjectType): ConstructionTemplate[] {
  return ALL_TEMPLATES.filter(t => t.projectType.includes(type));
}

export function renderTemplate(template: ConstructionTemplate, values: Record<string, string>): string {
  return template.sections.map(section => {
    let content = `# ${section.title}\n\n${section.content}`;
    for (const [key, value] of Object.entries(values)) {
      content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }
    return content;
  }).join('\n\n---\n\n');
}
