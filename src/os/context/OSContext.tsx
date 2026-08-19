'use client'

import React, { createContext, useContext, useEffect, useCallback } from 'react'
import {
  Role,
  Product,
  ProductArea,
  Proposal,
  WorkItem,
  Decision,
  FeedbackItem,
  Project,
  RoadmapItem,
  ActivityItem,
  SanitySyncState,
  WorkItemStatus,
  ClassificationSuggestion,
} from '../types'
import {
  initialProducts,
  initialProductAreas,
  initialProposals,
  initialWorkItems,
  initialDecisions,
  initialFeedback,
  initialProjects,
  initialRoadmap,
  initialActivities,
  initialSources,
} from '../data/initialSeed'
import { useWorkStore } from '../store/workStore'
import { useProposalStore } from '../store/proposalStore'
import { useDecisionStore } from '../store/decisionStore'
import { useFeedbackStore } from '../store/feedbackStore'
import { useRoadmapStore } from '../store/roadmapStore'
import { useActivityStore } from '../store/activityStore'
import { useMetaStore } from '../store/metaStore'
import { useSourceStore } from '../store/sourceStore'
import { initializeRealtimeListener } from '../sanity/realtime'
import { Source, ExtractedEntities } from '../types'

export interface OSContextType {
  role: Role
  currentUser: import('../store/metaStore').AuthenticatedFounder | null
  setRole: (role: Role) => void
  products: Product[]
  productAreas: ProductArea[]
  proposals: Proposal[]
  workItems: WorkItem[]
  decisions: Decision[]
  feedbackItems: FeedbackItem[]
  projects: Project[]
  roadmapItems: RoadmapItem[]
  activities: ActivityItem[]
  sources: Source[]
  sanitySyncStatus: SanitySyncState
  isLoaded: boolean
  lastError: string | null

  // Sanity Cloud Actions
  seedSanityCloud: () => Promise<{ success: boolean; message: string }>
  refreshFromSanity: () => Promise<void>

  // Proposal Actions
  updateProposalStatus: (id: string, status: Proposal['status']) => void
  createWorkItemFromProposal: (
    proposalId: string,
    taskTitle: string,
    assignee: 'abdulaziz' | 'ibrahim'
  ) => WorkItem

  // Work Item Actions
  addWorkItem: (
    item: Omit<WorkItem, 'id' | 'createdAt' | 'updatedAt' | 'itemNumber'>
  ) => WorkItem
  updateWorkItem: (id: string, updates: Partial<WorkItem>) => void
  deleteWorkItem: (id: string) => void
  updateWorkItemStatus: (id: string, status: WorkItemStatus) => void
  decomposeWorkItem: (id: string, subtaskTitles: string[]) => void
  toggleSubtask: (itemId: string, subtaskId: string) => void
  addSubtask: (itemId: string, title: string) => void

  // Decision Actions
  addDecision: (decision: Omit<Decision, 'id' | 'decisionNumber'>) => Decision
  updateDecision: (id: string, updates: Partial<Decision>) => void

  // Feedback Actions
  updateFeedbackStatus: (id: string, status: FeedbackItem['status']) => void
  convertFeedbackToWorkItem: (
    feedbackId: string,
    itemData: Partial<WorkItem>
  ) => WorkItem

  // Roadmap Actions
  addRoadmapItem: (item: Omit<RoadmapItem, 'id'>) => void
  updateRoadmapHorizon: (id: string, horizon: RoadmapItem['horizon']) => void

  // Source Actions
  addSource: (
    source: Omit<Source, 'id' | 'createdAt' | 'updatedAt' | 'sourceNumber'>
  ) => Source
  updateSource: (id: string, updates: Partial<Source>) => void
  deleteSource: (id: string) => void
  setSourceAiStatus: (id: string, aiStatus: Source['aiStatus'], aiSummary?: string) => void
  attachExtractedEntities: (id: string, entities: ExtractedEntities) => void
  linkEntityToSource: (
    sourceId: string,
    entityType: 'work' | 'decision' | 'proposal' | 'project',
    entityId: string
  ) => void

  // Intelligence
  suggestClassification: (text: string) => ClassificationSuggestion

