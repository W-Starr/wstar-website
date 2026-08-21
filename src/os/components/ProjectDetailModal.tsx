'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useOS } from '../context/OSContext'
import { Project, Milestone, WorkItem, WorkItemStatus } from '../types'
import { ProjectStatusBadge } from './ProjectStatusBadge'
import { StatusBadge } from './StatusBadge'
import { PriorityBadge } from './PriorityBadge'
import {
  X,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Trash2,
  ChartGantt,
  ExternalLink,
  Target,
  Layers,
  Sparkles,
  Edit2,
  Check,
} from 'lucide-react'

interface ProjectDetailModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  onOpenTaskDetail?: (item: WorkItem) => void
}

export function ProjectDetailModal({
  project,
  isOpen,
  onClose,
  onOpenTaskDetail,
}: ProjectDetailModalProps) {
  const router = useRouter()
  const {
    projects,
    workItems,
    updateProject,
    addMilestone,
    toggleMilestone,
    deleteMilestone,
    addWorkItem,
    updateWorkItemStatus,
  } = useOS()

  const [newMilestoneTitle, setNewMilestoneTitle] = useState('')
  const [newMilestoneDate, setNewMilestoneDate] = useState('')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [taskFilterStatus, setTaskFilterStatus] = useState<string>('all')
  const [isEditingSummary, setIsEditingSummary] = useState(false)
  const [editSummaryText, setEditSummaryText] = useState('')

  if (!isOpen || !project) return null

  // Ensure we get live project state from context store
  const liveProject = projects.find((p) => p.id === project.id) || project

  // Find all work items assigned to this project
  const linkedTasks = workItems.filter(
    (w) => w.projectId === liveProject.id || w.projectId === liveProject.id.replace(/^project-/, '')
  )

  const filteredTasks = linkedTasks.filter((t) => {
    if (taskFilterStatus === 'all') return true
    if (taskFilterStatus === 'open') return t.status !== 'done'
    return t.status === taskFilterStatus
  })

  const completedTasksCount = linkedTasks.filter((t) => t.status === 'done').length
  const blockedTasksCount = linkedTasks.filter((t) => t.status === 'blocked').length

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMilestoneTitle.trim() || !newMilestoneDate) return

    addMilestone(liveProject.id, {
      title: newMilestoneTitle.trim(),
      dueDate: newMilestoneDate,
      completed: false,
    })

    setNewMilestoneTitle('')
    setNewMilestoneDate('')
  }

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    addWorkItem({
      title: newTaskTitle.trim(),
      type: 'task',
      status: 'todo',
      priority: 'medium',
      productId: liveProject.productId || 'ace-acad',
      projectId: liveProject.id,
      assignee: 'abdulaziz',
    })

    setNewTaskTitle('')
  }

  const handleSaveSummary = () => {
    updateProject(liveProject.id, { summary: editSummaryText })
    setIsEditingSummary(false)
  }

  const handleViewInTimeline = () => {
    onClose()
    router.push(`/os/timeline?project=${liveProject.id}`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-400">
                {liveProject.id}
              </span>
              <ProjectStatusBadge status={liveProject.status} />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {liveProject.productId || 'ace-acad'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight font-heading">
              {liveProject.name}
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleViewInTimeline}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
            >
              <ChartGantt className="w-3.5 h-3.5" />
              <span>Timeline View</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Metadata & Status Quick Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs">
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Lead</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{liveProject.lead}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Timeline</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {liveProject.startDate || 'TBD'} → <span className="text-blue-600 dark:text-blue-400">{liveProject.targetDate}</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Task Progress</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {completedTasksCount}/{linkedTasks.length} Done ({linkedTasks.length > 0 ? Math.round((completedTasksCount / linkedTasks.length) * 100) : 0}%)
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Overall Health</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${liveProject.status === 'at_risk' ? 'bg-amber-500' : liveProject.status === 'blocked' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                <span className="capitalize">{liveProject.status.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Quick Status Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Set Status:</span>
            {(['planned', 'active', 'at_risk', 'blocked', 'completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => updateProject(liveProject.id, { status: st })}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  liveProject.status === st
                    ? st === 'completed'
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : st === 'at_risk'
                      ? 'bg-amber-600 text-white font-semibold shadow-xs'
                      : st === 'blocked'
                      ? 'bg-red-600 text-white font-semibold shadow-xs'
                      : 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {st.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          {/* Project Summary */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Summary & Objectives
              </h3>
              {!isEditingSummary ? (
                <button
                  onClick={() => {
                    setEditSummaryText(liveProject.summary)
                    setIsEditingSummary(true)
                  }}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:underline cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveSummary}
                    className="flex items-center gap-1 text-xs text-emerald-600 font-semibold hover:underline cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => setIsEditingSummary(false)}
                    className="text-xs text-slate-400 hover:underline cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            {isEditingSummary ? (
              <textarea
                value={editSummaryText}
                onChange={(e) => setEditSummaryText(e.target.value)}
                rows={3}
                className="w-full p-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500"
              />
            ) : (
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                {liveProject.summary || 'No project description recorded.'}
              </p>
            )}
          </div>

          {/* Milestones Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Milestones ({(liveProject.milestones || []).filter((m) => m.completed).length}/{(liveProject.milestones || []).length})
              </h3>
            </div>

            {/* Milestones List */}
            <div className="space-y-1.5">
              {(liveProject.milestones || []).length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                  No milestones added yet. Add critical target deadlines below.
                </div>
              ) : (
                (liveProject.milestones || []).map((ms) => (
                  <div
                    key={ms.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800"
                  >
                    <div
                      onClick={() => toggleMilestone(liveProject.id, ms.id)}
                      className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                    >
                      <input
                        type="checkbox"
                        checked={ms.completed}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 pointer-events-none"
                      />
                      <span
                        className={`text-xs font-medium truncate ${
                          ms.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {ms.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] font-mono text-slate-500 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {ms.dueDate}
                      </span>
                      <button
                        onClick={() => deleteMilestone(liveProject.id, ms.id)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Milestone Form */}
            <form onSubmit={handleAddMilestone} className="flex flex-col sm:flex-row gap-2 pt-1">
              <input
                type="text"
                placeholder="New milestone title..."
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              <input
                type="date"
                value={newMilestoneDate}
                onChange={(e) => setNewMilestoneDate(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              />
              <button
                type="submit"
                disabled={!newMilestoneTitle.trim() || !newMilestoneDate}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold disabled:opacity-40 flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Milestone</span>
              </button>
            </form>
          </div>

          {/* Linked Work Items Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Linked Work Items ({linkedTasks.length})
              </h3>
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs self-start sm:self-auto">
                {(['all', 'open', 'in_progress', 'blocked', 'done'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setTaskFilterStatus(f)}
                    className={`px-2 py-0.5 rounded capitalize text-[11px] font-medium transition-all ${
                      taskFilterStatus === f
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {f.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {filteredTasks.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                  {linkedTasks.length === 0
                    ? 'No tasks mapped to this project yet. Add one below.'
                    : `No tasks found matching "${taskFilterStatus}".`}
                </div>
              ) : (
                filteredTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onOpenTaskDetail?.(t)}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400 flex-shrink-0">
                        {t.itemNumber}
                      </span>
                      <span className={`text-xs font-medium truncate ${t.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {t.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <PriorityBadge priority={t.priority} />
                      <StatusBadge status={t.status} />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Add Task */}
            <form onSubmit={handleCreateTask} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add task to this project..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!newTaskTitle.trim()}
                className="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </form>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Target Deadline: <strong className="text-blue-600 dark:text-blue-400">{liveProject.targetDate}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleViewInTimeline}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ChartGantt className="w-3.5 h-3.5" />
              <span>Open Project Timeline</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
