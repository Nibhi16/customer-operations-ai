'use client';

import React, { useState, useMemo } from 'react';
import { CustomerRequest } from '@/types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { SentimentBadge } from './SentimentBadge';
import { Users, Mail, AlertCircle, ArrowLeft, Search, Eye } from 'lucide-react';

interface CustomersViewProps {
  requests: CustomerRequest[];
  onSelectRequest: (req: CustomerRequest) => void;
  onBackToOverview: () => void;
}

interface CustomerSummary {
  email: string;
  customerId: string | null;
  totalRequests: number;
  pendingReviews: number;
  latestRequest: CustomerRequest;
  intents: string[];
}

export function CustomersView({
  requests,
  onSelectRequest,
  onBackToOverview,
}: CustomersViewProps) {
  const [search, setSearch] = useState('');

  // Aggregate customer operational history from requests
  const customers = useMemo(() => {
    const customerMap = new Map<string, CustomerSummary>();

    requests.forEach((req) => {
      const email = req.email || 'Unregistered Customer';
      const existing = customerMap.get(email);

      if (existing) {
        existing.totalRequests++;
        if (req.human_review_required) existing.pendingReviews++;
        if (req.intent && !existing.intents.includes(req.intent)) {
          existing.intents.push(req.intent);
        }
        if (new Date(req.created_at) > new Date(existing.latestRequest.created_at)) {
          existing.latestRequest = req;
        }
      } else {
        customerMap.set(email, {
          email,
          customerId: req.customer_id,
          totalRequests: 1,
          pendingReviews: req.human_review_required ? 1 : 0,
          latestRequest: req,
          intents: req.intent ? [req.intent] : [],
        });
      }
    });

    return Array.from(customerMap.values()).sort(
      (a, b) => b.totalRequests - a.totalRequests
    );
  }, [requests]);

  const filteredCustomers = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.email.toLowerCase().includes(q) ||
        (c.customerId && c.customerId.toLowerCase().includes(q))
    );
  }, [customers, search]);

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <button
            onClick={onBackToOverview}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Overview
          </button>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Customer Accounts Directory
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
              {customers.length} Accounts
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Aggregated customer case history and escalation profile from Supabase.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search account or ID..."
            className="w-full pl-8.5 pr-3 py-1.5 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
          />
        </div>
      </div>

      {/* Structured Customer Accounts Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3.5">Customer Account</th>
              <th className="py-2.5 px-3.5">Customer ID</th>
              <th className="py-2.5 px-3.5">Total Cases</th>
              <th className="py-2.5 px-3.5">Escalated Reviews</th>
              <th className="py-2.5 px-3.5">Latest Status</th>
              <th className="py-2.5 px-3.5 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
            {filteredCustomers.map((c) => (
              <tr
                key={c.email}
                className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
              >
                <td className="py-2.5 px-3.5 font-medium text-zinc-900 dark:text-zinc-100">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>{c.email}</span>
                  </div>
                </td>

                <td className="py-2.5 px-3.5 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                  {c.customerId ? c.customerId : 'Unassigned'}
                </td>

                <td className="py-2.5 px-3.5 font-mono text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">
                  {c.totalRequests}
                </td>

                <td className="py-2.5 px-3.5">
                  {c.pendingReviews > 0 ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                      <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      {c.pendingReviews} pending
                    </span>
                  ) : (
                    <span className="text-zinc-400 font-mono text-[11px]">0</span>
                  )}
                </td>

                <td className="py-2.5 px-3.5">
                  <StatusBadge status={c.latestRequest.status} />
                </td>

                <td className="py-2.5 px-3.5 text-right">
                  <button
                    onClick={() => onSelectRequest(c.latestRequest)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-zinc-200/60 dark:border-zinc-700/60"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Latest Ticket</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
