'use client'

import React, { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function OSRootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[WSTAR OS Runtime Error Boundary]:', error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans">
      <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 flex items-center justify-center text-red-600 dark:text-red-400 shadow-sm">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <div className="space-y-1 max-w-md">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
          Operational System Exception
        </h2>
        <p className="text-xs text-slate-500">
          An unexpected error interrupted the operations console. Your local data and session remain secure.
        </p>
        {error.message && (
          <div className="mt-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 text-left overflow-x-auto">
            {error.message}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Operation</span>
        </button>

        <Link
          href="/os"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 text-xs font-semibold transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Executive Hub</span>
        </Link>
      </div>
    </div>
  )
}
