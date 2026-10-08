'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import {
  Sun,
  Moon,
  RefreshCw,
  Menu,
} from 'lucide-react';

interface DashboardHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: Date | null;
  onToggleMobileMenu: () => void;
}

export function DashboardHeader({
  onRefresh,
  isRefreshing,
  lastUpdated,
  onToggleMobileMenu,
}: DashboardHeaderProps) {
  const { theme, toggleTheme } = useTheme();

  const formatTime = (d: Date | null) => {
    if (!d) return 'Just now';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-white/95 dark:bg-zinc-950/95 border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-6 flex items-center justify-between backdrop-blur-xs transition-colors">
      {/* Left: Mobile menu toggle + Context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
            Operations Workspace
          </span>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Internal Console
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title={lastUpdated ? `Last updated: ${formatTime(lastUpdated)}` : 'Refresh telemetry'}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-zinc-700 dark:text-zinc-300' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
          {lastUpdated && (
            <span className="hidden xl:inline text-[11px] text-zinc-400 font-mono">
              ({formatTime(lastUpdated)})
            </span>
          )}
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-1.5 rounded-md text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-zinc-700" />
          )}
        </button>

        {/* Operator Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
          <div className="w-6.5 h-6.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center text-[10px] font-bold font-mono">
            OP
          </div>
          <span className="hidden md:inline text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Operations
          </span>
        </div>
      </div>
    </header>
  );
}
