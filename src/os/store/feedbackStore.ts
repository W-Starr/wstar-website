import { create } from 'zustand'
import { FeedbackItem, WorkItem } from '@/os/types'
import { initialFeedback } from '@/os/data/initialSeed'
import { dispatchMutation } from './syncHelper'
import { useWorkStore } from './workStore'

interface FeedbackStoreState {
  feedbackItems: FeedbackItem[]
  lastError: string | null
  
  setFeedbackItems: (feedbackItems: FeedbackItem[]) => void
  updateFeedbackStatus: (id: string, status: FeedbackItem['status']) => void
  convertFeedbackToWorkItem: (feedbackId: string, itemData: Partial<WorkItem>) => WorkItem
  applyRemoteDoc: (doc: any) => void
  applyRemoteDelete: (id: string) => void
}

export const useFeedbackStore = create<FeedbackStoreState>((set, get) => ({
  feedbackItems: initialFeedback,
  lastError: null,

  setFeedbackItems: (feedbackItems) => set({ feedbackItems }),

  updateFeedbackStatus: (id, status) => {
    const current = get().feedbackItems
    const original = current.find((f) => f.id === id)
    if (!original) return

    const updated = { ...original, status }

    // Optimistic update
    set({
      feedbackItems: current.map((f) => (f.id === id ? updated : f)),
    })

    // Background sync with rollback
    dispatchMutation('patch', 'feedback', id.startsWith('feedback-') ? id : `feedback-${id}`, { status }).then((res) => {
      if (!res.success) {
        console.error('[FeedbackStore Rollback] updateFeedbackStatus failed:', res.error)
        set({
          feedbackItems: get().feedbackItems.map((f) => (f.id === id ? original : f)),
          lastError: res.error || 'Failed to update feedback status',
        })
      }
    })
  },

  convertFeedbackToWorkItem: (feedbackId, itemData) => {
    const item = get().feedbackItems.find((f) => f.id === feedbackId)
    const workStore = useWorkStore.getState()

    const created = workStore.addWorkItem({
      title: itemData.title || item?.subject || 'Feedback Item',
      description: itemData.description || item?.description || '',
      type: itemData.type || (item?.type === 'Bug Report' ? 'bug' : 'improvement'),
      priority: itemData.priority || 'high',
      status: 'todo',
      assignee: itemData.assignee || 'abdulaziz',
      productId: itemData.productId || 'ace-acad',
      productAreaId: itemData.productAreaId || 'area-library',
    })

    // Mark feedback as converted with reference
    get().updateFeedbackStatus(feedbackId, 'converted')

    return created
  },

  applyRemoteDoc: (doc) => {
    const current = get().feedbackItems
    const rawId = doc._id.replace(/^feedback-/, '')
    const mapped: FeedbackItem = {
      id: rawId,
      subject: doc.subject,
      type: doc.type || 'General',
      description: doc.description,
      userId: doc.userId || 'Anonymous',
      timestamp: doc.timestamp || doc._createdAt || new Date().toISOString(),
      status: doc.status || 'new',
      convertedWorkItemId: doc.convertedWorkItemId,
    }

    const index = current.findIndex((f) => f.id === rawId || f.id === doc._id)
    if (index >= 0) {
      const next = [...current]
      next[index] = { ...next[index], ...mapped }
      set({ feedbackItems: next })
    } else {
      set({ feedbackItems: [mapped, ...current] })
    }
  },

  applyRemoteDelete: (id) => {
    const rawId = id.replace(/^feedback-/, '')
    set({
      feedbackItems: get().feedbackItems.filter((f) => f.id !== rawId && f.id !== id),
    })
  },
}))
