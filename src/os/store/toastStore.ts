import { create } from 'zustand'

export interface ToastMessage {
  id: string
  title: string
  description?: string
  type: 'success' | 'info' | 'warning' | 'error'
}

interface ToastStoreState {
  toasts: ToastMessage[]
  addToast: (toast: Omit<ToastMessage, 'id'>) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStoreState>((set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    const newToast: ToastMessage = { ...toast, id }

    set({ toasts: [...get().toasts, newToast] })

    setTimeout(() => {
      get().removeToast(id)
    }, 4000)
  },
  removeToast: (id) => {
    set({ toasts: get().toasts.filter((t) => t.id !== id) })
  },
}))

export const showToast = (
  title: string,
  type: ToastMessage['type'] = 'success',
  description?: string
) => {
  useToastStore.getState().addToast({ title, type, description })
}
