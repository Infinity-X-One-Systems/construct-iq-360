/**
 * INFINITY MESH INTEGRATION
 * =========================
 * Backend syncing with Vision Cortex and MCP Core
 * Connects to Infinity Mesh Docker network on localhost
 */

import React from 'react';

export interface InfinityMeshConfig {
  visionCortexUrl: string;
  mcpCoreUrl: string;
  repoRoot: string;
}

export interface MeshStatus {
  connected: boolean;
  visionCortex: {
    available: boolean;
    port: number;
    version?: string;
  };
  mcpCore: {
    available: boolean;
    status?: string;
  };
  repositories: number;
}

/**
 * Default configuration for Infinity Mesh
 * Connects to local Docker containers on infinity-mesh network
 */
export const DEFAULT_MESH_CONFIG: InfinityMeshConfig = {
  visionCortexUrl: process.env.NEXT_PUBLIC_VISION_CORTEX_URL || 'http://localhost:3000',
  mcpCoreUrl: process.env.NEXT_PUBLIC_MCP_CORE_URL || 'http://localhost:8080',
  repoRoot: process.env.INFINITY_MESH_REPO_ROOT || 'C:\\InfinityMesh\\Repos'
};

/**
 * Check Infinity Mesh connectivity and status
 */
export async function checkMeshStatus(config: InfinityMeshConfig = DEFAULT_MESH_CONFIG): Promise<MeshStatus> {
  const status: MeshStatus = {
    connected: false,
    visionCortex: {
      available: false,
      port: 3000
    },
    mcpCore: {
      available: false
    },
    repositories: 0
  };

  try {
    // Check Vision Cortex (Playwright container on port 3000)
    const visionResponse = await fetch(`${config.visionCortexUrl}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    }).catch(() => null);
    
    if (visionResponse?.ok) {
      status.visionCortex.available = true;
      const data = await visionResponse.json().catch(() => ({}));
      status.visionCortex.version = data.version;
    }
  } catch (error) {
    console.warn('Vision Cortex not available:', error);
  }

  try {
    // Check MCP Core
    const mcpResponse = await fetch(`${config.mcpCoreUrl}/status`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    }).catch(() => null);
    
    if (mcpResponse?.ok) {
      status.mcpCore.available = true;
      const data = await mcpResponse.json().catch(() => ({}));
      status.mcpCore.status = data.status;
    }
  } catch (error) {
    console.warn('MCP Core not available:', error);
  }

  // Overall connectivity status
  status.connected = status.visionCortex.available || status.mcpCore.available;

  return status;
}

/**
 * Sync lead data with Infinity Mesh backend
 */
export async function syncLeadsWithMesh(leads: any[], config: InfinityMeshConfig = DEFAULT_MESH_CONFIG) {
  try {
    const response = await fetch(`${config.visionCortexUrl}/api/sync/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        leads,
        timestamp: new Date().toISOString(),
        source: 'construct-iq-360'
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Leads synced with Infinity Mesh:', result);
      return result;
    }
  } catch (error) {
    console.warn('⚠️  Could not sync with Infinity Mesh (operating in standalone mode):', error);
  }
  
  return null;
}

/**
 * Get repository list from Infinity Mesh
 */
export async function getMeshRepositories(config: InfinityMeshConfig = DEFAULT_MESH_CONFIG) {
  try {
    const response = await fetch(`${config.mcpCoreUrl}/api/repositories`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('Could not fetch repositories from MCP Core:', error);
  }
  
  return [];
}

/**
 * Hook for using Infinity Mesh in React components
 */
export function useInfinityMesh() {
  const [status, setStatus] = React.useState<MeshStatus | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkStatus = async () => {
      setLoading(true);
      const meshStatus = await checkMeshStatus();
      setStatus(meshStatus);
      setLoading(false);
    };

    checkStatus();
    
    // Recheck every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { status, loading };
}
