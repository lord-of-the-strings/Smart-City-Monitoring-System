'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { GitCompare, TrendingDown, TrendingUp, Info } from 'lucide-react';
import { DELHI_CORRELATIONS, DELHI_DAILY_MASTER } from '@/lib/delhiData';

export default function MultiDomainCorrelationMatrix() {
  const [selectedPairIndex, setSelectedPairIndex] = useState(0);

  // Sample points for scatter view (140 points spaced across the 700 days)
  const scatterPoints = React.useMemo(() => {
    const sampled = DELHI_DAILY_MASTER.filter((_, idx) => idx % 5 === 0);
    return sampled.map(d => {
      let xVal = d.temp;
      let xLabel = 'Temperature (°C)';
      let xUnit = '°C';

      if (selectedPairIndex === 1) {
        xVal = d.windspeed;
        xLabel = 'Wind Speed (km/h)';
        xUnit = 'km/h';
      } else if (selectedPairIndex === 2) {
        xVal = d.demandMean;
        xLabel = 'Mean Demand (MW)';
        xUnit = 'MW';
      } else if (selectedPairIndex === 3) {
        xVal = d.humidity;
        xLabel = 'Relative Humidity (%)';
        xUnit = '%';
      } else if (selectedPairIndex === 4) {
        xVal = d.precip;
        xLabel = 'Precipitation (mm)';
        xUnit = 'mm';
      }

      return {
        x: xVal,
        y: d.pm25,
        date: d.date,
        season: d.season,
        xLabel,
        xUnit,
      };
    });
  }, [selectedPairIndex]);

  const currentPair = DELHI_CORRELATIONS[selectedPairIndex];

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <GitCompare className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-semibold text-zinc-100">
              Multi-Domain Empirical Correlation Matrix
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Statistical coupling across Air Quality, Weather, and Grid Power over 700 study days
          </p>
        </div>

        <div className="text-[11px] font-mono text-zinc-400 bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800">
          Pearson r Benchmarks
        </div>
      </div>

      {/* Correlation Cards Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {DELHI_CORRELATIONS.map((c, idx) => {
          const isSelected = selectedPairIndex === idx;
          const isNeg = c.r < 0;
          return (
            <button
              key={c.pair}
              type="button"
              onClick={() => setSelectedPairIndex(idx)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-purple-500/50 bg-zinc-800/90 shadow-md ring-1 ring-purple-500/40'
                  : 'border-zinc-800/80 bg-zinc-950/60 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-semibold truncate">{c.pair.split(' vs ')[0]}</span>
                <span
                  className={`font-mono text-xs font-bold ${
                    isNeg ? 'text-cyan-400' : 'text-amber-400'
                  }`}
                >
                  {c.r > 0 ? `+${c.r}` : c.r}
                </span>
              </div>
              <div className="text-[10px] text-zinc-400 font-mono mt-1">{c.strength}</div>
            </button>
          );
        })}
      </div>

      {/* Scatter plot of selected pair */}
      <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs pb-1">
          <div className="font-semibold text-zinc-200">
            Scatter Plot: {currentPair.pair} (Pearson r = {currentPair.r})
          </div>
          <div className="text-[11px] text-zinc-400 font-mono">
            N = 140 sampled days (2023 - 2024)
          </div>
        </div>

        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 15, right: 20, bottom: 15, left: -5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />

              <XAxis
                type="number"
                dataKey="x"
                name={scatterPoints[0]?.xLabel}
                stroke="#71717a"
                fontSize={11}
                fontFamily="monospace"
                unit={scatterPoints[0]?.xUnit}
              />

              <YAxis
                type="number"
                dataKey="y"
                name="PM2.5"
                stroke="#71717a"
                fontSize={11}
                fontFamily="monospace"
                unit=" µg"
                domain={[10, 220]}
              />

              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-zinc-900 border border-zinc-700/80 rounded-xl p-3 text-xs space-y-1 font-mono shadow-2xl">
                        <div className="text-zinc-200 font-semibold border-b border-zinc-800 pb-1">
                          Date: {item.date} ({item.season})
                        </div>
                        <div className="text-cyan-400">
                          {item.xLabel}: {item.x} {item.xUnit}
                        </div>
                        <div className="text-rose-400">
                          PM2.5: {item.y} µg/m³
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Scatter
                name="Daily Readings"
                data={scatterPoints}
                fill="#38bdf8"
                shape={(props: any) => {
                  const { cx, cy } = props;
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill="#38bdf8"
                      stroke="#090a0f"
                      strokeWidth={1}
                      opacity={0.8}
                    />
                  );
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Selected Pair Insight */}
        <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <span>{currentPair.insight}</span>
        </div>
      </div>
    </div>
  );
}
