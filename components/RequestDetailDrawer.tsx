'use client';

import React, { useEffect } from 'react';
import { CustomerRequest } from '@/types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { SentimentBadge } from './SentimentBadge';
import {
  X,
  AlertTriangle,
  User,
  Mail,
  Calendar,
  MessageSquare,
  FileText,
  Lightbulb,
  Clock,
  ShieldCheck,
  Hash,
} from 'lucide-react';

interface RequestDetailDrawerProps {
  request: CustomerRequest | null;
  onClose: () => void;
}

export function RequestDetailDrawer({ request, onClose }: RequestDetailDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!request) return null;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Slide-over Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-xl flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5" />
                  CASE-{String(request.id).slice(0, 8)}
                </span>
                <StatusBadge status={request.status} />
              </div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Operations Ticket Details
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Human Review Required Alert Banner */}
            {request.human_review_required && (
              <div className="rounded-lg border border-amber-300 dark:border-amber-700/80 bg-amber-50 dark:bg-amber-950/40 p-3.5 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    Human intervention is required for this request
                  </h4>
                  <p className="text-xs text-amber-800/90 dark:text-amber-300/90 mt-0.5 leading-relaxed">
                    This ticket has been escalated for operations manual review. Follow the recommended operational action below.
                  </p>
                </div>
              </div>
            )}

            {!request.human_review_required && (request.status === 'auto_resolved' || request.status === 'resolved') && (
              <div className="rounded-lg border border-emerald-300/80 dark:border-emerald-700/60 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                    Automatically Handled by AI System
                  </h4>
                  <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed">
                    Categorized with high confidence and resolved via automated communication pipeline.
                  </p>
                </div>
              </div>
            )}

            {/* Customer Information Card */}
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 p-3.5 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <User className="w-3.5 h-3.5 text-zinc-400" />
                Customer Identity
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">Email Address</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 break-all mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    {request.email || 'No email provided'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">Customer ID</span>
                  <span className="font-mono text-zinc-700 dark:text-zinc-300 text-xs mt-0.5 block">
                    {request.customer_id ? String(request.customer_id) : 'Unassigned'}
                  </span>
                </div>
              </div>
            </div>

            {/* Original Customer Message */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                  Original Customer Message
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">
                  Incoming payload
                </span>
              </div>
              <div className="p-3.5 rounded-lg bg-zinc-100/60 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-700/50 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
                {request.message || 'No message content available.'}
              </div>
            </div>

            {/* AI Analysis Section */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                AI Classification & Triage
              </div>

              {/* 4 Classification Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                    Intent
                  </span>
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 capitalize">
                    {request.intent || 'Unclassified'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                    Priority
                  </span>
                  <div>
                    <PriorityBadge priority={request.priority} />
                  </div>
                </div>

                <div className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                    Sentiment
                  </span>
                  <div>
                    <SentimentBadge sentiment={request.sentiment} />
                  </div>
                </div>

                <div className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                    Human Review
                  </span>
                  <span
                    className={`inline-block text-xs font-semibold ${
                      request.human_review_required
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {request.human_review_required ? 'Required' : 'Automated'}
                  </span>
                </div>
              </div>

              {/* AI Summary Card */}
              <div className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  <FileText className="w-3.5 h-3.5 text-zinc-500" />
                  AI Summary
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {request.summary || 'No summary available.'}
                </p>
              </div>

              {/* Recommended Action Card */}
              <div className="p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                  <Lightbulb className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Recommended Operational Action
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                  {request.recommended_action || 'No recommended action available.'}
                </p>
              </div>
            </div>

            {/* Audit / Metadata Timestamps */}
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-400 dark:text-zinc-500 flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Created: {formatDate(request.created_at)}
              </span>
              {request.updated_at && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Updated: {formatDate(request.updated_at)}
                </span>
              )}
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
            <span className="text-[11px] text-zinc-400 font-mono">
              Audit log verified in Supabase
            </span>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
