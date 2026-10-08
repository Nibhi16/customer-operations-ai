'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: number;
  description: string;
  icon: LucideIcon;
  variant?: 'default' | 'amber' | 'emerald' | 'rose';
  trend?: string;
}

export function KpiCard({
  label,
  value,
  description,
  icon: Icon,
  variant = 'default',
  trend,
}: KpiCardProps) {
  // Semantic restrained styles
  const variantStyles = {
    default: {
      border: 'border-zinc-200 dark:border-zinc-800',
      iconContainer: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
      valueText: 'text-zinc-900 dark:text-zinc-100',
    },
    amber: {
      border: 'border-amber-200/80 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10',
      iconContainer: 'bg-amber-100/70 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
      valueText: 'text-amber-600 dark:text-amber-400',
    },
    emerald: {
      border: 'border-zinc-200 dark:border-zinc-800',
      iconContainer: 'bg-emerald-100/60 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
      valueText: 'text-zinc-900 dark:text-zinc-100',
    },
    rose: {
      border: 'border-zinc-200 dark:border-zinc-800',
      iconContainer: 'bg-rose-100/60 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400',
      valueText: 'text-zinc-900 dark:text-zinc-100',
    },
  }[variant];

  return (
    <div
      className={`rounded-xl border ${variantStyles.border} bg-white dark:bg-zinc-900/60 p-4 shadow-xs transition-colors hover:border-zinc-300 dark:hover:border-zinc-700`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {label}
        </span>
        <div className={`p-1.5 rounded-lg ${variantStyles.iconContainer}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className={`text-2xl font-bold tracking-tight font-mono ${variantStyles.valueText}`}>
          {value.toLocaleString()}
        </span>
        {trend && (
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            {trend}
          </span>
        )}
      </div>

      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
        {description}
      </p>
    </div>
  );
}
