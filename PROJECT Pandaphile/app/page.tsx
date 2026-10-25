'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import AirQualityKpis from '@/components/delhi/AirQualityKpis';
import AqiCategoryDistribution from '@/components/delhi/AqiCategoryDistribution';
import TemporalAirQualityChart from '@/components/delhi/TemporalAirQualityChart';
import DailyMasterTable from '@/components/delhi/DailyMasterTable';
import EnergyTopMetrics from '@/components/delhi/EnergyTopMetrics';
import SeasonalEnergyChart from '@/components/delhi/SeasonalEnergyChart';
import DiurnalDemandChart from '@/components/delhi/DiurnalDemandChart';
import MultiDomainCorrelationMatrix from '@/components/delhi/MultiDomainCorrelationMatrix';
import PredictionChart from '@/components/delhi/PredictionChart';
import ModelScorecard from '@/components/delhi/ModelScorecard';
import ScenarioSandbox from '@/components/delhi/ScenarioSandbox';

import { TabView, TimeScope, DelhiDailyRecord } from '@/types/dashboard';
import { DELHI_DAILY_MASTER, DELHI_METADATA } from '@/lib/delhiData';
import { Calendar, ShieldCheck, Activity, MapPin, Database } from 'lucide-react';

export default function DelhiAnalyticsDashboard() {
  const [currentTab, setCurrentTab] = useState<TabView>('air-quality');
  const [timeScope, setTimeScope] = useState<TimeScope>('all-700d');
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // ML model selection state
  const [selectedModels, setSelectedModels] = useState({
    lstm: true,
    xgboost: true,
    randomForest: false,
    persistence: true,
  });
  const [showCI, setShowCI] = useState<boolean>(true);

  const toggleModel = (modelKey: 'lstm' | 'xgboost' | 'randomForest' | 'persistence') => {
    setSelectedModels(prev => ({ ...prev, [modelKey]: !prev[modelKey] }));
  };

  // Filtered dataset according to time scope
  const filteredRecords = useMemo(() => {
    let dataset = DELHI_DAILY_MASTER;

    if (timeScope === 'test-106d') {
      dataset = dataset.filter(r => r.date >= '2024-08-17');
    } else if (timeScope === 'stubble') {
      dataset = dataset.filter(r => r.stubbleSeason === 1);
    } else if (timeScope === 'summer-peak') {
      dataset = dataset.filter(r => r.season === 'Summer');
    }

    if (selectedCategory !== 'ALL') {
      dataset = dataset.filter(r => r.aqiCategory === selectedCategory);
    }

    return dataset;
  }, [timeScope, selectedCategory]);

  // Representative/Latest record for KPI display
  const latestRecord = DELHI_DAILY_MASTER[DELHI_DAILY_MASTER.length - 1];

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        timeScope={timeScope}
        onSelectTimeScope={setTimeScope}
        isStreaming={isStreaming}
        onToggleStreaming={() => setIsStreaming(!isStreaming)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      {/* Main Body Shell */}
      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Primary Content Workspace */}
        <main className="flex-1 p-4 lg:p-6 lg:max-w-[calc(100vw-18rem)] overflow-x-hidden space-y-6">
          {/* Top Operational Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Database className="w-4 h-4" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-200">
                    Integrated Study Dataset: Delhi Environmental & Energy Master
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    700 Days Complete
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 flex flex-wrap items-center gap-3 mt-0.5 font-mono">
                  <span>Window: 1 Jan 2023 – 30 Nov 2024</span>
                  <span>•</span>
                  <span>Filtered View: {filteredRecords.length} Days</span>
                  <span>•</span>
                  <span>All-Time Peak: 8,632 MW</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center text-xs font-mono">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Target: Next-Day PM2.5</span>
              </span>
              <span className="h-4 w-px bg-zinc-800" />
              <span className="text-emerald-400 font-semibold">
                RMSE: 14.8 µg/m³
              </span>
            </div>
          </div>

          {/* VIEW 1: AIR QUALITY & METEOROLOGY TELEMETRY */}
          {currentTab === 'air-quality' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Top KPIs */}
              <AirQualityKpis currentRecord={latestRecord} />

              {/* 700-day CPCB Category Distribution */}
              <AqiCategoryDistribution
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              {/* Temporal PM2.5 & PM10 Chart vs NAAQS 60/100 thresholds */}
              <TemporalAirQualityChart data={filteredRecords} />

              {/* Paginated 700-day master table */}
              <DailyMasterTable data={DELHI_DAILY_MASTER} />
            </div>
          )}

          {/* VIEW 2: ENERGY DEMAND & ENVIRONMENTAL CORRELATION */}
          {currentTab === 'energy-correlation' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Top Energy Metrics */}
              <EnergyTopMetrics
                currentMeanDemand={DELHI_METADATA.summary.demandMean}
                allTimePeakDemand={DELHI_METADATA.summary.demandPeakMax}
                peakLoadRatio={DELHI_METADATA.summary.peakLoadRatioMean}
                correlationCoeff={-0.28}
              />

              {/* Seasonal Divergence Bar/Line Chart */}
              <SeasonalEnergyChart />

              {/* High-Resolution 5-minute Diurnal Profile */}
              <DiurnalDemandChart />

              {/* Multi-Domain Correlation Matrix & Scatter Plot */}
              <MultiDomainCorrelationMatrix />
            </div>
          )}

          {/* VIEW 3: NEXT-DAY ML FORECASTING & SUSTAINABILITY ANALYTICS */}
          {currentTab === 'ml-prediction' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Test Set Prediction vs Ground Truth */}
              <PredictionChart
                selectedModels={selectedModels}
                onToggleModel={toggleModel}
                showCI={showCI}
                onToggleCI={() => setShowCI(!showCI)}
              />

              {/* Comparative Model Scorecard */}
              <ModelScorecard />

              {/* What-If Simulator & 18 Feature Importance */}
              <ScenarioSandbox />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
