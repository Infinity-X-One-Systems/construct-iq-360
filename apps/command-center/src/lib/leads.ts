/**
 * LEAD DATA TYPES AND UTILITIES
 */

export interface Lead {
  project_name: string;
  developer: string;
  project_value: number;
  location: string;
  contact: string;
  project_type: string;
  lat: number;
  lng: number;
  qualified?: boolean;
  qualification_date?: string;
  permit_date?: string;
  min_value_check?: string;
}

export interface LeadData {
  scrape_date: string;
  location: string;
  total_leads: number;
  leads: Lead[];
}

/**
 * Format currency values
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
 * Load lead data from JSON files
 */
export async function loadLeads(): Promise<Lead[]> {
  try {
    // In production (static export), load from public directory
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const response = await fetch(`${basePath}/data/raw-leads/2026-02-19.json`);
    if (response.ok) {
      const data: LeadData = await response.json();
      return data.leads || [];
    }
  } catch (error) {
    console.warn('Could not load leads:', error);
  }
  
  // Return mock data if file not available
  return getMockLeads();
}

/**
 * Mock lead data for development
 */
export function getMockLeads(): Lead[] {
  return [
    {
      project_name: "Orange County Convention Center Expansion",
      developer: "Orange County Government",
      project_value: 850000,
      location: "9800 International Dr, Orlando, FL 32819",
      contact: "permits@orangecountyfl.net",
      project_type: "Commercial",
      permit_date: "2026-02-19",
      lat: 28.4255,
      lng: -81.4688,
      qualified: true,
      qualification_date: "2026-02-19 03:28:20 UTC",
      min_value_check: "PASS ($850,000 >= $100,000)"
    },
    {
      project_name: "Lake Nona Medical Plaza",
      developer: "Tavistock Development Company",
      project_value: 1200000,
      location: "6900 Tavistock Lakes Blvd, Orlando, FL 32827",
      contact: "development@tavistock.com",
      project_type: "Medical Office",
      permit_date: "2026-02-19",
      lat: 28.3852,
      lng: -81.2765,
      qualified: true,
      qualification_date: "2026-02-19 03:28:20 UTC",
      min_value_check: "PASS ($1,200,000 >= $100,000)"
    },
    {
      project_name: "Downtown Orlando Mixed-Use Tower",
      developer: "CNL Real Estate",
      project_value: 2500000,
      location: "450 S Orange Ave, Orlando, FL 32801",
      contact: "info@cnl.com",
      project_type: "Mixed-Use Commercial",
      permit_date: "2026-02-19",
      lat: 28.5383,
      lng: -81.3792,
      qualified: true,
      qualification_date: "2026-02-19 03:28:20 UTC",
      min_value_check: "PASS ($2,500,000 >= $100,000)"
    },
    {
      project_name: "Winter Park Retail Center Renovation",
      developer: "Unicorp National Developments",
      project_value: 450000,
      location: "1750 Lee Rd, Winter Park, FL 32789",
      contact: "projects@unicorpnational.com",
      project_type: "Retail",
      permit_date: "2026-02-19",
      lat: 28.5946,
      lng: -81.3473,
      qualified: true,
      qualification_date: "2026-02-19 03:28:20 UTC",
      min_value_check: "PASS ($450,000 >= $100,000)"
    },
    {
      project_name: "UCF Research & Technology Park Building",
      developer: "University of Central Florida",
      project_value: 1800000,
      location: "3259 Progress Dr, Orlando, FL 32826",
      contact: "realestate@ucf.edu",
      project_type: "Educational/Research",
      permit_date: "2026-02-19",
      lat: 28.5947,
      lng: -81.1942,
      qualified: true,
      qualification_date: "2026-02-19 03:28:20 UTC",
      min_value_check: "PASS ($1,800,000 >= $100,000)"
    }
  ];
}
