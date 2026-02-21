'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyToken, saveToken, saveUser, isAuthenticated } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setError('Please enter your GitHub Personal Access Token.');
      return;
    }
    setLoading(true);
    setError('');

    const user = await verifyToken(token.trim());
    if (!user) {
      setError('Invalid token or unable to reach GitHub. Please check your PAT and try again.');
      setLoading(false);
      return;
    }

    saveToken(token.trim());
    saveUser(user);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center px-4">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#39FF14 1px, transparent 1px), linear-gradient(90deg, #39FF14 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 border border-neon-green/40 rounded mb-4 bg-neon-green/5">
            <svg className="w-7 h-7 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neon-green tracking-widest uppercase">CONSTRUCT-OS</h1>
          <p className="text-gray-600 text-xs mt-1 tracking-wider uppercase">Command Center v2</p>
        </div>

        {/* Login Card */}
        <div className="bg-dark-surface border border-neon-green/20 rounded p-8">
          <h2 className="text-sm font-bold text-white mb-1 uppercase tracking-widest">Authenticate</h2>
          <p className="text-gray-600 text-xs mb-6 tracking-wide">
            Enter your GitHub Personal Access Token to access the Command Center.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="token" className="block text-xs text-gray-500 uppercase tracking-widest mb-2">
                GitHub Personal Access Token
              </label>
              <input
                id="token"
                type="password"
                value={token}
                onChange={e => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="
                  w-full bg-black border border-neon-green/10 rounded px-4 py-3
                  text-white text-sm font-mono placeholder-gray-700
                  focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/20
                  transition-colors
                "
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            {error && (
              <div className="border border-red-500/20 rounded px-4 py-3 text-red-400 text-xs bg-red-500/5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full bg-neon-green text-black font-bold py-2.5 rounded
                uppercase tracking-widest text-xs
                hover:bg-white transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center space-x-2
              "
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-neon-green/5">
            <p className="text-xs text-gray-600 mb-3 uppercase tracking-widest">
              Create a GitHub PAT
            </p>
            <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
              <li>GitHub → Settings → Developer settings</li>
              <li>Personal access tokens → Fine-grained tokens</li>
              <li>Grant <code className="text-neon-green/70">repo</code> and <code className="text-neon-green/70">read:user</code> scopes</li>
              <li>Copy and paste the token above</li>
            </ol>
          </div>

          <div className="mt-4">
            <a
              href="https://github.com/settings/tokens/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-green text-xs hover:underline flex items-center space-x-1.5"
            >
              <span>Create token on GitHub</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <p className="text-center text-gray-700 text-xs mt-6 tracking-wider">
          Infinity X One Systems — Autonomous Construction Intelligence
        </p>
      </div>
    </div>
  );
}
