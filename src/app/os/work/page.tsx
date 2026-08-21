'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useOS } from '@/os/context/OSContext'
import { WorkItem, WorkItemStatus, WorkItemType, WorkItemPriority } from '@/os/types'
import { StatusBadge } from '@/os/components/StatusBadge'
import { PriorityBadge } from '@/os/components/PriorityBadge'
import { ProjectStatusBadge } from '@/os/components/ProjectStatusBadge'
import { WorkItemDetailModal } from '@/os/components/WorkItemDetailModal'
import { DecompositionModal } from '@/os/components/DecompositionModal'
import {
  CheckSquare,
  List,
  Kanban,
  Filter,
  Search,
  Plus,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Bug,
  HelpCircle,
  FileCode2,
  CheckCircle2,
  FolderKanban,
  Layers,
  ChevronDown,
} from 'lucide-react'

export default function WorkTrackerPage() {
  const { workItems, products, productAreas, projects, updateWorkItemStatus } = useOS()

  const [viewMode, setViewMode] = useState<'list' | 'board'>('list')
  const [groupByProject, setGroupByProject] = useState(false)
  const [filterProject, setFilterProject] = useState<string>('all')
  const [filterProduct, setFilterProduct] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterArea, setFilterArea] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null)
  const [decompositionItem, setDecompositionItem] = useState<WorkItem | null>(null)

  const filteredItems = workItems.filter((item) => {
    if (filterProduct !== 'all' && item.productId !== filterProduct) return false
    if (filterType !== 'all' && item.type !== filterType) return false
    if (filterPriority !== 'all' && item.priority !== filterPriority) return false
    if (filterArea !== 'all' && item.productAreaId !== filterArea) return false
    if (
      filterProject !== 'all' &&
      item.projectId !== filterProject &&
      item.projectId !== filterProject.replace(/^project-/, '')
    )
      return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        item.title.toLowerCase().includes(q) ||
        item.itemNumber.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.codeReference?.toLowerCase().includes(q)
      )
    }
    return true
  })

  const statuses: WorkItemStatus[] = ['backlog', 'todo', 'in_progress', 'blocked', 'done']

  const renderTaskRow = (item: WorkItem) => (
    <div
      key={item.id}
      onClick={() => setSelectedItem(item)}
      className="p-3.5 sm:p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group transition-colors"
    >
      <div className="flex items-start gap-2.5 sm:gap-3 min-w-0 flex-1">
        <div className="pt-0.5 shrink-0">
          <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
            {item.itemNumber}
          </span>
        </div>

        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {item.title}
            </h4>
            <PriorityBadge priority={item.priority} />
            <span className="text-[9px] sm:text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
              {item.productId}
            </span>
            {item.projectId && (
              <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
                {item.projectId}
              </span>
            )}
          </div>

          {item.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
              {item.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-slate-400 pt-0.5">
            <span>Assignee: <strong className="text-slate-600 dark:text-slate-300 capitalize">{item.assignee}</strong></span>
            {item.dueDate && <span>Due: {item.dueDate}</span>}
            {item.dependencies && item.dependencies.length > 0 && (
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                ⚠️ Blocked by {item.dependencies.length} deps
              </span>
            )}
            {item.codeReference && (
              item.codeReference.startsWith('PR-') || item.codeReference.startsWith('PROP-') ? (
                <Link
                  href="/os/proposals"
                  onClick={(e) => e.stopPropagation()}
                  className="font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 hover:underline px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 border border-purple-200 dark:border-purple-900/60"
                >
                  <span>{item.codeReference}</span>
                  <span className="text-[9px]">↗</span>
                </Link>
              ) : (
                <span className="font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1 rounded truncate max-w-[200px] sm:max-w-xs">
                  {item.codeReference}
                </span>
              )
            )}
            {item.subtasks && item.subtasks.length > 0 && (
              <span>
                {item.subtasks.filter((st) => st.completed).length}/{item.subtasks.length} subtasks
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/60">
        <StatusBadge status={item.status} />

        <select
          value={item.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) =>
            updateWorkItemStatus(item.id, e.target.value as WorkItemStatus)
          }
          className="text-[11px] py-1 px-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s.replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </select>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <CheckSquare className="w-4 h-4" />
            <span>Work & Execution Management</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white tracking-tight mt-1">
            Work Stream & Bug Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Opinionated, low-friction tracking for tasks, bugs, technical debt, and features.
          </p>
        </div>

        {/* View Switcher (List vs Board vs Group by Project) */}
        <div className="flex flex-wrap items-center gap-2">
          {viewMode === 'list' && (
            <button
              onClick={() => setGroupByProject((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                groupByProject
                  ? 'bg-purple-50 dark:bg-purple-950/50 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 font-semibold shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Group by Project</span>
            </button>
          )}

          <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'board'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban Board</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search items, bugs, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          {/* Project Filter */}
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="w-full sm:w-auto px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 font-medium max-w-[160px] truncate"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Product Filter */}
          <select
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value)}
            className="w-full sm:w-auto px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 font-medium"
          >
            <option value="all">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-auto px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Types</option>
            <option value="bug">Bugs ({workItems.filter((i) => i.type === 'bug').length})</option>
            <option value="task">Tasks</option>
            <option value="feature">Features</option>
            <option value="tech_debt">Tech Debt</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="w-full sm:w-auto px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Priorities</option>
            <option value="critical">P0 Critical</option>
            <option value="high">P1 High</option>
            <option value="medium">P2 Medium</option>
            <option value="low">P3 Low</option>
          </select>

          {/* Product Area Filter */}
          <select
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value)}
            className="w-full sm:w-auto px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 max-w-full sm:max-w-[150px] truncate"
          >
            <option value="all">All Areas</option>
            {productAreas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-[11px] sm:text-xs text-slate-400 font-mono sm:ml-auto self-end sm:self-auto">
          {filteredItems.length} items
        </span>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: LIST VIEW                                                         */}
      {/* ========================================================================= */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs p-12 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No work items found
              </div>
              <p className="text-xs text-slate-500">
                Try clearing your filters or capture a new task.
              </p>
            </div>
          ) : groupByProject ? (
            /* Grouped by Project view */
            <div className="space-y-4">
              {projects.map((proj) => {
                const projTasks = filteredItems.filter(
                  (w) => w.projectId === proj.id || w.projectId === proj.id.replace(/^project-/, '')
                )
                if (projTasks.length === 0) return null

                const doneCount = projTasks.filter((t) => t.status === 'done').length

                return (
                  <div
                    key={proj.id}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden"
                  >
                    {/* Project Section Header */}
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <FolderKanban className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate font-heading">
                          {proj.name}
                        </h3>
                        <ProjectStatusBadge status={proj.status} />
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 shrink-0">
                        {doneCount}/{projTasks.length} Done ({Math.round((doneCount / projTasks.length) * 100)}%)
                      </div>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {projTasks.map(renderTaskRow)}
                    </div>
                  </div>
                )
              })}

              {/* Tasks without a project */}
              {filteredItems.some((w) => !w.projectId) && (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-slate-400" />
                      <h3 className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 font-heading">
                        General & Unassigned Tasks
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {filteredItems.filter((w) => !w.projectId).length} tasks
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredItems.filter((w) => !w.projectId).map(renderTaskRow)}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Standard flat list */
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
              {filteredItems.map(renderTaskRow)}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: KANBAN BOARD                                                      */}
      {/* ========================================================================= */}
      {viewMode === 'board' && (
        <div className="flex md:grid md:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory pb-4">
          {statuses.map((status) => {
            const columnItems = filteredItems.filter((i) => i.status === status)

            const columnConfig: Record<
              WorkItemStatus,
              { title: string; color: string; countBg: string }
            > = {
              backlog: {
                title: 'Backlog',
                color: 'text-slate-600 dark:text-slate-400',
                countBg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
              },
              todo: {
                title: 'To Do',
                color: 'text-blue-600 dark:text-blue-400',
                countBg: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300',
              },
              in_progress: {
                title: 'In Progress',
                color: 'text-amber-600 dark:text-amber-400',
                countBg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300',
              },
              blocked: {
                title: 'Blocked',
                color: 'text-red-600 dark:text-red-400',
                countBg: 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300',
              },
              done: {
                title: 'Done',
                color: 'text-emerald-600 dark:text-emerald-400',
                countBg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300',
              },
            }

            const config = columnConfig[status]

            return (
              <div
                key={status}
                className="w-[85vw] sm:w-[320px] md:w-auto shrink-0 snap-center bg-slate-50 dark:bg-slate-900/50 rounded-xl p-2.5 sm:p-3 border border-slate-200/80 dark:border-slate-800 space-y-2.5 flex flex-col max-h-[calc(100vh-250px)]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 shrink-0">
                  <span className={`text-xs font-bold uppercase tracking-wider ${config.color}`}>
                    {config.title}
                  </span>
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${config.countBg}`}>
                    {columnItems.length}
                  </span>
                </div>

                {/* Column Items Scroll Area */}
                <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                  {columnItems.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                      No items
                    </div>
                  ) : (
                    columnItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="p-3 bg-white dark:bg-slate-800/90 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:border-blue-500/50 hover:shadow-xs cursor-pointer space-y-2 transition-all"
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="font-mono text-[10px] font-bold text-slate-500">
                            {item.itemNumber}
                          </span>
                          <PriorityBadge priority={item.priority} />
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                          {item.title}
                        </h4>

                        {item.description && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                            {item.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-700/50">
                          <span className="capitalize">{item.assignee}</span>
                          {item.dueDate && <span>{item.dueDate}</span>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <WorkItemDetailModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          onOpenDecomposition={(item) => {
            setDecompositionItem(item)
            setSelectedItem(null)
          }}
        />
      )}

      {/* Decomposition Modal */}
      {decompositionItem && (
        <DecompositionModal
          item={decompositionItem}
          isOpen={!!decompositionItem}
          onClose={() => setDecompositionItem(null)}
        />
      )}
    </div>
  )
}
