'use client';

import { useEffect, useState } from 'react';

export default function Hero() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-dark-surface to-dark-bg border-b border-neon-green">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzOUZGMTQiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTMwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMzAgMzBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat" />
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6">
            <div className="flex items-center space-x-2 bg-dark-surface border border-neon-green rounded-full px-6 py-2">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
              <span className="text-sm text-neon-green font-mono">SYSTEM OPERATIONAL</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-neon-green glow-text animate-pulse-glow">
            COMMAND CENTER
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-8 font-mono">
            Autonomous Intelligence for Construction Lead Domination
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
            <StatBox label="UPTIME" value="100%" />
            <StatBox label="ACCURACY" value="100%" />
            <StatBox label="LEADS/DAY" value="5+" />
            <StatBox label="TIME" value={time} />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <ScrollButton to="leads" label="View Leads" />
            <ScrollButton to="terminal" label="System Logs" secondary />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-green to-transparent" />
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-black border border-dark-border rounded-lg p-4 hover:border-neon-green transition-colors">
      <div className="text-2xl font-bold text-neon-green mb-1">{value}</div>
      <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function ScrollButton({ to, label, secondary }: { to: string; label: string; secondary?: boolean }) {
  const handleClick = () => {
    document.getElementById(to)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button
      onClick={handleClick}
      className={`
        px-8 py-3 rounded-lg font-bold uppercase tracking-wider
        transition-all duration-300 text-sm
        ${secondary 
          ? 'bg-transparent border-2 border-neon-green text-neon-green hover:bg-neon-green hover:text-black' 
          : 'bg-neon-green text-black hover:shadow-lg hover:shadow-neon-green/50'
        }
      `}
    >
      {label}
    </button>
  );
}
