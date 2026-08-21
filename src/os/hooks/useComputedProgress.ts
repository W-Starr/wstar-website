'use client'

import { useMemo } from 'react'
import { WorkItem, Project, ProductArea } from '@/os/types'

interface ProductStats {
  totalTasks: number
  doneTasks: number
  inProgressTasks: number
  openBugs: number
  totalProjects: number
  activeProjects: number
  completedProjects: number
  overallProgress: number
}

/**
 * Centralized computation hook for project progress, area maturity, and product stats.
 * All percentages are derived from actual task/milestone completion — never stored statically.
 *
 * Priority: Tasks are ground truth. Milestones are fallback when no tasks are linked.
 */
export function useComputedProgress(
  workItems: WorkItem[],
  projects: Project[],
  productAreas: ProductArea[]
) {
  // Pre-index work items by projectId for O(1) lookups
  const tasksByProject = useMemo(() => {
    const map = new Map<string, WorkItem[]>()
    for (const w of workItems) {
      if (!w.projectId) continue
      const key = w.projectId.replace(/^project-/, '')
      const existing = map.get(key) || []
      existing.push(w)
      map.set(key, existing)

      // Also index by the raw projectId (with prefix) for matching
      if (w.projectId !== key) {
        const existingFull = map.get(w.projectId) || []
        existingFull.push(w)
        map.set(w.projectId, existingFull)
      }
    }
    return map
  }, [workItems])

  // Pre-index work items by productAreaId
  const tasksByArea = useMemo(() => {
    const map = new Map<string, WorkItem[]>()
    for (const w of workItems) {
      if (!w.productAreaId) continue
      const key = w.productAreaId.replace(/^area-/, '')
      const existing = map.get(key) || []
      existing.push(w)
      map.set(key, existing)

      if (w.productAreaId !== key) {
        const existingFull = map.get(w.productAreaId) || []
        existingFull.push(w)
        map.set(w.productAreaId, existingFull)
      }
    }
    return map
  }, [workItems])

  // Pre-index work items by productId
  const tasksByProduct = useMemo(() => {
    const map = new Map<string, WorkItem[]>()
    for (const w of workItems) {
      if (!w.productId) continue
      const key = w.productId.replace(/^product-/, '').toLowerCase()
      const existing = map.get(key) || []
      existing.push(w)
      map.set(key, existing)
    }
    return map
  }, [workItems])

  // Pre-index projects by productId
  const projectsByProduct = useMemo(() => {
    const map = new Map<string, Project[]>()
    for (const p of projects) {
      if (!p.productId) continue
      const key = p.productId.replace(/^product-/, '').toLowerCase()
      const existing = map.get(key) || []
      existing.push(p)
      map.set(key, existing)
    }
    return map
  }, [projects])

  /**
   * Compute project progress from linked tasks (primary) or milestones (fallback).
   * Tasks are ground truth. If no tasks and no milestones, status determines 0 or 100.
   */
  const getProjectProgress = useMemo(() => {
    return (projectId: string): number => {
      const project = projects.find(
        (p) => p.id === projectId || p.id.replace(/^project-/, '') === projectId
      )

      // Get linked tasks
      const normalizedId = projectId.replace(/^project-/, '')
      const linked = tasksByProject.get(normalizedId) || tasksByProject.get(projectId) || []

      if (linked.length > 0) {
        const done = linked.filter((t) => t.status === 'done').length
        return Math.round((done / linked.length) * 100)
      }

      // Fallback: milestones
      if (project && project.milestones && project.milestones.length > 0) {
        const completed = project.milestones.filter((m) => m.completed).length
        return Math.round((completed / project.milestones.length) * 100)
      }

      // No tasks, no milestones: status-based
      if (project?.status === 'completed') return 100
      return 0
    }
  }, [projects, tasksByProject])

  /**
   * Compute product area maturity from linked tasks.
   * No tasks linked = 0% (no claim of progress without evidence).
   */
  const getAreaMaturity = useMemo(() => {
    return (areaId: string): number => {
      const normalizedId = areaId.replace(/^area-/, '')
      const linked = tasksByArea.get(normalizedId) || tasksByArea.get(areaId) || []

      if (linked.length === 0) return 0

      const done = linked.filter((t) => t.status === 'done').length
      return Math.round((done / linked.length) * 100)
    }
  }, [tasksByArea])

  /**
   * Compute aggregate stats for a product.
   */
  const getProductStats = useMemo(() => {
    return (productId: string): ProductStats => {
      const key = productId.replace(/^product-/, '').toLowerCase()
      const tasks = tasksByProduct.get(key) || []
      const prods = projectsByProduct.get(key) || []

      const totalTasks = tasks.length
      const doneTasks = tasks.filter((t) => t.status === 'done').length
      const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length
      const openBugs = tasks.filter((t) => t.type === 'bug' && t.status !== 'done').length

      const totalProjects = prods.length
      const activeProjects = prods.filter(
        (p) => p.status === 'active' || p.status === 'at_risk'
      ).length
      const completedProjects = prods.filter((p) => p.status === 'completed').length

      const overallProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

      return {
        totalTasks,
        doneTasks,
        inProgressTasks,
        openBugs,
        totalProjects,
        activeProjects,
        completedProjects,
        overallProgress,
      }
    }
  }, [tasksByProduct, projectsByProduct])

  return { getProjectProgress, getAreaMaturity, getProductStats }
}
