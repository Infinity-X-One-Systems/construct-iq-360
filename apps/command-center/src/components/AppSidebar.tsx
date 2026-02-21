'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { clearAuth, getSavedUser } from '@/lib/auth';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/crm', label: 'CRM / Leads', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { href: '/agents', label: 'Agents', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-1' },
  { href: '/templates', label: 'Templates', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { href: '/documents', label: 'Documents', icon: 'M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z' },
  { href: '/billing', label: 'Billing', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
  { href: '/ai-hub', label: 'AI Hub', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { href: '/learn', label: 'Learn', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
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
        flex flex-col h-screen bg-dark-surface border-r border-neon-green/20
        transition-all duration-300 sticky top-0 shrink-0
        ${collapsed ? 'w-14' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-neon-green/10">
        {!collapsed && (
          <div>
            <div className="text-neon-green font-bold text-sm tracking-widest uppercase">CONSTRUCT-OS</div>
            <div className="text-gray-600 text-xs mt-0.5 tracking-wider">Command Center</div>
          </div>
        )}
        {collapsed && (
          <div className="w-5 h-5 border border-neon-green rounded-sm mx-auto" />
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-600 hover:text-neon-green transition-colors ml-auto p-1"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {collapsed
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            }
          </svg>
        </button>
      </div>

      {/* System Status */}
      {!collapsed && (
        <div className="px-3 py-2 border-b border-neon-green/5">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            <span className="text-xs text-neon-green font-mono tracking-widest">ONLINE</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        <ul className="space-y-0.5 px-2">
          {NAV_ITEMS.map(item => (
            <li key={item.href}>
              <button
                onClick={() => handleNav(item.href)}
                className={`
                  w-full flex items-center rounded px-2 py-2 text-xs font-medium
                  transition-all duration-150 group
                  ${isActive(item.href)
                    ? 'bg-neon-green/10 text-neon-green border border-neon-green/20'
                    : 'text-gray-500 hover:text-neon-green hover:bg-neon-green/5 border border-transparent'
                  }
                  ${collapsed ? 'justify-center' : 'space-x-3'}
                `}
                title={collapsed ? item.label : undefined}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                {!collapsed && (
                  <span className="flex-1 text-left uppercase tracking-widest">
                    {item.label}
                  </span>
                )}
                {!collapsed && isActive(item.href) && (
                  <div className="w-1 h-1 rounded-full bg-neon-green" />
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Section Divider */}
        <div className="mx-3 my-3 border-t border-neon-green/5" />

        {/* Resources */}
        {!collapsed && (
          <div className="px-3 mb-2">
            <p className="text-xs text-gray-700 uppercase tracking-widest">Docs</p>
          </div>
        )}
        <ul className="space-y-0.5 px-2">
          {[
            { href: 'https://github.com/InfinityXOneSystems/construct-iq-360/blob/main/docs/DOCUMENT_PACKAGE_INDEX.md', label: 'Doc Index' },
            { href: 'https://github.com/InfinityXOneSystems/construct-iq-360/blob/main/docs/AI_CONNECTORS.md', label: 'AI Setup' },
          ].map(item => (
            <li key={item.href}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  w-full flex items-center rounded px-2 py-1.5 text-xs
                  text-gray-600 hover:text-neon-green hover:bg-neon-green/5 transition-all
                  ${collapsed ? 'justify-center' : 'space-x-2'}
                `}
                title={collapsed ? item.label : undefined}
              >
                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {!collapsed && <span className="flex-1 uppercase tracking-widest">{item.label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* User / Sign Out */}
      <div className="border-t border-neon-green/10 p-3">
        {user && !collapsed ? (
          <div className="flex items-center space-x-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-7 h-7 rounded-full border border-neon-green/20 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white font-medium truncate">{user.name || user.login}</p>
              <p className="text-xs text-gray-600 truncate">@{user.login}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="text-gray-600 hover:text-red-400 transition-colors p-1"
              title="Sign out"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center p-2 text-gray-600 hover:text-red-400 transition-colors"
            title="Sign out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        )}
      </div>
    </aside>
  );
}
