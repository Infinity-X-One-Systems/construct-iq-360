'use client';

export default function ActionButtons() {
  const openCodespace = () => {
    window.open('https://github.com/InfinityXOneSystems/construct-iq-360', '_blank');
  };

  const openProjects = () => {
    window.open('https://github.com/orgs/InfinityXOneSystems/projects', '_blank');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button
        onClick={openCodespace}
        className="
          bg-dark-surface border-2 border-neon-green text-neon-green
          px-6 py-4 rounded-lg font-bold uppercase tracking-wider
          hover:bg-neon-green hover:text-black
          transition-all duration-300
          flex items-center justify-center space-x-3
          group
        "
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 5H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z"/>
        </svg>
        <span>Open in Codespace</span>
      </button>

      <button
        onClick={openProjects}
        className="
          bg-dark-surface border-2 border-neon-green text-neon-green
          px-6 py-4 rounded-lg font-bold uppercase tracking-wider
          hover:bg-neon-green hover:text-black
          transition-all duration-300
          flex items-center justify-center space-x-3
          group
        "
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
        </svg>
        <span>View Projects</span>
      </button>
    </div>
  );
}
