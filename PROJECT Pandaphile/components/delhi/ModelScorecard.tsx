'use client';

import React from 'react';
import { Award, Zap, CheckCircle2, Info } from 'lucide-react';
import { MODEL_BENCHMARK_SCORECARD } from '@/lib/delhiData';

export default function ModelScorecard() {
  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Award className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-semibold text-zinc-100">
              Comparative Model Validation Scorecard (Next-Day PM2.5 Target)
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Evaluated on hold-out chronological test windows (N = 105 days, 17 Aug – 30 Nov 2024)
          </p>
        </div>

        <div className="text-[11px] font-mono text-zinc-400 bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800">
          Target: Next-Day PM2.5 (µg/m³)
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {MODEL_BENCHMARK_SCORECARD.map(model => (
          <div
            key={model.id}
            className={`relative bg-zinc-950/80 border rounded-2xl p-4 flex flex-col justify-between transition-all hover:border-zinc-700 ${
              model.isBestRMSE
                ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                : 'border-zinc-800/80'
            }`}
          >
            {model.isBestRMSE && (
              <span className="absolute -top-2.5 right-4 bg-cyan-500 text-zinc-950 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full shadow">
                ★ TOP ACCURACY
              </span>
            )}
            {model.isBestLatency && (
              <span className="absolute -top-2.5 right-4 bg-amber-500 text-zinc-950 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full shadow">
                ⚡ FASTEST EDGE
              </span>
            )}

            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold text-zinc-400">
                  {model.shortCode}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {model.latencyMs}ms Latency
                </span>
              </div>

              <h4 className="text-sm font-bold text-zinc-100 mt-1">{model.name}</h4>
              <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                {model.description}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-zinc-850">
                {/* RMSE */}
                <div className="bg-zinc-900/90 rounded-xl p-2.5 border border-zinc-800/80 text-center">
                  <span className="text-[10px] font-mono text-zinc-400 block">Test RMSE</span>
                  <div className="font-mono text-base font-bold mt-0.5 text-zinc-100">
                    <span className={model.isBestRMSE ? 'text-cyan-400' : 'text-zinc-200'}>
                      {model.rmse}
                    </span>
                    <span className="text-[10px] text-zinc-400 ml-0.5 font-normal">µg</span>
                  </div>
                </div>

                {/* MAE */}
                <div className="bg-zinc-900/90 rounded-xl p-2.5 border border-zinc-800/80 text-center">
                  <span className="text-[10px] font-mono text-zinc-400 block">MAE</span>
                  <div className="font-mono text-base font-bold mt-0.5 text-zinc-100">
                    <span className={model.isBestMAE ? 'text-emerald-400' : 'text-zinc-200'}>
                      {model.mae}
                    </span>
                    <span className="text-[10px] text-zinc-400 ml-0.5 font-normal">µg</span>
                  </div>
                </div>

                {/* R2 Score */}
                <div className="bg-zinc-900/90 rounded-xl p-2.5 border border-zinc-800/80 text-center">
                  <span className="text-[10px] font-mono text-zinc-400 block">R² Score</span>
                  <div className="font-mono text-base font-bold mt-0.5 text-zinc-100">
                    <span className={model.isBestR2 ? 'text-cyan-400' : 'text-zinc-200'}>
                      {model.r2}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-zinc-850 flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <span>{model.type}</span>
              {model.id === 'persistence' ? (
                <span className="text-zinc-400">Naïve Reference</span>
              ) : (
                <span className="text-emerald-400">Beats Baseline ✓</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-xs text-zinc-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-[11px] leading-relaxed">
          <span className="text-zinc-200 font-medium">Thesis Limitation & Findings: </span>
          Only 700 days were available in the integrated window. This sample is relatively small for deep learning sequence architectures, explaining why <b>Random Forest (RMSE 15.4)</b> and <b>XGBoost (RMSE 15.1)</b> closely match <b>LSTM (RMSE 14.8)</b> while requiring 1/3rd of the inference latency.
        </div>
      </div>
    </div>
  );
}
