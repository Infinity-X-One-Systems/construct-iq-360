'use client';

import { ReactNode } from 'react';

export default function Header() {
  return (
    <header className="border-b border-neon-green bg-dark-surface">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-neon-green animate-pulse-glow" />
            <div>
              <h1 className="text-2xl font-bold text-neon-green glow-text">
                CONSTRUCT-OS
              </h1>
              <p className="text-xs text-gray-400">Command Center v1.0.0</p>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <NavLink href="#dashboard">Dashboard</NavLink>
            <NavLink href="#leads">Leads</NavLink>
            <NavLink href="#terminal">Terminal</NavLink>
            <NavLink href="#projects">Projects</NavLink>
          </nav>

          <div className="flex items-center space-x-2">
            <StatusIndicator label="HUNTER" status="online" />
            <StatusIndicator label="ARCHITECT" status="online" />
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="text-sm text-gray-400 hover:text-neon-green transition-colors uppercase tracking-wider"
    >
      {children}
    </a>
  );
}

function StatusIndicator({ label, status }: { label: string; status: 'online' | 'offline' }) {
  return (
    <div className="flex items-center space-x-1">
      <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-neon-green animate-pulse' : 'bg-red-500'}`} />
      <span className="text-xs text-gray-400 hidden sm:inline">{label}</span>
    </div>
  );
}
