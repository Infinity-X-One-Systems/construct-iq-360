'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Lead } from '@/lib/leads';

const MapComponent = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-dark-surface">
      <div className="text-neon-green animate-pulse">Loading map...</div>
    </div>
  ),
});

interface LeadMapProps {
  leads: Lead[];
}

export default function LeadMap({ leads }: LeadMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[600px] bg-dark-surface border border-dark-border rounded-lg flex items-center justify-center">
        <div className="text-neon-green animate-pulse">Initializing map...</div>
      </div>
    );
  }

  return (
    <div className="bg-dark-surface border border-neon-green rounded-lg overflow-hidden">
      <div className="bg-dark-surface border-b border-neon-green px-4 py-3">
        <h3 className="text-lg font-bold text-neon-green glow-text">
          ORLANDO METRO LEADS MAP
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          {leads.length} qualified construction projects
        </p>
      </div>
      <div className="h-[600px]">
        <MapComponent leads={leads} />
      </div>
    </div>
  );
}
