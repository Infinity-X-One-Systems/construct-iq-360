'use client';

import { useEffect, useState } from 'react';
import { generateMockLogs, TerminalLine } from '@/lib/terminal';

export default function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([]);

  useEffect(() => {
    const initialLogs = generateMockLogs();
    setLines(initialLogs);

    const interval = setInterval(() => {
      const messages = [
        'System health check: ✓ PASSED',
        'Memory usage: 42%',
        'CPU load: 18%',
        'Network status: OPTIMAL',
        'Database sync: COMPLETE',
      ];
      
      const newLine: TerminalLine = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        level: 'info',
        message: messages[Math.floor(Math.random() * messages.length)],
      };

      setLines(prev => [...prev.slice(-20), newLine]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getLevelColor = (level: TerminalLine['level']) => {
    switch (level) {
      case 'success': return 'text-neon-green';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-black border border-neon-green rounded-lg overflow-hidden">
      <div className="bg-dark-surface border-b border-neon-green px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-neon-green" />
          <span className="ml-4 text-sm text-neon-green font-mono">SYSTEM TERMINAL</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
          <span className="text-xs text-gray-400">LIVE</span>
        </div>
      </div>
      
      <div className="p-4 h-96 overflow-y-auto font-mono text-sm">
        {lines.map((line, index) => (
          <div key={index} className="mb-2 flex space-x-2">
            <span className="text-gray-600">
              [{new Date(line.timestamp).toLocaleTimeString()}]
            </span>
            <span className={getLevelColor(line.level)}>
              {line.message}
            </span>
          </div>
        ))}
        <div className="flex items-center space-x-1">
          <span className="text-neon-green">$</span>
          <span className="animate-terminal-cursor text-neon-green">_</span>
        </div>
      </div>
    </div>
  );
}
