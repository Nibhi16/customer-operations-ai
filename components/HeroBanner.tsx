'use client';

import React from 'react';
import { ShieldAlert, Activity, CheckCircle2 } from 'lucide-react';

interface HeroBannerProps {
  totalRequests: number;
  pendingReviews: number;
}

export function HeroBanner({ totalRequests, pendingReviews }: HeroBannerProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 sm:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live System
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">•</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Operations Control
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Customer Operations Overview
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Monitor incoming customer communications, track automated classifications, and manage required operations interventions.
          </p>
        </div>

        {/* Utilitarian operational status pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-emerald-500" />
            <div>
              <div className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
                Ingestion Queue
              </div>
              <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                Connected & Active
              </div>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 flex items-center gap-2.5">
            {pendingReviews > 0 ? (
              <ShieldAlert className="w-4 h-4 text-amber-500" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            )}
            <div>
              <div className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
                Human Review
              </div>
              <div className={`text-xs font-semibold ${pendingReviews > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {pendingReviews} {pendingReviews === 1 ? 'Action Required' : 'Actions Required'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
