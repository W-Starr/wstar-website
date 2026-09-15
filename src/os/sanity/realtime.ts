/**
 * WSTAR OS Granular Real-time Sanity Sync Hub
 * Subscribes to live document mutations from Sanity and patches individual Zustand stores.
 */

import { sanityClient, isSanityConfigured } from './client'
import { useWorkStore } from '../store/workStore'
import { useProposalStore } from '../store/proposalStore'
import { useDecisionStore } from '../store/decisionStore'
import { useFeedbackStore } from '../store/feedbackStore'
import { useRoadmapStore } from '../store/roadmapStore'
import { useActivityStore } from '../store/activityStore'
import { useMetaStore } from '../store/metaStore'
import { useAnnouncementStore } from '../store/announcementStore'

export function initializeRealtimeListener() {
  if (!isSanityConfigured || typeof window === 'undefined') return () => {}

  try {
    const query = '*[_type in ["workItem", "proposal", "decision", "feedbackItem", "roadmapItem", "project", "activityItem", "announcement"]]'
    
    const subscription = sanityClient.listen(query, {}, { includeResult: true, visibility: 'query' }).subscribe((update) => {
      const { transition, result, documentId } = update as any

      if (transition === 'disappear') {
        // Granular document deletion
        if (documentId.startsWith('work-') || documentId.startsWith('task-') || documentId.startsWith('bug-')) {
          useWorkStore.getState().applyRemoteDelete(documentId)
        } else if (documentId.startsWith('proposal-')) {
          useProposalStore.getState().applyRemoteDelete(documentId)
        } else if (documentId.startsWith('decision-') || documentId.startsWith('dec-')) {
          useDecisionStore.getState().applyRemoteDelete(documentId)
        } else if (documentId.startsWith('feedback-')) {
          useFeedbackStore.getState().applyRemoteDelete(documentId)
        } else if (documentId.startsWith('roadmap-') || documentId.startsWith('road-')) {
          useRoadmapStore.getState().applyRemoteDelete('roadmapItem', documentId)
        } else if (documentId.startsWith('project-')) {
          useRoadmapStore.getState().applyRemoteDelete('project', documentId)
        } else if (documentId.startsWith('announcement-')) {
          useAnnouncementStore.getState().applyRemoteDelete(documentId)
        }
        return
      }

      if (result && (transition === 'appear' || transition === 'update')) {
        const type = result._type

        if (type === 'workItem') {
          useWorkStore.getState().applyRemoteDoc(result)
        } else if (type === 'proposal') {
          useProposalStore.getState().applyRemoteDoc(result)
        } else if (type === 'decision') {
          useDecisionStore.getState().applyRemoteDoc(result)
        } else if (type === 'feedbackItem') {
          useFeedbackStore.getState().applyRemoteDoc(result)
        } else if (type === 'roadmapItem') {
          useRoadmapStore.getState().applyRemoteDoc('roadmapItem', result)
        } else if (type === 'project') {
          useRoadmapStore.getState().applyRemoteDoc('project', result)
        } else if (type === 'activityItem') {
          useActivityStore.getState().applyRemoteDoc(result)
        } else if (type === 'announcement') {
          useAnnouncementStore.getState().applyRemoteDoc(result)
        }

        useMetaStore.getState().setSanitySyncStatus('synced')
      }
    })

    return () => subscription.unsubscribe()
  } catch (error) {
    console.warn('[Realtime Sanity Listener Warning]:', error)
    return () => {}
  }
}
