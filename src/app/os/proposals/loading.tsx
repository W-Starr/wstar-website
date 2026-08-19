import React from 'react'

export default function ProposalsLoading() {
  return (
    <div className="space-y-6 animate-pulse p-2">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-7 w-56 bg-slate-300 dark:bg-slate-700 rounded-lg" />
        </div>
      </div>

      {/* Proposal Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((card) => (
          <div
            key={card}
            className="h-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs"
          >
            <div className="flex justify-between">
              <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
            </div>
            <div className="h-6 w-4/5 bg-slate-300 dark:bg-slate-700 rounded" />
            <div className="h-16 w-full bg-slate-100 dark:bg-slate-800/40 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}
