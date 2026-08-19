import { create } from 'zustand'
import { Source, ExtractedEntities, ProductId } from '@/os/types'
import { dispatchMutation } from './syncHelper'

interface SourceStoreState {
  sources: Source[]
  lastError: string | null

  // Actions
  setSources: (sources: Source[]) => void
  addSource: (sourceData: Omit<Source, 'id' | 'createdAt' | 'updatedAt' | 'sourceNumber'>) => Source
  updateSource: (id: string, updates: Partial<Source>) => void
  deleteSource: (id: string) => void
  setSourceAiStatus: (id: string, aiStatus: Source['aiStatus'], aiSummary?: string) => void
  attachExtractedEntities: (id: string, extractedEntities: ExtractedEntities) => void
  linkEntityToSource: (
    sourceId: string,
    entityType: 'work' | 'decision' | 'proposal' | 'project',
    entityId: string
  ) => void
  applyRemoteDoc: (doc: any) => void
  applyRemoteDelete: (id: string) => void
}

/**
 * Computes monotonic sequence number for sources: SRC-001, SRC-002, etc.
 */
function generateMonotonicSourceNumber(currentSources: Source[]): string {
  const matchingNumbers = currentSources
    .filter((s) => s.sourceNumber?.startsWith('SRC-'))
    .map((s) => {
      const match = s.sourceNumber.match(/\d+/)
      return match ? parseInt(match[0], 10) : 0
    })

  const maxNum = matchingNumbers.length > 0 ? Math.max(...matchingNumbers) : 0
  const nextNum = maxNum + 1
  return `SRC-${String(nextNum).padStart(3, '0')}`
}

export const useSourceStore = create<SourceStoreState>((set, get) => ({
  sources: [],
  lastError: null,

  setSources: (sources) => set({ sources }),

  addSource: (sourceData) => {
    const current = get().sources
    const sourceNumber = generateMonotonicSourceNumber(current)
    const id = `src-${Date.now()}`
    const now = new Date().toISOString()

    const newSource: Source = {
      ...sourceData,
      id,
      sourceNumber,
      aiStatus: sourceData.aiStatus || 'pending',
      createdAt: now,
      updatedAt: now,
    }

    // Optimistic addition
    set({ sources: [newSource, ...current] })

    // Background sync to Sanity
    dispatchMutation('create', 'source', id, newSource).then((res) => {
      if (!res.success) {
        console.warn('[SourceStore Sync Warning] addSource failed:', res.error)
      }
    })

    return newSource
  },

  updateSource: (id, updates) => {
    const current = get().sources
    const original = current.find((s) => s.id === id)
    if (!original) return

    const updatedSource = {
      ...original,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    // Optimistic update
    set({
      sources: current.map((s) => (s.id === id ? updatedSource : s)),
    })

    // Background sync to Sanity
    dispatchMutation('patch', 'source', id, updates).then((res) => {
      if (!res.success) {
        console.warn('[SourceStore Sync Warning] updateSource failed:', res.error)
      }
    })
  },

  deleteSource: (id) => {
    const current = get().sources
    const original = current.find((s) => s.id === id)
    if (!original) return

    // Optimistic delete
    set({
      sources: current.filter((s) => s.id !== id),
    })

    // Background sync to Sanity
    dispatchMutation('delete', 'source', id).then((res) => {
      if (!res.success) {
        console.warn('[SourceStore Sync Warning] deleteSource failed:', res.error)
      }
    })
  },

  setSourceAiStatus: (id, aiStatus, aiSummary) => {
    get().updateSource(id, {
      aiStatus,
      ...(aiSummary ? { aiSummary } : {}),
    })
  },

  attachExtractedEntities: (id, extractedEntities) => {
    get().updateSource(id, {
      extractedEntities,
      aiStatus: 'analyzed',
    })
  },

  linkEntityToSource: (sourceId, entityType, entityId) => {
    const source = get().sources.find((s) => s.id === sourceId)
    if (!source) return

    const updates: Partial<Source> = {}

    if (entityType === 'work') {
      const existing = source.relatedWorkItemIds || []
      if (!existing.includes(entityId)) {
        updates.relatedWorkItemIds = [...existing, entityId]
      }
    } else if (entityType === 'decision') {
      const existing = source.relatedDecisionIds || []
      if (!existing.includes(entityId)) {
        updates.relatedDecisionIds = [...existing, entityId]
      }
    } else if (entityType === 'proposal') {
      const existing = source.relatedProposalIds || []
      if (!existing.includes(entityId)) {
        updates.relatedProposalIds = [...existing, entityId]
      }
    } else if (entityType === 'project') {
      updates.relatedProjectId = entityId
    }

    if (Object.keys(updates).length > 0) {
      get().updateSource(sourceId, updates)
    }
  },

  applyRemoteDoc: (doc) => {
    const id = doc._id
    const mapped: Source = {
      id,
      sourceNumber: doc.sourceNumber || `SRC-${id.slice(0, 3)}`,
      sourceType: doc.sourceType || 'other',
      provider: doc.provider || 'manual',
      title: doc.title,
      summary: doc.summary,
      content: doc.content,
      externalId: doc.externalId,
      externalUrl: doc.externalUrl,
      mimeType: doc.mimeType,
      author: doc.author,
      relatedProductId: doc.relatedProductId,
      relatedProjectId: doc.relatedProjectId,
      relatedWorkItemIds: doc.relatedWorkItemIds || [],
      relatedDecisionIds: doc.relatedDecisionIds || [],
      relatedProposalIds: doc.relatedProposalIds || [],
      aiStatus: doc.aiStatus || 'pending',
      aiSummary: doc.aiSummary,
      extractedEntities: doc.extractedEntities,
      tags: doc.tags || [],
      createdAt: doc._createdAt || new Date().toISOString(),
      updatedAt: doc._updatedAt || new Date().toISOString(),
    }

    const current = get().sources
    const exists = current.some((s) => s.id === id)

    if (exists) {
      set({ sources: current.map((s) => (s.id === id ? mapped : s)) })
    } else {
      set({ sources: [mapped, ...current] })
    }
  },

  applyRemoteDelete: (id) => {
    set({ sources: get().sources.filter((s) => s.id !== id) })
  },
}))
