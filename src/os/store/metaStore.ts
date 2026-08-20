import { create } from 'zustand'
import { Role, Product, ProductArea, SanitySyncState } from '@/os/types'

export interface AuthenticatedFounder {
  id: string
  email: string
  name: string
  role: Role
}

interface MetaStoreState {
  role: Role
  currentUser: AuthenticatedFounder | null
  sanitySyncStatus: SanitySyncState
  products: Product[]
  productAreas: ProductArea[]
  isLoaded: boolean

  setRole: (role: Role) => void
  setCurrentUser: (user: AuthenticatedFounder | null) => void
  fetchSession: () => Promise<void>
  setSanitySyncStatus: (status: SanitySyncState) => void
  setProducts: (products: Product[]) => void
  setProductAreas: (areas: ProductArea[]) => void
  setIsLoaded: (isLoaded: boolean) => void
}

export const useMetaStore = create<MetaStoreState>((set) => ({
  role: 'engineer',
  currentUser: null,
  sanitySyncStatus: 'local_fallback',
  products: [],
  productAreas: [],
  isLoaded: false,

  setRole: (role) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wstar_os_role', role)
    }
    set({ role })
  },
  setCurrentUser: (currentUser) => set({ currentUser, role: currentUser?.role || 'engineer' }),
  fetchSession: async () => {
    try {
      const res = await fetch('/api/os/auth/session')
      if (res.ok) {
        const data = await res.json()
        if (data.authenticated && data.user) {
          set({
            currentUser: data.user,
            role: data.user.role || 'engineer',
          })
        }
      }
    } catch (err) {
      console.warn('[Session Fetch Error]:', err)
    }
  },
  setSanitySyncStatus: (sanitySyncStatus) => set({ sanitySyncStatus }),
  setProducts: (products) => set({ products }),
  setProductAreas: (productAreas) => set({ productAreas }),
  setIsLoaded: (isLoaded) => set({ isLoaded }),
}))
