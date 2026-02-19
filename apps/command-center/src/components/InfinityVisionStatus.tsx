'use client';

import React from 'react';
import { useInfinityVision, openVisionActions, getTimeSince } from '@/lib/infinity-vision';

export default function InfinityVisionStatus() {
  const { status, loading } = useInfinityVision();

  if (loading) {
    return (
      <div className="bg-black border border-[#39FF14]/20 rounded p-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#39FF14] rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">Connecting to Infinity Vision...</span>
        </div>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  const brainColor = status.online ? '#39FF14' : '#666';
  const statusText = status.online ? 'ONLINE' : 'OFFLINE';

  return (
    <div className="bg-black border-2 border-[#39FF14] rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-4 h-4 rounded-full animate-pulse"
            style={{ 
              backgroundColor: brainColor,
              boxShadow: `0 0 20px ${brainColor}, 0 0 40px ${brainColor}`
            }}
          ></div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: brainColor }}>
              🧠 INFINITY VISION
            </h3>
            <p className="text-xs text-gray-400">Central Orchestrator Brain</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold" style={{ color: brainColor }}>
            {statusText}
          </div>
          {status.activeWorkflows > 0 && (
            <div className="text-xs text-[#39FF14] mt-1">
              {status.activeWorkflows} active workflow{status.activeWorkflows !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      {status.lastActivity && (
        <div className="mb-3 pb-3 border-b border-[#39FF14]/20">
          <div className="text-xs text-gray-400">
            Last Activity: <span className="text-[#39FF14]">{getTimeSince(status.lastActivity)}</span>
          </div>
        </div>
      )}

      {/* Recent Workflow Runs */}
      {status.recentRuns.length > 0 && (
        <div className="space-y-2 mb-3">
          <div className="text-xs text-gray-400 font-semibold">Recent Workflows:</div>
          {status.recentRuns.slice(0, 3).map((run) => (
            <div 
              key={run.id}
              className="flex items-center justify-between text-xs bg-black/50 p-2 rounded border border-[#39FF14]/10 hover:border-[#39FF14]/30 transition-colors cursor-pointer"
              onClick={() => window.open(run.html_url, '_blank')}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div 
                  className={`w-2 h-2 rounded-full ${
                    run.status === 'completed' 
                      ? run.conclusion === 'success' 
                        ? 'bg-[#39FF14]' 
                        : 'bg-red-500'
                      : 'bg-yellow-500 animate-pulse'
                  }`}
                ></div>
                <span className="text-white truncate">{run.name}</span>
              </div>
              <div className="text-gray-400 text-xs ml-2">
                {getTimeSince(run.updated_at)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4 pt-3 border-t border-[#39FF14]/20">
        <button
          onClick={openVisionActions}
          className="flex-1 bg-[#39FF14] text-black px-4 py-2 rounded font-bold text-sm hover:bg-[#2fd00e] transition-colors"
        >
          🧠 Open Brain Console
        </button>
        <button
          onClick={() => {
            const refresh = document.createElement('div');
            refresh.textContent = 'Refreshing...';
            refresh.className = 'fixed top-4 right-4 bg-[#39FF14] text-black px-4 py-2 rounded font-bold';
            document.body.appendChild(refresh);
            setTimeout(() => refresh.remove(), 1000);
            window.location.reload();
          }}
          className="px-4 py-2 rounded font-bold text-sm border border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14] hover:text-black transition-colors"
        >
          🔄
        </button>
      </div>

      {/* Info Footer */}
      <div className="mt-3 pt-3 border-t border-[#39FF14]/10">
        <p className="text-xs text-gray-500 text-center">
          ⚡ GitHub Actions Orchestrator • Real-time • Autonomous
        </p>
      </div>
    </div>
  );
}
