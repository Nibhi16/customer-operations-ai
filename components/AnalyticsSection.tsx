'use client';

import React from 'react';
import { CustomerRequest } from '@/types';
import { BarChart3, PieChart, Activity, ShieldAlert } from 'lucide-react';

interface AnalyticsSectionProps {
  requests: CustomerRequest[];
}

export function AnalyticsSection({ requests }: AnalyticsSectionProps) {
  const total = requests.length;

  // 1. Status Distribution
  const statusCounts: Record<string, number> = {
    received: 0,
    analyzed: 0,
    auto_resolved: 0,
    pending_human_review: 0,
  };

  // 2. Priority Distribution
  const priorityCounts: Record<string, number> = {
    urgent: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  // 3. Intent Distribution
  const intentCounts: Record<string, number> = {};

  requests.forEach((req) => {
    // Status
    const s = (req.status || 'received').toLowerCase().trim();
    if (s.includes('auto') || s.includes('resolved')) {
      statusCounts.auto_resolved = (statusCounts.auto_resolved || 0) + 1;
    } else if (s.includes('review') || s.includes('pending')) {
      statusCounts.pending_human_review = (statusCounts.pending_human_review || 0) + 1;
    } else if (s.includes('analyzed')) {
      statusCounts.analyzed = (statusCounts.analyzed || 0) + 1;
    } else {
      statusCounts.received = (statusCounts.received || 0) + 1;
    }

    // Priority
    const p = (req.priority || 'medium').toLowerCase().trim();
    if (p in priorityCounts) {
      priorityCounts[p]++;
    } else {
      priorityCounts['medium'] = (priorityCounts['medium'] || 0) + 1;
    }

    // Intent
    const intent = req.intent ? req.intent.trim() : 'Unclassified';
    intentCounts[intent] = (intentCounts[intent] || 0) + 1;
  });

  const topIntents = Object.entries(intentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const getPercentage = (count: number) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {/* 1. Status Distribution */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Status Breakdown
              </h3>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
              {total} cases
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-600 dark:text-zinc-400 font-medium">Auto Resolved</span>
                <span className="text-zinc-700 dark:text-zinc-300 font-mono text-[11px]">{statusCounts.auto_resolved} ({getPercentage(statusCounts.auto_resolved)}%)</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${getPercentage(statusCounts.auto_resolved)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-600 dark:text-zinc-400 font-medium">Pending Human Review</span>
                <span className="text-amber-600 dark:text-amber-400 font-mono text-[11px] font-semibold">{statusCounts.pending_human_review} ({getPercentage(statusCounts.pending_human_review)}%)</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${getPercentage(statusCounts.pending_human_review)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-600 dark:text-zinc-400 font-medium">Analyzed (Ready)</span>
                <span className="text-zinc-700 dark:text-zinc-300 font-mono text-[11px]">{statusCounts.analyzed} ({getPercentage(statusCounts.analyzed)}%)</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${getPercentage(statusCounts.analyzed)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-600 dark:text-zinc-400 font-medium">Received (In Ingestion)</span>
                <span className="text-zinc-700 dark:text-zinc-300 font-mono text-[11px]">{statusCounts.received} ({getPercentage(statusCounts.received)}%)</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-zinc-400 dark:bg-zinc-600 rounded-full transition-all duration-300"
                  style={{ width: `${getPercentage(statusCounts.received)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Priority Distribution */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Priority Severity
              </h3>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
              Urgency
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-600 dark:text-zinc-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Urgent
                </span>
                <span className="text-rose-600 dark:text-rose-400 font-mono text-[11px] font-semibold">{priorityCounts.urgent} ({getPercentage(priorityCounts.urgent)}%)</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-300"
                  style={{ width: `${getPercentage(priorityCounts.urgent)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-600 dark:text-zinc-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> High
                </span>
                <span className="text-orange-600 dark:text-orange-400 font-mono text-[11px]">{priorityCounts.high} ({getPercentage(priorityCounts.high)}%)</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-300"
                  style={{ width: `${getPercentage(priorityCounts.high)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-600 dark:text-zinc-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Medium
                </span>
                <span className="text-zinc-700 dark:text-zinc-300 font-mono text-[11px]">{priorityCounts.medium} ({getPercentage(priorityCounts.medium)}%)</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-300"
                  style={{ width: `${getPercentage(priorityCounts.medium)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-600 dark:text-zinc-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span> Low
                </span>
                <span className="text-zinc-700 dark:text-zinc-300 font-mono text-[11px]">{priorityCounts.low} ({getPercentage(priorityCounts.low)}%)</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-zinc-400 dark:bg-zinc-600 rounded-full transition-all duration-300"
                  style={{ width: `${getPercentage(priorityCounts.low)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Intent Distribution */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <PieChart className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Top Classified Intents
              </h3>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
              Volume
            </span>
          </div>

          {topIntents.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-xs text-zinc-400">
              No intent telemetry recorded
            </div>
          ) : (
            <div className="space-y-3">
              {topIntents.map(([intentName, count]) => {
                const pct = getPercentage(count);
                return (
                  <div key={intentName}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-600 dark:text-zinc-400 font-medium capitalize">
                        {intentName}
                      </span>
                      <span className="text-zinc-700 dark:text-zinc-300 font-mono text-[11px]">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
