'use client'

import React, { useState } from 'react'
import { useOS } from '@/os/context/OSContext'
import { FeedbackItem } from '@/os/types'
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
} from 'lucide-react'

export default function FeedbackTriagePage() {
  const { feedbackItems, updateFeedbackStatus, convertFeedbackToWorkItem } = useOS()

  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null)
  const [filterType, setFilterType] = useState<string>('all')

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

  const handleConvert = (item: FeedbackItem) => {
    convertFeedbackToWorkItem(item.id, {
      title: item.subject,
      description: `[Direct Customer Feedback]:\n${item.description}\n\nSubmitted by User ID: ${item.userId}`,
      priority: item.type === 'Bug Report' ? 'high' : 'medium',
      productAreaId: 'area-feedback',
    })
    alert(`Feedback converted to work item!`)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <MessageSquare className="w-4 h-4" />
            <span>Customer Intelligence</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            Feedback Triage Queue
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time feed from Ace Acad mobile app Firestore <code className="font-mono text-slate-600 dark:text-slate-400">feedback/</code> collection.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          {['all', 'Bug Report', 'Feature Request', 'Praise'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                filterType === t
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t === 'all' ? 'All Feedback' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Feedback List & Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feedback List */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-2xs overflow-hidden">
            {filtered.map((item) => {
              const IconData = typeIcons[item.type] || typeIcons.General
              const Icon = IconData.icon
              const isSelected = selectedFeedback?.id === item.id

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedFeedback(item)}
                  className={`p-4 transition-colors cursor-pointer flex items-start justify-between gap-4 ${
                    isSelected
                      ? 'bg-blue-50/50 dark:bg-blue-950/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${IconData.color} shrink-0 mt-0.5`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          {item.type}
                        </span>
                        <span className="text-[10px] text-slate-400">•</span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.subject}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                        item.status === 'new'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : item.status === 'converted'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action Panel / Triage Inspector */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Triage & Conversion Engine
            </h3>

            {selectedFeedback ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-400">Selected Subject:</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {selectedFeedback.subject}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedFeedback.description}
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  User ID: {selectedFeedback.userId}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <button
                    onClick={() => handleConvert(selectedFeedback)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Convert to Work Item</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        updateFeedbackStatus(selectedFeedback.id, 'triaged')
                      }
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-xs text-slate-700 dark:text-slate-300 font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Mark Triaged</span>
                    </button>
                    <button
                      onClick={() =>
                        updateFeedbackStatus(selectedFeedback.id, 'dismissed')
                      }
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-xs text-slate-700 dark:text-slate-300 font-medium"
                    >
                      <XCircle className="w-3.5 h-3.5 text-slate-400" />
                      <span>Dismiss</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
                <div>Select any feedback item from the queue to triage or convert.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
