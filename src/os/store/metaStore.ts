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
  addProductArea: (area: Omit<ProductArea, 'id'>) => ProductArea
  updateProductArea: (id: string, updates: Partial<ProductArea>) => void
  deleteProductArea: (id: string) => void
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

  addProductArea: (areaData) => {
    const id = `area-${Date.now()}`
    const newArea: ProductArea = {
      ...areaData,
      id,
    }
    const current = get().productAreas
    set({ productAreas: [...current, newArea] })

    dispatchMutation('create', 'productArea', id, {
      _id: id,
      _type: 'productArea',
      name: newArea.name,
      description: newArea.description,
      owner: newArea.owner,
      iconName: newArea.iconName || 'Layers',
      productId: newArea.productId || 'ace-acad',
    }).then((res) => {
      if (!res.success) {
        console.warn('[MetaStore Sync Warning] addProductArea failed:', res.error)
      }
    })
    return newArea
  },

  updateProductArea: (id, updates) => {
    const current = get().productAreas
    const area = current.find(
      (a) => a.id === id || a.id.replace(/^area-/, '') === id.replace(/^area-/, '')
    )
    if (!area) return

    const updatedArea: ProductArea = { ...area, ...updates }
    set({
      productAreas: current.map((a) => (a.id === area.id ? updatedArea : a)),
    })

    const docId = area.id.startsWith('area-') ? area.id : `area-${area.id}`
    dispatchMutation('patch', 'productArea', docId, updates).then((res) => {
      if (!res.success) {
        dispatchMutation('patch', 'productArea', area.id, updates)
      }
    })
  },

  deleteProductArea: (id) => {
    const current = get().productAreas
    const area = current.find(
      (a) => a.id === id || a.id.replace(/^area-/, '') === id.replace(/^area-/, '')
    )
    if (!area) return

    set({
      productAreas: current.filter((a) => a.id !== area.id),
    })

    const docId = area.id.startsWith('area-') ? area.id : `area-${area.id}`
    dispatchMutation('delete', 'productArea', docId).then((res) => {
      if (!res.success) {
        dispatchMutation('delete', 'productArea', area.id)
      }
    })
  },

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
