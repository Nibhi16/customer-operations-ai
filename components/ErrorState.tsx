'use client';

import React, { useState } from 'react';
import { AlertOctagon, RefreshCw, KeyRound, Check, ExternalLink } from 'lucide-react';

interface ErrorStateProps {
  onRetry: () => void;
  message?: string;
  onSaveKey?: (key: string) => void;
}

export function ErrorState({ onRetry, message, onSaveKey }: ErrorStateProps) {
  const [inputKey, setInputKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isKeyError =
    message?.toLowerCase().includes('anon') ||
    message?.toLowerCase().includes('key') ||
    message?.toLowerCase().includes('api key');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim() || !onSaveKey) return;
    onSaveKey(inputKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      onRetry();
    }, 400);
  };

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-8 text-center my-6 shadow-sm">
      <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-xs">
        {isKeyError ? <KeyRound className="w-6 h-6" /> : <AlertOctagon className="w-6 h-6" />}
      </div>

      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
        {isKeyError ? 'Supabase Authentication Required' : 'Unable to load customer operations data'}
      </h3>

      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto mb-6 leading-relaxed">
        {message || 'Could not connect to the Supabase database to fetch customer requests.'}
      </p>

      {isKeyError && onSaveKey && (
        <form onSubmit={handleSave} className="max-w-md mx-auto mb-6 text-left">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
            Enter Supabase Anon Key (for instant live preview):
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-violet-500 font-mono"
            />
            <button
              type="submit"
              disabled={!inputKey.trim()}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  Saved
                </>
              ) : (
                'Connect'
              )}
            </button>
          </div>
          <span className="block mt-2 text-[11px] text-zinc-400 dark:text-zinc-500">
            Or configure directly in <code className="font-mono text-zinc-600 dark:text-zinc-300">.env.local</code> as <code className="font-mono text-zinc-600 dark:text-zinc-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
          </span>
        </form>
      )}

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 shadow-xs transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Connection
        </button>
      </div>
    </div>
  );
}
