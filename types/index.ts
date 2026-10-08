export type RequestPriority = 'low' | 'medium' | 'high' | 'urgent' | string;
export type RequestSentiment = 'positive' | 'neutral' | 'negative' | string;
export type RequestStatus = 
  | 'received' 
  | 'analyzed' 
  | 'auto_resolved' 
  | 'pending_human_review' 
  | string;

export interface CustomerRequest {
  id: string | number;
  customer_id: string | null;
  email: string;
  message: string;
  intent: string | null;
  priority: RequestPriority | null;
  sentiment: RequestSentiment | null;
  summary: string | null;
  recommended_action: string | null;
  human_review_required: boolean | null;
  status: RequestStatus | null;
  created_at: string;
  updated_at: string | null;
}

export interface RequestFiltersState {
  search: string;
  status: string;
  priority: string;
  intent: string;
  sentiment: string;
  humanReviewOnly: boolean;
}

export interface DashboardMetrics {
  totalRequests: number;
  pendingReview: number;
  autoResolved: number;
  highPriority: number;
  autoResolveRate: number;
  reviewRate: number;
  mostFrequentIntent: string;
  mostFrequentIntentCount: number;
}
