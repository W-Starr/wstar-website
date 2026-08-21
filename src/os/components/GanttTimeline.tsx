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
  Filter,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { Project, WorkItem, Milestone } from '../types'
import { ProjectStatusBadge } from './ProjectStatusBadge'
import { StatusBadge } from './StatusBadge'
import { PriorityBadge } from './PriorityBadge'
import { useComputedProgress } from '../hooks/useComputedProgress'

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
  selectedProjectId?: string | null
  onSelectProject?: (projectId: string | null) => void
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

export function GanttTimeline({
  projects,
  workItems,
  selectedProjectId = null,
  onSelectProject,
  onProjectClick,
  onTaskClick,
}: GanttTimelineProps) {
  const { getProjectProgress } = useComputedProgress(workItems, projects, [])
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [offset, setOffset] = useState(0)
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null)
  const [localFocusedProject, setLocalFocusedProject] = useState<string | null>(selectedProjectId)

  useEffect(() => {
    setLocalFocusedProject(selectedProjectId)
  }, [selectedProjectId])

  const focusedProject = localFocusedProject ? projects.find((p) => p.id === localFocusedProject) : null

  // Viewport calculation: 3 / 6 / 12 months window
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

  // Resolve safe start date for a project
  const getResolvedProjectDates = (proj: Project) => {
    let projEnd = new Date(proj.targetDate || '2026-12-31')
    projEnd.setHours(0, 0, 0, 0)

    let projStart: Date
    if (proj.startDate) {
      projStart = new Date(proj.startDate)
    } else if (proj.milestones && proj.milestones.length > 0 && proj.milestones[0].dueDate) {
      projStart = new Date(proj.milestones[0].dueDate)
    } else {
      // Fallback: 60 days before target date
      projStart = new Date(projEnd)
      projStart.setDate(projStart.getDate() - 60)
    }
    projStart.setHours(0, 0, 0, 0)

    // Ensure start is before end
    if (projStart.getTime() >= projEnd.getTime()) {
      projStart = new Date(projEnd)
      projStart.setDate(projStart.getDate() - 30)
    }

    return { projStart, projEnd }
  }

  // Calculate bar position for a project
  const getBarPosition = (proj: Project) => {
    const { projStart, projEnd } = getResolvedProjectDates(proj)

    const startDays = daysBetween(viewConfig.start, projStart)
    const endDays = daysBetween(viewConfig.start, projEnd)

    const leftPct = Math.max(0, (startDays / viewConfig.totalDays) * 100)
    const rightPct = Math.min(100, (endDays / viewConfig.totalDays) * 100)
    const widthPct = Math.max(2, rightPct - leftPct)

    return { left: leftPct, width: widthPct, isVisible: rightPct > 0 && leftPct < 100 }
  }

  // Calculate task bar position
  const getTaskBarPosition = (task: WorkItem, proj: Project) => {
    const { projStart, projEnd } = getResolvedProjectDates(proj)
    let taskStart: Date
    let taskEnd: Date

    if (task.startDate && task.dueDate) {
      taskStart = new Date(task.startDate)
      taskEnd = new Date(task.dueDate)
    } else if (task.dueDate) {
      taskEnd = new Date(task.dueDate)
      taskStart = new Date(taskEnd)
      taskStart.setDate(taskStart.getDate() - 10)
    } else if (task.startDate) {
      taskStart = new Date(task.startDate)
      taskEnd = new Date(taskStart)
      taskEnd.setDate(taskEnd.getDate() + 10)
    } else {
      taskStart = new Date(projStart)
      taskEnd = new Date(taskStart)
      taskEnd.setDate(taskEnd.getDate() + 14)
    }

    taskStart.setHours(0, 0, 0, 0)
    taskEnd.setHours(0, 0, 0, 0)

    if (taskStart.getTime() >= taskEnd.getTime()) {
      taskEnd = new Date(taskStart)
      taskEnd.setDate(taskEnd.getDate() + 5)
    }

    const startDays = daysBetween(viewConfig.start, taskStart)
    const endDays = daysBetween(viewConfig.start, taskEnd)

    const leftPct = Math.max(0, (startDays / viewConfig.totalDays) * 100)
    const rightPct = Math.min(100, (endDays / viewConfig.totalDays) * 100)
    const widthPct = Math.max(1.5, rightPct - leftPct)

    return { left: leftPct, width: widthPct, isVisible: rightPct > 0 && leftPct < 100, taskStart, taskEnd }
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
    return workItems.filter(
      (w) => w.projectId === projectId || w.projectId === projectId.replace(/^project-/, '')
    )
  }

  // Unscheduled work items (no due date, not done)
  const unscheduledTasks = useMemo(() => {
    return workItems.filter((w) => !w.dueDate && !w.startDate && w.status !== 'done')
  }, [workItems])

  const handleProjectFilterChange = (id: string | null) => {
    setLocalFocusedProject(id)
    onSelectProject?.(id)
  }

  const viewModes: { key: ViewMode; label: string }[] = [
    { key: 'month', label: '3 Months' },
    { key: 'quarter', label: '6 Months' },
    { key: 'half-year', label: '12 Months' },
  ]

  const activeProjectsToRender = focusedProject ? [focusedProject] : projects

  return (
    <div className="space-y-4">
      {/* ─── Controls & Filter Toolbar ─── */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        {/* Project Scope / Focus Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Scope:</span>
          </div>
          <select
            value={localFocusedProject || 'all'}
            onChange={(e) => handleProjectFilterChange(e.target.value === 'all' ? null : e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Projects (Executive Overview)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {focusedProject && (
            <button
              onClick={() => handleProjectFilterChange(null)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Clear Focus (Show All)
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
            {viewModes.map((vm) => (
              <button
                key={vm.key}
                onClick={() => { setViewMode(vm.key); setOffset(0) }}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
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
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setOffset((o) => o - 1)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Earlier</span>
            </button>
            <button
              onClick={() => setOffset(0)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={() => setOffset((o) => o + 1)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <span>Later</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Main Gantt Chart Grid ─── */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
        {/* Month Header */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
          <div className="flex-shrink-0 w-48 sm:w-64 p-3 border-r border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {focusedProject ? 'Project & Tasks' : 'Projects'}
            </span>
            <span className="text-[10px] text-slate-400">
              {activeProjectsToRender.length} items
            </span>
          </div>

          <div className="flex-1 flex relative">
            {monthColumns.map((col) => (
              <div
                key={col.label}
                className="text-center py-2.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider border-r border-slate-100 dark:border-slate-800/60 last:border-r-0"
                style={{ width: `${col.width}%` }}
              >
                {col.label}
              </div>
            ))}
          </div>
        </div>

        {/* ─── RENDER ROWS: ALL PROJECTS OR FOCUSED PROJECT ─── */}
        {activeProjectsToRender.map((proj, idx) => {
          const color = PROJECT_COLORS[idx % PROJECT_COLORS.length]
          const bar = getBarPosition(proj)
          const tasks = getProjectTasks(proj.id)
          const doneTasks = tasks.filter((t) => t.status === 'done').length
          const isExpanded = expandedProjectId === proj.id || focusedProject?.id === proj.id

          return (
            <div key={proj.id} className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {/* Master Project Row */}
              <div
                className={`flex hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors ${
                  isExpanded ? 'bg-slate-50/40 dark:bg-slate-800/20' : ''
                }`}
              >
                {/* Project label column */}
                <div
                  onClick={() => {
                    if (onProjectClick) onProjectClick(proj)
                    else setExpandedProjectId(isExpanded ? null : proj.id)
                  }}
                  className="flex-shrink-0 w-48 sm:w-64 p-3 border-r border-slate-200 dark:border-slate-800 flex items-center gap-2 cursor-pointer group"
                >
                  <div className={`w-3 h-3 rounded-xs flex-shrink-0 ${color.bar}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {proj.name}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <ProjectStatusBadge status={proj.status} />
                      <span className="text-[10px] text-slate-400 font-mono">
                        {doneTasks}/{tasks.length} tasks
                      </span>
                    </div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>

                {/* Timeline Bar Canvas */}
                <div className="flex-1 relative py-3 px-1 min-h-[48px]">
                  {/* Week gridlines */}
                  {monthColumns.map((col) => (
                    <div
                      key={`grid-${col.label}`}
                      className="absolute top-0 bottom-0 border-r border-slate-100/60 dark:border-slate-800/30"
                      style={{ left: `${(col.endDay / viewConfig.totalDays) * 100}%` }}
                    />
                  ))}

                  {/* Today marker line */}
                  {todayPos !== null && (
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                      style={{ left: `${todayPos}%` }}
                    >
                      <span className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-red-500" />
                    </div>
                  )}

                  {/* Master Project Duration Bar */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-7 rounded-lg overflow-hidden group/bar cursor-pointer transition-all shadow-xs hover:shadow-md"
                    style={{
                      left: `${bar.left}%`,
                      width: `${bar.width}%`,
                      minWidth: '32px',
                    }}
                    onClick={() => (onProjectClick ? onProjectClick(proj) : setExpandedProjectId(isExpanded ? null : proj.id))}
                  >
                    {/* Background track */}
                    <div className={`absolute inset-0 ${color.bar} opacity-30 dark:opacity-35 rounded-lg`} />
                    {/* Progress fill */}
                    {(() => {
                      const prog = getProjectProgress(proj.id)
                      return (
                        <>
                          <div
                            className={`absolute inset-y-0 left-0 ${color.bar} opacity-75 dark:opacity-70 rounded-l-lg ${
                              prog >= 100 ? 'rounded-r-lg' : ''
                            }`}
                            style={{ width: `${Math.min(100, prog)}%` }}
                          />
                          {/* Bar Border */}
                          <div className={`absolute inset-0 rounded-lg border-2 ${color.border}`} />
                          {/* Label inside bar */}
                          <div className="absolute inset-0 flex items-center justify-between px-2.5 overflow-hidden">
                            <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate drop-shadow-sm">
                              {proj.name}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-slate-900 dark:text-white bg-white/40 dark:bg-black/30 px-1.5 py-0.5 rounded ml-1">
                              {prog}%
                            </span>
                          </div>
                        </>
                      )
                    })()}
                  </div>

                  {/* Milestone Diamonds along the bar */}
                  {(proj.milestones || []).map((ms) => {
                    const pos = getMilestonePos(ms)
                    if (pos === null) return null
                    return (
                      <div
                        key={ms.id}
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 group/ms"
                        style={{ left: `${pos}%` }}
                        title={`${ms.title} — ${ms.dueDate}${ms.completed ? ' (Completed)' : ''}`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rotate-45 rounded-xs border-2 shadow-sm transition-transform group-hover/ms:scale-125 ${
                            ms.completed
                              ? 'bg-emerald-500 border-emerald-600'
                              : 'bg-white dark:bg-slate-800 border-amber-500'
                          }`}
                        />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/ms:block z-30 pointer-events-none">
                          <div className="px-2.5 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-700 text-white text-[10px] font-medium shadow-lg whitespace-nowrap">
                            <div className="font-bold">{ms.title}</div>
                            <div className="text-slate-300 text-[9px] mt-0.5">
                              Due: {ms.dueDate} {ms.completed ? '• ✅ Delivered' : '• Pending'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* ─── EXPANDED OR FOCUSED: CONSTITUENT TASK TIMELINE BARS ─── */}
              {isExpanded && tasks.length > 0 && (
                <div className="bg-slate-50/70 dark:bg-slate-900/40 divide-y divide-slate-100 dark:divide-slate-800/40 border-t border-slate-100 dark:border-slate-800">
                  <div className="px-4 py-1.5 bg-slate-100/70 dark:bg-slate-800/60 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                    <span>Constituent Work Items & Tasks ({tasks.length})</span>
                    <span className="font-normal text-slate-400">Click task to view details / blockers</span>
                  </div>

                  {tasks.map((task) => {
                    const taskBar = getTaskBarPosition(task, proj)
                    const isDone = task.status === 'done'
                    const isBlocked = task.status === 'blocked'
                    const hasDeps = task.dependencies && task.dependencies.length > 0

                    return (
                      <div
                        key={task.id}
                        onClick={() => onTaskClick?.(task)}
                        className="flex hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors cursor-pointer group"
                      >
                        {/* Task label */}
                        <div className="flex-shrink-0 w-48 sm:w-64 p-2 pl-6 border-r border-slate-200 dark:border-slate-800 flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-slate-400 flex-shrink-0">
                            {task.itemNumber}
                          </span>
                          <span className={`text-xs truncate font-medium ${isDone ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200 group-hover:text-blue-600'}`}>
                            {task.title}
                          </span>
                          {hasDeps && (
                            <span title={`Depends on: ${task.dependencies?.join(', ')}`} className="text-[10px]">
                              🔗
                            </span>
                          )}
                        </div>

                        {/* Task Timeline Bar Canvas */}
                        <div className="flex-1 relative py-2 px-1 min-h-[36px]">
                          {/* Week gridlines */}
                          {monthColumns.map((col) => (
                            <div
                              key={`tgrid-${col.label}`}
                              className="absolute top-0 bottom-0 border-r border-slate-100/40 dark:border-slate-800/20"
                              style={{ left: `${(col.endDay / viewConfig.totalDays) * 100}%` }}
                            />
                          ))}

                          {/* Today line */}
                          {todayPos !== null && (
                            <div
                              className="absolute top-0 bottom-0 w-0.5 bg-red-500/50 z-10"
                              style={{ left: `${todayPos}%` }}
                            />
                          )}

                          {/* Task Bar */}
                          <div
                            className={`absolute top-1/2 -translate-y-1/2 h-5 rounded-md overflow-hidden flex items-center px-2 shadow-2xs border transition-all ${
                              isDone
                                ? 'bg-emerald-500/30 border-emerald-400/50 text-emerald-800 dark:text-emerald-300'
                                : isBlocked
                                ? 'bg-red-500/40 border-red-400 text-red-900 dark:text-red-200'
                                : task.priority === 'critical'
                                ? 'bg-purple-500/40 border-purple-400 text-purple-900 dark:text-purple-200'
                                : 'bg-blue-400/30 border-blue-400/60 text-blue-900 dark:text-blue-200'
                            }`}
                            style={{
                              left: `${taskBar.left}%`,
                              width: `${taskBar.width}%`,
                              minWidth: '24px',
                            }}
                          >
                            <span className="text-[10px] font-bold truncate">
                              {task.title}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ─── Unscheduled Tasks Drawer ─── */}
      {!focusedProject && unscheduledTasks.length > 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20 p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <CalendarOff className="w-4 h-4" />
            <span className="uppercase tracking-wider">Unscheduled Tasks ({unscheduledTasks.length})</span>
            <span className="text-[10px] font-normal text-slate-400">— Tasks without target deadlines</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {unscheduledTasks.slice(0, 9).map((t) => (
              <div
                key={t.id}
                onClick={() => onTaskClick?.(t)}
                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-mono font-bold text-[10px] text-slate-500">
                    {t.itemNumber}
                  </span>
                  <span className="truncate text-slate-800 dark:text-slate-200">
                    {t.title}
                  </span>
                </div>
                <StatusBadge status={t.status} />
              </div>
            ))}
            {unscheduledTasks.length > 9 && (
              <div className="text-[11px] text-slate-400 p-2 col-span-full">
                +{unscheduledTasks.length - 9} more unscheduled items
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
