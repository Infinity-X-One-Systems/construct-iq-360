/**
 * Plugin Adapter — universal connector for external sites and services.
 * Allows Construct-OS agents and UI to read/write data from third-party platforms.
 */

export type PluginType =
  | 'leads'
  | 'export'
  | 'contracts'
  | 'billing'
  | 'project-management'
  | 'payments'
  | 'communication'
  | 'generic';

export type PluginStatus = 'active' | 'available' | 'error' | 'disabled';

export interface PluginConfig {
  id: string;
  name: string;
  type: PluginType;
  description: string;
  /** Base URL for this plugin's API */
  baseUrl?: string;
  /** Auth type — injected at runtime, never hardcoded */
  authType?: 'bearer' | 'api-key' | 'oauth' | 'none';
  /** Supported action names */
  actions: string[];
  status: PluginStatus;
  /** Optional metadata */
  meta?: Record<string, unknown>;
}

export interface PluginExecutionResult {
  success: boolean;
  pluginId: string;
  action: string;
  data?: unknown;
  error?: string;
  timestamp: string;
}

/** Registry of all known plugins */
const REGISTRY: Map<string, PluginConfig> = new Map();

/** Action handlers — registered by each plugin implementation */
const HANDLERS: Map<string, Map<string, (payload: unknown, token?: string) => Promise<unknown>>> = new Map();

/** Built-in plugins registered by default */
const BUILTIN_PLUGINS: PluginConfig[] = [
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    type: 'export',
    description: 'CSV export to Google Sheets, Docs generation to Drive via Apps Script webhook.',
    baseUrl: 'https://script.google.com',
    authType: 'bearer',
    actions: ['exportLeads', 'exportInvoices', 'createDoc'],
    status: 'active',
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions Runner',
    type: 'generic',
    description: 'Dispatch repository_dispatch events to trigger GitHub Actions runners.',
    baseUrl: 'https://api.github.com',
    authType: 'bearer',
    actions: ['dispatch', 'getRunStatus', 'listWorkflows'],
    status: 'active',
  },
  {
    id: 'dodge-data',
    name: 'Dodge Data & Analytics',
    type: 'leads',
    description: 'Commercial construction project leads from the Dodge database.',
    authType: 'api-key',
    actions: ['searchProjects', 'getProjectDetail', 'listBids'],
    status: 'available',
  },
  {
    id: 'constructconnect',
    name: 'ConstructConnect',
    type: 'leads',
    description: 'Bid management and construction project tracking.',
    authType: 'bearer',
    actions: ['searchProjects', 'submitBid', 'trackProject'],
    status: 'available',
  },
  {
    id: 'docusign',
    name: 'DocuSign',
    type: 'contracts',
    description: 'Contract signature automation for proposals, agreements, and lien waivers.',
    authType: 'oauth',
    actions: ['sendEnvelope', 'getStatus', 'downloadSigned'],
    status: 'available',
  },
  {
    id: 'procore',
    name: 'Procore',
    type: 'project-management',
    description: 'Project management sync via Procore REST API.',
    authType: 'oauth',
    actions: ['syncProject', 'updateBudget', 'createRFI', 'listProjects'],
    status: 'available',
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks Online',
    type: 'billing',
    description: 'Invoice and billing export to QuickBooks Online.',
    authType: 'oauth',
    actions: ['createInvoice', 'syncCustomer', 'getPayments'],
    status: 'available',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    type: 'payments',
    description: 'Payment processing for proposals and invoices.',
    authType: 'api-key',
    actions: ['createPaymentLink', 'chargeCard', 'getPaymentStatus'],
    status: 'available',
  },
];

/** Initialize the adapter with all built-in plugins */
function init(): void {
  for (const plugin of BUILTIN_PLUGINS) {
    REGISTRY.set(plugin.id, plugin);
    HANDLERS.set(plugin.id, new Map());
  }

  // Register GitHub Actions runner handler (active by default)
  registerHandler('github-actions', 'dispatch', async (payload: unknown, token?: string) => {
    if (!token) throw new Error('GitHub token required for dispatch');
    const p = payload as { event_type: string; client_payload?: unknown };
    const res = await fetch('https://api.github.com/repos/InfinityXOneSystems/construct-iq-360/dispatches', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event_type: p.event_type, client_payload: p.client_payload ?? {} }),
    });
    if (res.status !== 204) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`GitHub API error ${res.status}: ${(err as { message?: string }).message ?? 'Unknown'}`);
    }
    return { dispatched: true, event_type: p.event_type };
  });
}

/** Register or update a plugin in the adapter */
function register(config: PluginConfig): void {
  REGISTRY.set(config.id, config);
  if (!HANDLERS.has(config.id)) {
    HANDLERS.set(config.id, new Map());
  }
}

/** Register an action handler for a plugin */
function registerHandler(
  pluginId: string,
  action: string,
  handler: (payload: unknown, token?: string) => Promise<unknown>,
): void {
  if (!HANDLERS.has(pluginId)) {
    HANDLERS.set(pluginId, new Map());
  }
  HANDLERS.get(pluginId)!.set(action, handler);
}

/** Execute a plugin action */
async function execute(
  pluginId: string,
  action: string,
  payload: unknown = {},
  token?: string,
): Promise<PluginExecutionResult> {
  const plugin = REGISTRY.get(pluginId);
  if (!plugin) {
    return { success: false, pluginId, action, error: `Plugin '${pluginId}' not found.`, timestamp: new Date().toISOString() };
  }
  if (plugin.status === 'disabled') {
    return { success: false, pluginId, action, error: `Plugin '${pluginId}' is disabled.`, timestamp: new Date().toISOString() };
  }

  const handler = HANDLERS.get(pluginId)?.get(action);
  if (!handler) {
    return {
      success: false,
      pluginId,
      action,
      error: `No handler registered for ${pluginId}::${action}. Register with PluginAdapter.registerHandler().`,
      timestamp: new Date().toISOString(),
    };
  }

  try {
    const data = await handler(payload, token);
    return { success: true, pluginId, action, data, timestamp: new Date().toISOString() };
  } catch (err) {
    return {
      success: false,
      pluginId,
      action,
      error: err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    };
  }
}

/** List all registered plugins */
function list(): PluginConfig[] {
  return Array.from(REGISTRY.values());
}

/** Get a single plugin config */
function get(pluginId: string): PluginConfig | undefined {
  return REGISTRY.get(pluginId);
}

/** Update a plugin's status */
function setStatus(pluginId: string, status: PluginStatus): void {
  const plugin = REGISTRY.get(pluginId);
  if (plugin) {
    REGISTRY.set(pluginId, { ...plugin, status });
  }
}

// Auto-initialize on module load
init();

export const PluginAdapter = {
  register,
  registerHandler,
  execute,
  list,
  get,
  setStatus,
};
