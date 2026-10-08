'use client';

import React from 'react';
import { Inbox, Sparkles, FilterX } from 'lucide-react';

interface EmptyStateProps {
  isFiltered?: boolean;
  onClearFilters?: () => void;
}

export function EmptyState({ isFiltered = false, onClearFilters }: EmptyStateProps) {
  if (isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 flex items-center justify-center mb-4 text-zinc-400 dark:text-zinc-500 shadow-inner">
          <FilterX className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
          No matching requests found
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mb-4">
          No customer operations records match your current search and filter criteria.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-opacity"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-16 text-center">
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-500/10 via-indigo-500/10 to-emerald-500/10 dark:from-violet-500/20 dark:via-indigo-500/20 dark:to-emerald-500/20 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 shadow-sm">
          <Inbox className="w-8 h-8" />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <Sparkles className="w-3 h-3" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
        No customer requests yet
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
        Requests processed by the AI automation will appear here automatically. Incoming emails and inquiries from n8n will populate in real time.
      </p>
    </div>
  );
}
