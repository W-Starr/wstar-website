import { create } from 'zustand'
import { Role, Product, ProductArea, ProductCommandConfig, SanitySyncState } from '@/os/types'
import { dispatchMutation } from './syncHelper'

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
  productCommandConfigs: ProductCommandConfig[]
  isLoaded: boolean

  setRole: (role: Role) => void
  setCurrentUser: (user: AuthenticatedFounder | null) => void
  fetchSession: () => Promise<void>
  setSanitySyncStatus: (status: SanitySyncState) => void
  setProducts: (products: Product[]) => void
  setProductAreas: (areas: ProductArea[]) => void
  setProductCommandConfigs: (configs: ProductCommandConfig[]) => void
  saveProductCommandConfig: (config: ProductCommandConfig) => void
  setIsLoaded: (isLoaded: boolean) => void
}

export const useMetaStore = create<MetaStoreState>((set, get) => ({
  role: 'engineer',
  currentUser: null,
  sanitySyncStatus: 'local_fallback',
  products: [],
  productAreas: [],
  productCommandConfigs: [],
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
  setProductCommandConfigs: (productCommandConfigs) => set({ productCommandConfigs }),

  saveProductCommandConfig: (config) => {
    const current = get().productCommandConfigs
    const docId = config.id || `product-command-${config.productId}`
    const updatedConfig = { ...config, id: docId }

    const index = current.findIndex((c) => c.productId === config.productId)
    let next: ProductCommandConfig[]
    if (index >= 0) {
      next = [...current]
      next[index] = updatedConfig
    } else {
      next = [...current, updatedConfig]
    }

    set({ productCommandConfigs: next })

    dispatchMutation('create', 'productCommandCenter', docId, updatedConfig).then((res) => {
      if (!res.success) {
        console.warn('[MetaStore Sync Warning] saveProductCommandConfig failed:', res.error)
      }
    })
  },

  setIsLoaded: (isLoaded) => set({ isLoaded }),
}))
