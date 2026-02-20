'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { clearAuth, getSavedUser } from '@/lib/auth';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/crm', label: 'CRM / Leads', icon: '👥' },
  { href: '/templates', label: 'Templates', icon: '📋' },
  { href: '/documents', label: 'Documents', icon: '📁' },
  { href: '/billing', label: 'Billing', icon: '💰' },
  { href: '/ai-hub', label: 'AI Hub', icon: '🤖' },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const user = getSavedUser();

  const isActive = (href: string) => {
    const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const normalized = pathname.replace(base, '') || '/';
    return normalized === href || (href !== '/dashboard' && normalized.startsWith(href));
  };

  const handleSignOut = () => {
    clearAuth();
    router.push('/login');
  };

  const handleNav = (href: string) => {
    router.push(href);
  };

  return (
    <aside
      className={`
        flex flex-col h-screen bg-dark-surface border-r border-neon-green/30
        transition-all duration-300 sticky top-0
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-neon-green/20">
        {!collapsed && (
          <div>
            <div className="text-neon-green font-bold text-lg glow-text leading-none">CONSTRUCT-OS</div>
            <div className="text-gray-500 text-xs mt-0.5">Command Center</div>
          </div>
        )}
        {collapsed && (
          <div className="w-6 h-6 bg-neon-green rounded-sm mx-auto" />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-neon-green transition-colors ml-auto"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* System Status */}
      {!collapsed && (
        <div className="px-4 py-2 border-b border-neon-green/10">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-xs text-neon-green font-mono">SYSTEM ONLINE</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {NAV_ITEMS.map(item => (
            <li key={item.href}>
              <button
                onClick={() => handleNav(item.href)}
                className={`
                  w-full flex items-center rounded-lg px-3 py-2.5 text-sm font-medium
                  transition-all duration-200 group
                  ${isActive(item.href)
                    ? 'bg-neon-green/10 text-neon-green border border-neon-green/30'
                    : 'text-gray-400 hover:text-neon-green hover:bg-neon-green/5 border border-transparent'
                  }
                  ${collapsed ? 'justify-center' : 'space-x-3'}
                `}
                title={collapsed ? item.label : undefined}
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="flex-1 text-left uppercase tracking-wider text-xs">
                    {item.label}
                  </span>
                )}
                {!collapsed && isActive(item.href) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-green" />
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Section Divider */}
        <div className="mx-4 my-4 border-t border-neon-green/10" />

        {/* Docs section */}
        {!collapsed && (
          <div className="px-4 mb-2">
            <p className="text-xs text-gray-600 uppercase tracking-widest">Resources</p>
          </div>
        )}
        <ul className="space-y-1 px-2">
          {[
            { href: 'https://github.com/InfinityXOneSystems/construct-iq-360/blob/main/docs/DOCUMENT_PACKAGE_INDEX.md', label: 'Doc Index', icon: '📑', external: true },
            { href: 'https://github.com/InfinityXOneSystems/construct-iq-360/blob/main/docs/AI_CONNECTORS.md', label: 'AI Setup', icon: '🔗', external: true },
          ].map(item => (
            <li key={item.href}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  w-full flex items-center rounded-lg px-3 py-2 text-xs
                  text-gray-500 hover:text-neon-green hover:bg-neon-green/5 transition-all
                  ${collapsed ? 'justify-center' : 'space-x-3'}
                `}
                title={collapsed ? item.label : undefined}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="flex-1 uppercase tracking-wider">{item.label}</span>}
                {!collapsed && <span className="text-gray-600 text-xs">↗</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* User / Sign Out */}
      <div className="border-t border-neon-green/20 p-3">
        {user && !collapsed ? (
          <div className="flex items-center space-x-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-8 h-8 rounded-full border border-neon-green/30"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white font-medium truncate">{user.name || user.login}</p>
              <p className="text-xs text-gray-500 truncate">@{user.login}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="text-gray-500 hover:text-red-400 transition-colors text-xs"
              title="Sign out"
            >
              ⏏
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-red-400 transition-colors"
            title="Sign out"
          >
            <span className="text-lg">⏏</span>
          </button>
        )}
      </div>
    </aside>
  );
}
