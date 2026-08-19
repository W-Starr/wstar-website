import React from 'react'

export default function WorkLoading() {
  return (
    <div className="space-y-6 animate-pulse p-2">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-7 w-48 bg-slate-300 dark:bg-slate-700 rounded-lg" />
        </div>
        <div className="h-9 w-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>

      {/* Kanban Columns Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((col) => (
          <div
            key={col}
            className="h-[520px] rounded-2xl bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 space-y-3"
          >
            <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-28 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50" />
            <div className="h-28 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50" />
          </div>
        ))}
      </div>
    </div>
  )
}
