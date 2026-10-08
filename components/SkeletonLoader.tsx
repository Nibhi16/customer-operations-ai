'use client';

import React from 'react';

export function KpiSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/50 animate-pulse backdrop-blur-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
          </div>
          <div className="h-8 w-16 bg-zinc-300 dark:bg-zinc-700 rounded mb-2"></div>
          <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/50 animate-pulse"
        >
          <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-3 w-4/5 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-3 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableRowSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="p-4 flex items-center justify-between gap-4 animate-pulse"
        >
          <div className="flex items-center gap-3 min-w-[200px]">
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0"></div>
            <div className="space-y-1.5 flex-1">
              <div className="h-3.5 w-32 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              <div className="h-2.5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            </div>
          </div>
          <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full hidden sm:block"></div>
          <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
          <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full hidden md:block"></div>
          <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
          <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded hidden lg:block"></div>
          <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
        </div>
      ))}
    </div>
  );
}
