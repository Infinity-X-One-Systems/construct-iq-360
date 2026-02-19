'use client';

export default function ProjectBoard() {
  return (
    <div className="bg-dark-surface border border-neon-green rounded-lg overflow-hidden">
      <div className="bg-dark-surface border-b border-neon-green px-4 py-3">
        <h3 className="text-lg font-bold text-neon-green glow-text">
          GITHUB PROJECT BOARD
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Active development pipeline
        </p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black border border-dark-border rounded-lg p-4">
            <h4 className="text-sm font-bold text-gray-400 uppercase mb-3">
              📋 To Do
            </h4>
            <div className="space-y-2">
              <TaskCard title="Implement email automation" labels={['enhancement']} />
              <TaskCard title="Add CRM integration" labels={['feature']} />
            </div>
          </div>

          <div className="bg-black border border-dark-border rounded-lg p-4">
            <h4 className="text-sm font-bold text-yellow-500 uppercase mb-3">
              🚧 In Progress
            </h4>
            <div className="space-y-2">
              <TaskCard title="Hunter-Killer optimization" labels={['in-progress']} />
              <TaskCard title="Data pipeline refinement" labels={['in-progress']} />
            </div>
          </div>

          <div className="bg-black border border-dark-border rounded-lg p-4">
            <h4 className="text-sm font-bold text-neon-green uppercase mb-3">
              ✅ Done
            </h4>
            <div className="space-y-2">
              <TaskCard title="Command Center dashboard" labels={['completed']} />
              <TaskCard title="Lead scraping system" labels={['completed']} />
              <TaskCard title="Data validation pipeline" labels={['completed']} />
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="https://github.com/orgs/InfinityXOneSystems/projects"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon-green hover:underline text-sm"
          >
            View full project board on GitHub →
          </a>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ title, labels }: { title: string; labels: string[] }) {
  return (
    <div className="bg-dark-surface border border-dark-border rounded p-3 hover:border-neon-green transition-colors">
      <p className="text-sm text-white mb-2">{title}</p>
      <div className="flex flex-wrap gap-1">
        {labels.map((label, index) => (
          <span
            key={index}
            className="text-xs px-2 py-1 rounded bg-neon-green bg-opacity-10 text-neon-green border border-neon-green"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
