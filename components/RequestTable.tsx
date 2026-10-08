'use client';

import React from 'react';
import { CustomerRequest } from '@/types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { SentimentBadge } from './SentimentBadge';
import { EmptyState } from './EmptyState';
import { AlertCircle, ChevronRight, Eye, User } from 'lucide-react';

interface RequestTableProps {
  requests: CustomerRequest[];
  onSelectRequest: (req: CustomerRequest) => void;
  isFiltered?: boolean;
  onClearFilters?: () => void;
}

export function RequestTable({
  requests,
  onSelectRequest,
  isFiltered = false,
  onClearFilters,
}: RequestTableProps) {
  if (requests.length === 0) {
    return <EmptyState isFiltered={isFiltered} onClearFilters={onClearFilters} />;
  }

  const formatShortDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
            <th className="py-2.5 px-3.5">Customer & Request</th>
            <th className="py-2.5 px-3.5">Intent</th>
            <th className="py-2.5 px-3.5">Priority</th>
            <th className="py-2.5 px-3.5">Sentiment</th>
            <th className="py-2.5 px-3.5">Status</th>
            <th className="py-2.5 px-3.5 hidden lg:table-cell">Received</th>
            <th className="py-2.5 px-3.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
          {requests.map((req) => {
            const needsReview = Boolean(req.human_review_required);

            return (
              <tr
                key={req.id}
                onClick={() => onSelectRequest(req)}
                className={`group cursor-pointer transition-colors duration-100 hover:bg-zinc-50/90 dark:hover:bg-zinc-800/40 ${
                  needsReview
                    ? 'bg-amber-50/30 dark:bg-amber-950/15 border-l-4 border-l-amber-500'
                    : 'border-l-4 border-l-transparent'
                }`}
              >
                {/* Customer & Message Summary */}
                <td className="py-2.5 px-3.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                        needsReview
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 max-w-[260px] sm:max-w-[340px]">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate flex items-center gap-1.5">
                        <span className="truncate">{req.email || 'Anonymous customer'}</span>
                        {needsReview && (
                          <span
                            title="Human review required"
                            className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 shrink-0"
                          >
                            <AlertCircle className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                            Review Required
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                        {req.message || 'No message content'}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Intent Column */}
                <td className="py-2.5 px-3.5 whitespace-nowrap">
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 capitalize border border-zinc-200/60 dark:border-zinc-700/60">
                    {req.intent || 'Unclassified'}
                  </span>
                </td>

                {/* Priority Column */}
                <td className="py-2.5 px-3.5 whitespace-nowrap">
                  <PriorityBadge priority={req.priority} />
                </td>

                {/* Sentiment Column */}
                <td className="py-2.5 px-3.5 whitespace-nowrap">
                  <SentimentBadge sentiment={req.sentiment} />
                </td>

                {/* Status Column */}
                <td className="py-2.5 px-3.5 whitespace-nowrap">
                  <StatusBadge status={req.status} />
                </td>

                {/* Created Column */}
                <td className="py-2.5 px-3.5 whitespace-nowrap text-zinc-500 dark:text-zinc-400 font-mono text-[11px] hidden lg:table-cell">
                  {formatShortDate(req.created_at)}
                </td>

                {/* Actions Column */}
                <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRequest(req);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200/60 dark:border-zinc-700/60"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
