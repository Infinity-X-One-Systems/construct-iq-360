import Header from '@/components/Header';
import Hero from '@/components/Hero';
import MetricCard from '@/components/MetricCard';
import LeadMap from '@/components/LeadMap';
import Terminal from '@/components/Terminal';
import ProjectBoard from '@/components/ProjectBoard';
import ActionButtons from '@/components/ActionButtons';

// Static lead data for build
const leadData = {
  scrape_date: "2026-02-19 03:28:20 UTC",
  location: "Orlando, FL (100-mile radius)",
  total_leads: 5,
  leads: [
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
  ]
};

export default function Home() {
  const totalValue = leadData.leads.reduce((sum, lead) => sum + lead.project_value, 0);
  const avgValue = totalValue / leadData.leads.length;

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      <Hero />
      
      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Metrics Dashboard */}
        <section id="dashboard" className="scroll-mt-20">
          <h2 className="text-3xl font-bold text-neon-green glow-text mb-8">
            LIVE METRICS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Leads"
              value={leadData.total_leads}
              subtitle="Qualified projects"
              trend="up"
              icon="📊"
            />
            <MetricCard
              title="Total Value"
              value={`$${(totalValue / 1000000).toFixed(1)}M`}
              subtitle="Combined project value"
              trend="up"
              icon="💰"
            />
            <MetricCard
              title="Avg Project Size"
              value={`$${(avgValue / 1000).toFixed(0)}K`}
              subtitle="Per project"
              trend="neutral"
              icon="📈"
            />
            <MetricCard
              title="Success Rate"
              value="100%"
              subtitle="Lead qualification"
              trend="up"
              icon="✓"
            />
          </div>
        </section>

        {/* Lead Map */}
        <section id="leads" className="scroll-mt-20">
          <LeadMap leads={leadData.leads} />
        </section>

        {/* Terminal */}
        <section id="terminal" className="scroll-mt-20">
          <h2 className="text-3xl font-bold text-neon-green glow-text mb-8">
            SYSTEM TERMINAL
          </h2>
          <Terminal />
        </section>

        {/* Project Board */}
        <section id="projects" className="scroll-mt-20">
          <ProjectBoard />
        </section>

        {/* Action Buttons */}
        <section className="py-8">
          <h2 className="text-3xl font-bold text-neon-green glow-text mb-8 text-center">
            QUICK ACTIONS
          </h2>
          <ActionButtons />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neon-green bg-dark-surface py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm mb-2">
            CONSTRUCT-OS Command Center v1.0.0
          </p>
          <p className="text-gray-600 text-xs">
            Powered by Infinity X One Systems | Built with Next.js 14
          </p>
          <p className="text-neon-green text-xs mt-4 font-mono">
            AUTONOMOUS INTELLIGENCE FOR CONSTRUCTION DOMINANCE
          </p>
        </div>
      </footer>
    </div>
  );
}
