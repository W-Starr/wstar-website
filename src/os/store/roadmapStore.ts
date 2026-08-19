import { create } from 'zustand'
import { RoadmapItem, Project } from '@/os/types'
import { initialRoadmap, initialProjects } from '@/os/data/initialSeed'
import { dispatchMutation } from './syncHelper'

interface RoadmapStoreState {
  roadmapItems: RoadmapItem[]
  projects: Project[]
  lastError: string | null

  setRoadmapItems: (items: RoadmapItem[]) => void
  setProjects: (projects: Project[]) => void
  addRoadmapItem: (itemData: Omit<RoadmapItem, 'id'>) => RoadmapItem
  updateRoadmapHorizon: (id: string, horizon: RoadmapItem['horizon']) => void
  applyRemoteDoc: (docType: 'roadmapItem' | 'project', doc: any) => void
  applyRemoteDelete: (docType: 'roadmapItem' | 'project', id: string) => void
}

export const useRoadmapStore = create<RoadmapStoreState>((set, get) => ({
  roadmapItems: initialRoadmap,
  projects: initialProjects,
  lastError: null,

  setRoadmapItems: (roadmapItems) => set({ roadmapItems }),
  setProjects: (projects) => set({ projects }),

  addRoadmapItem: (itemData) => {
    const current = get().roadmapItems
    const id = `road-${Date.now()}`
    const newItem: RoadmapItem = { ...itemData, id }

    // Optimistic addition
    set({ roadmapItems: [...current, newItem] })

    // Background sync with rollback
    dispatchMutation('create', 'roadmapItem', id, newItem).then((res) => {
      if (!res.success) {
        console.error('[RoadmapStore Rollback] addRoadmapItem failed:', res.error)
        set({
          roadmapItems: get().roadmapItems.filter((i) => i.id !== id),
          lastError: res.error || 'Failed to add roadmap item',
        })
      }
    })

    return newItem
  },

  updateRoadmapHorizon: (id, horizon) => {
    const current = get().roadmapItems
    const original = current.find((i) => i.id === id)
    if (!original) return

    const updated = { ...original, horizon }

    // Optimistic update
    set({
      roadmapItems: current.map((i) => (i.id === id ? updated : i)),
    })

    // Background sync with rollback
    dispatchMutation('patch', 'roadmapItem', id.startsWith('road-') || id.startsWith('roadmap-') ? id : `roadmap-${id}`, { horizon }).then((res) => {
      if (!res.success) {
        console.error('[RoadmapStore Rollback] updateRoadmapHorizon failed:', res.error)
        set({
          roadmapItems: get().roadmapItems.map((i) => (i.id === id ? original : i)),
          lastError: res.error || 'Failed to update roadmap item',
        })
      }
    })
  },

  applyRemoteDoc: (docType, doc) => {
    if (docType === 'roadmapItem') {
      const current = get().roadmapItems
      const rawId = doc._id.replace(/^roadmap-/, '').replace(/^road-/, '')
      const mapped: RoadmapItem = {
        id: rawId,
        title: doc.title,
        description: doc.description,
        horizon: doc.horizon || 'now',
        productId: doc.productId || 'ace-acad',
        targetQuarter: doc.targetQuarter || doc.targetDate || 'Q3 2026',
        category: doc.category || 'Feature',
      }

      const index = current.findIndex((i) => i.id === rawId || i.id === doc._id)
      if (index >= 0) {
        const next = [...current]
        next[index] = { ...next[index], ...mapped }
        set({ roadmapItems: next })
      } else {
        set({ roadmapItems: [...current, mapped] })
      }
    } else if (docType === 'project') {
      const current = get().projects
      const rawId = doc._id.replace(/^project-/, '')
      const mapped: Project = {
        id: rawId,
        name: doc.name,
        summary: doc.summary,
        productId: doc.productId || 'ace-acad',
        status: doc.status || 'active',
        targetDate: doc.targetDate || '2026-10-01',
        lead: doc.lead || 'Abdulaziz Abdulwahab',
        progress: typeof doc.progress === 'number' ? doc.progress : 0,
        milestones: doc.milestones || [],
      }

      const index = current.findIndex((p) => p.id === rawId || p.id === doc._id)
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
      const rawId = id.replace(/^roadmap-/, '').replace(/^road-/, '')
      set({
        roadmapItems: get().roadmapItems.filter((i) => i.id !== rawId && i.id !== id),
      })
    } else if (docType === 'project') {
      const rawId = id.replace(/^project-/, '')
      set({
        projects: get().projects.filter((p) => p.id !== rawId && p.id !== id),
      })
    }
  },
}))
