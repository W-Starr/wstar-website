import { create } from 'zustand'
import { Announcement } from '@/os/types'
import { dispatchMutation } from './syncHelper'

interface AnnouncementStoreState {
  announcements: Announcement[]
  lastError: string | null

  setAnnouncements: (announcements: Announcement[]) => void
  addAnnouncement: (data: Omit<Announcement, 'id'>) => Announcement
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void
  deleteAnnouncement: (id: string) => void
  applyRemoteDoc: (doc: any) => void
  applyRemoteDelete: (id: string) => void
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const useAnnouncementStore = create<AnnouncementStoreState>((set, get) => ({
  announcements: [],
  lastError: null,

  setAnnouncements: (announcements) => set({ announcements }),

  addAnnouncement: (data) => {
    const current = get().announcements
    const id = `announcement-${Date.now()}`

    const newAnnouncement: Announcement = {
      ...data,
      id,
      slug: data.slug || slugify(data.title),
    }

    // Optimistic add
    set({ announcements: [newAnnouncement, ...current] })

    // Background sync to Sanity
    dispatchMutation('create', 'announcement', id, newAnnouncement).then((res) => {
      if (!res.success) {
        console.warn('[AnnouncementStore Sync Warning] addAnnouncement failed:', res.error)
      }
    })

    return newAnnouncement
  },

  updateAnnouncement: (id, updates) => {
    const current = get().announcements
    const original = current.find((a) => a.id === id)
    if (!original) return

    const updated = { ...original, ...updates }

    // Optimistic update
    set({
      announcements: current.map((a) => (a.id === id ? updated : a)),
    })

    // Background sync to Sanity
    dispatchMutation('patch', 'announcement', id, updates).then((res) => {
      if (!res.success) {
        console.warn('[AnnouncementStore Sync Warning] updateAnnouncement failed:', res.error)
      }
    })
  },

  deleteAnnouncement: (id) => {
    const current = get().announcements
    set({ announcements: current.filter((a) => a.id !== id) })

    dispatchMutation('delete', 'announcement', id).then((res) => {
      if (!res.success) {
        console.warn('[AnnouncementStore Sync Warning] deleteAnnouncement failed:', res.error)
      }
    })
  },

  applyRemoteDoc: (doc) => {
    const current = get().announcements
    const rawId = doc._id
    const mapped: Announcement = {
      id: rawId,
      title: doc.title,
      slug: doc.slug || slugify(doc.title || rawId),
      category: doc.category || 'announcement',
      status: doc.status || 'draft',
      excerpt: doc.excerpt || '',
      publishedAt: doc.publishedAt || doc._createdAt || new Date().toISOString(),
      author: doc.author,
      pdfUrl: doc.pdfUrl,
      pdfFilename: doc.pdfFilename,
      pdfSize: doc.pdfSize,
      coverImageUrl: doc.coverImageUrl,
    }

    const index = current.findIndex((a) => a.id === rawId)
    if (index >= 0) {
      const next = [...current]
      next[index] = { ...next[index], ...mapped }
      set({ announcements: next })
    } else {
      set({ announcements: [mapped, ...current] })
    }
  },

  applyRemoteDelete: (id) => {
    set({
      announcements: get().announcements.filter((a) => a.id !== id),
    })
  },
}))
