# 📜 Contract Templates — Construct-OS

**Purpose**: Full library of construction contract templates  
**Last Updated**: 2026-02-20  
**Interactive Versions**: Command Center → Templates → Contracts

---

## 1. Residential Owner-Contractor Agreement

**Use when**: Direct contract between homeowner and general contractor

### Key Provisions
- **Scope**: Full description of work, referencing plans and specifications
- **Contract Price**: Fixed price, cost-plus, or GMP
- **Payment Schedule**: Milestone-based (recommended: 10/15/20/15/15/10/10/5)
- **Warranty**: 1-year labor warranty minimum; manufacturer warranties passed through
- **Change Orders**: All changes in writing before work; 10% markup on extras
- **Dispute Resolution**: Mediation first, then binding arbitration (AAA Construction)
- **Insurance**: GC to carry $1M/$2M GL, statutory WC, builder's risk

### Payment Schedule Template (Residential)
| Milestone | % | Due |
|-----------|---|-----|
| Contract signing | 10% | At execution |
| Foundation complete | 15% | 5 days after milestone |
| Framing complete | 20% | 5 days after milestone |
| MEP rough-in | 15% | 5 days after milestone |
| Drywall complete | 15% | 5 days after milestone |
| Finishes 50% complete | 10% | 5 days after milestone |
| Substantial completion | 10% | 5 days after milestone |
| Final / CO | 5% | Upon CO issuance |

---

## 2. Commercial Construction Contract (AIA A101 Alternative)

**Use when**: Commercial or multi-family construction

### Key Provisions
- **Payment Applications**: AIA G702/G703, submitted monthly
- **Retainage**: 10% until 50% complete, reduced to 5% thereafter
- **Schedule**: CPM schedule required; substantial completion date
- **Liquidated Damages**: Per contract documents (typically $500–$2,000/day)
- **Notice of Claims**: 21-day written notice required
- **Dispute Resolution**: Initial Decision Maker → Mediation → Arbitration
- **Substantial Completion**: Per AIA definition; punch list process

### Insurance Requirements (Commercial)
| Coverage | Minimum Amount |
|----------|---------------|
| Commercial General Liability | $2M per occurrence / $4M aggregate |
| Workers' Compensation | Statutory limits |
| Employers' Liability | $1M |
| Commercial Auto | $1M |
| Builder's Risk | Full replacement value |
| Umbrella / Excess | $5M |

---

## 3. Subcontractor Agreement

**Use when**: GC contracts with a trade subcontractor

**Key Provisions**:
- Flow-down of all prime contract terms
- Insurance: $1M/$2M GL; statutory WC; GC named as additional insured
- Retainage: Matches prime contract (typically 10%)
- Payment: Net 30 from GC's receipt of owner payment (pay-when-paid)
- Safety: Sub responsible for its employees; OSHA compliance
- Lien waivers: Required with each payment application
- Back-charges: GC may back-charge for sub's breach after written notice
- Dispute: Mediation then AAA arbitration

---

## 4. Subcontractor Qualification Form

**Collect before awarding subcontracts**:

```
Company Name: _______________________
Address: _______________________
Phone: _______________________
License #: _______________________
Insurance Carrier: _______________________
GL Policy #: _______________________
WC Policy #: _______________________

References (last 3 similar projects):
1. Project: __________ Owner: __________ Value: $__________
2. Project: __________ Owner: __________ Value: $__________
3. Project: __________ Owner: __________ Value: $__________

Bonding Capacity: $__________
Years in Business: __________
Signature: _________________________ Date: _________
```

---

## 5. Change Order Form

**Use for**: All scope additions, deductions, and time extensions

### Required Information
- Change Order number (sequential)
- Original contract amount
- Sum of all previous change orders
- This change order amount (+/-)
- New contract total
- Time extension (calendar days, if any)
- Detailed description of change
- Signatures: Owner and Contractor

### Change Order Pricing Guidelines
- **Labor additions**: Actual cost + 15% markup
- **Material additions**: Actual cost + 10% markup
- **Subcontractor additions**: Sub's price + 10% GC markup
- **Overhead & Profit**: Included in markups above
- **Pricing deadline**: Submit within 14 days of direction to proceed

---

## 6. Conditional Lien Waiver (Upon Progress Payment)

**Use**: With each progress payment application

```
CONDITIONAL WAIVER AND RELEASE UPON RECEIPT OF PAYMENT

Upon receipt by the undersigned of a check from [PAYING PARTY] in the sum of 
$[AMOUNT], payable to [CLAIMANT NAME], and when the check has been properly endorsed 
and has been paid by the bank upon which it is drawn, this document shall become 
effective to release any mechanic's lien, stop payment notice, or bond right the 
undersigned has on the job of [OWNER] located at [PROJECT ADDRESS] to the following 
extent.

This release covers a progress payment for all labor, services, equipment, or material 
furnished through [DATE], and does not cover any retention retained before or after 
that date, extras or change orders which have not been paid, items furnished after the 
date specified, and disputed claims for additional work in the amount of $[AMOUNT].

CLAIMANT: _________________________
TITLE: _________________________
DATE: _________________________
```

---

## 7. Unconditional Lien Waiver (Final Payment)

**Use**: With final payment — releases ALL lien rights

```
UNCONDITIONAL WAIVER AND RELEASE UPON FINAL PAYMENT

The undersigned waives and releases any right to a mechanic's lien, stop payment 
notice, or any right against a labor and material bond on the job of [OWNER] located 
at [PROJECT ADDRESS].

This release covers the final payment to the undersigned for all labor, services, 
equipment, or material furnished on the job, except for disputed claims for additional 
work in the amount of $[AMOUNT].

Before any recipient of this document relies on it, said party should verify evidence 
of payment to the undersigned.

CLAIMANT: _________________________
TITLE: _________________________
DATE: _________________________
```

---

## 8. Notice to Owner (NTO) — Florida

**Required in Florida for non-prime contractors to preserve lien rights**

Must be served within 45 days of first furnishing labor/materials.

```
NOTICE TO OWNER

To: [OWNER NAME]
   [OWNER ADDRESS]

NOTICE IS HEREBY GIVEN that the undersigned, [CONTRACTOR/SUB/SUPPLIER], has 
furnished or is furnishing services or materials for the improvement of real property 
described as:

[PROPERTY ADDRESS AND LEGAL DESCRIPTION]

Under an order given by [CONTRACTING WITH].

Florida law prescribes the serving of this notice and restricts your right to make 
payments under your contract in accordance with Section 713.06, Florida Statutes.

Signed: _________________________
Name: _________________________
Address: _________________________
Date: _________________________
```

---

## Document Generation

Generate any contract via:
1. **Interactive Builder**: Command Center → Templates → Contracts
2. **Document Pipeline**: Trigger `generate-document` dispatch
3. **Copilot**: `@workspace Generate a subcontractor agreement for [trade] at $[amount]`

---

*Maintained by Overseer-Prime · Infinity X One Systems*
