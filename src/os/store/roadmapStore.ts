import { create } from 'zustand'
import { RoadmapItem, Project, ProductId } from '@/os/types'
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
  roadmapItems: [],
  projects: [],
  lastError: null,

  setRoadmapItems: (roadmapItems) => set({ roadmapItems }),
  setProjects: (projects) => set({ projects }),

  addRoadmapItem: (itemData) => {
    const current = get().roadmapItems
    const id = `roadmap-${Date.now()}`
    const newItem: RoadmapItem = { ...itemData, id }

    // Optimistic addition
    set({ roadmapItems: [...current, newItem] })

    // Background sync to Sanity
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

    const updated = { ...original, horizon }

    // Optimistic update
    set({
      roadmapItems: current.map((i) => (i.id === id ? updated : i)),
    })

    // Background sync to Sanity
    dispatchMutation('patch', 'roadmapItem', id, { horizon }).then((res) => {
      if (!res.success) {
        console.warn('[RoadmapStore Sync Warning] updateRoadmapHorizon failed:', res.error)
      }
    })
  },

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
        targetDate: doc.targetDate || '2026-10-01',
        lead: doc.lead || 'Abdulaziz',
        progress: doc.progress || 0,
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
