'use client'

import React, { useState, useMemo } from 'react'
import { Search } from 'lucide-react'

export interface RegistryColumn {
  key: string
  label: string
  isMono?: boolean
}

interface DataRegistryTableProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  columns: RegistryColumn[]
  rows: Record<string, any>[]
  searchable?: boolean
  maxHeight?: string
}

/**
 * Reusable table for domain registries, progress trackers, inventory lists.
 * Works for course ingestion tracking, crop model status, or any tabular data.
 * Supports built-in search, status column auto-coloring, and empty state.
 */
export function DataRegistryTable({
  title,
  subtitle,
  icon,
  columns,
  rows,
  searchable = true,
  maxHeight = '320px',
}: DataRegistryTableProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return rows
    const q = searchQuery.toLowerCase()
    return rows.filter((row) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(q))
    )
  }, [rows, searchQuery])

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {icon}
            <span>{title}</span>
          </h3>
          {subtitle && (
            <span className="text-xs text-slate-400">{subtitle}</span>
          )}
        </div>

        {searchable && (
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight }}>
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800 sticky top-0">
              <tr>
                {columns.map((col, cIdx) => (
                  <th
                    key={col.key}
                    className={`p-3 ${cIdx === 0 ? 'pl-4' : ''} ${
                      cIdx === columns.length - 1 ? 'pr-4' : ''
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length || 1}
                    className="p-6 text-center text-slate-400"
                  >
                    {searchQuery
                      ? 'No items match your search.'
                      : 'No items in this registry yet.'}
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {columns.map((col, cIdx) => {
                      const val = row[col.key] || ''
                      const isMono =
                        col.isMono || col.key === 'code' || col.key === 'id'
                      const isStatus = col.key === 'status'

                      return (
                        <td
                          key={col.key}
                          className={`p-3 ${cIdx === 0 ? 'pl-4 font-bold' : ''} ${
                            cIdx === columns.length - 1 ? 'pr-4' : ''
                          } ${
                            isMono
                              ? 'font-mono text-slate-900 dark:text-white'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {isStatus ? (
                            <StatusBadge value={String(val)} />
                          ) : (
                            val
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/** Auto-colored status badge based on keyword matching */
function StatusBadge({ value }: { value: string }) {
  const lower = value.toLowerCase()
  const isPositive =
    lower.includes('verified') ||
    lower.includes('trained') ||
    lower.includes('done') ||
    lower.includes('complete') ||
    lower.includes('passed')
  const isPending =
    lower.includes('pending') ||
    lower.includes('progress') ||
    lower.includes('validation') ||
    lower.includes('ingestion')

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
        isPositive
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
          : isPending
          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
      }`}
    >
      {value}
    </span>
  )
}
