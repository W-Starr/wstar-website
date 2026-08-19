'use client'

import React from 'react'
import { useToastStore } from '../store/toastStore'
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react'

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts)
  const removeToast = useToastStore((state) => state.removeToast)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2 sm:p-0">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success'
        const isError = toast.type === 'error'
        const isWarning = toast.type === 'warning'

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-xl shadow-xl border backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 duration-200 ${
              isSuccess
                ? 'bg-slate-900/95 border-emerald-500/40 text-white'
                : isError
                ? 'bg-slate-900/95 border-red-500/40 text-white'
                : isWarning
                ? 'bg-slate-900/95 border-amber-500/40 text-white'
                : 'bg-slate-900/95 border-blue-500/40 text-white'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
              {isError && <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
              {!isSuccess && !isError && !isWarning && (
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              )}

              <div className="space-y-0.5">
                <p className="text-xs font-semibold leading-tight">{toast.title}</p>
                {toast.description && (
                  <p className="text-[11px] text-slate-400 leading-snug">{toast.description}</p>
                )}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
