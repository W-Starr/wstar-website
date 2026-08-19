import { create } from 'zustand'
import { WorkItem, WorkItemStatus, WorkItemType, WorkItemPriority, ProductId } from '@/os/types'
import { initialWorkItems } from '@/os/data/initialSeed'
import { dispatchMutation } from './syncHelper'

interface WorkStoreState {
  workItems: WorkItem[]
  lastError: string | null
  
  // Actions
  setWorkItems: (items: WorkItem[]) => void
  addWorkItem: (itemData: Omit<WorkItem, 'id' | 'createdAt' | 'updatedAt' | 'itemNumber'>) => WorkItem
  updateWorkItem: (id: string, updates: Partial<WorkItem>) => void
  deleteWorkItem: (id: string) => void
  updateWorkItemStatus: (id: string, status: WorkItemStatus) => void
  decomposeWorkItem: (id: string, subtaskTitles: string[]) => void
  toggleSubtask: (itemId: string, subtaskId: string) => void
  addSubtask: (itemId: string, title: string) => void
  applyRemoteDoc: (doc: any) => void
  applyRemoteDelete: (id: string) => void
}

/**
 * Computes monotonic sequence number without collision even if items are deleted
 */
function generateMonotonicItemNumber(type: WorkItemType, currentItems: WorkItem[]): string {
  const prefix = type === 'bug' ? 'BUG' : 'TASK'
  const matchingNumbers = currentItems
    .filter((i) => i.itemNumber.startsWith(prefix))
    .map((i) => {
      const match = i.itemNumber.match(/\d+/)
      return match ? parseInt(match[0], 10) : 0
    })

  const maxNum = matchingNumbers.length > 0 ? Math.max(...matchingNumbers) : 0
  const nextNum = maxNum + 1
  return `${prefix}-${String(nextNum).padStart(3, '0')}`
}

export const useWorkStore = create<WorkStoreState>((set, get) => ({
  workItems: initialWorkItems,
  lastError: null,

  setWorkItems: (workItems) => set({ workItems }),

  addWorkItem: (itemData) => {
    const current = get().workItems
    const itemNumber = generateMonotonicItemNumber(itemData.type, current)
    const id = `work-${Date.now()}`
    const now = new Date().toISOString()

    const newItem: WorkItem = {
      ...itemData,
      id,
      itemNumber,
      createdAt: now,
      updatedAt: now,
    }

    // Optimistic addition
    set({ workItems: [newItem, ...current] })

    // Background sync with rollback on failure
    dispatchMutation('create', 'workItem', id, newItem).then((res) => {
      if (!res.success) {
        console.error('[WorkStore Rollback] addWorkItem failed, reverting state:', res.error)
        set({
          workItems: get().workItems.filter((i) => i.id !== id),
          lastError: res.error || 'Failed to save work item to cloud database',
        })
      }
    })

    return newItem
  },

  updateWorkItem: (id, updates) => {
    const current = get().workItems
    const originalItem = current.find((i) => i.id === id)
    if (!originalItem) return

    const updatedItem = {
      ...originalItem,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    // Optimistic update
    set({
      workItems: current.map((i) => (i.id === id ? updatedItem : i)),
    })

    // Background sync with rollback
    dispatchMutation('patch', 'workItem', id.startsWith('work-') ? id : `work-${id}`, updates).then((res) => {
      if (!res.success) {
        console.error('[WorkStore Rollback] updateWorkItem failed, reverting state:', res.error)
        set({
          workItems: get().workItems.map((i) => (i.id === id ? originalItem : i)),
          lastError: res.error || 'Failed to update work item',
        })
      }
    })
  },

  deleteWorkItem: (id) => {
    const current = get().workItems
    const originalItem = current.find((i) => i.id === id)
    if (!originalItem) return

    // Optimistic deletion
    set({
      workItems: current.filter((i) => i.id !== id),
    })

    // Background sync with rollback
    dispatchMutation('delete', 'workItem', id.startsWith('work-') ? id : `work-${id}`).then((res) => {
      if (!res.success) {
        console.error('[WorkStore Rollback] deleteWorkItem failed, restoring item:', res.error)
        set({
          workItems: [originalItem, ...get().workItems],
          lastError: res.error || 'Failed to delete work item from cloud database',
        })
      }
    })
  },

  updateWorkItemStatus: (id, status) => {
    get().updateWorkItem(id, { status })
  },

  decomposeWorkItem: (id, subtaskTitles) => {
    const item = get().workItems.find((i) => i.id === id)
    if (!item) return

    const newSubtasks = subtaskTitles.map((t, idx) => ({
      id: `sub-${Date.now()}-${idx}`,
      title: t,
      completed: false,
    }))

    get().updateWorkItem(id, {
      subtasks: [...(item.subtasks || []), ...newSubtasks],
    })
  },

  toggleSubtask: (itemId, subtaskId) => {
    const item = get().workItems.find((i) => i.id === itemId)
    if (!item || !item.subtasks) return

    const updatedSubtasks = item.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    )

    get().updateWorkItem(itemId, { subtasks: updatedSubtasks })
  },

  addSubtask: (itemId, title) => {
    const item = get().workItems.find((i) => i.id === itemId)
    if (!item || !title.trim()) return

    const newSubtask = {
      id: `sub-${Date.now()}`,
      title: title.trim(),
      completed: false,
    }

    get().updateWorkItem(itemId, {
      subtasks: [...(item.subtasks || []), newSubtask],
    })
  },

  applyRemoteDoc: (doc) => {
    const current = get().workItems
    const rawId = doc._id.replace(/^work-/, '')
    const mapped: WorkItem = {
      id: rawId,
      itemNumber: doc.itemNumber || rawId,
      title: doc.title,
      description: doc.description,
      type: doc.type || 'task',
      priority: doc.priority || 'medium',
      status: doc.status || 'backlog',
      assignee: doc.assignee || 'abdulaziz',
      productId: doc.productId || 'ace-acad',
      productAreaId: doc.productAreaId,
      codeReference: doc.codeReference,
      createdAt: doc._createdAt || doc.createdAt || new Date().toISOString(),
      updatedAt: doc._updatedAt || doc.updatedAt || new Date().toISOString(),
      subtasks: doc.subtasks || [],
    }

    const index = current.findIndex((i) => i.id === rawId || i.id === doc._id)
    if (index >= 0) {
      const next = [...current]
      next[index] = { ...next[index], ...mapped }
      set({ workItems: next })
    } else {
      set({ workItems: [mapped, ...current] })
    }
  },

  applyRemoteDelete: (id) => {
    const rawId = id.replace(/^work-/, '')
    set({
      workItems: get().workItems.filter((i) => i.id !== rawId && i.id !== id),
    })
  },
}))
