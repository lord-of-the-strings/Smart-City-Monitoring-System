'use client';

import React from 'react';
import { Zap, Flame, Clock, Gauge, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

interface EnergyTopMetricsProps {
  currentMeanDemand?: number;
  allTimePeakDemand?: number;
  peakLoadRatio?: number;
  correlationCoeff?: number;
}

export default function EnergyTopMetrics({
  currentMeanDemand = 4187.9,
  allTimePeakDemand = 8631.5,
  peakLoadRatio = 1.23,
  correlationCoeff = -0.28,
}: EnergyTopMetricsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Grid Mean Demand */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-sm">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span className="font-medium">Study Window Mean Demand</span>
            <span className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Zap className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-100">
              {currentMeanDemand.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-zinc-400">MW</span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-zinc-800/80 text-[10px] text-zinc-400 flex items-center justify-between font-mono">
          <span>Range: 2,121 – 7,361 MW</span>
          <span className="text-emerald-400">Delhi SLDC Verified</span>
        </div>
      </div>

      {/* 2. All-Time Recorded Peak Demand */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-sm">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span className="font-medium">All-Time Grid Peak Demand</span>
            <span className="p-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Flame className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-400">
              {allTimePeakDemand.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-zinc-400">MW</span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-zinc-800/80 text-[10px] text-zinc-400 flex items-center justify-between font-mono">
          <span>Recorded: 19 June 2024</span>
          <span className="text-rose-400 font-semibold">Summer Heatwave Peak</span>
        </div>
      </div>

      {/* 3. Peak-Load Ratio */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-sm">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span className="font-medium">Mean Peak-Load Ratio</span>
            <span className="p-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Gauge className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-cyan-400">
              {peakLoadRatio}x
            </span>
            <span className="text-xs font-mono text-zinc-400">(Peak / Mean)</span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-zinc-800/80 text-[10px] text-zinc-400 flex items-center justify-between font-mono">
          <span>Stress Envelope: 1.0 – 1.49x</span>
          <span className="text-cyan-400">Peaking Peaker Reserve</span>
        </div>
      </div>

      {/* 4. Inverse Seasonal Correlation */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-sm">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span className="font-medium">Energy vs PM2.5 Correlation</span>
            <span className="p-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-purple-400">
              {correlationCoeff}
            </span>
            <span className="text-xs font-mono text-zinc-400">Pearson r</span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-zinc-800/80 text-[10px] text-zinc-400 flex items-center justify-between font-mono">
          <span>Inverse Seasonality</span>
          <span className="text-zinc-300">Seasonal, not causal</span>
        </div>
      </div>
    </div>
  );
}
