'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Calendar,
  Download,
  Activity,
  Layers,
  Menu,
  X,
  Clock,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import { TimeScope } from '@/types/dashboard';
import { downloadCSV } from '@/lib/utils';
import { DELHI_DAILY_MASTER } from '@/lib/delhiData';

interface HeaderProps {
  timeScope: TimeScope;
  onSelectTimeScope: (scope: TimeScope) => void;
  isStreaming: boolean;
  onToggleStreaming: () => void;
  onToggleMobileSidebar?: () => void;
  isMobileSidebarOpen?: boolean;
}

export default function Header({
  timeScope,
  onSelectTimeScope,
  isStreaming,
  onToggleStreaming,
  onToggleMobileSidebar,
  isMobileSidebarOpen,
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) +
          ' ' +
          now.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          }) +
          ' IST'
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const exportMasterCSV = () => {
    downloadCSV(`delhi_daily_master_export_${Date.now()}.csv`, DELHI_DAILY_MASTER);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 lg:px-6 py-3 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left section */}
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 rounded-lg transition-colors border border-zinc-800"
              aria-label="Toggle Navigation"
            >
              {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          {/* Branding */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30 text-emerald-400 shadow-inner">
              <Activity className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="leading-tight">
              <div className="text-xs font-mono font-medium text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
                DELHI DESA 2.0
                <span className="inline-block px-1.5 py-0.2 text-[9px] font-mono bg-zinc-800 text-zinc-300 rounded border border-zinc-700">700 DAYS</span>
              </div>
              <div className="text-sm font-semibold text-zinc-100 tracking-tight">
                Environmental & Sustainability Analytics
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-zinc-800 hidden md:block" />

          {/* Location Badge */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>Delhi, India</span>
            <span className="text-[10px] font-mono text-zinc-400">(28.61° N, 77.21° E)</span>
          </div>
        </div>

        {/* Right section */}
        <div className="flex flex-wrap items-center gap-2.5 justify-end">
          {/* Live Stream / Ingestion Status */}
          <button
            type="button"
            onClick={onToggleStreaming}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              isStreaming
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isStreaming ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="font-mono text-[11px]">
              {isStreaming ? '700D STREAM' : 'PAUSED'}
            </span>
          </button>

          {/* Time Scope Filter */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs">
            <button
              type="button"
              onClick={() => onSelectTimeScope('all-700d')}
              className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors ${
                timeScope === 'all-700d'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              700D (Full)
            </button>
            <button
              type="button"
              onClick={() => onSelectTimeScope('test-106d')}
              className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors ${
                timeScope === 'test-106d'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Test (106D)
            </button>
            <button
              type="button"
              onClick={() => onSelectTimeScope('stubble')}
              className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors ${
                timeScope === 'stubble'
                  ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Stubble (Oct-Nov)
            </button>
            <button
              type="button"
              onClick={() => onSelectTimeScope('summer-peak')}
              className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-colors ${
                timeScope === 'summer-peak'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Summer Peak
            </button>
          </div>

          {/* Export CSV Master Dataset */}
          <button
            type="button"
            onClick={exportMasterCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-200 font-medium transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </header>
  );
}
