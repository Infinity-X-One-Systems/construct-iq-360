'use client';

import { useEffect, useState } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
}

export default function MetricCard({ title, value, subtitle, trend, icon }: MetricCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`
        bg-dark-surface border border-dark-border rounded-lg p-6
        hover:border-neon-green transition-all duration-300
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-neon-green glow-text mb-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="text-4xl opacity-20">
            {icon}
          </div>
        )}
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center space-x-1">
          <span className={`text-xs ${
            trend === 'up' ? 'text-neon-green' :
            trend === 'down' ? 'text-red-500' :
            'text-gray-400'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
          <span className="text-xs text-gray-400">
            {trend === 'up' ? 'Increasing' : trend === 'down' ? 'Decreasing' : 'Stable'}
          </span>
        </div>
      )}
    </div>
  );
}
