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
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white tracking-tight mt-1">
            Feedback Triage Queue
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time feed from Ace Acad mobile app Firestore <code className="font-mono text-slate-600 dark:text-slate-400">feedback/</code> collection.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs self-start sm:self-auto">
          {['all', 'Bug Report', 'Feature Request', 'Praise'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 sm:px-3 py-1 rounded-md font-medium transition-all text-xs ${
                filterType === t
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t === 'all' ? 'All' : t}
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
                  className={`p-3.5 sm:p-4 transition-colors cursor-pointer flex items-start justify-between gap-3 sm:gap-4 ${
                    isSelected
                      ? 'bg-blue-50/50 dark:bg-blue-950/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${IconData.color} shrink-0 mt-0.5`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {item.subject}
                        </h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                        <span>User: <strong className="text-slate-600 dark:text-slate-300">{item.userId}</strong></span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                        item.status === 'new'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          : item.status === 'triaged'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
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

        {/* Feedback Detail Sidebar / Inspector */}
        <div className="space-y-4">
          {selectedFeedback ? (
            <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Feedback Inspector
                </span>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                  {selectedFeedback.subject}
                </h3>
                <div className="text-xs text-slate-500 mt-1">
                  Submitted on {selectedFeedback.date} by {selectedFeedback.userId}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedFeedback.description}
              </div>

              {/* Status Update & Actions */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-500">
                  Triage Workflow
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  {(['new', 'triaged', 'closed'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateFeedbackStatus(selectedFeedback.id, status)}
                      className={`py-1.5 rounded-md font-medium capitalize transition-colors ${
                        selectedFeedback.status === status
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleConvert(selectedFeedback)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-all active:scale-98"
                >
                  <Plus className="w-4 h-4" />
                  <span>Convert to Work Item / Bug</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Select a feedback report
              </div>
              <p className="text-[11px] text-slate-400">
                Click any incoming report from the feed to inspect details or convert it to a prioritized engineering bug ticket.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
