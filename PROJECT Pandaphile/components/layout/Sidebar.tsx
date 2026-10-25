'use client';

import React from 'react';
import {
  Wind,
  Zap,
  Cpu,
  ShieldCheck,
  Server,
  Layers,
  BarChart3,
  Flame,
  Calendar
} from 'lucide-react';
import { TabView } from '@/types/dashboard';

interface SidebarProps {
  currentTab: TabView;
  onSelectTab: (tab: TabView) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({
  currentTab,
  onSelectTab,
  isMobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const navItems = [
    {
      id: 'air-quality' as TabView,
      label: 'Air Quality & Weather',
      sublabel: 'Daily PM2.5, Trace Gases & CPCB',
      icon: Wind,
      badge: '700 Days',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'energy-correlation' as TabView,
      label: 'Energy Demand & Correlation',
      sublabel: '5-Min Peak Load vs Emission Inversion',
      icon: Zap,
      badge: '8,632 MW Peak',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      id: 'ml-prediction' as TabView,
      label: 'ML Forecast & Sustainability',
      sublabel: 'Next-Day PM2.5 & Index (0-100)',
      icon: Cpu,
      badge: 'RMSE 14.8',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
  ];

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 lg:top-[57px] left-0 z-40 h-full lg:h-[calc(100vh-57px)] w-72 bg-zinc-950 border-r border-zinc-800/80 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-5">
          {/* Mobile close */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 lg:hidden">
            <span className="font-semibold text-zinc-100 text-sm">Delhi Analytics</span>
            <button
              onClick={onCloseMobile}
              className="text-xs text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded bg-zinc-900 border border-zinc-800"
            >
              Close
            </button>
          </div>

          {/* Navigation group */}
          <div>
            <div className="px-3 pb-2 text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
              Study Analytics Domains
            </div>
            <nav className="space-y-1.5" role="tablist">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    role="tab"
                    aria-selected={isActive}
                    type="button"
                    onClick={() => {
                      onSelectTab(item.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full group relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-zinc-900 text-zinc-100 border border-zinc-700/80 shadow-md shadow-black/40'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40 border border-transparent'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    )}

                    <div
                      className={`p-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-zinc-900 text-zinc-400 group-hover:text-zinc-200 group-hover:bg-zinc-850'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-semibold truncate ${
                            isActive ? 'text-zinc-100' : 'text-zinc-300'
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                      <span className="block text-[11px] text-zinc-400 truncate mt-0.5">
                        {item.sublabel}
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Master Study Scope Summary Card */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                Delhi Master Pipeline
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                Synchronized
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Study Window:</span>
                <span className="font-mono text-zinc-200">700 Days</span>
              </div>
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Target:</span>
                <span className="font-mono text-cyan-400">Next-Day PM2.5</span>
              </div>
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Features:</span>
                <span className="font-mono text-zinc-200">18 Inputs</span>
              </div>
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Split:</span>
                <span className="font-mono text-zinc-300">70 / 15 / 15%</span>
              </div>
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Baseline RMSE:</span>
                <span className="font-mono text-amber-400 font-bold">17.9 µg/m³</span>
              </div>
            </div>
          </div>

          {/* Three Domain Integration Callout */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/90 rounded-xl p-3 text-xs space-y-1.5">
            <div className="text-zinc-200 font-semibold text-[11px] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>3 Merged Source Domains</span>
            </div>
            <ul className="text-[11px] text-zinc-400 space-y-1 pl-1 font-mono">
              <li>• Air Quality (Open-Meteo)</li>
              <li>• Weather (Kaggle Delhi Daily)</li>
              <li>• Power Demand (5-min Grid SLDC)</li>
            </ul>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400 space-y-1">
          <div className="flex items-center justify-between">
            <span>Prediction Target</span>
            <span className="font-mono text-cyan-400">target_next_day_pm25</span>
          </div>
          <div className="flex items-center justify-between">
            <span>CPCB Breakpoints</span>
            <span className="font-mono text-emerald-400">Active</span>
          </div>
        </div>
      </aside>
    </>
  );
}
