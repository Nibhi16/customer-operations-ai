'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createSupabaseClient, getEffectiveAnonKey } from '@/lib/supabase';
import { CustomerRequest, RequestFiltersState, DashboardMetrics } from '@/types';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { HeroBanner } from '@/components/HeroBanner';
import { KpiCard } from '@/components/KpiCard';
import { AnalyticsSection } from '@/components/AnalyticsSection';
import { AiInsightsPanel } from '@/components/AiInsightsPanel';
import { RequestFilters } from '@/components/RequestFilters';
import { RequestTable } from '@/components/RequestTable';
import { RequestDetailDrawer } from '@/components/RequestDetailDrawer';
import { CustomersView } from '@/components/CustomersView';
import { KpiSkeleton, AnalyticsSkeleton, TableRowSkeleton } from '@/components/SkeletonLoader';
import { ErrorState } from '@/components/ErrorState';
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Layers,
} from 'lucide-react';

export default function DashboardPage() {
  const [requests, setRequests] = useState<CustomerRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Navigation & UI state
  const [currentTab, setCurrentTab] = useState<'overview' | 'requests' | 'customers'>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<CustomerRequest | null>(null);

  // Requests section anchor
  const requestsSectionRef = useRef<HTMLDivElement>(null);

  // Filters state
  const [filters, setFilters] = useState<RequestFiltersState>({
    search: '',
    status: 'all',
    priority: 'all',
    intent: 'all',
    sentiment: 'all',
    humanReviewOnly: false,
  });

  // Fetch requests from Supabase
  const fetchRequests = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const key = getEffectiveAnonKey();
      if (!key) {
        throw new Error(
          'Supabase anonymous key is missing. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file or enter it below.'
        );
      }

      const client = createSupabaseClient(key);
      const { data, error: sbError } = await client
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (sbError) {
        console.error('[CustomerOps AI] Supabase query error:', sbError);
        throw new Error(sbError.message || 'Failed to fetch operational requests from Supabase.');
      }

      setRequests((data as CustomerRequest[]) || []);
      setLastUpdated(new Date());
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'Unknown network error';
      console.error('[CustomerOps AI] Error fetching requests:', errMessage);
      setError(errMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleSaveKey = (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('customerops_anon_key', key);
    }
    fetchRequests(false);
  };

  // Initial fetch and Realtime subscription
  useEffect(() => {
    fetchRequests();

    const key = getEffectiveAnonKey();
    if (!key) return;

    // Supabase Realtime channel
    const client = createSupabaseClient(key);
    const channel = client
      .channel('public:requests')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'requests' },
        (payload) => {
          console.log('[CustomerOps AI] Realtime change detected:', payload);
          // Refetch quietly to ensure sorted and consistent state
          fetchRequests(true);
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [fetchRequests]);

  // Tab change handler
  const handleSelectTab = (tab: 'overview' | 'requests' | 'customers') => {
    setCurrentTab(tab);
    if (tab === 'requests' && requestsSectionRef.current) {
      requestsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Extract unique available intents from the real data
  const availableIntents = useMemo(() => {
    const set = new Set<string>();
    requests.forEach((r) => {
      if (r.intent && r.intent.trim()) {
        set.add(r.intent.trim());
      }
    });
    return Array.from(set).sort();
  }, [requests]);

  // Compute Dashboard Metrics from REAL data
  const metrics = useMemo<DashboardMetrics>(() => {
    const totalRequests = requests.length;
    let pendingReview = 0;
    let autoResolved = 0;
    let highPriority = 0;
    const intentMap: Record<string, number> = {};

    requests.forEach((req) => {
      // Pending human review
      if (req.human_review_required) {
        pendingReview++;
      }

      // Auto resolved
      const s = (req.status || '').toLowerCase();
      if (s === 'auto_resolved' || s === 'resolved') {
        autoResolved++;
      }

      // High / Urgent Priority
      const p = (req.priority || '').toLowerCase();
      if (p === 'high' || p === 'urgent') {
        highPriority++;
      }

      // Intent tally
      if (req.intent) {
        const trimmed = req.intent.trim();
        intentMap[trimmed] = (intentMap[trimmed] || 0) + 1;
      }
    });

    const autoResolveRate = totalRequests > 0 ? Math.round((autoResolved / totalRequests) * 100) : 0;
    const reviewRate = totalRequests > 0 ? Math.round((pendingReview / totalRequests) * 100) : 0;

    let mostFrequentIntent = '';
    let mostFrequentIntentCount = 0;
    Object.entries(intentMap).forEach(([intent, count]) => {
      if (count > mostFrequentIntentCount) {
        mostFrequentIntentCount = count;
        mostFrequentIntent = intent;
      }
    });

    return {
      totalRequests,
      pendingReview,
      autoResolved,
      highPriority,
      autoResolveRate,
      reviewRate,
      mostFrequentIntent,
      mostFrequentIntentCount,
    };
  }, [requests]);

  // Filter requests based on user filters & search query
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // 1. Search (email, message, intent)
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesEmail = req.email ? req.email.toLowerCase().includes(q) : false;
        const matchesMessage = req.message ? req.message.toLowerCase().includes(q) : false;
        const matchesIntent = req.intent ? req.intent.toLowerCase().includes(q) : false;
        if (!matchesEmail && !matchesMessage && !matchesIntent) {
          return false;
        }
      }

      // 2. Status
      if (filters.status !== 'all') {
        const s = (req.status || '').toLowerCase();
        if (filters.status === 'auto_resolved' && !s.includes('auto') && !s.includes('resolved')) {
          return false;
        }
        if (filters.status === 'pending_human_review' && !s.includes('review') && !s.includes('pending')) {
          return false;
        }
        if (filters.status === 'analyzed' && !s.includes('analyzed')) {
          return false;
        }
        if (filters.status === 'received' && s !== 'received') {
          return false;
        }
      }

      // 3. Priority
      if (filters.priority !== 'all') {
        const p = (req.priority || '').toLowerCase();
        if (p !== filters.priority) {
          return false;
        }
      }

      // 4. Intent
      if (filters.intent !== 'all') {
        if ((req.intent || '').trim().toLowerCase() !== filters.intent.toLowerCase()) {
          return false;
        }
      }

      // 5. Sentiment
      if (filters.sentiment !== 'all') {
        const sent = (req.sentiment || '').toLowerCase();
        if (sent !== filters.sentiment) {
          return false;
        }
      }

      // 6. Human Review Required Toggle
      if (filters.humanReviewOnly && !req.human_review_required) {
        return false;
      }

      return true;
    });
  }, [requests, filters]);

  const isAnyFilterActive =
    filters.search !== '' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.intent !== 'all' ||
    filters.sentiment !== 'all' ||
    filters.humanReviewOnly;

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      intent: 'all',
      sentiment: 'all',
      humanReviewOnly: false,
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#090d16] text-zinc-900 dark:text-zinc-100 flex flex-col antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        requestsCount={requests.length}
        pendingReviewCount={metrics.pendingReview}
      />

      {/* Main Content Area (offset by sidebar width on lg screens) */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top Header */}
        <DashboardHeader
          onRefresh={() => fetchRequests(true)}
          isRefreshing={refreshing}
          lastUpdated={lastUpdated}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto space-y-5">
          {error ? (
            <ErrorState
              onRetry={() => fetchRequests(false)}
              message={error}
              onSaveKey={handleSaveKey}
            />
          ) : currentTab === 'customers' ? (
            /* Customers View */
            <CustomersView
              requests={requests}
              onSelectRequest={(req) => setSelectedRequest(req)}
              onBackToOverview={() => setCurrentTab('overview')}
            />
          ) : (
            /* Overview & Requests View */
            <>
              {/* Hero Banner */}
              <HeroBanner
                totalRequests={metrics.totalRequests}
                pendingReviews={metrics.pendingReview}
              />

              {/* 4 Main KPI Cards */}
              {loading ? (
                <KpiSkeleton />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
                  {/* Card 1: Total Requests */}
                  <KpiCard
                    label="Total Requests"
                    value={metrics.totalRequests}
                    description="All customer requests received"
                    icon={Inbox}
                    variant="default"
                    trend={metrics.totalRequests > 0 ? '100% Ingested' : undefined}
                  />

                  {/* Card 2: Pending Human Review */}
                  <KpiCard
                    label="Pending Review"
                    value={metrics.pendingReview}
                    description="Requests waiting for operations"
                    icon={AlertTriangle}
                    variant="amber"
                    trend={metrics.totalRequests > 0 ? `${metrics.reviewRate}% of volume` : undefined}
                  />

                  {/* Card 3: Auto Resolved */}
                  <KpiCard
                    label="Auto Resolved"
                    value={metrics.autoResolved}
                    description="Handled automatically by AI"
                    icon={CheckCircle2}
                    variant="emerald"
                    trend={metrics.totalRequests > 0 ? `${metrics.autoResolveRate}% AI rate` : undefined}
                  />

                  {/* Card 4: High Priority */}
                  <KpiCard
                    label="High Priority"
                    value={metrics.highPriority}
                    description="Requests requiring attention"
                    icon={Flame}
                    variant="rose"
                  />
                </div>
              )}

              {/* AI Insights Card */}
              {!loading && (
                <div className="mb-5">
                  <AiInsightsPanel requests={requests} metrics={metrics} />
                </div>
              )}

              {/* Secondary Analytics Visualizations */}
              {loading ? (
                <AnalyticsSkeleton />
              ) : (
                <AnalyticsSection requests={requests} />
              )}

              {/* Requests Section Anchor */}
              <section
                ref={requestsSectionRef}
                id="requests"
                className="pt-2 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <Inbox className="w-4 h-4 text-zinc-500" />
                      Customer Requests Queue
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Operational queue of tickets received, automated classifications, and human triage interventions.
                    </p>
                  </div>
                </div>

                {/* Filters & Search Control Bar */}
                <RequestFilters
                  filters={filters}
                  onChange={setFilters}
                  availableIntents={availableIntents}
                  totalCount={requests.length}
                  filteredCount={filteredRequests.length}
                />

                {/* Requests Table */}
                {loading ? (
                  <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                    <TableRowSkeleton rows={6} />
                  </div>
                ) : (
                  <RequestTable
                    requests={filteredRequests}
                    onSelectRequest={(req) => setSelectedRequest(req)}
                    isFiltered={isAnyFilterActive}
                    onClearFilters={handleClearFilters}
                  />
                )}
              </section>
            </>
          )}
        </main>
      </div>

      {/* Request Detail Drawer */}
      <RequestDetailDrawer
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  );
}
