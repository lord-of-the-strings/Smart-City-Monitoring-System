'use client';

import React, { useState, useMemo } from 'react';
import {
  Sliders,
  Sparkles,
  BarChart2,
  RotateCcw,
  Wind,
  Thermometer,
  Zap,
  Flame,
  Leaf,
  Info
} from 'lucide-react';
import { FEATURE_IMPORTANCE_LIST } from '@/lib/delhiData';

export default function ScenarioSandbox() {
  const [priorPM25, setPriorPM25] = useState<number>(85);
  const [temperature, setTemperature] = useState<number>(20);
  const [windSpeed, setWindSpeed] = useState<number>(12);
  const [powerDemandMW, setPowerDemandMW] = useState<number>(4200);
  const [isStubbleSeason, setIsStubbleSeason] = useState<boolean>(true);

  // Simulation calculations based on empirical coefficients from the thesis
  const simulation = useMemo(() => {
    // Temperature effect (negative corr: -0.60; lower temp = higher inversion)
    const tempFactor = (28 - temperature) * 1.8;
    // Wind effect (negative corr: -0.44; lower wind = stagnation)
    const windFactor = Math.max(-25, (14 - windSpeed) * 2.2);
    // Stubble season adds ~25 ug/m3 in Oct-Nov
    const stubbleAdd = isStubbleSeason ? 28 : 0;
    // Autoregressive component (autocorrelation 0.85)
    const predicted = Math.max(
      15.0,
      Math.min(240.0, Math.round((priorPM25 * 0.72 + tempFactor + windFactor + stubbleAdd + 12) * 10) / 10)
    );

    // AQI Category
    let category = 'Satisfactory';
    let catColor = 'text-green-400';
    let catBg = 'bg-green-500/10 border-green-500/30';
    if (predicted <= 30) {
      category = 'Good';
      catColor = 'text-emerald-400';
      catBg = 'bg-emerald-500/10 border-emerald-500/30';
    } else if (predicted <= 60) {
      category = 'Satisfactory';
      catColor = 'text-green-400';
      catBg = 'bg-green-500/10 border-green-500/30';
    } else if (predicted <= 90) {
      category = 'Moderate';
      catColor = 'text-yellow-400';
      catBg = 'bg-yellow-500/10 border-yellow-500/30';
    } else if (predicted <= 120) {
      category = 'Poor';
      catColor = 'text-orange-400';
      catBg = 'bg-orange-500/10 border-orange-500/30';
    } else {
      category = 'Very Poor';
      catColor = 'text-rose-400';
      catBg = 'bg-rose-500/10 border-rose-500/30';
    }

    // Sustainability score formula from thesis:
    // 100 - 100 * (0.50 * norm_PM2.5 + 0.30 * norm_demand + 0.20 * norm_weather_stress)
    // norm_PM2.5 = (PM2.5 - 15) / (214 - 15)
    // norm_demand = (demand - 2121) / (7361 - 2121)
    // weather_stress = |temp - 24| / (39.5 - 24)
    const normPM25 = Math.min(1.0, Math.max(0.0, (predicted - 15.3) / (214.0 - 15.3)));
    const normDemand = Math.min(1.0, Math.max(0.0, (powerDemandMW - 2121) / (7361 - 2121)));
    const weatherStress = Math.min(1.0, Math.max(0.0, Math.abs(temperature - 24) / 16.0));

    const sustScore = Math.max(
      10,
      Math.min(95, Math.round((100 - 100 * (0.5 * normPM25 + 0.3 * normDemand + 0.2 * weatherStress)) * 10) / 10)
    );

    return {
      predictedPM25: predicted,
      category,
      catColor,
      catBg,
      sustScore,
    };
  }, [priorPM25, temperature, windSpeed, powerDemandMW, isStubbleSeason]);

  const setPreset = (preset: 'winterSmog' | 'summerHeat' | 'monsoonClean') => {
    if (preset === 'winterSmog') {
      setPriorPM25(140);
      setTemperature(11);
      setWindSpeed(7);
      setPowerDemandMW(3400);
      setIsStubbleSeason(true);
    } else if (preset === 'summerHeat') {
      setPriorPM25(55);
      setTemperature(38);
      setWindSpeed(16);
      setPowerDemandMW(7200);
      setIsStubbleSeason(false);
    } else {
      setPriorPM25(25);
      setTemperature(26);
      setWindSpeed(22);
      setPowerDemandMW(4100);
      setIsStubbleSeason(false);
    }
  };

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Sliders className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-semibold text-zinc-100">
              Multi-Domain Scenario Sandbox & Sustainability Score Simulator
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Evaluate how weather stress, seasonal stubble fires, and power loads alter tomorrow’s air quality and sustainability
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
          <button
            type="button"
            onClick={() => setPreset('winterSmog')}
            className="px-2.5 py-1 rounded-lg text-rose-300 hover:bg-zinc-850 transition-colors"
          >
            Winter Smog Peak
          </button>
          <button
            type="button"
            onClick={() => setPreset('summerHeat')}
            className="px-2.5 py-1 rounded-lg text-amber-300 hover:bg-zinc-850 transition-colors"
          >
            Summer Heatwave
          </button>
          <button
            type="button"
            onClick={() => setPreset('monsoonClean')}
            className="px-2.5 py-1 rounded-lg text-emerald-300 hover:bg-zinc-850 transition-colors"
          >
            Monsoon Clean
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sliders on Left */}
        <div className="lg:col-span-6 space-y-4 bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-4">
          <div className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
            <span>Model Input Drivers</span>
            <button
              type="button"
              onClick={() => {
                setPriorPM25(85);
                setTemperature(20);
                setWindSpeed(12);
                setPowerDemandMW(4200);
                setIsStubbleSeason(true);
              }}
              className="text-[11px] font-mono text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Defaults
            </button>
          </div>

          {/* Slider 1: Prior Day PM2.5 */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-300 font-medium">Yesterday’s PM2.5 Baseline (Autocorrelation)</span>
              <span className="font-mono font-bold text-zinc-100">{priorPM25} µg/m³</span>
            </div>
            <input
              type="range"
              min="15"
              max="200"
              step="1"
              value={priorPM25}
              onChange={e => setPriorPM25(Number(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
              <span>15 µg (Clean)</span>
              <span>100 µg</span>
              <span>200 µg (Severe)</span>
            </div>
          </div>

          {/* Slider 2: Temperature */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-300 font-medium flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                Ambient Temperature
              </span>
              <span className="font-mono font-bold text-amber-400">{temperature} °C</span>
            </div>
            <input
              type="range"
              min="8"
              max="40"
              step="1"
              value={temperature}
              onChange={e => setTemperature(Number(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
              <span>8°C (Winter Inversion)</span>
              <span>24°C (Optimal)</span>
              <span>40°C (Heatwave)</span>
            </div>
          </div>

          {/* Slider 3: Wind Speed */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-300 font-medium flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                Wind Speed (Dispersion)
              </span>
              <span className="font-mono font-bold text-cyan-400">{windSpeed} km/h</span>
            </div>
            <input
              type="range"
              min="5"
              max="45"
              step="1"
              value={windSpeed}
              onChange={e => setWindSpeed(Number(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
              <span>5 km/h (Calm Smog)</span>
              <span>15 km/h (Avg)</span>
              <span>45 km/h (Strong)</span>
            </div>
          </div>

          {/* Slider 4: Mean Power Demand */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-300 font-medium flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                Grid Power Demand
              </span>
              <span className="font-mono font-bold text-emerald-400">{powerDemandMW.toLocaleString()} MW</span>
            </div>
            <input
              type="range"
              min="2100"
              max="7400"
              step="50"
              value={powerDemandMW}
              onChange={e => setPowerDemandMW(Number(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
              <span>2,121 MW (Baseload)</span>
              <span>4,188 MW (Avg)</span>
              <span>7,361 MW (Peak Summer)</span>
            </div>
          </div>

          {/* Toggle: Stubble Burning Season */}
          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
            <label className="text-xs text-zinc-300 font-medium flex items-center gap-2 cursor-pointer">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Stubble Burning Season (October – November)</span>
            </label>
            <input
              type="checkbox"
              checked={isStubbleSeason}
              onChange={e => setIsStubbleSeason(e.target.checked)}
              className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-rose-500 focus:ring-rose-500/30"
            />
          </div>
        </div>

        {/* Results on Right */}
        <div className="lg:col-span-6 space-y-4">
          {/* Simulated Outcome Card */}
          <div className={`p-4 rounded-xl border ${simulation.catBg} transition-all`}>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                  ML Next-Day Predicted Outcome
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${simulation.catColor} border ${simulation.catBg}`}>
                {simulation.category}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 my-3">
              <div>
                <span className="text-[10px] text-zinc-400 block font-mono">Next-Day PM2.5 Forecast</span>
                <span className="text-2xl font-bold font-mono text-zinc-100">
                  {simulation.predictedPM25}
                </span>
                <span className="text-[10px] text-zinc-400 block">µg/m³ (NAAQS: 60)</span>
              </div>

              <div>
                <span className="text-[10px] text-zinc-400 block font-mono">Sustainability Score</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">
                  {simulation.sustScore}
                </span>
                <span className="text-[10px] text-zinc-400 block">/ 100 (Mean: 67.8)</span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 pt-2 border-t border-zinc-800/60 leading-relaxed">
              {simulation.sustScore < 50
                ? 'High multi-domain environmental stress. Low temperature and calm winds create severe trapping of particulates.'
                : simulation.sustScore < 75
                ? 'Moderate sustainability score. Conditions are close to Delhi’s 700-day historical mean.'
                : 'Optimal environmental index. High dispersion winds and moderate temperature create clean air shed conditions.'}
            </p>
          </div>

          {/* 18 Features Importance SHAP ranking */}
          <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-zinc-300 font-semibold pb-1 border-b border-zinc-800">
              <span className="flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
                18-Feature Relative Importance (SHAP Weights)
              </span>
              <span className="font-mono text-[10px] text-zinc-400">Normalized %</span>
            </div>

            <div className="space-y-1.5 pt-1">
              {FEATURE_IMPORTANCE_LIST.slice(0, 6).map(f => (
                <div key={f.feature} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-400 truncate max-w-[220px]">{f.feature}</span>
                    <span className="font-mono text-zinc-200">{f.importance}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${f.importance}%`, backgroundColor: f.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
