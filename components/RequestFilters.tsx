'use client';

import React from 'react';
import { Search, X, Filter, AlertCircle, RotateCcw } from 'lucide-react';
import { RequestFiltersState } from '@/types';

interface RequestFiltersProps {
  filters: RequestFiltersState;
  onChange: (filters: RequestFiltersState) => void;
  availableIntents: string[];
  totalCount: number;
  filteredCount: number;
}

export function RequestFilters({
  filters,
  onChange,
  availableIntents,
  totalCount,
  filteredCount,
}: RequestFiltersProps) {
  const isAnyFilterActive =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.intent !== 'all' ||
    filters.sentiment !== 'all' ||
    filters.humanReviewOnly;

  const handleClear = () => {
    onChange({
      search: '',
      status: 'all',
      priority: 'all',
      intent: 'all',
      sentiment: 'all',
      humanReviewOnly: false,
    });
  };

  return (
    <div className="space-y-2.5 mb-3">
      {/* Search Bar & Primary Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search email, message content, or classified intent..."
            className="w-full pl-8.5 pr-8 py-1.5 rounded-lg text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors shadow-2xs"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: '' })}
              aria-label="Clear search query"
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Review Filter */}
        <button
          onClick={() => onChange({ ...filters, humanReviewOnly: !filters.humanReviewOnly })}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            filters.humanReviewOnly
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-800 dark:text-amber-300'
              : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <AlertCircle className={`w-3.5 h-3.5 ${filters.humanReviewOnly ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-400'}`} />
          <span>Needs Review Only</span>
        </button>
      </div>

      {/* Filter Dropdowns Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mr-0.5">
            <Filter className="w-3 h-3" />
            <span>Filter by:</span>
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
            className="px-2 py-1 rounded-md text-xs font-medium bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
          >
            <option value="all">Status: All</option>
            <option value="received">Received</option>
            <option value="analyzed">Analyzed</option>
            <option value="auto_resolved">Auto Resolved</option>
            <option value="pending_human_review">Pending Review</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filters.priority}
            onChange={(e) => onChange({ ...filters, priority: e.target.value })}
            className="px-2 py-1 rounded-md text-xs font-medium bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
          >
            <option value="all">Priority: All</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Intent Filter */}
          <select
            value={filters.intent}
            onChange={(e) => onChange({ ...filters, intent: e.target.value })}
            className="px-2 py-1 rounded-md text-xs font-medium bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
          >
            <option value="all">Intent: All</option>
            {availableIntents.map((intent) => (
              <option key={intent} value={intent}>
                {intent}
              </option>
            ))}
          </select>

          {/* Sentiment Filter */}
          <select
            value={filters.sentiment}
            onChange={(e) => onChange({ ...filters, sentiment: e.target.value })}
            className="px-2 py-1 rounded-md text-xs font-medium bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
          >
            <option value="all">Sentiment: All</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>

          {/* Reset button */}
          {isAnyFilterActive && (
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset filters
            </button>
          )}
        </div>

        {/* Results Counter */}
        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
          Showing <span className="font-semibold text-zinc-900 dark:text-zinc-100">{filteredCount}</span> of{' '}
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{totalCount}</span> cases
        </div>
      </div>
    </div>
  );
}
