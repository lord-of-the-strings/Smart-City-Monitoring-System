'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';
import { Clock, Zap, Sun, Snowflake } from 'lucide-react';
import { DELHI_DIURNAL_CURVES } from '@/lib/delhiData';

export default function DiurnalDemandChart() {
  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Clock className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-semibold text-zinc-100">
              High-Resolution Diurnal 5-Minute Load Profile (Delhi Power Grid)
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            24-Hour diurnal curve comparing Summer All-Time Record Heatwave (19 June 2024) vs Winter Cold Baseline (15 Jan 2024)
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-rose-400">
            <Sun className="w-3.5 h-3.5" /> 19 June 2024 (Summer Peak: 8,632 MW)
          </span>
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Snowflake className="w-3.5 h-3.5" /> 15 Jan 2024 (Winter Cold: ~3,200 MW)
          </span>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={DELHI_DIURNAL_CURVES} margin={{ top: 15, right: 20, bottom: 5, left: -5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />

            <XAxis
              dataKey="time"
              stroke="#71717a"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              axisLine={{ stroke: '#3f3f46' }}
            />

            <YAxis
              stroke="#71717a"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              axisLine={{ stroke: '#3f3f46' }}
              domain={[2000, 9000]}
              unit=" MW"
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-zinc-900 border border-zinc-700/80 rounded-xl p-3 shadow-2xl text-xs space-y-2 font-mono">
                      <div className="text-zinc-200 font-semibold border-b border-zinc-800 pb-1">
                        Time: {label} IST
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-rose-400">
                          <span>Summer Heatwave:</span>
                          <span className="font-bold">{item.summerDemand.toLocaleString()} MW</span>
                        </div>
                        <div className="flex justify-between text-cyan-400">
                          <span>Winter Cold:</span>
                          <span className="font-bold">{item.winterDemand.toLocaleString()} MW</span>
                        </div>
                        <div className="flex justify-between text-amber-300 pt-1 border-t border-zinc-800 text-[10px]">
                          <span>Delta (Cooling Surge):</span>
                          <span>+{(item.summerDemand - item.winterDemand).toLocaleString()} MW</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Summer Peak Line */}
            <Line
              type="monotone"
              dataKey="summerDemand"
              name="Summer Peak (19 June 2024)"
              stroke="#f43f5e"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#f43f5e' }}
            />

            {/* Winter Baseline Line */}
            <Line
              type="monotone"
              dataKey="winterDemand"
              name="Winter Baseline (15 Jan 2024)"
              stroke="#06b6d4"
              strokeWidth={2}
              strokeDasharray="4 3"
              dot={false}
              activeDot={{ r: 5, fill: '#06b6d4' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-2 border-t border-zinc-800 text-xs text-zinc-400 flex flex-wrap items-center justify-between gap-3">
        <span>Diurnal shape shows night trough near 04:00 AM (~5,900 MW in summer, ~2,000 MW in winter) followed by steady daytime and evening cooling ramps.</span>
        <span className="font-mono text-zinc-300">Coverage Rule: &ge;80% 5-min intervals</span>
      </div>
    </div>
  );
}
