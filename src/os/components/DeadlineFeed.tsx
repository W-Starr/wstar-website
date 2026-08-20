'use client'

import React from 'react'
import { Calendar, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import { WorkItem, Project, Milestone } from '../types'
import { StatusBadge } from './StatusBadge'
import { ProjectStatusBadge } from './ProjectStatusBadge'

interface DeadlineEntry {
  id: string
  date: string
  title: string
  type: 'milestone' | 'task'
  projectName?: string
  assignee?: string
  status: string
  isOverdue: boolean
  daysUntil: number
}

interface DeadlineFeedProps {
  projects: Project[]
  workItems: WorkItem[]
  daysAhead?: number
  onTaskClick?: (item: WorkItem) => void
}

export function DeadlineFeed({
  projects,
  workItems,
  daysAhead = 30,
  onTaskClick,
}: DeadlineFeedProps) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const entries: DeadlineEntry[] = []

  // Collect milestone deadlines
  for (const project of projects) {
    if (!project.milestones) continue
    for (const ms of project.milestones) {
      if (!ms.dueDate) continue
      const due = new Date(ms.dueDate)
      due.setHours(0, 0, 0, 0)
      const daysUntil = Math.round((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      entries.push({
        id: `ms-${ms.id}`,
        date: ms.dueDate,
        title: ms.title,
        type: 'milestone',
        projectName: project.name,
        status: ms.completed ? 'done' : 'pending',
        isOverdue: !ms.completed && daysUntil < 0,
        daysUntil,
      })
    }

    // Project target dates
    if (project.targetDate) {
      const due = new Date(project.targetDate)
      due.setHours(0, 0, 0, 0)
      const daysUntil = Math.round((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      entries.push({
        id: `proj-${project.id}`,
        date: project.targetDate,
        title: `🏁 ${project.name} — Target Completion`,
        type: 'milestone',
        projectName: project.name,
        status: project.status === 'completed' ? 'done' : project.status,
        isOverdue: project.status !== 'completed' && daysUntil < 0,
        daysUntil,
      })
    }
  }

  // Collect task deadlines (high priority or with due dates)
  for (const item of workItems) {
    if (!item.dueDate || item.status === 'done') continue
    const due = new Date(item.dueDate)
    due.setHours(0, 0, 0, 0)
    const daysUntil = Math.round((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    entries.push({
      id: `task-${item.id}`,
      date: item.dueDate,
      title: `${item.itemNumber}: ${item.title}`,
      type: 'task',
      assignee: item.assignee,
      status: item.status,
      isOverdue: daysUntil < 0,
      daysUntil,
    })
  }

  // Sort by date ascending, overdue first
  entries.sort((a, b) => {
    if (a.isOverdue && !b.isOverdue) return -1
    if (!a.isOverdue && b.isOverdue) return 1
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  // Filter: show overdue + next N days
  const filtered = entries.filter((e) => e.daysUntil <= daysAhead)

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  const formatDaysLabel = (days: number, isOverdue: boolean) => {
    if (isOverdue) return `${Math.abs(days)}d overdue`
    if (days === 0) return 'Today'
    if (days === 1) return 'Tomorrow'
    return `in ${days}d`
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500">
        <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p>No upcoming deadlines</p>
      </div>
    )
  }

  return (
    <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
      {filtered.map((entry) => (
        <div
          key={entry.id}
          onClick={() => {
            if (entry.type === 'task' && onTaskClick) {
              const item = workItems.find((w) => `task-${w.id}` === entry.id)
              if (item) onTaskClick(item)
            }
          }}
          className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-all ${
            entry.isOverdue
              ? 'bg-red-50/60 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 hover:border-red-300'
              : entry.status === 'done'
              ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-800/50 opacity-60'
              : 'bg-white dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/60 hover:border-blue-300 dark:hover:border-blue-700'
          } ${entry.type === 'task' && onTaskClick ? 'cursor-pointer' : ''}`}
        >
          {/* Date column */}
          <div className="flex-shrink-0 w-12 text-center">
            <div className={`text-xs font-bold ${entry.isOverdue ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-200'}`}>
              {formatDate(entry.date)}
            </div>
            <div className={`text-[10px] font-medium mt-0.5 ${
              entry.isOverdue
                ? 'text-red-500 dark:text-red-400'
                : entry.daysUntil <= 3
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-slate-400'
            }`}>
              {formatDaysLabel(entry.daysUntil, entry.isOverdue)}
            </div>
          </div>

          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {entry.isOverdue ? (
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            ) : entry.status === 'done' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            ) : entry.type === 'milestone' ? (
              <span className="inline-block w-3 h-3 rotate-45 bg-amber-500 rounded-sm" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-blue-500" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className={`text-xs font-medium leading-snug ${
              entry.status === 'done' ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'
            }`}>
              {entry.title}
            </div>
            {entry.projectName && entry.type === 'milestone' && (
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                {entry.projectName}
              </div>
            )}
            {entry.assignee && (
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 capitalize">
                → {entry.assignee === 'abdulaziz' ? 'Abdulaziz' : entry.assignee === 'ibrahim' ? 'Ibrahim' : 'Unassigned'}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
