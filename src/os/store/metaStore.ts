import { create } from 'zustand'
import { Role, Product, ProductArea, SanitySyncState } from '@/os/types'
import { initialProducts, initialProductAreas } from '@/os/data/initialSeed'

interface MetaStoreState {
  role: Role
  sanitySyncStatus: SanitySyncState
  products: Product[]
  productAreas: ProductArea[]
  isLoaded: boolean

  setRole: (role: Role) => void
  setSanitySyncStatus: (status: SanitySyncState) => void
  setProducts: (products: Product[]) => void
  setProductAreas: (areas: ProductArea[]) => void
  setIsLoaded: (isLoaded: boolean) => void
}

export const useMetaStore = create<MetaStoreState>((set) => ({
  role: 'engineer',
  sanitySyncStatus: 'local_fallback',
  products: initialProducts,
  productAreas: initialProductAreas,
  isLoaded: false,

  setRole: (role) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wstar_os_role', role)
    }
    set({ role })
  },
  setSanitySyncStatus: (sanitySyncStatus) => set({ sanitySyncStatus }),
  setProducts: (products) => set({ products }),
  setProductAreas: (productAreas) => set({ productAreas }),
  setIsLoaded: (isLoaded) => set({ isLoaded }),
}))
