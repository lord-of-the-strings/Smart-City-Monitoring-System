'use client';

import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend
} from 'recharts';
import { Cpu, Calendar, Flame, CheckCircle2, Square, CheckSquare } from 'lucide-react';
import { DELHI_TEST_PREDICTIONS } from '@/lib/delhiData';

interface PredictionChartProps {
  selectedModels: {
    lstm: boolean;
    xgboost: boolean;
    randomForest: boolean;
    persistence: boolean;
  };
  onToggleModel: (modelKey: 'lstm' | 'xgboost' | 'randomForest' | 'persistence') => void;
  showCI: boolean;
  onToggleCI: () => void;
}

export default function PredictionChart({
  selectedModels,
  onToggleModel,
  showCI,
  onToggleCI,
}: PredictionChartProps) {
  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header and Toggles */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Cpu className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-semibold text-zinc-100">
              Test Set Evaluation: Next-Day PM2.5 Prediction vs Ground Truth (105 Days)
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Hold-out chronological test partition: 17 Aug 2024 to 30 Nov 2024 (late monsoon to autumn stubble peak)
          </p>
        </div>

        {/* Model Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* LSTM */}
          <button
            type="button"
            onClick={() => onToggleModel('lstm')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs transition-all ${
              selectedModels.lstm
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-medium'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>LSTM (RMSE 14.8)</span>
            {selectedModels.lstm ? <CheckSquare className="w-3 h-3 text-cyan-400" /> : <Square className="w-3 h-3 text-zinc-400" />}
          </button>

          {/* XGBoost */}
          <button
            type="button"
            onClick={() => onToggleModel('xgboost')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs transition-all ${
              selectedModels.xgboost
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-medium'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>XGBoost (RMSE 15.1)</span>
            {selectedModels.xgboost ? <CheckSquare className="w-3 h-3 text-amber-400" /> : <Square className="w-3 h-3 text-zinc-400" />}
          </button>

          {/* Random Forest */}
          <button
            type="button"
            onClick={() => onToggleModel('randomForest')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs transition-all ${
              selectedModels.randomForest
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-medium'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Random Forest (RMSE 15.4)</span>
            {selectedModels.randomForest ? <CheckSquare className="w-3 h-3 text-purple-400" /> : <Square className="w-3 h-3 text-zinc-400" />}
          </button>

          {/* Persistence */}
          <button
            type="button"
            onClick={() => onToggleModel('persistence')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs transition-all ${
              selectedModels.persistence
                ? 'bg-zinc-800 text-zinc-200 border-zinc-700 font-medium'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-zinc-400" />
            <span>Persistence (RMSE 17.9)</span>
            {selectedModels.persistence ? <CheckSquare className="w-3 h-3 text-zinc-300" /> : <Square className="w-3 h-3 text-zinc-400" />}
          </button>

          {/* 95% CI */}
          <button
            type="button"
            onClick={onToggleCI}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-xs transition-all ${
              showCI
                ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300 font-medium'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>95% CI</span>
            {showCI ? <CheckSquare className="w-3 h-3 text-cyan-400" /> : <Square className="w-3 h-3 text-zinc-400" />}
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={DELHI_TEST_PREDICTIONS} margin={{ top: 15, right: 20, bottom: 5, left: -5 }}>
            <defs>
              <linearGradient id="predCI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.03} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />

            <XAxis
              dataKey="date"
              stroke="#71717a"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              axisLine={{ stroke: '#3f3f46' }}
              tickFormatter={(d: string) => d.slice(5)}
            />

            <YAxis
              stroke="#71717a"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              axisLine={{ stroke: '#3f3f46' }}
              domain={[10, 200]}
              unit=" µg"
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-zinc-900 border border-zinc-700/80 rounded-xl p-3.5 shadow-2xl text-xs space-y-2 max-w-xs font-mono">
                      <div className="flex justify-between items-center border-b border-zinc-800 pb-1">
                        <span className="font-semibold text-zinc-200">Date: {label}</span>
                        {item.stubbleSeason && (
                          <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30">
                            Stubble Season
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-zinc-100 font-bold">
                          <span className="font-sans text-zinc-300">Actual Target:</span>
                          <span>{item.actual} µg/m³</span>
                        </div>

                        {selectedModels.lstm && (
                          <div className="flex justify-between text-cyan-400">
                            <span className="font-sans">LSTM Prediction:</span>
                            <span>{item.lstm} µg/m³</span>
                          </div>
                        )}

                        {selectedModels.xgboost && (
                          <div className="flex justify-between text-amber-400">
                            <span className="font-sans">XGBoost (18 feat):</span>
                            <span>{item.xgboost} µg/m³</span>
                          </div>
                        )}

                        {selectedModels.randomForest && (
                          <div className="flex justify-between text-purple-400">
                            <span className="font-sans">Random Forest:</span>
                            <span>{item.randomForest} µg/m³</span>
                          </div>
                        )}

                        {selectedModels.persistence && (
                          <div className="flex justify-between text-zinc-400">
                            <span className="font-sans">Persistence:</span>
                            <span>{item.persistence} µg/m³</span>
                          </div>
                        )}
                      </div>

                      {showCI && (
                        <div className="pt-1.5 border-t border-zinc-800 text-[10px] text-cyan-300 flex justify-between">
                          <span>95% Confidence Band:</span>
                          <span>[{item.ciLower} – {item.ciUpper}]</span>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Stubble Burning Start Marker (1 Oct 2024) */}
            <ReferenceLine
              x="2024-10-01"
              stroke="#f43f5e"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: '▲ Stubble Burning Period (Oct–Nov)',
                fill: '#fb7185',
                fontSize: 10,
                position: 'top',
                offset: 8,
              }}
            />

            {/* NAAQS 60 µg/m³ Reference Line */}
            <ReferenceLine
              y={60}
              stroke="#10b981"
              strokeDasharray="3 3"
              strokeWidth={1}
              label={{
                value: 'NAAQS Standard: 60 µg/m³',
                fill: '#34d399',
                fontSize: 10,
                position: 'insideBottomLeft',
              }}
            />

            {/* 95% Confidence Interval Area Band */}
            {showCI && (
              <Area
                type="monotone"
                dataKey="ciUpper"
                stroke="none"
                fill="url(#predCI)"
                fillOpacity={0.4}
              />
            )}

            {/* Ground Truth Actual Line */}
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual Ground Truth"
              stroke="#ffffff"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#ffffff' }}
              activeDot={{ r: 5, fill: '#ffffff' }}
            />

            {/* LSTM Model Line */}
            {selectedModels.lstm && (
              <Line
                type="monotone"
                dataKey="lstm"
                name="LSTM Recurrent Sequence"
                stroke="#38bdf8"
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={{ r: 2.5, fill: '#38bdf8' }}
              />
            )}

            {/* XGBoost Line */}
            {selectedModels.xgboost && (
              <Line
                type="monotone"
                dataKey="xgboost"
                name="XGBoost"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 2.5, fill: '#f59e0b' }}
              />
            )}

            {/* Random Forest Line */}
            {selectedModels.randomForest && (
              <Line
                type="monotone"
                dataKey="randomForest"
                name="Random Forest"
                stroke="#c084fc"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                dot={{ r: 2, fill: '#c084fc' }}
              />
            )}

            {/* Persistence Benchmark Line */}
            {selectedModels.persistence && (
              <Line
                type="monotone"
                dataKey="persistence"
                name="Persistence Benchmark"
                stroke="#71717a"
                strokeWidth={1.5}
                strokeDasharray="2 2"
                dot={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-2 border-t border-zinc-800 text-xs text-zinc-400 flex flex-wrap items-center justify-between gap-3">
        <span>The test window captures the steep autumn escalation from ~20 µg/m³ in August up to 176 µg/m³ in November.</span>
        <span className="font-mono text-cyan-400">All 3 ML models outperform Persistence RMSE 17.9 µg/m³</span>
      </div>
    </div>
  );
}
