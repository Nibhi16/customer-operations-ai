'use client';

import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { CustomerRequest, DashboardMetrics } from '@/types';

interface AiInsightsPanelProps {
  requests: CustomerRequest[];
  metrics: DashboardMetrics;
}

export function AiInsightsPanel({ requests, metrics }: AiInsightsPanelProps) {
  if (requests.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Operations Telemetry
          </h3>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          AI insights will appear as requests are ingested from the n8n webhook.
        </p>
      </div>
    );
  }

  const insights: { text: string; icon: React.ReactNode }[] = [];

  // Insight 1: Auto-resolution rate
  if (metrics.totalRequests > 0) {
    insights.push({
      text: `${metrics.autoResolveRate}% of customer tickets resolved automatically without manual intervention.`,
      icon: <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />,
    });
  }

  // Insight 2: Pending human review count
  if (metrics.pendingReview > 0) {
    insights.push({
      text: `${metrics.pendingReview} ${metrics.pendingReview === 1 ? 'ticket requires' : 'tickets require'} human operations review before response dispatch.`,
      icon: <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />,
    });
  } else if (metrics.totalRequests > 0) {
    insights.push({
      text: `Zero review backlog: all operational escalations are currently resolved.`,
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />,
    });
  }

  // Insight 3: Most common intent
  if (metrics.mostFrequentIntent) {
    insights.push({
      text: `"${metrics.mostFrequentIntent}" is the most frequent intent (${metrics.mostFrequentIntentCount} requests, ${Math.round((metrics.mostFrequentIntentCount / metrics.totalRequests) * 100)}% of total volume).`,
      icon: <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />,
    });
  }

  // Insight 4: Negative sentiment rate
  const negativeCount = requests.filter(r => (r.sentiment || '').toLowerCase() === 'negative').length;
  if (negativeCount > 0) {
    const negRate = Math.round((negativeCount / requests.length) * 100);
    insights.push({
      text: `${negRate}% of incoming requests show negative sentiment, prioritized for escalation.`,
      icon: <ArrowRight className="w-3.5 h-3.5 text-rose-500 shrink-0" />,
    });
  }

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Operations Telemetry & Decision Insights
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Calculated dynamically from real-time customer operations telemetry
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {insights.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-2.5 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-700/50 text-xs text-zinc-700 dark:text-zinc-300"
          >
            <div className="mt-0.5">{item.icon}</div>
            <span className="leading-relaxed">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
