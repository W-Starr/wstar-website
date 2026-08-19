'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useOS } from '@/os/context/OSContext'
import { FeedbackItem } from '@/os/types'
import { showToast } from '@/os/store/toastStore'
import {
  MessageSquare,
  Bug,
  Sparkles,
  Heart,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Plus,
  ExternalLink,
  Zap,
  RefreshCw,
  Flame,
} from 'lucide-react'

export default function FeedbackTriagePage() {
  const { feedbackItems, updateFeedbackStatus, convertFeedbackToWorkItem, refreshFromSanity } = useOS()

  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null)
  const [filterType, setFilterType] = useState<string>('all')
  const [isSyncingFirebase, setIsSyncingFirebase] = useState(false)

  const filtered = feedbackItems.filter((f) => {
    if (filterType !== 'all' && f.type !== filterType) return false
    return true
  })

  const typeIcons: Record<string, { icon: any; color: string }> = {
    'Bug Report': { icon: Bug, color: 'text-red-500 bg-red-50 dark:bg-red-950/60' },
    'Feature Request': { icon: Sparkles, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60' },
    Praise: { icon: Heart, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60' },
    General: { icon: HelpCircle, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60' },
  }

  const handleSyncFirebase = async () => {
    setIsSyncingFirebase(true)
    try {
      const res = await fetch('/api/os/feedback/fetch-firebase', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        showToast(
          `Synced ${data.count} Firebase Reports`,
          'success',
          `Successfully ingested ${data.syncedToSanity} records into Sanity dataset.`
        )
        await refreshFromSanity()
      } else {
        showToast('Firebase Sync Error', 'error', data.error || 'Failed to fetch from Firebase')
      }
    } catch (e: any) {
      showToast('Firebase Connection Error', 'error', e.message)
    } finally {
      setIsSyncingFirebase(false)
    }
  }

  const handleConvert = (item: FeedbackItem) => {
    const created = convertFeedbackToWorkItem(item.id, {
      title: item.subject,
      description: `[Customer Feedback Report]:\n${item.description}\n\nSubmitted by User ID: ${item.userId}`,
      priority: item.type === 'Bug Report' ? 'high' : 'medium',
      type: item.type === 'Bug Report' ? 'bug' : 'feature',
      productAreaId: 'area-library',
      assignee: item.type === 'Bug Report' ? 'abdulaziz' : 'ibrahim',
    })

    showToast(`Converted to ${created.itemNumber}`, 'success', created.title)
    setSelectedFeedback(null)
  }

  const handleStatusChange = (id: string, status: FeedbackItem['status']) => {
    updateFeedbackStatus(id, status)
    showToast(`Feedback ${status.toUpperCase()}`, 'info')
    if (selectedFeedback && selectedFeedback.id === id) {
      setSelectedFeedback({ ...selectedFeedback, status })
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <MessageSquare className="w-4 h-4" />
            <span>Customer Intelligence Feed</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white tracking-tight mt-1">
            Feedback Triage Queue
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Incoming user reports from Ace Acad mobile app Firestore <code className="font-mono text-slate-600 dark:text-slate-400">feedback/</code> collection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Sync Firebase Feedback Button */}
          <button
            onClick={handleSyncFirebase}
            disabled={isSyncingFirebase}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-semibold shadow-2xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isSyncingFirebase ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Flame className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span>{isSyncingFirebase ? 'Syncing...' : 'Sync Firebase Feedback'}</span>
          </button>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            {['all', 'Bug Report', 'Feature Request', 'General'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 sm:px-3 py-1 rounded-lg font-medium transition-all text-xs cursor-pointer ${
                  filterType === t
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t === 'all' ? 'All' : t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Feedback List & Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feedback List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <MessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Feedback Found</h3>
              <p className="text-xs text-slate-500 mt-1">Click "Sync Firebase Feedback" above to ingest live student submissions.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-2xs overflow-hidden">
              {filtered.map((item) => {
                const IconData = typeIcons[item.type] || typeIcons.General
                const Icon = IconData.icon
                const isSelected = selectedFeedback?.id === item.id

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedFeedback(item)}
                    className={`p-4 transition-colors cursor-pointer flex items-start justify-between gap-3 sm:gap-4 ${
                      isSelected
                        ? 'bg-blue-50/50 dark:bg-blue-950/30'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`p-2 rounded-xl ${IconData.color} shrink-0 mt-0.5`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate font-heading">
                            {item.subject}
                          </h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">
                            {item.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                          <span>User: <strong className="text-slate-600 dark:text-slate-300 font-mono text-[10px]">{item.userId.slice(0, 10)}...</strong></span>
                          <span>•</span>
                          <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                          item.status === 'converted'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : item.status === 'dismissed'
                            ? 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                            : 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Feedback Detail / Triage Action Pane */}
        <div className="space-y-4">
          {selectedFeedback ? (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-5 sticky top-20">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Report Detail
                </span>
                <span className="font-mono text-xs text-slate-400 font-bold">
                  {selectedFeedback.type}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                  {selectedFeedback.subject}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 whitespace-pre-line leading-relaxed">
                  {selectedFeedback.description}
                </p>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <div>User ID: <code className="font-mono text-[11px] text-slate-600 dark:text-slate-300">{selectedFeedback.userId}</code></div>
                <div>Submitted: {new Date(selectedFeedback.timestamp).toLocaleString()}</div>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleConvert(selectedFeedback)}
                  className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Convert to Engineering Work Item</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedFeedback.id, 'triaged')}
                    className="py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Mark Triaged
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedFeedback.id, 'dismissed')}
                    className="py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
              <Zap className="w-6 h-6 text-slate-400 mx-auto" />
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Select a feedback item
              </div>
              <p className="text-[11px] text-slate-400">
                Convert student feedback into prioritized backlog tasks, bug reports, or feature requests.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
