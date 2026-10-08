'use client';

import React from 'react';
import { Clock, CheckCircle2, AlertCircle, Cpu } from 'lucide-react';

interface StatusBadgeProps {
  status: string | null;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const normalized = (status || '').toLowerCase().trim();

  switch (normalized) {
    case 'auto_resolved':
    case 'resolved':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 ${className}`}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          Auto Resolved
        </span>
      );

    case 'pending_human_review':
    case 'pending_review':
    case 'needs_review':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 ${className}`}
        >
          <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          Pending Review
        </span>
      );

    case 'analyzed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 ${className}`}
        >
          <Cpu className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          Analyzed
        </span>
      );

    case 'received':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20 ${className}`}
        >
          <Clock className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
          {status ? status.replace(/_/g, ' ') : 'Received'}
        </span>
      );
  }
}
