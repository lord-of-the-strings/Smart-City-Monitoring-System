'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  Legend
} from 'recharts';
import { TrendingUp, AlertCircle, Calendar, Wind, Thermometer } from 'lucide-react';
import { DelhiDailyRecord } from '@/types/dashboard';

interface TemporalAirQualityChartProps {
  data: DelhiDailyRecord[];
}

export default function TemporalAirQualityChart({ data }: TemporalAirQualityChartProps) {
  const [visibleSeries, setVisibleSeries] = useState({
    pm25: true,
    pm10: true,
    temp: false,
    windspeed: false,
  });

  const toggleSeries = (key: keyof typeof visibleSeries) => {
    setVisibleSeries(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Sample data to 100-150 points for super smooth chart rendering if 700 points
  const displayData = React.useMemo(() => {
    if (data.length <= 120) return data;
    const step = Math.ceil(data.length / 100);
    return data.filter((_, idx) => idx % step === 0 || idx === data.length - 1);
  }, [data]);

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header and Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-semibold text-zinc-100">
              Temporal Air Quality & Meteorology Trajectory (2023 - 2024)
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Observing winter inversion surges, monsoon washouts, and NAAQS regulatory compliance
          </p>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
          <button
            type="button"
            onClick={() => toggleSeries('pm25')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
              visibleSeries.pm25
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-medium'
                : 'text-zinc-400 hover:text-zinc-200 opacity-60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>PM2.5 (Std: 60)</span>
          </button>

          <button
            type="button"
            onClick={() => toggleSeries('pm10')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
              visibleSeries.pm10
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                : 'text-zinc-400 hover:text-zinc-200 opacity-60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>PM10 (Std: 100)</span>
          </button>

          <button
            type="button"
            onClick={() => toggleSeries('temp')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
              visibleSeries.temp
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium'
                : 'text-zinc-400 hover:text-zinc-200 opacity-60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Temp (°C)</span>
          </button>

          <button
            type="button"
            onClick={() => toggleSeries('windspeed')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
              visibleSeries.windspeed
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-medium'
                : 'text-zinc-400 hover:text-zinc-200 opacity-60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Wind (km/h)</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={displayData} margin={{ top: 15, right: 20, bottom: 5, left: -10 }}>
            <defs>
              <linearGradient id="delhiPM25" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
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
              tickFormatter={(val: string) => val.slice(2, 7)}
            />

            <YAxis
              stroke="#71717a"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              axisLine={{ stroke: '#3f3f46' }}
              domain={[0, 'auto']}
              unit=" µg"
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as DelhiDailyRecord;
                  return (
                    <div className="bg-zinc-900 border border-zinc-700/80 rounded-xl p-3 shadow-2xl text-xs space-y-2 max-w-xs">
                      <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
                        <span className="font-mono font-semibold text-zinc-200">
                          {item.date}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          {item.season} {item.stubbleSeason === 1 ? '• Stubble' : ''}
                        </span>
                      </div>

                      <div className="space-y-1 font-mono">
                        {visibleSeries.pm25 && (
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400">PM2.5:</span>
                            <span className="font-bold text-rose-400">
                              {item.pm25} µg/m³
                            </span>
                          </div>
                        )}
                        {visibleSeries.pm10 && (
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400">PM10:</span>
                            <span className="font-bold text-amber-400">
                              {item.pm10} µg/m³
                            </span>
                          </div>
                        )}
                        {visibleSeries.temp && (
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400">Temp:</span>
                            <span className="font-bold text-cyan-400">
                              {item.temp} °C
                            </span>
                          </div>
                        )}
                        {visibleSeries.windspeed && (
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400">Wind:</span>
                            <span className="font-bold text-purple-400">
                              {item.windspeed} km/h
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="pt-1.5 border-t border-zinc-800 text-[10px] text-zinc-400 flex justify-between">
                        <span>Sustainability Score:</span>
                        <span className="font-mono text-emerald-400 font-bold">{item.sustainabilityScore}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* NAAQS Standard Reference Line 60 */}
            {visibleSeries.pm25 && (
              <ReferenceLine
                y={60}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: 'NAAQS PM2.5 (60 µg/m³)',
                  fill: '#fb7185',
                  fontSize: 10,
                  position: 'insideTopLeft',
                  offset: 8,
                }}
              />
            )}

            {/* NAAQS Standard Reference Line 100 */}
            {visibleSeries.pm10 && (
              <ReferenceLine
                y={100}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: 'NAAQS PM10 (100 µg/m³)',
                  fill: '#fbbf24',
                  fontSize: 10,
                  position: 'insideTopLeft',
                  offset: 24,
                }}
              />
            )}

            {/* PM2.5 Area & Line */}
            {visibleSeries.pm25 && (
              <>
                <Area
                  type="monotone"
                  dataKey="pm25"
                  stroke="none"
                  fill="url(#delhiPM25)"
                />
                <Line
                  type="monotone"
                  dataKey="pm25"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  dot={false}
                />
              </>
            )}

            {/* PM10 Line */}
            {visibleSeries.pm10 && (
              <Line
                type="monotone"
                dataKey="pm10"
                stroke="#f59e0b"
                strokeWidth={1.5}
                dot={false}
              />
            )}

            {/* Temp Line */}
            {visibleSeries.temp && (
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#06b6d4"
                strokeWidth={1.5}
                dot={false}
              />
            )}

            {/* Wind Line */}
            {visibleSeries.windspeed && (
              <Line
                type="monotone"
                dataKey="windspeed"
                stroke="#a855f7"
                strokeWidth={1.5}
                dot={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer insight */}
      <div className="pt-2 border-t border-zinc-800 text-xs text-zinc-400 flex flex-wrap items-center justify-between gap-3">
        <span className="flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Noticeable seasonal trough during monsoon (July-Sept avg ~44-49 µg/m³) vs winter peak (Jan avg ~121 µg/m³).</span>
        </span>
        <span className="font-mono text-zinc-300">Auto-Correlation: 0.85</span>
      </div>
    </div>
  );
}
