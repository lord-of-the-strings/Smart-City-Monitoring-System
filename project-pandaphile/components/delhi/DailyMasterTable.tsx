'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  Flame,
  Leaf
} from 'lucide-react';
import { DelhiDailyRecord } from '@/types/dashboard';
import { downloadCSV } from '@/lib/utils';

interface DailyMasterTableProps {
  data: DelhiDailyRecord[];
}

type SortField = 'date' | 'pm25' | 'pm10' | 'temp' | 'windspeed' | 'demandMean' | 'demandPeak' | 'sustainabilityScore';
type SortOrder = 'asc' | 'desc';

export default function DailyMasterTable({ data }: DailyMasterTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [stubbleOnly, setStubbleOnly] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredData = useMemo(() => {
    return data
      .filter(item => {
        const matchesSearch =
          searchQuery === '' ||
          item.date.includes(searchQuery) ||
          item.aqiCategory.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSeason = selectedSeason === 'ALL' || item.season === selectedSeason;
        const matchesCategory = selectedCategory === 'ALL' || item.aqiCategory === selectedCategory;
        const matchesStubble = !stubbleOnly || item.stubbleSeason === 1;

        return matchesSearch && matchesSeason && matchesCategory && matchesStubble;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string') {
          return sortOrder === 'asc'
            ? (valA as string).localeCompare(valB as string)
            : (valB as string).localeCompare(valA as string);
        }

        return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [data, searchQuery, selectedSeason, selectedCategory, stubbleOnly, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const exportTableCSV = () => {
    downloadCSV(`Delhi_Master_Daily_Telemetry_${Date.now()}.csv`, filteredData);
  };

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Title & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <span>Integrated Delhi Daily Master Dataset</span>
            <span className="font-mono text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
              {filteredData.length} records
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Synchronized daily air quality, meteorology & 5-min aggregated power demand (700 rows, 34 features)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative min-w-[160px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Filter by Date (YYYY-MM)..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Season Filter */}
          <select
            value={selectedSeason}
            onChange={e => {
              setSelectedSeason(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500/50"
          >
            <option value="ALL">All Seasons</option>
            <option value="Winter">Winter</option>
            <option value="Summer">Summer</option>
            <option value="Monsoon">Monsoon</option>
            <option value="Post-Monsoon">Post-Monsoon</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500/50"
          >
            <option value="ALL">All CPCB Categories</option>
            <option value="Good">Good</option>
            <option value="Satisfactory">Satisfactory</option>
            <option value="Moderate">Moderate</option>
            <option value="Poor">Poor</option>
            <option value="Very Poor">Very Poor</option>
          </select>

          {/* Stubble Toggle */}
          <button
            type="button"
            onClick={() => {
              setStubbleOnly(!stubbleOnly);
              setCurrentPage(1);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-colors ${
              stubbleOnly
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-semibold'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Stubble Season (Oct-Nov)</span>
          </button>

          {/* Download CSV */}
          <button
            type="button"
            onClick={exportTableCSV}
            title="Download Filtered Table as CSV"
            className="p-1.5 text-zinc-300 hover:text-emerald-400 bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/60">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 font-mono text-[11px]">
              <th
                onClick={() => handleSort('date')}
                className="py-3 px-3.5 cursor-pointer hover:text-zinc-200 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Date</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('pm25')}
                className="py-3 px-3.5 cursor-pointer hover:text-zinc-200 transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>PM2.5 (µg)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('pm10')}
                className="py-3 px-3.5 cursor-pointer hover:text-zinc-200 transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>PM10 (µg)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('temp')}
                className="py-3 px-3.5 cursor-pointer hover:text-zinc-200 transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Temp (°C)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('windspeed')}
                className="py-3 px-3.5 cursor-pointer hover:text-zinc-200 transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Wind (km/h)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('demandMean')}
                className="py-3 px-3.5 cursor-pointer hover:text-zinc-200 transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Mean Demand (MW)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('demandPeak')}
                className="py-3 px-3.5 cursor-pointer hover:text-zinc-200 transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Peak Demand (MW)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('sustainabilityScore')}
                className="py-3 px-3.5 cursor-pointer hover:text-zinc-200 transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Sustainability</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3.5 text-center">Category</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-sans">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-zinc-400 font-mono">
                  No records matched the filter criteria.
                </td>
              </tr>
            ) : (
              paginatedData.map(row => (
                <tr key={row.date} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="py-2.5 px-3.5 font-mono text-zinc-300 whitespace-nowrap font-medium">
                    {row.date}
                    {row.stubbleSeason === 1 && (
                      <span className="ml-2 px-1.5 py-0.2 text-[9px] rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Stubble
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono font-bold whitespace-nowrap">
                    <span
                      className={
                        row.pm25 > 120
                          ? 'text-rose-400'
                          : row.pm25 > 60
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }
                    >
                      {row.pm25}
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono text-zinc-300 whitespace-nowrap">
                    {row.pm10}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono text-zinc-200 whitespace-nowrap">
                    {row.temp}°
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono text-cyan-400 whitespace-nowrap">
                    {row.windspeed}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono text-zinc-200 whitespace-nowrap">
                    {row.demandMean.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono text-amber-400 whitespace-nowrap font-medium">
                    {row.demandPeak.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono text-emerald-400 whitespace-nowrap font-bold">
                    {row.sustainabilityScore}
                  </td>
                  <td className="py-2.5 px-3.5 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase ${
                        row.aqiCategory === 'Very Poor'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : row.aqiCategory === 'Poor'
                          ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                          : row.aqiCategory === 'Moderate'
                          ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {row.aqiCategory}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-zinc-400 font-mono">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-zinc-200"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-zinc-400">
            Showing {(currentPage - 1) * pageSize + 1} -{' '}
            {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
