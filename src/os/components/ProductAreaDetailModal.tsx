'use client'

import React, { useState } from 'react'
import { useOS } from '../context/OSContext'
import { ProductArea, WorkItem, WorkItemStatus, WorkItemType, WorkItemPriority } from '../types'
import { StatusBadge } from './StatusBadge'
import { PriorityBadge } from './PriorityBadge'
import {
  X,
  Layers,
  User,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Trash2,
  Bug,
  ListChecks,
  Sparkles,
  ChevronRight,
  TrendingUp,
  FolderKanban,
  Edit2,
  Check,
} from 'lucide-react'

interface ProductAreaDetailModalProps {
  area: ProductArea | null
  isOpen: boolean
  onClose: () => void
  onOpenTaskDetail?: (item: WorkItem) => void
}

export function ProductAreaDetailModal({
  area,
  isOpen,
  onClose,
  onOpenTaskDetail,
}: ProductAreaDetailModalProps) {
  const {
    workItems,
    projects,
    addWorkItem,
    updateWorkItemStatus,
    deleteWorkItem,
    deleteProductArea,
    updateProductArea,
  } = useOS()

  // Edit Area Form State
  const [isEditingArea, setIsEditingArea] = useState(false)
  const [editName, setEditName] = useState(area?.name || '')
  const [editDescription, setEditDescription] = useState(area?.description || '')
  const [editOwner, setEditOwner] = useState(area?.owner || 'Abdulaziz')

  // New Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskType, setNewTaskType] = useState<WorkItemType>('task')
  const [newTaskPriority, setNewTaskPriority] = useState<WorkItemPriority>('medium')
  const [newTaskAssignee, setNewTaskAssignee] = useState<'abdulaziz' | 'ibrahim'>('abdulaziz')
  const [newTaskProjectId, setNewTaskProjectId] = useState<string>('')
  const [isAddingTask, setIsAddingTask] = useState(false)

  // Filter State
  const [taskFilter, setTaskFilter] = useState<'all' | 'open' | 'done' | 'bug' | 'tech_debt' | 'feature'>('all')

  if (!isOpen || !area) return null

  const areaKey = area.id.replace(/^area-/, '')
  const linkedTasks = workItems.filter(
    (w) =>
      w.productAreaId === area.id ||
      w.productAreaId === `area-${area.id}` ||
      w.productAreaId?.replace(/^area-/, '') === areaKey
  )

  const doneTasks = linkedTasks.filter((w) => w.status === 'done')
  const inProgressTasks = linkedTasks.filter((w) => w.status === 'in_progress')
  const blockedTasks = linkedTasks.filter((w) => w.status === 'blocked')
  const openBugs = linkedTasks.filter((w) => w.type === 'bug' && w.status !== 'done')

  const computedMaturity =
    linkedTasks.length > 0 ? Math.round((doneTasks.length / linkedTasks.length) * 100) : 0

  // Filtered task list
  const filteredTasks = linkedTasks.filter((t) => {
    if (taskFilter === 'all') return true
    if (taskFilter === 'open') return t.status !== 'done'
    if (taskFilter === 'done') return t.status === 'done'
    return t.type === taskFilter
  })

  // Projects scoped to this product for optional project assignment
  const scopedProjects = projects.filter((p) => {
    const prod = (p.productId || '').toLowerCase()
    const target = (area.productId || '').toLowerCase()
    return prod === target || prod.replace(/^product-/, '') === target
  })

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    addWorkItem({
      title: newTaskTitle.trim(),
      type: newTaskType,
      status: 'todo',
      priority: newTaskPriority,
      productId: area.productId || 'ace-acad',
      productAreaId: area.id,
      projectId: newTaskProjectId ? newTaskProjectId : undefined,
      assignee: newTaskAssignee,
    })

    setNewTaskTitle('')
    setIsAddingTask(false)
  }

  const handleSaveArea = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editName.trim()) return

    updateProductArea(area.id, {
      name: editName.trim(),
      description: editDescription.trim(),
      owner: editOwner,
    })
    setIsEditingArea(false)
  }

  const handleDeleteArea = () => {
    if (
      window.confirm(
        `Are you sure you want to delete "${area.name}"? This will permanently remove this product area from Sanity Cloud.`
      )
    ) {
      deleteProductArea(area.id)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-400">
                AREA-{area.id}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {area.productId || 'ace-acad'}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>Lead: <strong>{area.owner}</strong></span>
              </span>
            </div>

            {isEditingArea ? (
              <form onSubmit={handleSaveArea} className="space-y-3 pt-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                    Area Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full text-sm font-bold px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    placeholder="Product Area Name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 resize-none"
                    placeholder="Area purpose, architectural domain, or scope"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">
                      Lead Owner
                    </label>
                    <input
                      type="text"
                      value={editOwner}
                      onChange={(e) => setEditOwner(e.target.value)}
                      className="w-full text-xs px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      placeholder="e.g. Abdulaziz"
                    />
                  </div>
                  <div className="flex items-end gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditingArea(false)}
                      className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight font-heading flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-600" />
                  <span>{area.name}</span>
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                  {area.description}
                </p>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {!isEditingArea && (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditingArea(true)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-colors cursor-pointer"
                  title="Edit Area Details"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleDeleteArea}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                  title="Delete Product Area"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Live Progress & Stats Quick Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs">
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Maturity Progress
              </div>
              <div className="font-bold text-slate-900 dark:text-white font-mono text-base mt-0.5">
                {computedMaturity}%
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Tasks Completed
              </div>
              <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {doneTasks.length} / {linkedTasks.length} Done
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                In Progress
              </div>
              <div className="font-semibold text-purple-600 dark:text-purple-400 mt-0.5">
                {inProgressTasks.length} Active
              </div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Open Bugs
              </div>
              <div className={`font-semibold mt-0.5 ${openBugs.length > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}`}>
                {openBugs.length} Bugs
              </div>
            </div>
          </div>

          {/* Maturity Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                <span>Area Maturity Level</span>
              </span>
              <span className="font-mono text-xs font-bold">{computedMaturity}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  computedMaturity >= 85
                    ? 'bg-emerald-500'
                    : computedMaturity >= 70
                    ? 'bg-blue-500'
                    : computedMaturity >= 40
                    ? 'bg-purple-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${computedMaturity}%` }}
              />
            </div>
          </div>

          {/* Work Items Section */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Area Work Items & Action Plan
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  ({linkedTasks.length})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingTask(!isAddingTask)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingTask ? 'Cancel' : 'Add Task'}</span>
                </button>
              </div>
            </div>

            {/* Quick Add Task Form */}
            {isAddingTask && (
              <form
                onSubmit={handleCreateTask}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3 animate-in fade-in duration-150"
              >
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  New Task for {area.name}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Task title (e.g. Implement Drift caching migration)..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Type</label>
                    <select
                      value={newTaskType}
                      onChange={(e) => setNewTaskType(e.target.value as WorkItemType)}
                      className="w-full text-xs px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="task">Task</option>
                      <option value="bug">Bug</option>
                      <option value="tech_debt">Tech Debt</option>
                      <option value="feature">Feature</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Priority</label>
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as WorkItemPriority)}
                      className="w-full text-xs px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Assignee</label>
                    <select
                      value={newTaskAssignee}
                      onChange={(e) => setNewTaskAssignee(e.target.value as 'abdulaziz' | 'ibrahim')}
                      className="w-full text-xs px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="abdulaziz">Abdulaziz</option>
                      <option value="ibrahim">Ibrahim</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Project</label>
                    <select
                      value={newTaskProjectId}
                      onChange={(e) => setNewTaskProjectId(e.target.value)}
                      className="w-full text-xs px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white truncate"
                    >
                      <option value="">No Project</option>
                      {scopedProjects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingTask(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            )}

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-xs">
              {[
                { key: 'all' as const, label: 'All', count: linkedTasks.length },
                { key: 'open' as const, label: 'Open', count: linkedTasks.filter((w) => w.status !== 'done').length },
                { key: 'done' as const, label: 'Done', count: doneTasks.length },
                { key: 'bug' as const, label: 'Bugs', count: linkedTasks.filter((w) => w.type === 'bug').length },
                { key: 'tech_debt' as const, label: 'Debt', count: linkedTasks.filter((w) => w.type === 'tech_debt').length },
                { key: 'feature' as const, label: 'Features', count: linkedTasks.filter((w) => w.type === 'feature').length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setTaskFilter(tab.key)}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    taskFilter === tab.key
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Task List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredTasks.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  {linkedTasks.length === 0
                    ? `No tasks linked to ${area.name} yet. Click "Add Task" above to create one.`
                    : 'No tasks match the selected filter.'}
                </div>
              ) : (
                filteredTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs flex items-center justify-between gap-3 group transition-all"
                  >
                    <div
                      className="flex-1 min-w-0 cursor-pointer space-y-1"
                      onClick={() => onOpenTaskDetail?.(t)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-slate-400">
                          {t.itemNumber}
                        </span>
                        <PriorityBadge priority={t.priority} />
                        <span className="text-[10px] text-slate-400 font-medium capitalize">
                          {t.type.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">
                        {t.title}
                      </h4>
                      {t.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {t.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Status Selector */}
                      <select
                        value={t.status}
                        onChange={(e) =>
                          updateWorkItemStatus(t.id, e.target.value as WorkItemStatus)
                        }
                        className={`text-[10px] font-semibold px-2 py-1 rounded-lg border cursor-pointer ${
                          t.status === 'done'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                            : t.status === 'in_progress'
                            ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                            : t.status === 'blocked'
                            ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                            : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                        }`}
                      >
                        <option value="todo">Todo</option>
                        <option value="in_progress">In Progress</option>
                        <option value="in_review">In Review</option>
                        <option value="blocked">Blocked</option>
                        <option value="done">Done</option>
                        <option value="backlog">Backlog</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => onOpenTaskDetail?.(t)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="View Full Details"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteWorkItem(t.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
