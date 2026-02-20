/**
 * TERMINAL UTILITIES
 */

export interface TerminalLine {
  id: number;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

const LOG_MESSAGES = [
  { level: 'info' as const, message: 'Initializing Shadow Headless Browser Orchestrator...' },
  { level: 'success' as const, message: 'Vision Cortex connected on port 3000' },
  { level: 'info' as const, message: 'Spawning 10 parallel Playwright instances' },
  { level: 'success' as const, message: 'Instance scraper-0001 initialized' },
  { level: 'success' as const, message: 'Instance scraper-0002 initialized' },
  { level: 'success' as const, message: 'Instance scraper-0003 initialized' },
  { level: 'info' as const, message: 'Scraping Orlando construction leads...' },
  { level: 'info' as const, message: 'Target: Google Maps + Mock Permit Data' },
  { level: 'success' as const, message: 'Found: Orange County Convention Center - $850K' },
  { level: 'success' as const, message: 'Found: Lake Nona Medical Plaza - $1.2M' },
  { level: 'success' as const, message: 'Found: Downtown Orlando Mixed-Use Tower - $2.5M' },
  { level: 'info' as const, message: 'Applying qualification filters ($100K minimum)' },
  { level: 'success' as const, message: 'Qualified 5 high-value leads' },
  { level: 'info' as const, message: 'Syncing with Infinity Mesh backend...' },
  { level: 'success' as const, message: 'Data synced to Vision Cortex' },
  { level: 'info' as const, message: 'Creating GitHub Issues for qualified leads' },
  { level: 'success' as const, message: 'Issue #47 created: CNL Real Estate - Downtown Tower' },
  { level: 'info' as const, message: 'Saving to data/raw-leads/2026-02-19.json' },
  { level: 'success' as const, message: 'Hunt execution complete: 5 leads discovered' },
  { level: 'info' as const, message: 'Next hunt scheduled: Tomorrow @ 08:00 UTC' },
];

/**
 * Generate mock terminal logs for display
 */
export function generateMockLogs(count: number = 20): TerminalLine[] {
  const logs: TerminalLine[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const messageIndex = i % LOG_MESSAGES.length;
    const message = LOG_MESSAGES[messageIndex];
    
    // Calculate timestamp (spread logs over last 5 minutes)
    const timestamp = new Date(now.getTime() - (count - i) * 15000);
    
    logs.push({
      id: i,
      timestamp: timestamp.toISOString(),
      level: message.level,
      message: message.message,
    });
  }
  
  return logs;
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Get color for log level
 */
export function getLogColor(level: TerminalLine['level']): string {
  switch (level) {
    case 'success':
      return '#39FF14'; // Neon green
    case 'warning':
      return '#FFA500'; // Orange
    case 'error':
      return '#FF0000'; // Red
    case 'info':
    default:
      return '#FFFFFF'; // White
  }
}