  // Reset data to initial discovery seed
  resetToInitialSeed: () => void
}

const OSContext = createContext<OSContextType | null>(null)

export function OSProvider({ children }: { children: React.ReactNode }) {
  // Zustand store subscriptions
  const workItems = useWorkStore((state) => state.workItems)
  const workLastError = useWorkStore((state) => state.lastError)
  const addWorkItem = useWorkStore((state) => state.addWorkItem)
  const updateWorkItem = useWorkStore((state) => state.updateWorkItem)
  const deleteWorkItem = useWorkStore((state) => state.deleteWorkItem)
  const updateWorkItemStatus = useWorkStore((state) => state.updateWorkItemStatus)
  const decomposeWorkItem = useWorkStore((state) => state.decomposeWorkItem)
  const toggleSubtask = useWorkStore((state) => state.toggleSubtask)
  const addSubtask = useWorkStore((state) => state.addSubtask)
  const setWorkItems = useWorkStore((state) => state.setWorkItems)

  const proposals = useProposalStore((state) => state.proposals)
  const setProposals = useProposalStore((state) => state.setProposals)
  const updateProposalStatus = useProposalStore((state) => state.updateProposalStatus)
  const createWorkItemFromProposal = useProposalStore((state) => state.createWorkItemFromProposal)

  const decisions = useDecisionStore((state) => state.decisions)
  const setDecisions = useDecisionStore((state) => state.setDecisions)
  const addDecision = useDecisionStore((state) => state.addDecision)
  const updateDecision = useDecisionStore((state) => state.updateDecision)

  const feedbackItems = useFeedbackStore((state) => state.feedbackItems)
  const setFeedbackItems = useFeedbackStore((state) => state.setFeedbackItems)
  const updateFeedbackStatus = useFeedbackStore((state) => state.updateFeedbackStatus)
  const convertFeedbackToWorkItem = useFeedbackStore((state) => state.convertFeedbackToWorkItem)

  const roadmapItems = useRoadmapStore((state) => state.roadmapItems)
  const projects = useRoadmapStore((state) => state.projects)
  const setRoadmapItems = useRoadmapStore((state) => state.setRoadmapItems)
  const setProjects = useRoadmapStore((state) => state.setProjects)
  const addRoadmapItem = useRoadmapStore((state) => state.addRoadmapItem)
  const updateRoadmapHorizon = useRoadmapStore((state) => state.updateRoadmapHorizon)

  const sources = useSourceStore((state) => state.sources)
  const setSources = useSourceStore((state) => state.setSources)
  const addSource = useSourceStore((state) => state.addSource)
  const updateSource = useSourceStore((state) => state.updateSource)
  const deleteSource = useSourceStore((state) => state.deleteSource)
  const setSourceAiStatus = useSourceStore((state) => state.setSourceAiStatus)
  const attachExtractedEntities = useSourceStore((state) => state.attachExtractedEntities)
  const linkEntityToSource = useSourceStore((state) => state.linkEntityToSource)

  const activities = useActivityStore((state) => state.activities)
  const setActivities = useActivityStore((state) => state.setActivities)
  const logActivityRaw = useActivityStore((state) => state.logActivity)

  const role = useMetaStore((state) => state.role)
  const currentUser = useMetaStore((state) => state.currentUser)
  const sanitySyncStatus = useMetaStore((state) => state.sanitySyncStatus)
  const products = useMetaStore((state) => state.products)
  const productAreas = useMetaStore((state) => state.productAreas)
  const isLoaded = useMetaStore((state) => state.isLoaded)
  const setRole = useMetaStore((state) => state.setRole)
  const fetchSession = useMetaStore((state) => state.fetchSession)
  const setSanitySyncStatus = useMetaStore((state) => state.setSanitySyncStatus)
  const setProducts = useMetaStore((state) => state.setProducts)
  const setProductAreas = useMetaStore((state) => state.setProductAreas)
  const setIsLoaded = useMetaStore((state) => state.setIsLoaded)

  const logActivity = useCallback(
    (
      action: string,
      targetTitle: string,
      targetType: ActivityItem['targetType'],
      badgeColor = 'blue'
    ) => {
      const actorName = currentUser?.name || (role === 'engineer' ? 'Abdulaziz' : 'Ibrahim (CEO)')
      logActivityRaw(action, targetTitle, targetType, actorName, badgeColor)
    },
    [role, currentUser, logActivityRaw]
  )

  // Remote Sanity Fetch
  const refreshFromSanity = useCallback(async () => {
    try {
      setSanitySyncStatus('syncing')
      const res = await fetch('/api/os/fetch')
      if (!res.ok) {
        setSanitySyncStatus('local_fallback')
        return
      }

      const json = await res.json()
      if (json.success && json.data) {
        if (json.data.workItems && json.data.workItems.length > 0) {
          const mappedWork: WorkItem[] = json.data.workItems.map((w: any) => ({
            id: w._id.replace(/^work-/, '').replace(/^item-/, ''),
            itemNumber: w.itemNumber || `TASK-${w._id.slice(0, 4)}`,
            title: w.title,
            description: w.description,
            type: w.type || 'task',
            status: w.status || 'todo',
            priority: w.priority || 'medium',
            productId: w.productId || 'ace-acad',
            productAreaId: w.productAreaId,
            assignee: w.assignee || 'unassigned',
            reporter: w.reporter,
            blockerReason: w.blockerReason,
            codeReference: w.codeReference,
            dueDate: w.dueDate,
            subtasks: w.subtasks || [],
            bugMetadata: w.bugMetadata,
            createdAt: w.createdAt || w._createdAt || new Date().toISOString(),
            updatedAt: w.updatedAt || w._updatedAt || new Date().toISOString(),
          }))
          setWorkItems(mappedWork)
        }

        if (json.data.proposals && json.data.proposals.length > 0) {
          const mappedProposals: Proposal[] = json.data.proposals.map((p: any) => ({
            id: p._id.replace(/^prop-/, '').replace(/^proposal-/, ''),
            proposalNumber: p.proposalNumber || `PROP-${p._id.slice(0, 3)}`,
            slug: p.slug || p.filename?.replace('.md', '') || 'proposal',
            title: p.title,
            subtitle: p.subtitle || '',
            category: p.category || 'Content Scaling & UGC',
            status: p.status || 'approved_for_scoping',
            date: p.date || new Date().toISOString(),
            authors: p.authors || ['Abdulaziz Abdulwahab'],
            relatedDocuments: p.relatedDocuments || [],
            filename: p.filename || `${p.title}.md`,
            executiveSummary: p.executiveSummary || '',
            problemStatement: p.problemStatement || [],
            proposedSolution: p.proposedSolution || '',
            strategicAdvantages: p.strategicAdvantages || [],
            recommendedTierOrApproach: p.recommendedTierOrApproach || {
              name: 'Standard Tier',
              rationale: '',
              estimatedCost: '$0',
              roi: 'High',
            },
            keyRisks: p.keyRisks || [],
            phases: p.phases || [],
            actionItems: p.actionItems || [],
          }))
          setProposals(mappedProposals)
        }

        if (json.data.decisions && json.data.decisions.length > 0) {
          const mappedDecisions: Decision[] = json.data.decisions.map((d: any) => ({
            id: d._id.replace(/^decision-/, '').replace(/^dec-/, ''),
            decisionNumber: d.decisionNumber || `DEC-${d._id.slice(0, 3)}`,
            title: d.title,
            decision: d.decision,
            reason: d.reason,
            status: d.status || 'accepted',
            participants: d.participants || ['Abdulaziz Abdulwahab', 'Ibrahim Abdulwahab'],
            date: d.date || new Date().toISOString().split('T')[0],
            productId: d.productId || 'ace-acad',
            consequences: d.consequences,
            alternativesConsidered: d.alternativesConsidered || [],
          }))
          setDecisions(mappedDecisions)
        }

        if (json.data.feedbackItems && json.data.feedbackItems.length > 0) {
          const mappedFeedback: FeedbackItem[] = json.data.feedbackItems.map((f: any) => ({
            id: f._id.replace(/^feedback-/, ''),
            subject: f.subject,
            type: f.type || 'General',
            description: f.description,
            userId: f.userId || 'Anonymous',
            timestamp: f.timestamp || f._createdAt || new Date().toISOString(),
            status: f.status || 'new',
            convertedWorkItemId: f.convertedWorkItemId,
          }))
          setFeedbackItems(mappedFeedback)
        }

        if (json.data.roadmapItems && json.data.roadmapItems.length > 0) {
          const mappedRoadmap: RoadmapItem[] = json.data.roadmapItems.map((r: any) => ({
            id: r._id.replace(/^roadmap-/, '').replace(/^road-/, ''),
            title: r.title,
            description: r.description,
            horizon: r.horizon || 'now',
            productId: r.productId || 'ace-acad',
            targetQuarter: r.targetQuarter || r.targetDate || 'Q3 2026',
            category: r.category || 'Feature',
          }))
          setRoadmapItems(mappedRoadmap)
        }

        if (json.data.projects && json.data.projects.length > 0) {
          const mappedProjects: Project[] = json.data.projects.map((p: any) => ({
            id: p._id.replace(/^project-/, ''),
            name: p.name,
            summary: p.summary,
            productId: p.productId || 'ace-acad',
            status: p.status || 'active',
            targetDate: p.targetDate || '2026-10-01',
            lead: p.lead || 'Abdulaziz Abdulwahab',
            progress: typeof p.progress === 'number' ? p.progress : 0,
            milestones: p.milestones || [],
          }))
          setProjects(mappedProjects)
        }

        if (json.data.activities && json.data.activities.length > 0) {
          const mappedActivities: ActivityItem[] = json.data.activities.map((a: any) => ({
            id: a._id.replace(/^act-/, ''),
            actor: a.actor || 'System',
            action: a.action || 'updated',
            targetTitle: a.targetTitle || '',
            targetType: a.targetType || 'task',
            timestamp: a.timestamp || a._createdAt || new Date().toISOString(),
            badgeColor: a.badgeColor || 'blue',
          }))
          setActivities(mappedActivities)
        }

        if (json.data.sources && json.data.sources.length > 0) {
          const mappedSources: Source[] = json.data.sources.map((s: any) => ({
            id: s._id.replace(/^src-/, ''),
            sourceNumber: s.sourceNumber || `SRC-${s._id.slice(0, 3)}`,
            sourceType: s.sourceType || 'other',
            provider: s.provider || 'manual',
            title: s.title,
            summary: s.summary,
            content: s.content,
            externalId: s.externalId,
            externalUrl: s.externalUrl,
            mimeType: s.mimeType,
            author: s.author,
            relatedProductId: s.relatedProductId,
            relatedProjectId: s.relatedProjectId,
            relatedWorkItemIds: s.relatedWorkItemIds || [],
            relatedDecisionIds: s.relatedDecisionIds || [],
            relatedProposalIds: s.relatedProposalIds || [],
            aiStatus: s.aiStatus || 'pending',
            aiSummary: s.aiSummary,
            extractedEntities: s.extractedEntities,
            tags: s.tags || [],
            createdAt: s._createdAt || new Date().toISOString(),
            updatedAt: s._updatedAt || new Date().toISOString(),
          }))
          setSources(mappedSources)
        }

        setSanitySyncStatus('synced')
      } else {
        setSanitySyncStatus('local_fallback')
      }
    } catch (err) {
      console.warn('Unable to query Sanity remote dataset, utilizing local cache:', err)
      setSanitySyncStatus('local_fallback')
    }
  }, [
    setWorkItems,
    setProposals,
    setDecisions,
    setFeedbackItems,
    setRoadmapItems,
    setProjects,
    setActivities,
    setSources,
    setSanitySyncStatus,
  ])

  // Real-time Sanity Listener Initialization
  useEffect(() => {
    const unsubscribe = initializeRealtimeListener()
    return () => unsubscribe()
  }, [])

  // Initial Load (Fetch Session + Local Storage + Remote Sanity query)
  useEffect(() => {
    fetchSession().finally(() => {
      setIsLoaded(true)
      refreshFromSanity()
    })
  }, [fetchSession, setIsLoaded, refreshFromSanity])

  // Seed Sanity Cloud Handler
  const seedSanityCloud = async () => {
    setSanitySyncStatus('seeding')
    try {
      const res = await fetch('/api/os/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmSeed: true }),
      })
      const json = await res.json()
      if (json.success) {
        setSanitySyncStatus('synced')
        await refreshFromSanity()
        return { success: true, message: json.message }
      } else {
        setSanitySyncStatus('error')
        return { success: false, message: json.error || 'Failed to seed Sanity dataset' }
      }
    } catch (e: any) {
      setSanitySyncStatus('error')
      return { success: false, message: e.message || 'Network error while seeding Sanity' }
    }
  }

  const suggestClassification = (text: string): ClassificationSuggestion => {
    const lower = text.toLowerCase()

    if (
      lower.includes('crash') ||
      lower.includes('error') ||
      lower.includes('bug') ||
      lower.includes('fails') ||
      lower.includes('broken') ||
      lower.includes('exception') ||
      lower.includes('wrong')
    ) {
      return {
        type: 'bug',
        productId: lower.includes('plant') ? 'plantiq' : lower.includes('wstar') ? 'wstar-core' : 'ace-acad',
        productAreaId: lower.includes('auth') ? 'area-auth' : lower.includes('pdf') ? 'area-library' : 'area-study-path',
        priority: lower.includes('crash') || lower.includes('exception') ? 'critical' : 'high',
        assignee: 'abdulaziz',
        confidence: 0.9,
      }
    }

    if (
      lower.includes('we should') ||
      lower.includes('decide') ||
      lower.includes('architecture') ||
      lower.includes('policy') ||
      lower.includes('choose') ||
      lower.includes('strategy')
    ) {
      return {
        type: 'decision' as any,
        productId: 'ace-acad',
        priority: 'high',
        assignee: 'ibrahim',
        confidence: 0.85,
      }
    }

    return {
      type: 'task',
      productId: lower.includes('plant') ? 'plantiq' : lower.includes('wstar') ? 'wstar-core' : 'ace-acad',
      productAreaId: 'area-library',
      priority: 'medium',
      assignee: lower.includes('pitch') || lower.includes('investor') || lower.includes('legal') ? 'ibrahim' : 'abdulaziz',
      confidence: 0.7,
    }
  }

  const resetToInitialSeed = () => {
    if (typeof window !== 'undefined') {
      const confirmReset = window.confirm(
        'Are you sure you want to reset all OS data back to the Ace Acad Discovery Seed? Local changes will be reinitialized.'
      )
      if (confirmReset) {
        setProducts(initialProducts)
        setProposals(initialProposals)
        setWorkItems(initialWorkItems)
        setDecisions(initialDecisions)
        setFeedbackItems(initialFeedback)
        setProjects(initialProjects)
        setRoadmapItems(initialRoadmap)
        setActivities(initialActivities)
        setSources(initialSources)
      }
    }
  }

  return (
    <OSContext.Provider
      value={{
        role,
        currentUser,
        setRole,
        products,
        productAreas,
        proposals,
        workItems,
        decisions,
        feedbackItems,
        projects,
        roadmapItems,
        activities,
        sources,
        sanitySyncStatus,
        isLoaded,
        lastError: workLastError,
        seedSanityCloud,
        refreshFromSanity,
        updateProposalStatus,
        createWorkItemFromProposal,
        addWorkItem,
        updateWorkItem,
        deleteWorkItem,
        updateWorkItemStatus,
        decomposeWorkItem,
        toggleSubtask,
        addSubtask,
        addDecision,
        updateDecision,
        updateFeedbackStatus,
        convertFeedbackToWorkItem,
        addRoadmapItem,
        updateRoadmapHorizon,
        addSource,
        updateSource,
        deleteSource,
        setSourceAiStatus,
        attachExtractedEntities,
        linkEntityToSource,
        suggestClassification,
        resetToInitialSeed,
      }}
    >
      {children}
    </OSContext.Provider>
  )
}

export function useOS() {
  const context = useContext(OSContext)
  if (!context) {
    throw new Error('useOS must be used within an OSProvider')
  }
  return context
}
