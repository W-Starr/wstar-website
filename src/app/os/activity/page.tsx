'use client'

import React, { useState } from 'react'
import { useOS } from '@/os/context/OSContext'
import {
  Activity,
  CheckCircle2,
  Bug,
  FileText,
  MessageSquare,
  Sparkles,
  User,
  Clock,
} from 'lucide-react'

export default function ActivityFeedPage() {
  const { activities } = useOS()
  const [filter, setFilter] = useState<string>('all')

  const filtered = activities.filter((act) => {
    if (filter !== 'all' && act.targetType !== filter) return false
    return true
  })

  const typeIcons: Record<string, { icon: any; color: string }> = {
    bug: { icon: Bug, color: 'text-red-500 bg-red-50 dark:bg-red-950/60' },
    task: { icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60' },
    decision: { icon: FileText, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60' },
    feedback: { icon: MessageSquare, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60' },
    product: { icon: Sparkles, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60' },
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Activity className="w-4 h-4" />
            <span>Audit & Transparency</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            Global Activity Stream
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time audit log of team actions, completed work, decisions, and customer triage.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          {['all', 'task', 'bug', 'decision', 'feedback'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1 rounded-md font-medium capitalize transition-all ${
                filter === t
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t === 'all' ? 'All Events' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs">
        <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-4 space-y-6">
          {filtered.map((act) => {
            const IconData = typeIcons[act.targetType] || typeIcons.task
            const Icon = IconData.icon

            return (
              <div key={act.id} className="relative pl-6 group">
                {/* Node Icon */}
                <div
                  className={`absolute -left-[17px] top-0.5 w-8 h-8 rounded-full flex items-center justify-center ${IconData.color} border-2 border-white dark:border-slate-900 shadow-xs`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Event Details */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <strong className="text-slate-900 dark:text-white font-semibold">
                      {act.actor}
                    </strong>
                    <span>{act.action}</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {act.targetTitle}
                    </strong>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(act.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
