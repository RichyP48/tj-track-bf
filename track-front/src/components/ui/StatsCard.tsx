import React from 'react';
import type { LucideProps } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: React.ComponentType<LucideProps>;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export function StatsCard({ title, value, change, icon: Icon, color = 'blue' }: StatsCardProps) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30 text-green-400',
    yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400',
    red: 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-400',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm rounded-xl border p-6 hover:scale-105 transition-transform duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              change.type === 'increase' ? 'text-green-400' : 'text-red-400'
            }`}>
              <span className="mr-1">
                {change.type === 'increase' ? '↗' : '↘'}
              </span>
              {Math.abs(change.value)}%
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-white/10`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}