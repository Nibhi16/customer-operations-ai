'use client';

import React from 'react';
import { Flame, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

interface PriorityBadgeProps {
  priority: string | null;
  className?: string;
}

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  const normalized = (priority || '').toLowerCase().trim();

  switch (normalized) {
    case 'urgent':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/25 ${className}`}
        >
          <Flame className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          Urgent
        </span>
      );

    case 'high':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/25 ${className}`}
        >
          <AlertTriangle className="w-3 h-3 text-orange-600 dark:text-orange-400" />
          High
        </span>
      );

    case 'medium':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 ${className}`}
        >
          <ArrowUp className="w-3 h-3 text-amber-500" />
          Medium
        </span>
      );

    case 'low':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20 ${className}`}
        >
          <ArrowDown className="w-3 h-3 text-zinc-400" />
          Low
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20 ${className}`}
        >
          {priority ? priority : 'Normal'}
        </span>
      );
  }
}
