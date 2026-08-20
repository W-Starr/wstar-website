'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Target,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CalendarOff,
} from 'lucide-react'
import { Project, WorkItem, Milestone } from '../types'
import { ProjectStatusBadge } from './ProjectStatusBadge'
import { StatusBadge } from './StatusBadge'

// ─── Distinct Project Color Palette ───
const PROJECT_COLORS = [
  { bar: 'bg-blue-500', barDark: 'bg-blue-600', fill: 'bg-blue-400/40', text: 'text-blue-700 dark:text-blue-300', light: 'bg-blue-50 dark:bg-blue-950/40', border: 'border-blue-200 dark:border-blue-800' },
  { bar: 'bg-violet-500', barDark: 'bg-violet-600', fill: 'bg-violet-400/40', text: 'text-violet-700 dark:text-violet-300', light: 'bg-violet-50 dark:bg-violet-950/40', border: 'border-violet-200 dark:border-violet-800' },
  { bar: 'bg-teal-500', barDark: 'bg-teal-600', fill: 'bg-teal-400/40', text: 'text-teal-700 dark:text-teal-300', light: 'bg-teal-50 dark:bg-teal-950/40', border: 'border-teal-200 dark:border-teal-800' },
  { bar: 'bg-rose-500', barDark: 'bg-rose-600', fill: 'bg-rose-400/40', text: 'text-rose-700 dark:text-rose-300', light: 'bg-rose-50 dark:bg-rose-950/40', border: 'border-rose-200 dark:border-rose-800' },
  { bar: 'bg-amber-500', barDark: 'bg-amber-600', fill: 'bg-amber-400/40', text: 'text-amber-700 dark:text-amber-300', light: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-200 dark:border-amber-800' },
  { bar: 'bg-cyan-500', barDark: 'bg-cyan-600', fill: 'bg-cyan-400/40', text: 'text-cyan-700 dark:text-cyan-300', light: 'bg-cyan-50 dark:bg-cyan-950/40', border: 'border-cyan-200 dark:border-cyan-800' },
  { bar: 'bg-emerald-500', barDark: 'bg-emerald-600', fill: 'bg-emerald-400/40', text: 'text-emerald-700 dark:text-emerald-300', light: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800' },
  { bar: 'bg-pink-500', barDark: 'bg-pink-600', fill: 'bg-pink-400/40', text: 'text-pink-700 dark:text-pink-300', light: 'bg-pink-50 dark:bg-pink-950/40', border: 'border-pink-200 dark:border-pink-800' },
]

type ViewMode = 'month' | 'quarter' | 'half-year'

interface GanttTimelineProps {
  projects: Project[]
  workItems: WorkItem[]
  onProjectClick?: (project: Project) => void
  onTaskClick?: (item: WorkItem) => void
}

// ─── Date Utilities ───

function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function formatMonthLabel(d: Date): string {
  return d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
}

function formatFullMonth(d: Date): string {
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

// ─── Main Component ───

export function GanttTimeline({
  projects,
  workItems,
  onProjectClick,
  onTaskClick,
}: GanttTimelineProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [offset, setOffset] = useState(0) // months offset from center
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Viewport calculation: 3 months centered on today, shifted by offset
  const viewConfig = useMemo(() => {
    const monthsSpan = viewMode === 'month' ? 3 : viewMode === 'quarter' ? 6 : 12
    const halfSpan = Math.floor(monthsSpan / 2)
    const now = new Date()
    const start = startOfMonth(addMonths(now, -halfSpan + offset))
    const end = addMonths(start, monthsSpan)
    const totalDays = daysBetween(start, end)
    return { start, end, totalDays, monthsSpan }
  }, [viewMode, offset])

  // Generate month columns for the header
  const monthColumns = useMemo(() => {
    const cols: { label: string; fullLabel: string; startDay: number; endDay: number; width: number }[] = []
    let cursor = new Date(viewConfig.start)
    while (cursor < viewConfig.end) {
      const monthStart = new Date(cursor)
      const nextMonth = addMonths(monthStart, 1)
      const effEnd = nextMonth > viewConfig.end ? viewConfig.end : nextMonth
      const startDay = daysBetween(viewConfig.start, monthStart)
      const endDay = daysBetween(viewConfig.start, effEnd)
      const width = ((endDay - startDay) / viewConfig.totalDays) * 100
      cols.push({
        label: formatMonthLabel(monthStart),
        fullLabel: formatFullMonth(monthStart),
        startDay,
        endDay,
        width,
      })
      cursor = nextMonth
    }
    return cols
  }, [viewConfig])

  // Today marker position
  const todayPos = useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const days = daysBetween(viewConfig.start, now)
    if (days < 0 || days > viewConfig.totalDays) return null
    return (days / viewConfig.totalDays) * 100
  }, [viewConfig])

  // Separate projects with valid dates vs unscheduled
  const { scheduledProjects, unscheduledProjects } = useMemo(() => {
    const scheduled: Project[] = []
    const unscheduled: Project[] = []
    for (const proj of projects) {
      const hasStart = proj.startDate || proj.targetDate
      const hasEnd = proj.targetDate
      if (hasStart && hasEnd) {
        scheduled.push(proj)
      } else {
        unscheduled.push(proj)
      }
    }
    return { scheduledProjects: scheduled, unscheduledProjects: unscheduled }
  }, [projects])

  // Unscheduled work items (no due date, not done)
  const unscheduledTasks = useMemo(() => {
    return workItems.filter((w) => !w.dueDate && !w.startDate && w.status !== 'done')
  }, [workItems])

  // Calculate bar position for a project
  const getBarPosition = (proj: Project) => {
    const projStart = new Date(proj.startDate || proj.targetDate)
    projStart.setHours(0, 0, 0, 0)
    const projEnd = new Date(proj.targetDate)
    projEnd.setHours(0, 0, 0, 0)

    const startDays = daysBetween(viewConfig.start, projStart)
    const endDays = daysBetween(viewConfig.start, projEnd)

    const leftPct = Math.max(0, (startDays / viewConfig.totalDays) * 100)
    const rightPct = Math.min(100, (endDays / viewConfig.totalDays) * 100)
    const widthPct = Math.max(1, rightPct - leftPct)

    return { left: leftPct, width: widthPct }
  }

  // Get milestone position on a bar
  const getMilestonePos = (ms: Milestone) => {
    if (!ms.dueDate) return null
    const d = new Date(ms.dueDate)
    d.setHours(0, 0, 0, 0)
    const days = daysBetween(viewConfig.start, d)
    if (days < 0 || days > viewConfig.totalDays) return null
    return (days / viewConfig.totalDays) * 100
  }

  // Tasks belonging to a project
  const getProjectTasks = (projectId: string) => {
    return workItems.filter((w) => w.projectId === projectId)
  }

  const viewModes: { key: ViewMode; label: string }[] = [
    { key: 'month', label: '3 Months' },
    { key: 'quarter', label: '6 Months' },
    { key: 'half-year', label: '12 Months' },
  ]

  return (
    <div className="space-y-4">
      {/* ─── Controls Bar ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Zoom controls */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/60">
          {viewModes.map((vm) => (
            <button
              key={vm.key}
              onClick={() => { setViewMode(vm.key); setOffset(0) }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                viewMode === vm.key
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {vm.label}
            </button>
          ))}
        </div>

        {/* Pan navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOffset((o) => o - 1)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Earlier
          </button>
          <button
            onClick={() => setOffset(0)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Today
          </button>
          <button
            onClick={() => setOffset((o) => o + 1)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Later
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── Gantt Chart ─── */}
      <div
        ref={containerRef}
        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
      >
        {/* Month Header */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
          {/* Label column */}
          <div className="flex-shrink-0 w-48 sm:w-56 p-2.5 border-r border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Projects
            </span>
          </div>
          {/* Month columns */}
          <div className="flex-1 flex relative">
            {monthColumns.map((col, i) => (
              <div
                key={col.label}
                className={`text-center py-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-r border-slate-100 dark:border-slate-800/60 last:border-r-0`}
                style={{ width: `${col.width}%` }}
              >
                {col.label}
              </div>
            ))}
          </div>
        </div>

        {/* Project Rows */}
        {scheduledProjects.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400 dark:text-slate-500">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No scheduled projects</p>
            <p className="text-xs mt-1">Add startDate and targetDate to projects to see them on the timeline</p>
          </div>
        ) : (
          scheduledProjects.map((proj, idx) => {
            const color = PROJECT_COLORS[idx % PROJECT_COLORS.length]
            const bar = getBarPosition(proj)
            const tasks = getProjectTasks(proj.id)
            const doneTasks = tasks.filter((t) => t.status === 'done').length
            const isExpanded = expandedProjectId === proj.id

            return (
              <React.Fragment key={proj.id}>
                {/* Project Row */}
                <div
                  className={`flex border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors ${
                    isExpanded ? 'bg-slate-50/50 dark:bg-slate-800/20' : ''
                  }`}
                >
                  {/* Label column */}
                  <div
                    onClick={() => setExpandedProjectId(isExpanded ? null : proj.id)}
                    className="flex-shrink-0 w-48 sm:w-56 p-2.5 pr-2 border-r border-slate-200 dark:border-slate-800 flex items-center gap-2 cursor-pointer group"
                  >
                    <div className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${color.bar}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {proj.name}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <ProjectStatusBadge status={proj.status} />
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    )}
                  </div>

                  {/* Timeline bar area */}
                  <div className="flex-1 relative py-2.5 px-1">
                    {/* Week gridlines */}
                    {monthColumns.map((col) => (
                      <div
                        key={`grid-${col.label}`}
                        className="absolute top-0 bottom-0 border-r border-slate-100/50 dark:border-slate-800/30"
                        style={{ left: `${(col.endDay / viewConfig.totalDays) * 100}%` }}
                      />
                    ))}

                    {/* Today marker */}
                    {todayPos !== null && (
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-red-500/70 z-10"
                        style={{ left: `${todayPos}%` }}
                      />
                    )}

                    {/* Project bar */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-6 rounded-md overflow-hidden group/bar cursor-pointer"
                      style={{
                        left: `${bar.left}%`,
                        width: `${bar.width}%`,
                        minWidth: '24px',
                      }}
                      onClick={() => onProjectClick?.(proj)}
                    >
                      {/* Background bar */}
                      <div className={`absolute inset-0 ${color.bar} opacity-25 dark:opacity-30 rounded-md`} />
                      {/* Progress fill */}
                      <div
                        className={`absolute inset-y-0 left-0 ${color.bar} opacity-60 dark:opacity-50 rounded-l-md ${
                          proj.progress >= 100 ? 'rounded-r-md' : ''
                        }`}
                        style={{ width: `${Math.min(100, proj.progress)}%` }}
                      />
                      {/* Bar border */}
                      <div className={`absolute inset-0 rounded-md border ${color.border} opacity-60`} />
                      {/* Label inside bar */}
                      <div className="absolute inset-0 flex items-center px-2 overflow-hidden">
                        <span className="text-[10px] font-bold text-slate-900 dark:text-white truncate drop-shadow-sm">
                          {proj.progress}%
                        </span>
                      </div>
                    </div>

                    {/* Milestone diamonds */}
                    {(proj.milestones || []).map((ms) => {
                      const pos = getMilestonePos(ms)
                      if (pos === null) return null
                      return (
                        <div
                          key={ms.id}
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 group/ms"
                          style={{ left: `${pos}%` }}
                          title={`${ms.title} — ${ms.dueDate}${ms.completed ? ' ✅' : ''}`}
                        >
                          <div
                            className={`w-3 h-3 rotate-45 rounded-sm border-2 ${
                              ms.completed
                                ? 'bg-emerald-500 border-emerald-600'
                                : 'bg-white dark:bg-slate-800 border-amber-500'
                            }`}
                          />
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/ms:block z-30 pointer-events-none">
                            <div className="px-2.5 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-700 text-white text-[10px] font-medium shadow-lg whitespace-nowrap">
                              {ms.title}
                              <span className="text-slate-300 ml-1.5">
                                {new Date(ms.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Expanded Project Detail Panel */}
                {isExpanded && (
                  <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/30">
                    <div className="p-4 space-y-3">
                      {/* Project summary */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {proj.summary}
                          </div>
                          <div className="flex flex-wrap gap-3 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              Lead: <strong className="text-slate-700 dark:text-slate-300">{proj.lead}</strong>
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {proj.startDate || '?'} → {proj.targetDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              {doneTasks}/{tasks.length} tasks done
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full max-w-sm">
                            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${color.bar} transition-all`}
                                style={{ width: `${proj.progress}%` }}
                              />
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{proj.progress}% complete</div>
                          </div>
                        </div>

                        {/* Milestones list */}
                        {proj.milestones && proj.milestones.length > 0 && (
                          <div className="w-full sm:w-64 flex-shrink-0">
                            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                              Milestones
                            </div>
                            <div className="space-y-1">
                              {proj.milestones.map((ms) => (
                                <div key={ms.id} className="flex items-center gap-2 text-xs">
                                  <div
                                    className={`w-2.5 h-2.5 rotate-45 rounded-sm flex-shrink-0 ${
                                      ms.completed
                                        ? 'bg-emerald-500'
                                        : 'border-2 border-amber-500 bg-transparent'
                                    }`}
                                  />
                                  <span
                                    className={`truncate ${
                                      ms.completed
                                        ? 'line-through text-slate-400 dark:text-slate-500'
                                        : 'text-slate-700 dark:text-slate-300'
                                    }`}
                                  >
                                    {ms.title}
                                  </span>
                                  <span className="text-[10px] text-slate-400 flex-shrink-0 ml-auto">
                                    {new Date(ms.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Linked tasks */}
                      {tasks.length > 0 && (
                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                            Linked Work Items ({tasks.length})
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
                            {tasks.slice(0, 9).map((t) => (
                              <div
                                key={t.id}
                                onClick={() => onTaskClick?.(t)}
                                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                              >
                                <span className="font-mono font-bold text-[10px] text-slate-500 dark:text-slate-400 flex-shrink-0">
                                  {t.itemNumber}
                                </span>
                                <span className="truncate text-slate-700 dark:text-slate-300">
                                  {t.title}
                                </span>
                                <span className="flex-shrink-0 ml-auto">
                                  <StatusBadge status={t.status} />
                                </span>
                              </div>
                            ))}
                            {tasks.length > 9 && (
                              <div className="text-[11px] text-slate-400 px-2.5 py-1.5">
                                +{tasks.length - 9} more items
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </React.Fragment>
            )
          })
        )}
      </div>

      {/* ─── Unscheduled Section ─── */}
      {(unscheduledProjects.length > 0 || unscheduledTasks.length > 0) && (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20 p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <CalendarOff className="w-4 h-4" />
            <span className="uppercase tracking-wider">Unscheduled — No Timeline Dates Set</span>
            <span className="text-[10px] font-normal ml-1">
              ({unscheduledProjects.length} projects, {unscheduledTasks.length} tasks)
            </span>
          </div>

          {/* Unscheduled projects */}
          {unscheduledProjects.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Projects without dates
              </div>
              {unscheduledProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => onProjectClick?.(proj)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <div className="w-2.5 h-2.5 rounded-sm bg-slate-400" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {proj.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {proj.summary ? proj.summary.slice(0, 80) + '...' : 'No summary'}
                    </div>
                  </div>
                  <ProjectStatusBadge status={proj.status} />
                </div>
              ))}
            </div>
          )}

          {/* Unscheduled tasks */}
          {unscheduledTasks.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Tasks without dates ({unscheduledTasks.length})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
                {unscheduledTasks.slice(0, 12).map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onTaskClick?.(t)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <span className="font-mono font-bold text-[10px] text-slate-500 dark:text-slate-400 flex-shrink-0">
                      {t.itemNumber}
                    </span>
                    <span className="truncate text-slate-700 dark:text-slate-300">{t.title}</span>
                    <span className="flex-shrink-0 ml-auto">
                      <StatusBadge status={t.status} />
                    </span>
                  </div>
                ))}
                {unscheduledTasks.length > 12 && (
                  <div className="text-[11px] text-slate-400 px-2.5 py-1.5 col-span-full">
                    +{unscheduledTasks.length - 12} more unscheduled tasks
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
