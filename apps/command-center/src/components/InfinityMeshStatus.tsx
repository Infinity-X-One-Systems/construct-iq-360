'use client';

import React from 'react';
import { useInfinityMesh } from '@/lib/infinity-mesh';

export default function InfinityMeshStatus() {
  const { status, loading } = useInfinityMesh();

  if (loading) {
    return (
      <div className="bg-black border border-[#39FF14]/20 rounded p-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">Checking Infinity Mesh...</span>
        </div>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  const meshColor = status.connected ? '#39FF14' : '#666';
  const statusText = status.connected ? 'CONNECTED' : 'STANDALONE';

  return (
    <div className="bg-black border border-[#39FF14]/20 rounded p-3">
      <div className="space-y-2">
        {/* Main Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ 
                backgroundColor: meshColor,
                boxShadow: status.connected ? `0 0 10px ${meshColor}` : 'none'
              }}
            ></div>
            <span className="text-sm font-bold" style={{ color: meshColor }}>
              INFINITY MESH: {statusText}
            </span>
          </div>
        </div>

        {/* Vision Cortex Status */}
        <div className="flex items-center gap-2 text-xs">
          <div className={`w-1.5 h-1.5 rounded-full ${status.visionCortex.available ? 'bg-[#39FF14]' : 'bg-gray-600'}`}></div>
          <span className="text-gray-400">
            Vision Cortex (Port {status.visionCortex.port})
          </span>
          {status.visionCortex.available && status.visionCortex.version && (
            <span className="text-[#39FF14]">v{status.visionCortex.version}</span>
          )}
        </div>

        {/* MCP Core Status */}
        <div className="flex items-center gap-2 text-xs">
          <div className={`w-1.5 h-1.5 rounded-full ${status.mcpCore.available ? 'bg-[#39FF14]' : 'bg-gray-600'}`}></div>
          <span className="text-gray-400">MCP Core</span>
          {status.mcpCore.available && status.mcpCore.status && (
            <span className="text-[#39FF14]">{status.mcpCore.status}</span>
          )}
        </div>

        {/* Connection Info */}
        {status.connected && (
          <div className="mt-2 pt-2 border-t border-[#39FF14]/10">
            <p className="text-xs text-[#39FF14]/70">
              ✓ Backend syncing active
            </p>
          </div>
        )}

        {!status.connected && (
          <div className="mt-2 pt-2 border-t border-gray-800">
            <p className="text-xs text-gray-500">
              ℹ️ Running in standalone mode
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
