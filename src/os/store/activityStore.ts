import { create } from 'zustand'
import { ActivityItem } from '@/os/types'
import { dispatchMutation } from './syncHelper'

interface ActivityStoreState {
  activities: ActivityItem[]
  
  setActivities: (activities: ActivityItem[]) => void
  logActivity: (
    action: string,
    targetTitle: string,
    targetType: ActivityItem['targetType'],
    actorName: string,
    badgeColor?: string
  ) => void
  applyRemoteDoc: (doc: any) => void
}

export const useActivityStore = create<ActivityStoreState>((set, get) => ({
  activities: [],

  setActivities: (activities) => set({ activities }),

  logActivity: (action, targetTitle, targetType, actorName, badgeColor = 'blue') => {
    const id = `activity-${Date.now()}`
    const now = new Date().toISOString()

    const newAct: ActivityItem = {
      id,
      actor: actorName,
      action,
      targetTitle,
      targetType,
      timestamp: now,
      badgeColor,
    }

    set({ activities: [newAct, ...get().activities] })

    // Sync to Sanity in background
    dispatchMutation('create', 'activityItem', id, newAct)
  },

  applyRemoteDoc: (doc) => {
    const current = get().activities
    const rawId = doc._id
    const mapped: ActivityItem = {
      id: rawId,
      actor: doc.actor || 'System',
      action: doc.action || 'updated',
      targetTitle: doc.targetTitle || '',
      targetType: doc.targetType || 'task',
      timestamp: doc.timestamp || doc._createdAt || new Date().toISOString(),
      badgeColor: doc.badgeColor || 'blue',
    }

    if (!current.some((a) => a.id === rawId)) {
      set({ activities: [mapped, ...current] })
    }
  },
}))
