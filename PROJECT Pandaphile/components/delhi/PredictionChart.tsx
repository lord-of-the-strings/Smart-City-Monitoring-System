'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend
} from 'recharts';
import { Cpu, Calendar, Flame, CheckCircle2, Square, CheckSquare, Sparkles, AlertTriangle } from 'lucide-react';
import { NOTEBOOK_DAILY_PREDICTIONS, NotebookPredictionPoint } from '@/lib/notebookModelData';

interface PredictionChartProps {
  selectedModels: {
    randomForest: boolean;
    lstm: boolean;
    ridge: boolean;
    persistence: boolean;
  };
  onToggleModel: (modelKey: 'randomForest' | 'lstm' | 'ridge' | 'persistence') => void;
  showErrorBars: boolean;
  onToggleErrorBars: () => void;
}

export default function PredictionChart({
  selectedModels,
  onToggleModel,
  showErrorBars,
  onToggleErrorBars,
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
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <span>Notebook ML Model Predictions: Test Set (105 Days)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                SmartCity.ipynb Outputs
              </span>
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Hold-out chronological test partition (18 Aug 2024 to 30 Nov 2024): Actual Next-Day PM2.5 vs Notebook Forecasts
          </p>
        </div>

        {/* Model Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Random Forest */}
          <button
            type="button"
            onClick={() => onToggleModel('randomForest')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs transition-all ${
              selectedModels.randomForest
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-medium'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Random Forest (RMSE 17.18)</span>
            {selectedModels.randomForest ? <CheckSquare className="w-3 h-3 text-blue-400" /> : <Square className="w-3 h-3 text-zinc-400" />}
          </button>

          {/* Ridge */}
          <button
            type="button"
            onClick={() => onToggleModel('ridge')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs transition-all ${
              selectedModels.ridge
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-medium'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Ridge (RMSE 17.43)</span>
            {selectedModels.ridge ? <CheckSquare className="w-3 h-3 text-cyan-400" /> : <Square className="w-3 h-3 text-zinc-400" />}
          </button>

          {/* LSTM */}
          <button
            type="button"
            onClick={() => onToggleModel('lstm')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs transition-all ${
              selectedModels.lstm
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-medium'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>LSTM (RMSE 17.66)</span>
            {selectedModels.lstm ? <CheckSquare className="w-3 h-3 text-emerald-400" /> : <Square className="w-3 h-3 text-zinc-400" />}
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
            <span>Persistence (RMSE 17.94)</span>
            {selectedModels.persistence ? <CheckSquare className="w-3 h-3 text-zinc-300" /> : <Square className="w-3 h-3 text-zinc-400" />}
          </button>

          {/* Residual Error Delta Bars */}
          <button
            type="button"
            onClick={onToggleErrorBars}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs transition-all ${
              showErrorBars
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-medium'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Residual |Error|</span>
            {showErrorBars ? <CheckSquare className="w-3 h-3 text-rose-400" /> : <Square className="w-3 h-3 text-zinc-400" />}
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[380px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={NOTEBOOK_DAILY_PREDICTIONS} margin={{ top: 15, right: 20, bottom: 5, left: -5 }}>
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
                  const item = payload[0].payload as NotebookPredictionPoint;
                  return (
                    <div className="bg-zinc-900 border border-zinc-700/80 rounded-xl p-3.5 shadow-2xl text-xs space-y-2 max-w-xs font-mono">
                      <div className="flex justify-between items-center border-b border-zinc-800 pb-1">
                        <span className="font-semibold text-zinc-200">Date: {label} (Day #{item.testDay})</span>
                        {item.stubbleSeason && (
                          <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30">
                            Stubble Season
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-zinc-100 font-bold">
                          <span className="font-sans text-zinc-300">Actual Ground Truth:</span>
                          <span>{item.actual} µg/m³</span>
                        </div>

                        {selectedModels.randomForest && (
                          <div className="flex justify-between text-blue-400">
                            <span className="font-sans">Random Forest (300 est):</span>
                            <span>{item.randomForest} µg/m³</span>
                          </div>
                        )}

                        {selectedModels.ridge && (
                          <div className="flex justify-between text-cyan-400">
                            <span className="font-sans">Ridge (alpha=100):</span>
                            <span>{item.ridge} µg/m³</span>
                          </div>
                        )}

                        {selectedModels.lstm && (
                          <div className="flex justify-between text-emerald-400">
                            <span className="font-sans">LSTM (5-seed avg):</span>
                            <span>{item.lstm} µg/m³</span>
                          </div>
                        )}

                        {selectedModels.persistence && (
                          <div className="flex justify-between text-zinc-400">
                            <span className="font-sans">Persistence (Today):</span>
                            <span>{item.persistence} µg/m³</span>
                          </div>
                        )}
                      </div>

                      {showErrorBars && (
                        <div className="pt-1.5 border-t border-zinc-800 text-[10px] text-zinc-300 flex justify-between">
                          <span>RF Error: <span className="text-rose-400 font-bold">{item.rfError} µg</span></span>
                          <span>LSTM Error: <span className="text-amber-400 font-bold">{item.lstmError} µg</span></span>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* October 1st Stubble Season marker */}
            <ReferenceLine
              x="2024-10-01"
              stroke="#f43f5e"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: '▲ Stubble Burning (Oct–Nov)',
                fill: '#fb7185',
                fontSize: 10,
                position: 'top',
                offset: 8,
              }}
            />

            {/* NAAQS 60 µg/m³ Reference Line */}
            <ReferenceLine
              y={60}
              stroke="#22c55e"
              strokeDasharray="3 3"
              strokeWidth={1}
              label={{
                value: 'NAAQS Standard: 60 µg/m³',
                fill: '#4ade80',
                fontSize: 10,
                position: 'insideBottomLeft',
              }}
            />

            {/* Residual error bars if toggled */}
            {showErrorBars && (
              <Bar
                dataKey="rfError"
                name="RF Absolute Error"
                fill="#f43f5e"
                opacity={0.3}
              />
            )}

            {/* Actual Ground Truth (Solid Line) */}
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual Next-Day PM2.5"
              stroke="#ffffff"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#ffffff' }}
              activeDot={{ r: 5, fill: '#ffffff' }}
            />

            {/* Random Forest Line (Top Performer) */}
            {selectedModels.randomForest && (
              <Line
                type="monotone"
                dataKey="randomForest"
                name="Random Forest (RMSE 17.18)"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 2, fill: '#3b82f6' }}
              />
            )}

            {/* Ridge Line */}
            {selectedModels.ridge && (
              <Line
                type="monotone"
                dataKey="ridge"
                name="Ridge (RMSE 17.43)"
                stroke="#06b6d4"
                strokeWidth={1.8}
                strokeDasharray="4 3"
                dot={false}
              />
            )}

            {/* LSTM Model Line */}
            {selectedModels.lstm && (
              <Line
                type="monotone"
                dataKey="lstm"
                name="LSTM (RMSE 17.66)"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={{ r: 2, fill: '#10b981' }}
              />
            )}

            {/* Persistence Benchmark Line */}
            {selectedModels.persistence && (
              <Line
                type="monotone"
                dataKey="persistence"
                name="Persistence (RMSE 17.94)"
                stroke="#71717a"
                strokeWidth={1.5}
                strokeDasharray="2 2"
                dot={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Notes */}
      <div className="pt-2 border-t border-zinc-800 text-xs text-zinc-400 flex flex-wrap items-center justify-between gap-3">
        <span className="flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span>Post-monsoon surge: PM2.5 jumps from 30.4 µg/m³ (19 Aug) to 176.2 µg/m³ (18 Nov). Random Forest tracked the trajectory with lowest overall error.</span>
        </span>
        <span className="font-mono text-cyan-400">All ML models beat Persistence (RMSE 17.937)</span>
      </div>
    </div>
  );
}
