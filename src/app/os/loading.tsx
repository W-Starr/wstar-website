import React from 'react'

export default function OSLoading() {
  return (
    <div className="space-y-6 animate-pulse p-2">
      {/* Top Banner Skeleton */}
      <div className="h-28 rounded-2xl bg-slate-200/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800" />

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-32 rounded-xl bg-slate-200/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800" />
        <div className="h-32 rounded-xl bg-slate-200/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800" />
        <div className="h-32 rounded-xl bg-slate-200/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800" />
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 rounded-2xl bg-slate-200/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800" />
        <div className="h-96 rounded-2xl bg-slate-200/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800" />
      </div>
    </div>
  )
}
