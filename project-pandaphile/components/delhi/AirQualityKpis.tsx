'use client';

import React from 'react';
import {
  Wind,
  Gauge,
  Thermometer,
  CloudRain,
  Compass,
  Activity,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { DelhiDailyRecord } from '@/types/dashboard';

interface AirQualityKpisProps {
  currentRecord: DelhiDailyRecord;
  avgPM25?: number;
}

export default function AirQualityKpis({ currentRecord, avgPM25 = 64.5 }: AirQualityKpisProps) {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Good':
        return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
      case 'Satisfactory':
        return { text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' };
      case 'Moderate':
        return { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' };
      case 'Poor':
        return { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' };
      case 'Very Poor':
        return { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' };
      default:
        return { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' };
    }
  };

  const aqiStyle = getCategoryColor(currentRecord.aqiCategory);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {/* 1. PM2.5 */}
      <div className={`bg-zinc-900/80 border rounded-2xl p-4 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-sm ${aqiStyle.border}`}>
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-zinc-400 font-medium">Daily PM2.5</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${aqiStyle.text} ${aqiStyle.bg} border ${aqiStyle.border}`}>
              {currentRecord.aqiCategory}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${aqiStyle.text}`}>
              {currentRecord.pm25}
            </span>
            <span className="text-xs font-mono text-zinc-400">µg/m³</span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-zinc-800/80 text-[10px] text-zinc-400 flex items-center justify-between">
          <span>NAAQS Standard: 60</span>
          <span className="font-mono text-zinc-300">
            {currentRecord.pm25 > 60 ? `+${(currentRecord.pm25 - 60).toFixed(1)} over` : 'Compliant'}
          </span>
        </div>
      </div>

      {/* 2. PM10 */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-sm">
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-zinc-400 font-medium">Respirable PM10</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              Limit: 100
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-100">
              {currentRecord.pm10}
            </span>
            <span className="text-xs font-mono text-zinc-400">µg/m³</span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-zinc-800/80 text-[10px] text-zinc-400 flex items-center justify-between">
          <span>Ratio PM2.5/PM10</span>
          <span className="font-mono text-zinc-300">
            {((currentRecord.pm25 / (currentRecord.pm10 || 1)) * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* 3. Sustainability Score */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-sm">
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-zinc-400 font-medium">Sustainability Index</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              0 - 100
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {currentRecord.sustainabilityScore}
            </span>
            <span className="text-xs font-mono text-zinc-400">/ 100</span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-zinc-800/80 text-[10px] text-zinc-400 flex items-center justify-between">
          <span>Study Mean: 67.8</span>
          <span className="font-mono text-emerald-400">
            {currentRecord.sustainabilityScore >= 67.8 ? 'Above Avg' : 'Stressed'}
          </span>
        </div>
      </div>

      {/* 4. Ambient Temperature */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-sm">
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-zinc-400 font-medium">Temperature & RH</span>
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-zinc-100">
              {currentRecord.temp}°C
            </span>
            <span className="text-xs font-mono text-zinc-400">/ {currentRecord.humidity}%</span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-zinc-800/80 text-[10px] text-zinc-400 flex items-center justify-between">
          <span>Corr with PM2.5</span>
          <span className="font-mono text-rose-400 font-medium">r = -0.60</span>
        </div>
      </div>

      {/* 5. Wind Speed */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-sm">
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-zinc-400 font-medium">Wind Dispersion</span>
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-cyan-400">
              {currentRecord.windspeed}
            </span>
            <span className="text-xs font-mono text-zinc-400">km/h</span>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-zinc-800/80 text-[10px] text-zinc-400 flex items-center justify-between">
          <span>Sea-level Pressure</span>
          <span className="font-mono text-zinc-300">{currentRecord.pressure} hPa</span>
        </div>
      </div>

      {/* 6. Trace Gases / Stubble Season */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-sm">
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-zinc-400 font-medium">Trace Gases & Season</span>
            {currentRecord.stubbleSeason === 1 ? (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                Stubble Season
              </span>
            ) : (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                {currentRecord.season}
              </span>
            )}
          </div>

          <div className="text-xs font-mono space-y-0.5 text-zinc-300">
            <div className="flex justify-between">
              <span className="text-zinc-400">NO₂:</span>
              <span className="font-semibold">{currentRecord.no2} µg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">CO:</span>
              <span className="font-semibold">{currentRecord.co} µg</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-zinc-800/80 text-[10px] text-zinc-400 flex items-center justify-between">
          <span>SO₂: {currentRecord.so2}</span>
          <span>O₃: {currentRecord.o3}</span>
        </div>
      </div>
    </div>
  );
}
