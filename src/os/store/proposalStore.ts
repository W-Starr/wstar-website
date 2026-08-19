import { create } from 'zustand'
import { Proposal, WorkItem } from '@/os/types'
import { dispatchMutation } from './syncHelper'
import { useWorkStore } from './workStore'

interface ProposalStoreState {
  proposals: Proposal[]
  lastError: string | null
  
  setProposals: (proposals: Proposal[]) => void
  updateProposalStatus: (id: string, status: Proposal['status']) => void
  createWorkItemFromProposal: (proposalId: string, taskTitle: string, assignee: 'abdulaziz' | 'ibrahim') => WorkItem
  applyRemoteDoc: (doc: any) => void
  applyRemoteDelete: (id: string) => void
}

export const useProposalStore = create<ProposalStoreState>((set, get) => ({
  proposals: [],
  lastError: null,

  setProposals: (proposals) => set({ proposals }),

  updateProposalStatus: (id, status) => {
    const current = get().proposals
    const original = current.find((p) => p.id === id)
    if (!original) return

    const updated = { ...original, status }

    // Optimistic update
    set({
      proposals: current.map((p) => (p.id === id ? updated : p)),
    })

    // Background sync to Sanity
    dispatchMutation('patch', 'proposal', id, { status }).then((res) => {
      if (!res.success) {
        console.warn('[ProposalStore Sync Warning] updateProposalStatus failed:', res.error)
      }
    })
  },

  createWorkItemFromProposal: (proposalId, taskTitle, assignee) => {
    const proposal = get().proposals.find((p) => p.id === proposalId)
    const workStore = useWorkStore.getState()

    const item = workStore.addWorkItem({
      title: taskTitle,
      description: `Spun off from Approved Specification: ${proposal ? proposal.title : proposalId}\n\nDeliverable: ${taskTitle}`,
      type: 'feature',
      priority: 'high',
      status: 'todo',
      assignee,
      productId: 'ace-acad',
      codeReference: `PR-${proposal?.proposalNumber || 'SPEC'}`,
    })

    if (proposal && proposal.status === 'under_review') {
      get().updateProposalStatus(proposalId, 'staged_for_execution')
    }

    return item
  },

  applyRemoteDoc: (doc) => {
    const current = get().proposals
    const rawId = doc._id
    const mapped: Proposal = {
      id: rawId,
      proposalNumber: doc.proposalNumber || rawId,
      slug: doc.slug || rawId,
      title: doc.title,
      subtitle: doc.subtitle || '',
      category: doc.category || 'Architecture & Ingestion',
      status: doc.status || 'under_review',
      authors: doc.authors || ['Abdulaziz'],
      filename: doc.filename || `${doc.slug || rawId}.md`,
      executiveSummary: doc.executiveSummary || doc.summary || '',
      problemStatement: doc.problemStatement || [],
      proposedSolution: doc.proposedSolution || '',
      strategicAdvantages: doc.strategicAdvantages || [],
      recommendedTierOrApproach: doc.recommendedTierOrApproach || {
        name: 'Standard Implementation',
        rationale: 'Baseline architecture',
        estimatedCost: '$0',
        roi: 'High',
      },
      keyRisks: doc.keyRisks || [],
      date: doc.date || new Date().toISOString().split('T')[0],
      phases: doc.phases || [],
      actionItems: doc.actionItems || [],
    }

    const index = current.findIndex((p) => p.id === rawId)
    if (index >= 0) {
      const next = [...current]
      next[index] = { ...next[index], ...mapped }
      set({ proposals: next })
    } else {
      set({ proposals: [mapped, ...current] })
    }
  },

  applyRemoteDelete: (id) => {
    set({
      proposals: get().proposals.filter((p) => p.id !== id),
    })
  },
}))
