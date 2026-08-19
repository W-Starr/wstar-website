import { create } from 'zustand'
import { FeedbackItem, WorkItem } from '@/os/types'
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
  feedbackItems: [],
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

    // Background sync to Sanity
    dispatchMutation('patch', 'feedbackItem', id, { status }).then((res) => {
      if (!res.success) {
        console.warn('[FeedbackStore Sync Warning] updateFeedbackStatus failed:', res.error)
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

    get().updateFeedbackStatus(feedbackId, 'converted')

    return created
  },

  applyRemoteDoc: (doc) => {
    const current = get().feedbackItems
    const rawId = doc._id
    const mapped: FeedbackItem = {
      id: rawId,
      type: doc.type || 'Feedback',
      subject: doc.subject,
      description: doc.description,
      status: doc.status || 'new',
      timestamp: doc.timestamp || doc._createdAt || new Date().toISOString(),
      userId: doc.userId || 'student@university.edu.ng',
    }

    const index = current.findIndex((f) => f.id === rawId)
    if (index >= 0) {
      const next = [...current]
      next[index] = { ...next[index], ...mapped }
      set({ feedbackItems: next })
    } else {
      set({ feedbackItems: [mapped, ...current] })
    }
  },

  applyRemoteDelete: (id) => {
    set({
      feedbackItems: get().feedbackItems.filter((f) => f.id !== id),
    })
  },
}))
