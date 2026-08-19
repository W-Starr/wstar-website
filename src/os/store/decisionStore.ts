import { create } from 'zustand'
import { Decision } from '@/os/types'
import { initialDecisions } from '@/os/data/initialSeed'
import { dispatchMutation } from './syncHelper'

interface DecisionStoreState {
  decisions: Decision[]
  lastError: string | null
  
  setDecisions: (decisions: Decision[]) => void
  addDecision: (decisionData: Omit<Decision, 'id' | 'decisionNumber'>) => Decision
  updateDecision: (id: string, updates: Partial<Decision>) => void
  applyRemoteDoc: (doc: any) => void
  applyRemoteDelete: (id: string) => void
}

function generateMonotonicDecisionNumber(currentDecisions: Decision[]): string {
  const matchingNumbers = currentDecisions.map((d) => {
    const match = d.decisionNumber.match(/\d+/)
    return match ? parseInt(match[0], 10) : 0
  })

  const maxNum = matchingNumbers.length > 0 ? Math.max(...matchingNumbers) : 0
  return `DEC-${String(maxNum + 1).padStart(3, '0')}`
}

export const useDecisionStore = create<DecisionStoreState>((set, get) => ({
  decisions: initialDecisions,
  lastError: null,

  setDecisions: (decisions) => set({ decisions }),

  addDecision: (decData) => {
    const current = get().decisions
    const decisionNumber = generateMonotonicDecisionNumber(current)
    const id = `dec-${Date.now()}`

    const newDec: Decision = {
      ...decData,
      id,
      decisionNumber,
    }

    // Optimistic add
    set({ decisions: [newDec, ...current] })

    // Background sync with rollback
    dispatchMutation('create', 'decision', id, newDec).then((res) => {
      if (!res.success) {
        console.error('[DecisionStore Rollback] addDecision failed:', res.error)
        set({
          decisions: get().decisions.filter((d) => d.id !== id),
          lastError: res.error || 'Failed to save decision record',
        })
      }
    })

    return newDec
  },

  updateDecision: (id, updates) => {
    const current = get().decisions
    const original = current.find((d) => d.id === id)
    if (!original) return

    const updated = { ...original, ...updates }

    // Optimistic update
    set({
      decisions: current.map((d) => (d.id === id ? updated : d)),
    })

    // Background sync with rollback
    dispatchMutation('patch', 'decision', id.startsWith('decision-') ? id : `decision-${id}`, updates).then((res) => {
      if (!res.success) {
        console.error('[DecisionStore Rollback] updateDecision failed:', res.error)
        set({
          decisions: get().decisions.map((d) => (d.id === id ? original : d)),
          lastError: res.error || 'Failed to update decision',
        })
      }
    })
  },

  applyRemoteDoc: (doc) => {
    const current = get().decisions
    const rawId = doc._id.replace(/^decision-/, '')
    const mapped: Decision = {
      id: rawId,
      decisionNumber: doc.decisionNumber || rawId,
      title: doc.title,
      decision: doc.decision,
      reason: doc.reason,
      status: doc.status || 'accepted',
      participants: doc.participants || ['Abdulaziz Abdulwahab', 'Ibrahim Abdulwahab'],
      date: doc.date || new Date().toISOString().split('T')[0],
      productId: doc.productId,
      consequences: doc.consequences,
      alternativesConsidered: doc.alternativesConsidered,
    }

    const index = current.findIndex((d) => d.id === rawId || d.id === doc._id)
    if (index >= 0) {
      const next = [...current]
      next[index] = { ...next[index], ...mapped }
      set({ decisions: next })
    } else {
      set({ decisions: [mapped, ...current] })
    }
  },

  applyRemoteDelete: (id) => {
    const rawId = id.replace(/^decision-/, '')
    set({
      decisions: get().decisions.filter((d) => d.id !== rawId && d.id !== id),
    })
  },
}))
