'use client';

import React, { useState } from 'react';
import { Award, Zap, CheckCircle2, Info, Layers, BarChart2, Image as ImageIcon } from 'lucide-react';
import { NOTEBOOK_MODEL_METRICS, NOTEBOOK_ABLATION_STUDY } from '@/lib/notebookModelData';

export default function ModelScorecard() {
  const [activeTab, setActiveTab] = useState<'models' | 'ablation' | 'plots'>('models');

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Award className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <span>SmartCity.ipynb Model Validation Benchmarks & Ablation</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Exact Notebook Outputs
              </span>
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Evaluated on hold-out chronological test windows (N = 105 days, 18 Aug – 30 Nov 2024)
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('models')}
            className={`px-3 py-1 rounded-lg transition-colors font-medium ${
              activeTab === 'models'
                ? 'bg-zinc-800 text-emerald-300 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Model Leaderboard
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ablation')}
            className={`px-3 py-1 rounded-lg transition-colors font-medium ${
              activeTab === 'ablation'
                ? 'bg-zinc-800 text-emerald-300 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Feature Ablation Study
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('plots')}
            className={`px-3 py-1 rounded-lg transition-colors font-medium ${
              activeTab === 'plots'
                ? 'bg-zinc-800 text-emerald-300 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Notebook Plots
          </button>
        </div>
      </div>

      {/* TAB 1: MODEL LEADERBOARD */}
      {activeTab === 'models' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {NOTEBOOK_MODEL_METRICS.map(model => {
              const isBest = model.model === 'Random Forest';
              return (
                <div
                  key={model.model}
                  className={`relative bg-zinc-950/80 border rounded-2xl p-4 flex flex-col justify-between transition-all hover:border-zinc-700 ${
                    isBest
                      ? 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/30'
                      : 'border-zinc-800/80'
                  }`}
                >
                  {isBest && (
                    <span className="absolute -top-2.5 right-4 bg-blue-500 text-zinc-950 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full shadow">
                      ★ TOP ACCURACY
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-semibold text-zinc-400">
                        {model.rank}
                      </span>
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: model.color }}
                      />
                    </div>

                    <h4 className="text-sm font-bold text-zinc-100 mt-1">{model.model}</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                      {model.type}
                    </p>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-zinc-850">
                      {/* RMSE */}
                      <div className="bg-zinc-900/90 rounded-xl p-2.5 border border-zinc-800/80 text-center">
                        <span className="text-[10px] font-mono text-zinc-400 block">RMSE</span>
                        <div className="font-mono text-base font-bold mt-0.5 text-zinc-100">
                          <span className={isBest ? 'text-blue-400' : 'text-zinc-200'}>
                            {model.rmse}
                          </span>
                        </div>
                      </div>

                      {/* MAE */}
                      <div className="bg-zinc-900/90 rounded-xl p-2.5 border border-zinc-800/80 text-center">
                        <span className="text-[10px] font-mono text-zinc-400 block">MAE</span>
                        <div className="font-mono text-base font-bold mt-0.5 text-zinc-100">
                          <span className={isBest ? 'text-emerald-400' : 'text-zinc-200'}>
                            {model.mae}
                          </span>
                        </div>
                      </div>

                      {/* R2 Score */}
                      <div className="bg-zinc-900/90 rounded-xl p-2.5 border border-zinc-800/80 text-center">
                        <span className="text-[10px] font-mono text-zinc-400 block">R² Score</span>
                        <div className="font-mono text-base font-bold mt-0.5 text-zinc-100">
                          <span className={isBest ? 'text-blue-400' : 'text-zinc-200'}>
                            {model.r2}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-zinc-850 text-[10px] text-zinc-400 leading-tight">
                    {model.notes}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-xs text-zinc-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <span className="text-zinc-200 font-medium">Notebook Key Finding: </span>
              <b>Random Forest (RMSE 17.185, R² 0.780)</b> beats <b>LSTM (RMSE 17.659, R² 0.768)</b> and <b>Ridge (RMSE 17.433)</b>. For sample size N=700, tree ensembles capture non-linear interactions across pollutants without overfitting compared to deep recurrent networks.
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ABLATION STUDY (Cell 8) */}
      {activeTab === 'ablation' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/60">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 font-mono text-[11px]">
                  <th className="py-3 px-3.5">Feature Configuration</th>
                  <th className="py-3 px-3.5">Omitted Variables</th>
                  <th className="py-3 px-3.5 text-right">RMSE (µg/m³)</th>
                  <th className="py-3 px-3.5 text-right">MAE (µg/m³)</th>
                  <th className="py-3 px-3.5 text-right">R² Score</th>
                  <th className="py-3 px-3.5">Research Finding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-sans">
                {NOTEBOOK_ABLATION_STUDY.map(row => (
                  <tr
                    key={row.group}
                    className={`hover:bg-zinc-900/50 transition-colors ${
                      row.isBest ? 'bg-emerald-500/5' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3.5 font-semibold text-zinc-200 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {row.isBest && (
                          <span className="px-1.5 py-0.2 text-[9px] font-mono bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/40">
                            BEST
                          </span>
                        )}
                        <span>{row.group}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-zinc-400 font-mono text-[11px]">
                      {row.description}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono font-bold whitespace-nowrap">
                      <span className={row.isBest ? 'text-emerald-400' : 'text-zinc-200'}>
                        {row.rmse}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono font-bold whitespace-nowrap">
                      <span className={row.isBest ? 'text-emerald-400' : 'text-zinc-200'}>
                        {row.mae}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono font-bold whitespace-nowrap">
                      <span className={row.isBest ? 'text-emerald-400' : 'text-zinc-200'}>
                        {row.r2}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-zinc-300 text-[11px] leading-tight">
                      {row.impact}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-xs text-zinc-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <span className="text-zinc-200 font-medium">Ablation Insight: </span>
              In Cell 8 of <code>SmartCity.ipynb</code>, removing energy, weather, and other pollutants improved model test score to <b>RMSE 16.873 and R² 0.788</b> on lagged PM2.5 alone. This proves that high day-to-day autocorrelation (0.85) drives immediate next-day PM2.5, whereas energy demand operates on seasonal timescales.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NOTEBOOK PLOTS (Cell 7 outputs) */}
      {activeTab === 'plots' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Plot 1: LSTM Training Curve */}
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-zinc-800">
                <span className="font-semibold text-zinc-200">
                  LSTM Loss Curve (Cell 7 Output)
                </span>
                <span className="text-[10px] font-mono text-zinc-400">loss_curve.png</span>
              </div>
              <div className="rounded-lg overflow-hidden border border-zinc-800 bg-white p-1">
                <img
                  src="/loss_curve.png"
                  alt="LSTM Training Loss Curve"
                  className="w-full h-auto object-contain max-h-[300px]"
                />
              </div>
              <p className="text-[11px] text-zinc-400 pt-1">
                Training vs validation MSE loss across epochs with early stopping and learning rate reduction on plateau.
              </p>
            </div>

            {/* Plot 2: Actual vs Predicted */}
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-zinc-800">
                <span className="font-semibold text-zinc-200">
                  Predicted vs Actual (Cell 7 Output)
                </span>
                <span className="text-[10px] font-mono text-zinc-400">predicted_vs_actual.png</span>
              </div>
              <div className="rounded-lg overflow-hidden border border-zinc-800 bg-white p-1">
                <img
                  src="/predicted_vs_actual.png"
                  alt="Predicted vs Actual"
                  className="w-full h-auto object-contain max-h-[300px]"
                />
              </div>
              <p className="text-[11px] text-zinc-400 pt-1">
                Direct plot from the notebook: Actual ground truth (blue) vs LSTM (orange) vs Persistence baseline (green).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
