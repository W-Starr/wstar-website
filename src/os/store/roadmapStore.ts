import { create } from 'zustand'
import { RoadmapItem, Project, Milestone, ProductId } from '@/os/types'
import { dispatchMutation } from './syncHelper'

interface RoadmapStoreState {
  roadmapItems: RoadmapItem[]
  projects: Project[]
  lastError: string | null

  setRoadmapItems: (items: RoadmapItem[]) => void
  setProjects: (projects: Project[]) => void
  
  // Roadmap actions
  addRoadmapItem: (itemData: Omit<RoadmapItem, 'id'>) => RoadmapItem
  updateRoadmapHorizon: (id: string, horizon: RoadmapItem['horizon']) => void
  markRoadmapItemShipped: (id: string) => void
  updateRoadmapItem: (id: string, patches: Partial<RoadmapItem>) => void
  deleteRoadmapItem: (id: string) => void

  // Project actions
  addProject: (projectData: Omit<Project, 'id'>) => Project
  updateProject: (id: string, patches: Partial<Project>) => void
  deleteProject: (id: string) => void

  // Milestone actions
  addMilestone: (projectId: string, milestone: Omit<Milestone, 'id' | 'projectId'>) => void
  toggleMilestone: (projectId: string, milestoneId: string) => void
  deleteMilestone: (projectId: string, milestoneId: string) => void

  // Remote sync
  applyRemoteDoc: (docType: 'roadmapItem' | 'project', doc: any) => void
  applyRemoteDelete: (docType: 'roadmapItem' | 'project', id: string) => void
}

