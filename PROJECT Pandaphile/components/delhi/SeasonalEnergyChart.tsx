'use client';

import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { Layers, Zap, Wind, Info } from 'lucide-react';
import { DELHI_MONTHLY_STATS } from '@/lib/delhiData';

export default function SeasonalEnergyChart() {
  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Zap className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-semibold text-zinc-100">
              Seasonal Divergence: Grid Power Demand (MW) vs Particulate Pollution (PM2.5)
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            23-Month aggregate (Jan 2023 – Nov 2024) revealing the physical inverse seasonality mechanism
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" /> Mean Demand (MW)
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" /> Peak Demand (MW)
          </span>
          <span className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-3 h-0.5 bg-cyan-400 inline-block" /> PM2.5 (µg/m³)
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={DELHI_MONTHLY_STATS} margin={{ top: 20, right: 25, bottom: 5, left: -5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />

            <XAxis
              dataKey="month"
              stroke="#71717a"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              axisLine={{ stroke: '#3f3f46' }}
            />

            {/* Left Y Axis: Power Demand in MW */}
            <YAxis
              yAxisId="left"
              stroke="#fbbf24"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              axisLine={{ stroke: '#d97706' }}
              domain={[1500, 9000]}
              unit=" MW"
            />

            {/* Right Y Axis: PM2.5 in ug/m3 */}
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#38bdf8"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              axisLine={{ stroke: '#0284c7' }}
              domain={[0, 160]}
              unit=" µg"
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-zinc-900 border border-zinc-700/80 rounded-xl p-3.5 shadow-2xl text-xs space-y-2 max-w-xs font-mono">
                      <div className="text-zinc-200 font-semibold border-b border-zinc-800 pb-1">
                        Month: {label}
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-amber-400">
                          <span>Mean Demand:</span>
                          <span className="font-bold">{item.demandMean.toLocaleString()} MW</span>
                        </div>
                        <div className="flex justify-between text-rose-400">
                          <span>Peak Demand:</span>
                          <span className="font-bold">{item.demandPeak.toLocaleString()} MW</span>
                        </div>
                        <div className="flex justify-between text-cyan-400">
                          <span>Avg PM2.5:</span>
                          <span className="font-bold">{item.pm25} µg/m³</span>
                        </div>
                        <div className="flex justify-between text-zinc-300">
                          <span>Avg Temp:</span>
                          <span>{item.temp}°C</span>
                        </div>
                        <div className="flex justify-between text-emerald-400 pt-1 border-t border-zinc-800">
                          <span>Sustainability:</span>
                          <span className="font-bold">{item.sustainabilityScore}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Mean Demand Bar */}
            <Bar
              yAxisId="left"
              dataKey="demandMean"
              name="Mean Demand (MW)"
              fill="#f59e0b"
              opacity={0.8}
              radius={[4, 4, 0, 0]}
            />

            {/* Peak Demand Line */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="demandPeak"
              name="Peak Demand (MW)"
              stroke="#f43f5e"
              strokeWidth={2}
              dot={{ r: 3, fill: '#f43f5e' }}
            />

            {/* PM2.5 Line on Right Axis */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="pm25"
              name="Avg PM2.5 (µg/m³)"
              stroke="#38bdf8"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#38bdf8' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-xs text-zinc-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-[11px] leading-relaxed">
          <span className="text-zinc-200 font-medium">Core Thesis Finding: </span>
          Energy demand and PM2.5 are negatively correlated (r = -0.28) because they peak in opposite seasons. Demand peaks during the June summer heatwaves (June avg 4,860 MW, record 8,632 MW) due to intense air conditioning load. Conversely, PM2.5 peaks in November and January (averaging 109 to 121 µg/m³) due to winter thermal inversion and agricultural residue burning. The relationship is seasonal, not causal.
        </div>
      </div>
    </div>
  );
}
