'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useOS } from '@/os/context/OSContext'
import { Project, WorkItem, ProductId } from '@/os/types'
import { ProjectStatusBadge } from '@/os/components/ProjectStatusBadge'
import { ProjectDetailModal } from '@/os/components/ProjectDetailModal'
import { WorkItemDetailModal } from '@/os/components/WorkItemDetailModal'
import { DecompositionModal } from '@/os/components/DecompositionModal'
import {
  FolderKanban,
  Search,
  Plus,
  Calendar,
  Users,
  Target,
  ChartGantt,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  X,
} from 'lucide-react'

export default function ProjectsPage() {
  const router = useRouter()
  const {
    projects,
    workItems,
    products,
    addProject,
  } = useOS()

  const [searchQuery, setSearchQuery] = useState('')
  const [filterProduct, setFilterProduct] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedTask, setSelectedTask] = useState<WorkItem | null>(null)
  const [decompositionTask, setDecompositionTask] = useState<WorkItem | null>(null)
  const [isCreatingProject, setIsCreatingProject] = useState(false)

  // New Project Form state
  const [newName, setNewName] = useState('')
  const [newSummary, setNewSummary] = useState('')
  const [newProduct, setNewProduct] = useState<ProductId>('ace-acad')
  const [newLead, setNewLead] = useState('Abdulaziz')
  const [newStartDate, setNewStartDate] = useState('')
  const [newTargetDate, setNewTargetDate] = useState('')

  const filteredProjects = projects.filter((p) => {
    if (filterProduct !== 'all' && (p.productId || 'ace-acad') !== filterProduct) return false
    if (filterStatus !== 'all' && p.status !== filterStatus) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        p.name.toLowerCase().includes(q) ||
        p.summary?.toLowerCase().includes(q) ||
        p.lead?.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      )
    }
    return true
  })

  // Executive Stats
  const activeProjectsCount = projects.filter((p) => p.status === 'active' || p.status === 'at_risk').length
  const totalMilestones = projects.reduce((acc, p) => acc + (p.milestones || []).length, 0)
  const completedMilestones = projects.reduce(
    (acc, p) => acc + (p.milestones || []).filter((m) => m.completed).length,
    0
  )
  const allLinkedTasks = workItems.filter((w) => !!w.projectId)
  const doneLinkedTasks = allLinkedTasks.filter((w) => w.status === 'done')

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newTargetDate) return

    const created = addProject({
      name: newName.trim(),
      summary: newSummary.trim(),
      productId: newProduct,
      lead: newLead,
      status: 'active',
      startDate: newStartDate || new Date().toISOString().split('T')[0],
      targetDate: newTargetDate,
      progress: 0,
      milestones: [],
    })

    setNewName('')
    setNewSummary('')
    setNewStartDate('')
    setNewTargetDate('')
    setIsCreatingProject(false)
    setSelectedProject(created)
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              WSTAR OS / Project Hub
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white tracking-tight mt-1">
            Projects & Initiatives
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track company initiatives, sprint targets, milestone deliverables, and linked task progress.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/os/timeline"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
          >
            <ChartGantt className="w-3.5 h-3.5 text-blue-500" />
            <span>Timeline View</span>
          </Link>
          <button
            onClick={() => setIsCreatingProject(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Executive Health Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-blue-200/60 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-950/30 space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Active Initiatives
          </div>
          <div className="text-2xl font-bold font-heading text-blue-700 dark:text-blue-300">
            {activeProjectsCount} <span className="text-xs font-normal text-slate-500">/ {projects.length} total</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-950/30 space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Milestones Delivered
          </div>
          <div className="text-2xl font-bold font-heading text-emerald-700 dark:text-emerald-300">
            {completedMilestones} <span className="text-xs font-normal text-slate-500">/ {totalMilestones} ({totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0}%)</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-purple-200/60 dark:border-purple-800/40 bg-purple-50 dark:bg-purple-950/30 space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Linked Tasks Done
          </div>
          <div className="text-2xl font-bold font-heading text-purple-700 dark:text-purple-300">
            {doneLinkedTasks.length} <span className="text-xs font-normal text-slate-500">/ {allLinkedTasks.length} tasks</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700/40 bg-slate-50 dark:bg-slate-800/40 space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Average Progress
          </div>
          <div className="text-2xl font-bold font-heading text-slate-800 dark:text-slate-200">
            {projects.length > 0 ? Math.round(projects.reduce((a, b) => a + (b.progress || 0), 0) / projects.length) : 0}%
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search projects by name, lead, summary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Product filter */}
          <select
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 font-medium"
          >
            <option value="all">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="at_risk">At Risk</option>
            <option value="planned">Planned</option>
            <option value="blocked">Blocked</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((project) => {
          const tasks = workItems.filter(
            (w) => w.projectId === project.id || w.projectId === project.id.replace(/^project-/, '')
          )
          const doneTasks = tasks.filter((t) => t.status === 'done').length
          const completedMilestonesCount = (project.milestones || []).filter((m) => m.completed).length

          return (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              {/* Top info */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold text-slate-400">
                    {project.id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <ProjectStatusBadge status={project.status} />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-heading leading-snug">
                    {project.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {project.summary || 'No project description recorded.'}
                  </p>
                </div>
              </div>

              {/* Progress & Metadata */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                {/* Timeline dates */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>{project.startDate || 'Start TBD'} → <strong className="text-slate-700 dark:text-slate-200">{project.targetDate}</strong></span>
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Users className="w-3 h-3" />
                    <span>{project.lead}</span>
                  </span>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-semibold mb-1 text-slate-600 dark:text-slate-300">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        project.status === 'completed'
                          ? 'bg-emerald-500'
                          : project.status === 'at_risk'
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Deliverables summary */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>
                    Milestones: <strong>{completedMilestonesCount}/{(project.milestones || []).length}</strong>
                  </span>
                  <span>
                    Tasks: <strong>{doneTasks}/{tasks.length}</strong>
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* New Project Modal */}
      {isCreatingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                Create New Project Initiative
              </h2>
              <button
                onClick={() => setIsCreatingProject(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ace Acad 100L Class Rep Onboarding Engine"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Objectives & Summary
                </label>
                <textarea
                  rows={2}
                  placeholder="What is this initiative aiming to achieve?"
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Product
                  </label>
                  <select
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value as ProductId)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="ace-acad">Ace Acad</option>
                    <option value="plantiq">PlantIQ</option>
                    <option value="wstar-core">WSTAR Core</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Lead
                  </label>
                  <input
                    type="text"
                    value={newLead}
                    onChange={(e) => setNewLead(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Target Completion *
                  </label>
                  <input
                    type="date"
                    required
                    value={newTargetDate}
                    onChange={(e) => setNewTargetDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreatingProject(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          onOpenTaskDetail={(task) => {
            setSelectedTask(task)
          }}
        />
      )}

      {/* Work Item Detail Modal */}
      {selectedTask && (
        <WorkItemDetailModal
          item={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onOpenDecomposition={(item) => {
            setDecompositionTask(item)
            setSelectedTask(null)
          }}
        />
      )}

      {/* Decomposition Modal */}
      {decompositionTask && (
        <DecompositionModal
          item={decompositionTask}
          isOpen={!!decompositionTask}
          onClose={() => setDecompositionTask(null)}
        />
      )}
    </div>
  )
}
