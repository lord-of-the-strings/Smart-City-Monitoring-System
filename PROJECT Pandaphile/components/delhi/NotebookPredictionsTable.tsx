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
  CheckCircle2,
  Table as TableIcon
} from 'lucide-react';
import { NOTEBOOK_DAILY_PREDICTIONS, NotebookPredictionPoint } from '@/lib/notebookModelData';
import { downloadCSV } from '@/lib/utils';

type SortField = 'date' | 'testDay' | 'actual' | 'randomForest' | 'lstm' | 'ridge' | 'rfError';
type SortOrder = 'asc' | 'desc';

export default function NotebookPredictionsTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stubbleOnly, setStubbleOnly] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField>('testDay');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredData = useMemo(() => {
    return NOTEBOOK_DAILY_PREDICTIONS
      .filter(item => {
        const matchesSearch =
          searchQuery === '' ||
          item.date.includes(searchQuery) ||
          item.testDay.toString().includes(searchQuery);

        const matchesStubble = !stubbleOnly || item.stubbleSeason;
        return matchesSearch && matchesStubble;
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
  }, [searchQuery, stubbleOnly, sortField, sortOrder]);

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
      setSortOrder('asc');
    }
  };

  const exportCSV = () => {
    downloadCSV(`SmartCity_Notebook_Test_Predictions_${Date.now()}.csv`, filteredData);
  };

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header and Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-cyan-400" />
            <span>Notebook Test Set Predictions Table (105 Days)</span>
            <span className="font-mono text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
              {filteredData.length} days
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Tabulated day-by-day ground truth vs predictions from Random Forest, LSTM, Ridge, and Persistence
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative min-w-[150px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search date YYYY-MM..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

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
            <span>Stubble Days Only</span>
          </button>

          {/* Export CSV */}
          <button
            type="button"
            onClick={exportCSV}
            title="Download Test Predictions as CSV"
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
                onClick={() => handleSort('testDay')}
                className="py-3 px-3.5 cursor-pointer hover:text-zinc-200 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Day #</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('date')}
                className="py-3 px-3.5 cursor-pointer hover:text-zinc-200 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Forecast Date</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('actual')}
                className="py-3 px-3.5 cursor-pointer hover:text-zinc-200 transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Actual Target</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('randomForest')}
                className="py-3 px-3.5 cursor-pointer hover:text-zinc-200 transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5 text-blue-400">
                  <span>Random Forest</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('lstm')}
                className="py-3 px-3.5 cursor-pointer hover:text-zinc-200 transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5 text-emerald-400">
                  <span>LSTM Model</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('ridge')}
                className="py-3 px-3.5 cursor-pointer hover:text-zinc-200 transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5 text-cyan-400">
                  <span>Ridge</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3.5 text-right font-normal">Persistence</th>
              <th
                onClick={() => handleSort('rfError')}
                className="py-3 px-3.5 cursor-pointer hover:text-zinc-200 transition-colors text-right"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>RF |Error|</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-sans">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-zinc-400 font-mono">
                  No prediction records matched the criteria.
                </td>
              </tr>
            ) : (
              paginatedData.map(row => (
                <tr key={row.testDay} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="py-2.5 px-3.5 font-mono text-zinc-400">
                    #{row.testDay}
                  </td>
                  <td className="py-2.5 px-3.5 font-mono text-zinc-300 font-medium whitespace-nowrap">
                    {row.date}
                    {row.stubbleSeason && (
                      <span className="ml-2 px-1.5 py-0.2 text-[9px] rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Stubble
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono font-bold text-zinc-100 whitespace-nowrap">
                    {row.actual} µg
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono font-semibold text-blue-400 whitespace-nowrap">
                    {row.randomForest} µg
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono font-semibold text-emerald-400 whitespace-nowrap">
                    {row.lstm} µg
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono text-cyan-400 whitespace-nowrap">
                    {row.ridge} µg
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono text-zinc-400 whitespace-nowrap">
                    {row.persistence} µg
                  </td>
                  <td className="py-2.5 px-3.5 text-right font-mono font-bold whitespace-nowrap">
                    <span className={row.rfError > 20 ? 'text-rose-400' : 'text-emerald-400'}>
                      {row.rfError} µg
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
            <option value={105}>All 105</option>
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
