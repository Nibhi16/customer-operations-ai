'use client';

import React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';

interface SentimentBadgeProps {
  sentiment: string | null;
  className?: string;
  showIconOnly?: boolean;
}

export function SentimentBadge({ sentiment, className = '', showIconOnly = false }: SentimentBadgeProps) {
  const normalized = (sentiment || '').toLowerCase().trim();

  switch (normalized) {
    case 'positive':
      return (
        <span
          title="Positive sentiment"
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 ${className}`}
        >
          <Smile className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          {!showIconOnly && 'Positive'}
        </span>
      );

    case 'negative':
      return (
        <span
          title="Negative sentiment"
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/25 ${className}`}
        >
          <Frown className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          {!showIconOnly && 'Negative'}
        </span>
      );

    case 'neutral':
    default:
      return (
        <span
          title="Neutral sentiment"
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20 ${className}`}
        >
          <Meh className="w-3 h-3 text-zinc-400" />
          {!showIconOnly && (sentiment ? sentiment.charAt(0).toUpperCase() + sentiment.slice(1) : 'Neutral')}
        </span>
      );
  }
}
