import { create } from 'zustand'
import { Source, ExtractedEntities, ProductId } from '@/os/types'
import { initialSources } from '@/os/data/initialSeed'
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
  sources: initialSources,
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
    set({ sources: [newSource, ...current], lastError: null })

    // Dispatch background remote mutation
    dispatchMutation('create', 'source', id, {
      sourceNumber: newSource.sourceNumber,
      sourceType: newSource.sourceType,
      provider: newSource.provider,
      title: newSource.title,
      summary: newSource.summary,
      content: newSource.content,
      externalId: newSource.externalId,
      externalUrl: newSource.externalUrl,
      mimeType: newSource.mimeType,
      author: newSource.author,
      relatedProductId: newSource.relatedProductId,
      relatedProjectId: newSource.relatedProjectId,
      aiStatus: newSource.aiStatus,
      aiSummary: newSource.aiSummary,
      extractedEntities: newSource.extractedEntities,
      tags: newSource.tags,
    }).catch((err) => {
      console.error('[SourceStore] Remote mutation failed; rolling back:', err)
      set({ sources: current, lastError: 'Failed to sync source to cloud storage' })
    })

    return newSource
  },

  updateSource: (id, updates) => {
    const previous = get().sources
    const now = new Date().toISOString()

    set({
      sources: previous.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: now } : s)),
      lastError: null,
    })

    dispatchMutation('patch', 'source', id, updates).catch((err) => {
      console.error('[SourceStore] Remote update failed; rolling back:', err)
      set({ sources: previous, lastError: 'Failed to update source in cloud storage' })
    })
  },

  deleteSource: (id) => {
    const previous = get().sources
    set({
      sources: previous.filter((s) => s.id !== id),
      lastError: null,
    })

    dispatchMutation('delete', 'source', id).catch((err) => {
      console.error('[SourceStore] Remote delete failed; rolling back:', err)
      set({ sources: previous, lastError: 'Failed to delete source from cloud storage' })
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
      aiSummary: extractedEntities.summary,
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
    const id = doc._id.replace(/^src-/, '')
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
    const cleanId = id.replace(/^src-/, '')
    set({ sources: get().sources.filter((s) => s.id !== cleanId) })
  },
}))
