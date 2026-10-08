import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eqsqaiwlschmuowpjuef.supabase.co';
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export function getEffectiveAnonKey(): string {
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (envKey && envKey !== '<MY_SUPABASE_PUBLISHABLE_KEY>') {
    return envKey;
  }
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('customerops_anon_key');
    if (stored) return stored;
  }
  return envKey || '';
}

let cachedClient: SupabaseClient | null = null;
let cachedKey: string | null = null;

export function createSupabaseClient(keyOverride?: string): SupabaseClient {
  const key = keyOverride || getEffectiveAnonKey();
  if (cachedClient && cachedKey === key) {
    return cachedClient;
  }

  cachedClient = createClient(supabaseUrl, key || 'placeholder-anon-key', {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  cachedKey = key;
  return cachedClient;
}

export const supabase = createSupabaseClient();
