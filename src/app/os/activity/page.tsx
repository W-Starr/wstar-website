'use client'

import React, { useState } from 'react'
import { useOS } from '@/os/context/OSContext'
import { showToast } from '@/os/store/toastStore'
import {
  Activity,
  CheckCircle2,
  Bug,
  FileText,
  MessageSquare,
  Sparkles,
  User,
  Clock,
  Download,
  Filter,
  Users,
} from 'lucide-react'

export default function ActivityFeedPage() {
  const { activities } = useOS()
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [actorFilter, setActorFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = activities.filter((act) => {
    if (typeFilter !== 'all' && act.targetType !== typeFilter) return false

    if (actorFilter !== 'all') {
      if (actorFilter === 'abdulaziz' && !act.actor.toLowerCase().includes('abdulaziz')) return false
      if (actorFilter === 'ibrahim' && !act.actor.toLowerCase().includes('ibrahim')) return false
      if (actorFilter === 'system' && !act.actor.toLowerCase().includes('system')) return false
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        act.actor.toLowerCase().includes(q) ||
        act.action.toLowerCase().includes(q) ||
        act.targetTitle.toLowerCase().includes(q)
      )
    }

    return true
  })

  const typeIcons: Record<string, { icon: any; color: string }> = {
    bug: { icon: Bug, color: 'text-red-500 bg-red-50 dark:bg-red-950/60' },
    task: { icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60' },
    decision: { icon: FileText, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60' },
    feedback: { icon: MessageSquare, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60' },
    proposal: { icon: Sparkles, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60' },
    product: { icon: Sparkles, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60' },
  }

  const handleExportCSV = () => {
    if (filtered.length === 0) return

    const headers = ['Timestamp', 'Actor', 'Action', 'Target Type', 'Target Title']
    const rows = filtered.map((act) => [
      `"${new Date(act.timestamp).toISOString()}"`,
      `"${act.actor.replace(/"/g, '""')}"`,
      `"${act.action.replace(/"/g, '""')}"`,
      `"${act.targetType}"`,
      `"${act.targetTitle.replace(/"/g, '""')}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `wstar-os-audit-log-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showToast('Audit Log Exported', 'success', `Downloaded ${filtered.length} audit records as CSV`)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Activity className="w-4 h-4" />
            <span>Audit Trail & Governance</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1 font-heading">
            Global Activity Stream
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable audit trail of founder operations, code deployments, ADR ratifications, and feedback triage.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold shadow-xs transition-all hover:scale-102 self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <input
          type="text"
          placeholder="Filter audit entries by keyword, title, or actor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
        />

        {/* Actor Filter */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs shrink-0 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Actors' },
            { id: 'abdulaziz', label: 'Abdulaziz' },
            { id: 'ibrahim', label: 'Ibrahim' },
            { id: 'system', label: 'System' },
          ].map((act) => (
            <button
              key={act.id}
              onClick={() => setActorFilter(act.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                actorFilter === act.id
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {act.label}
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs shrink-0 w-full sm:w-auto overflow-x-auto">
          {['all', 'task', 'bug', 'decision', 'feedback', 'proposal'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2.5 py-1 rounded-lg font-medium capitalize transition-colors shrink-0 ${
                typeFilter === t
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t === 'all' ? 'All Types' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs">
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

        {filtered.length === 0 && (
          <div className="p-12 text-center text-xs text-slate-400">
            No audit records match the selected filters.
          </div>
        )}
      </div>
    </div>
  )
}
