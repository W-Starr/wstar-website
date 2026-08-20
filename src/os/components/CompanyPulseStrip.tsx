'use client'

import React from 'react'
import {
  FolderKanban,
  ListChecks,
  AlertOctagon,
  Link2Off,
  MessageSquareWarning,
  TrendingUp,
} from 'lucide-react'
import { WorkItem, FeedbackItem, Project } from '../types'

interface CompanyPulseStripProps {
  workItems: WorkItem[]
  feedbackItems: FeedbackItem[]
  projects: Project[]
  activities: { timestamp: string }[]
}

export function CompanyPulseStrip({
  workItems,
  feedbackItems,
  projects,
  activities,
}: CompanyPulseStripProps) {
  const activeProjects = projects.filter((p) => p.status === 'active' || p.status === 'at_risk').length
  const openWorkItems = workItems.filter((w) => w.status !== 'done').length
  const blockedItems = workItems.filter((w) => w.status === 'blocked').length

  // Count tasks whose dependencies are not all resolved
  const unresolvedDeps = workItems.filter((w) => {
    if (!w.dependencies || w.dependencies.length === 0) return false
    if (w.status === 'done') return false
    return w.dependencies.some((depId) => {
      const dep = workItems.find((d) => d.id === depId || d.itemNumber === depId)
      return !dep || dep.status !== 'done'
    })
  }).length

  const untriagedFeedback = feedbackItems.filter((f) => f.status === 'new').length

  // Velocity: tasks completed this week vs last week
  const now = new Date()
  const thisWeekStart = new Date(now)
  thisWeekStart.setDate(now.getDate() - now.getDay())
  thisWeekStart.setHours(0, 0, 0, 0)
  const lastWeekStart = new Date(thisWeekStart)
  lastWeekStart.setDate(lastWeekStart.getDate() - 7)

  const completedThisWeek = workItems.filter((w) => {
    if (w.status !== 'done') return false
    const d = new Date(w.updatedAt)
    return d >= thisWeekStart
  }).length

  const completedLastWeek = workItems.filter((w) => {
    if (w.status !== 'done') return false
    const d = new Date(w.updatedAt)
    return d >= lastWeekStart && d < thisWeekStart
  }).length

  const velocityRatio = completedLastWeek > 0
    ? +(completedThisWeek / completedLastWeek).toFixed(1)
    : completedThisWeek > 0 ? completedThisWeek : 0

  const metrics = [
    {
      label: 'Active Projects',
      value: activeProjects,
      icon: FolderKanban,
      color: activeProjects > 0 ? 'emerald' : 'slate',
      detail: `${projects.length} total`,
    },
    {
      label: 'Open Work Items',
      value: openWorkItems,
      icon: ListChecks,
      color: openWorkItems > 20 ? 'amber' : openWorkItems > 10 ? 'blue' : 'emerald',
      detail: `${workItems.filter((w) => w.status === 'done').length} completed`,
    },
    {
      label: 'Blocked Items',
      value: blockedItems,
      icon: AlertOctagon,
      color: blockedItems > 0 ? 'red' : 'emerald',
      detail: blockedItems > 0 ? 'Needs attention' : 'All clear',
    },
    {
      label: 'Unresolved Deps',
      value: unresolvedDeps,
      icon: Link2Off,
      color: unresolvedDeps > 0 ? 'red' : 'emerald',
      detail: unresolvedDeps > 0 ? 'Prerequisite tasks pending' : 'All dependencies met',
    },
    {
      label: 'Untriaged Feedback',
      value: untriagedFeedback,
      icon: MessageSquareWarning,
      color: untriagedFeedback > 3 ? 'amber' : untriagedFeedback > 0 ? 'blue' : 'emerald',
      detail: `${feedbackItems.length} total feedback`,
    },
    {
      label: 'Weekly Velocity',
      value: `${velocityRatio}×`,
      icon: TrendingUp,
      color: velocityRatio >= 1 ? 'emerald' : velocityRatio > 0 ? 'amber' : 'slate',
      detail: `${completedThisWeek} done this week`,
    },
  ]

  const colorMap: Record<string, { bg: string; text: string; iconBg: string; border: string }> = {
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-700 dark:text-emerald-300',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/60',
      border: 'border-emerald-200/60 dark:border-emerald-800/40',
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      text: 'text-blue-700 dark:text-blue-300',
      iconBg: 'bg-blue-100 dark:bg-blue-900/60',
      border: 'border-blue-200/60 dark:border-blue-800/40',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      text: 'text-amber-700 dark:text-amber-300',
      iconBg: 'bg-amber-100 dark:bg-amber-900/60',
      border: 'border-amber-200/60 dark:border-amber-800/40',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-950/30',
      text: 'text-red-700 dark:text-red-300',
      iconBg: 'bg-red-100 dark:bg-red-900/60',
      border: 'border-red-200/60 dark:border-red-800/40',
    },
    slate: {
      bg: 'bg-slate-50 dark:bg-slate-800/40',
      text: 'text-slate-600 dark:text-slate-400',
      iconBg: 'bg-slate-100 dark:bg-slate-800',
      border: 'border-slate-200/60 dark:border-slate-700/40',
    },
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {metrics.map((m) => {
        const c = colorMap[m.color] || colorMap.slate
        const Icon = m.icon
        return (
          <div
            key={m.label}
            className={`p-3.5 rounded-xl border ${c.border} ${c.bg} space-y-2 transition-all hover:shadow-xs`}
          >
            <div className="flex items-center justify-between">
              <div className={`w-7 h-7 rounded-lg ${c.iconBg} flex items-center justify-center`}>
                <Icon className={`w-3.5 h-3.5 ${c.text}`} />
              </div>
            </div>
            <div>
              <div className={`text-xl font-bold font-heading tracking-tight ${c.text}`}>
                {m.value}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
                {m.label}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                {m.detail}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
