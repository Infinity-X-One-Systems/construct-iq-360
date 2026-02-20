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
          <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-neon-green rounded-lg mb-4 bg-neon-green/10">
            <span className="text-3xl">🏗️</span>
          </div>
          <h1 className="text-3xl font-bold text-neon-green glow-text">CONSTRUCT-OS</h1>
          <p className="text-gray-400 text-sm mt-1">Command Center — Professional Edition</p>
        </div>

        {/* Login Card */}
        <div className="bg-dark-surface border border-neon-green/30 rounded-xl p-8 shadow-2xl shadow-neon-green/5">
          <h2 className="text-xl font-bold text-white mb-2">Sign in with GitHub</h2>
          <p className="text-gray-400 text-sm mb-6">
            Enter your GitHub Personal Access Token to access the Command Center.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="token" className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
                GitHub Personal Access Token
              </label>
              <input
                id="token"
                type="password"
                value={token}
                onChange={e => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="
                  w-full bg-black border border-dark-border rounded-lg px-4 py-3
                  text-white text-sm font-mono placeholder-gray-600
                  focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green/30
                  transition-colors
                "
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full bg-neon-green text-black font-bold py-3 rounded-lg
                uppercase tracking-wider text-sm
                hover:bg-white transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center space-x-2
              "
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>🔐</span>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-dark-border">
            <p className="text-xs text-gray-500 mb-3">
              How to create a GitHub PAT:
            </p>
            <ol className="text-xs text-gray-500 space-y-1 list-decimal list-inside">
              <li>Go to GitHub → Settings → Developer settings</li>
              <li>Personal access tokens → Fine-grained tokens</li>
              <li>Generate new token with <code className="text-neon-green/70">repo</code> and <code className="text-neon-green/70">read:user</code> scopes</li>
              <li>Copy and paste the token above</li>
            </ol>
          </div>

          <div className="mt-4">
            <a
              href="https://github.com/settings/tokens/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-green text-xs hover:underline flex items-center space-x-1"
            >
              <span>Create token on GitHub</span>
              <span>↗</span>
            </a>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Powered by Infinity X One Systems · Autonomous Construction Intelligence
        </p>
      </div>
    </div>
  );
}