export const useRoadmapStore = create<RoadmapStoreState>((set, get) => ({
  roadmapItems: [],
  projects: [],
  lastError: null,

  setRoadmapItems: (roadmapItems) => set({ roadmapItems }),
  setProjects: (projects) => set({ projects }),

  // ─── Roadmap Operations ───
  addRoadmapItem: (itemData) => {
    const current = get().roadmapItems
    const id = `roadmap-${Date.now()}`
    const newItem: RoadmapItem = { ...itemData, id }

    set({ roadmapItems: [...current, newItem] })

    dispatchMutation('create', 'roadmapItem', id, newItem).then((res) => {
      if (!res.success) {
        console.warn('[RoadmapStore Sync Warning] addRoadmapItem failed:', res.error)
      }
    })

    return newItem
  },

  updateRoadmapHorizon: (id, horizon) => {
    const current = get().roadmapItems
    const original = current.find((i) => i.id === id)
    if (!original) return

    const shippedDate = horizon === 'shipped' ? (original.shippedDate || new Date().toISOString().split('T')[0]) : undefined
    const updated: RoadmapItem = { ...original, horizon, shippedDate }

    set({
      roadmapItems: current.map((i) => (i.id === id ? updated : i)),
    })

    dispatchMutation('patch', 'roadmapItem', id, { horizon, shippedDate }).then((res) => {
      if (!res.success) {
        console.warn('[RoadmapStore Sync Warning] updateRoadmapHorizon failed:', res.error)
      }
    })
  },

  markRoadmapItemShipped: (id) => {
    get().updateRoadmapHorizon(id, 'shipped')
  },

  updateRoadmapItem: (id, patches) => {
    const current = get().roadmapItems
    const original = current.find((i) => i.id === id)
    if (!original) return

    const updated: RoadmapItem = { ...original, ...patches }
    set({
      roadmapItems: current.map((i) => (i.id === id ? updated : i)),
    })

    dispatchMutation('patch', 'roadmapItem', id, patches).then((res) => {
      if (!res.success) {
        console.warn('[RoadmapStore Sync Warning] updateRoadmapItem failed:', res.error)
      }
    })
  },

  deleteRoadmapItem: (id) => {
    const current = get().roadmapItems
    set({ roadmapItems: current.filter((i) => i.id !== id) })

    dispatchMutation('delete', 'roadmapItem', id).then((res) => {
      if (!res.success) {
        console.warn('[RoadmapStore Sync Warning] deleteRoadmapItem failed:', res.error)
      }
    })
  },

  // ─── Project Operations ───
  addProject: (projectData) => {
    const current = get().projects
    const id = `project-${Date.now()}`
    const newProject: Project = { ...projectData, id }

    set({ projects: [...current, newProject] })

    dispatchMutation('create', 'project', id, newProject).then((res) => {
      if (!res.success) {
        console.warn('[RoadmapStore Sync Warning] addProject failed:', res.error)
      }
    })

    return newProject
  },

  updateProject: (id, patches) => {
    const current = get().projects
    const original = current.find((p) => p.id === id)
    if (!original) return

    const updated: Project = { ...original, ...patches }
    set({
      projects: current.map((p) => (p.id === id ? updated : p)),
    })

    dispatchMutation('patch', 'project', id, patches).then((res) => {
      if (!res.success) {
        console.warn('[RoadmapStore Sync Warning] updateProject failed:', res.error)
      }
    })
  },

  deleteProject: (id) => {
    const current = get().projects
    set({ projects: current.filter((p) => p.id !== id) })

    dispatchMutation('delete', 'project', id).then((res) => {
      if (!res.success) {
        console.warn('[RoadmapStore Sync Warning] deleteProject failed:', res.error)
      }
    })
  },

  // ─── Milestone Operations ───
  addMilestone: (projectId, milestoneData) => {
    const current = get().projects
    const project = current.find((p) => p.id === projectId)
    if (!project) return

    const newMilestone: Milestone = {
      ...milestoneData,
      id: `ms-${Date.now()}`,
      projectId,
    }

    const updatedMilestones = [...(project.milestones || []), newMilestone]

    const updatedProject: Project = {
      ...project,
      milestones: updatedMilestones,
    }

    set({
      projects: current.map((p) => (p.id === projectId ? updatedProject : p)),
    })

    dispatchMutation('patch', 'project', projectId, { milestones: updatedMilestones }).then((res) => {
      if (!res.success) {
        console.warn('[RoadmapStore Sync Warning] addMilestone failed:', res.error)
      }
    })
  },

  toggleMilestone: (projectId, milestoneId) => {
    const current = get().projects
    const project = current.find((p) => p.id === projectId)
    if (!project || !project.milestones) return

    const updatedMilestones = project.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    )

    const updatedProject: Project = {
      ...project,
      milestones: updatedMilestones,
    }

    set({
      projects: current.map((p) => (p.id === projectId ? updatedProject : p)),
    })

    dispatchMutation('patch', 'project', projectId, { milestones: updatedMilestones }).then((res) => {
      if (!res.success) {
        console.warn('[RoadmapStore Sync Warning] toggleMilestone failed:', res.error)
      }
    })
  },

  deleteMilestone: (projectId, milestoneId) => {
    const current = get().projects
    const project = current.find((p) => p.id === projectId)
    if (!project || !project.milestones) return

    const updatedMilestones = project.milestones.filter((m) => m.id !== milestoneId)

    const updatedProject: Project = {
      ...project,
      milestones: updatedMilestones,
    }

    set({
      projects: current.map((p) => (p.id === projectId ? updatedProject : p)),
    })

    dispatchMutation('patch', 'project', projectId, { milestones: updatedMilestones }).then((res) => {
      if (!res.success) {
        console.warn('[RoadmapStore Sync Warning] deleteMilestone failed:', res.error)
      }
    })
  },

  // ─── Remote Sync Handlers ───
  applyRemoteDoc: (docType, doc) => {
    const rawId = doc._id
    if (docType === 'roadmapItem') {
      const mapped: RoadmapItem = {
        id: rawId,
        title: doc.title,
        description: doc.description,
        horizon: doc.horizon || 'now',
        targetQuarter: doc.targetQuarter || 'Q3 2026',
        category: doc.category || 'Strategic Initiative',
        productId: doc.productId || 'ace-acad',
        shippedDate: doc.shippedDate,
      }
      const current = get().roadmapItems
      const index = current.findIndex((i) => i.id === rawId)
      if (index >= 0) {
        const next = [...current]
        next[index] = { ...next[index], ...mapped }
        set({ roadmapItems: next })
      } else {
        set({ roadmapItems: [...current, mapped] })
      }
    } else {
      const mapped: Project = {
        id: rawId,
        name: doc.name,
        summary: doc.summary,
        productId: (doc.productId || 'ace-acad') as ProductId,
        status: doc.status || 'active',
        startDate: doc.startDate,
        targetDate: doc.targetDate || '2026-10-01',
        lead: doc.lead || 'Abdulaziz',
        progress: typeof doc.progress === 'number' ? doc.progress : 0,
        dependencies: doc.dependencies || [],
        milestones: doc.milestones || [],
        sourceId: doc.sourceId,
      }
      const current = get().projects
      const index = current.findIndex((p) => p.id === rawId)
      if (index >= 0) {
        const next = [...current]
        next[index] = { ...next[index], ...mapped }
        set({ projects: next })
      } else {
        set({ projects: [...current, mapped] })
      }
    }
  },

  applyRemoteDelete: (docType, id) => {
    if (docType === 'roadmapItem') {
      set({ roadmapItems: get().roadmapItems.filter((i) => i.id !== id) })
    } else {
      set({ projects: get().projects.filter((p) => p.id !== id) })
    }
  },
}))
