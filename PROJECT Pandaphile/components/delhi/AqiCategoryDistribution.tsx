'use client';

import React from 'react';
import { ShieldCheck, Info, PieChart, AlertCircle } from 'lucide-react';
import { DELHI_CATEGORY_DISTRIBUTION } from '@/lib/delhiData';

interface AqiCategoryDistributionProps {
  selectedCategory?: string;
  onSelectCategory?: (cat: string) => void;
}

export default function AqiCategoryDistribution({
  selectedCategory = 'ALL',
  onSelectCategory,
}: AqiCategoryDistributionProps) {
  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <PieChart className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-semibold text-zinc-100">
              700-Day Study Window: CPCB Air Quality Category Distribution
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Breakpoints based on 24-hr daily average PM2.5 concentrations (1 Jan 2023 – 30 Nov 2024)
          </p>
        </div>

        <div className="text-[11px] font-mono text-zinc-400 bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800">
          Total Observations: 700 Days
        </div>
      </div>

      {/* Distribution progress bar */}
      <div className="space-y-2">
        <div className="w-full h-3 rounded-full bg-zinc-800 overflow-hidden flex shadow-inner">
          {DELHI_CATEGORY_DISTRIBUTION.map(item => (
            <div
              key={item.category}
              title={`${item.category}: ${item.days} days (${item.percentage}%)`}
              className="h-full transition-all hover:opacity-80"
              style={{
                width: `${item.percentage}%`,
                backgroundColor: item.color,
              }}
            />
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
        {DELHI_CATEGORY_DISTRIBUTION.map(cat => {
          const isSelected = selectedCategory === cat.category;
          return (
            <button
              key={cat.category}
              type="button"
              onClick={() => onSelectCategory && onSelectCategory(isSelected ? 'ALL' : cat.category)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-zinc-350 bg-zinc-800/90 shadow-md ring-1 ring-emerald-500/50'
                  : 'border-zinc-800/80 bg-zinc-950/60 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-[10px] font-mono text-zinc-400">{cat.range}</span>
              </div>

              <div className="text-xs font-semibold text-zinc-200">{cat.category}</div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-mono text-base font-bold text-zinc-100">{cat.days}</span>
                <span className="text-[10px] text-zinc-400 font-mono">days</span>
              </div>
              <div className="text-[10px] font-mono text-zinc-400 mt-0.5">{cat.percentage}%</div>
            </button>
          );
        })}
      </div>

      {/* Thesis note callout */}
      <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-xs text-zinc-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-[11px] leading-relaxed">
          <span className="text-zinc-200 font-medium">Thesis Dataset Quality Finding: </span>
          Zero days reached the <i>Severe (&gt;250 µg/m³)</i> category because Open-Meteo draws from spatial atmospheric models that smooth localized ground-level spikes. Maximum recorded PM2.5 in study was 214.1 µg/m³ (9 Jan 2023).
        </div>
      </div>
    </div>
  );
}
