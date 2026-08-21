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
  Milestone,
  ProductCommandConfig,
  RoadmapItem,
  ActivityItem,
  SanitySyncState,
  WorkItemStatus,
  ClassificationSuggestion,
} from '../types'
import { useWorkStore } from '../store/workStore'
import { useProposalStore } from '../store/proposalStore'
import { useDecisionStore } from '../store/decisionStore'
import { useFeedbackStore } from '../store/feedbackStore'
import { useRoadmapStore } from '../store/roadmapStore'
import { useActivityStore } from '../store/activityStore'
import { useMetaStore } from '../store/metaStore'
import { useSourceStore } from '../store/sourceStore'
import { initializeRealtimeListener } from '../sanity/realtime'
import { Source, ExtractedEntities, ProductId } from '../types'

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
  productCommandConfigs: ProductCommandConfig[]
  sanitySyncStatus: SanitySyncState
  isLoaded: boolean
  lastError: string | null

  // Sanity Cloud Actions
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
  markRoadmapItemShipped: (id: string) => void
  updateRoadmapItem: (id: string, updates: Partial<RoadmapItem>) => void
  deleteRoadmapItem: (id: string) => void

  // Project Actions
  addProject: (project: Omit<Project, 'id'>) => Project
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  addMilestone: (projectId: string, milestone: Omit<Milestone, 'id' | 'projectId'>) => void
  toggleMilestone: (projectId: string, milestoneId: string) => void
  deleteMilestone: (projectId: string, milestoneId: string) => void

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

  // Product Area Actions
  addProductArea: (area: Omit<ProductArea, 'id'>) => ProductArea
  updateProductArea: (id: string, updates: Partial<ProductArea>) => void
  deleteProductArea: (id: string) => void

  // Product Command Centers
  saveProductCommandConfig: (config: ProductCommandConfig) => void
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
  const markRoadmapItemShipped = useRoadmapStore((state) => state.markRoadmapItemShipped)
  const updateRoadmapItem = useRoadmapStore((state) => state.updateRoadmapItem)
  const deleteRoadmapItem = useRoadmapStore((state) => state.deleteRoadmapItem)
  const addProject = useRoadmapStore((state) => state.addProject)
  const updateProject = useRoadmapStore((state) => state.updateProject)
  const deleteProject = useRoadmapStore((state) => state.deleteProject)
  const addMilestone = useRoadmapStore((state) => state.addMilestone)
  const toggleMilestone = useRoadmapStore((state) => state.toggleMilestone)
  const deleteMilestone = useRoadmapStore((state) => state.deleteMilestone)

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
  const productCommandConfigs = useMetaStore((state) => state.productCommandConfigs)
  const isLoaded = useMetaStore((state) => state.isLoaded)
  const setRole = useMetaStore((state) => state.setRole)
  const fetchSession = useMetaStore((state) => state.fetchSession)
  const setSanitySyncStatus = useMetaStore((state) => state.setSanitySyncStatus)
  const setProducts = useMetaStore((state) => state.setProducts)
  const setProductAreas = useMetaStore((state) => state.setProductAreas)
  const addProductArea = useMetaStore((state) => state.addProductArea)
  const updateProductArea = useMetaStore((state) => state.updateProductArea)
  const deleteProductArea = useMetaStore((state) => state.deleteProductArea)
  const setProductCommandConfigs = useMetaStore((state) => state.setProductCommandConfigs)
  const saveProductCommandConfig = useMetaStore((state) => state.saveProductCommandConfig)
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
        if (json.data.workItems && Array.isArray(json.data.workItems)) {
          const mappedWork: WorkItem[] = json.data.workItems.map((w: any) => ({
            id: w._id,
            itemNumber: w.itemNumber || `TASK-${w._id.replace(/^work-/, '').slice(-4)}`,
            title: w.title,
            description: w.description,
            type: w.type || 'task',
            status: w.status || 'todo',
            priority: w.priority || 'medium',
            productId: (w.productId || (w.product?._ref ? w.product._ref.replace('product-', '') : 'ace-acad')) as ProductId,
            productAreaId: w.productAreaId || (w.productArea?._ref ? w.productArea._ref.replace('area-', '') : undefined),
            projectId: w.projectId || (w.project?._ref ? w.project._ref.replace('project-', '') : undefined),
            assignee: w.assignee || 'unassigned',
            reporter: w.reporter,
            blockerReason: w.blockerReason,
            codeReference: w.codeReference,
            startDate: w.startDate,
            dueDate: w.dueDate,
            estimatedHours: w.estimatedHours,
            storyPoints: w.storyPoints,
            dependencies: w.dependencies || (w.dependsOn ? (Array.isArray(w.dependsOn) ? w.dependsOn : [w.dependsOn]) : []),
            subtasks: w.subtasks || [],
            bugMetadata: w.bugMetadata,
            createdAt: w.createdAt || w._createdAt || new Date().toISOString(),
            updatedAt: w.updatedAt || w._updatedAt || new Date().toISOString(),
          }))
          setWorkItems(mappedWork)
        }

        if (json.data.proposals && Array.isArray(json.data.proposals)) {
          const mappedProposals: Proposal[] = json.data.proposals.map((p: any) => ({
            id: p._id,
            proposalNumber: p.proposalNumber || `PROP-${p._id.replace(/^proposal-/, '').slice(-3)}`,
            slug: p.slug || p.filename?.replace('.md', '') || 'proposal',
            title: p.title,
            subtitle: p.subtitle || '',
            productId: p.productId || (p.product?._ref ? p.product._ref.replace(/^product-/, '') : 'ace-acad'),
            category: p.category || 'Architecture & Planning',
            status: p.status || 'under_review',
            date: p.date || p._createdAt || new Date().toISOString(),
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

        if (json.data.decisions && Array.isArray(json.data.decisions)) {
          const mappedDecisions: Decision[] = json.data.decisions.map((d: any) => ({
            id: d._id,
            decisionNumber: d.decisionNumber || `DEC-${d._id.replace(/^decision-/, '').slice(-3)}`,
            title: d.title,
            decision: d.decision,
            reason: d.reason,
            status: d.status || 'accepted',
            participants: d.participants || ['Abdulaziz Abdulwahab', 'Ibrahim Abdulwahab'],
            date: d.date || (d._createdAt ? d._createdAt.split('T')[0] : new Date().toISOString().split('T')[0]),
            productId: (d.productId || 'ace-acad') as ProductId,
            consequences: d.consequences,
            alternativesConsidered: d.alternativesConsidered || [],
          }))
          setDecisions(mappedDecisions)
        }

        if (json.data.feedbackItems && Array.isArray(json.data.feedbackItems)) {
          const mappedFeedback: FeedbackItem[] = json.data.feedbackItems.map((f: any) => ({
            id: f._id,
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

        if (json.data.roadmapItems && Array.isArray(json.data.roadmapItems)) {
          const mappedRoadmap: RoadmapItem[] = json.data.roadmapItems.map((r: any) => ({
            id: r._id,
            title: r.title,
            description: r.description,
            horizon: r.horizon || 'now',
            productId: (r.productId || 'ace-acad') as ProductId,
            targetQuarter: r.targetQuarter || 'Q3 2026',
            category: r.category || 'Feature',
          }))
          setRoadmapItems(mappedRoadmap)
        }

        if (json.data.projects && Array.isArray(json.data.projects)) {
          const mappedProjects: Project[] = json.data.projects.map((p: any) => ({
            id: p._id,
            name: p.name,
            summary: p.summary,
            productId: (p.productId || 'ace-acad') as ProductId,
            status: p.status || 'active',
            startDate: p.startDate,
            targetDate: p.targetDate || '2026-10-01',
            lead: p.lead || 'Abdulaziz Abdulwahab',
            progress: typeof p.progress === 'number' ? p.progress : 0,
            dependencies: p.dependencies || [],
            milestones: p.milestones || [],
          }))
          setProjects(mappedProjects)
        }

        if (json.data.activities && Array.isArray(json.data.activities)) {
          const mappedActivities: ActivityItem[] = json.data.activities.map((a: any) => ({
            id: a._id,
            actor: a.actor || 'System',
            action: a.action || 'updated',
            targetTitle: a.targetTitle || '',
            targetType: a.targetType || 'task',
            timestamp: a.timestamp || a._createdAt || new Date().toISOString(),
            badgeColor: a.badgeColor || 'blue',
          }))
          setActivities(mappedActivities)
        }

        if (json.data.sources && Array.isArray(json.data.sources)) {
          const mappedSources: Source[] = json.data.sources.map((s: any) => ({
            id: s._id,
            sourceNumber: s.sourceNumber || `SRC-${s._id.replace(/^src-/, '').slice(-3)}`,
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

        if (json.data.products && Array.isArray(json.data.products)) {
          const mappedProducts: Product[] = json.data.products.map((p: any) => ({
            id: p._id.replace(/^product-/, ''),
            name: p.name,
            tagline: p.tagline || '',
            description: p.description || '',
            status: p.status || 'live',
            targetAudience: p.targetAudience || '',
            version: p.version || '1.0.0',
            healthStatus: p.healthStatus || 'healthy',
            areas: p.areas || [],
          }))
          setProducts(mappedProducts)
        }

        if (json.data.productAreas && Array.isArray(json.data.productAreas)) {
          const mappedAreas: ProductArea[] = json.data.productAreas.map((a: any) => ({
            id: a._id.replace(/^area-/, ''),
            name: a.name,
            description: a.description || '',
            maturity: typeof a.maturity === 'number' ? a.maturity : 50,
            owner: a.owner || 'Abdulaziz',
            iconName: a.iconName || 'Layers',
            productId: a.productId || (a.product?._ref ? a.product._ref.replace(/^product-/, '') : 'ace-acad'),
          }))
          setProductAreas(mappedAreas)
        }

        if (json.data.productCommandCenters && Array.isArray(json.data.productCommandCenters)) {
          const mappedConfigs: ProductCommandConfig[] = json.data.productCommandCenters.map((c: any) => ({
            id: c._id,
            productId: c.productId || c._id.replace(/^product-command-/, ''),
            productName: c.productName,
            versionBadge: c.versionBadge || 'v1.0.0',
            architecturePillars: c.architecturePillars || [],
            domainRegistry: c.domainRegistry || { title: 'DOMAIN INVENTORY REGISTRY', columns: [], rows: [] },
            lifecyclePipeline: c.lifecyclePipeline,
            sourceIds: c.sourceIds || [],
            lastSynthesizedAt: c.lastSynthesizedAt || c._updatedAt,
          }))
          setProductCommandConfigs(mappedConfigs)
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
    setProducts,
    setProductAreas,
    setProductCommandConfigs,
    setSanitySyncStatus,
  ])

  // Real-time Sanity Listener Initialization
  useEffect(() => {
    const unsubscribe = initializeRealtimeListener()
    return () => unsubscribe()
  }, [])

  // Initial Load (Fetch Session + Remote Sanity query)
  useEffect(() => {
    fetchSession().finally(() => {
      setIsLoaded(true)
      refreshFromSanity()
    })
  }, [fetchSession, setIsLoaded, refreshFromSanity])

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
        productCommandConfigs,
        sanitySyncStatus,
        isLoaded,
        lastError: workLastError,
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
        markRoadmapItemShipped,
        updateRoadmapItem,
        deleteRoadmapItem,
        addProject,
        updateProject,
        deleteProject,
        addMilestone,
        toggleMilestone,
        deleteMilestone,
        addSource,
        updateSource,
        deleteSource,
        setSourceAiStatus,
        attachExtractedEntities,
        linkEntityToSource,
        suggestClassification,
        addProductArea,
        updateProductArea,
        deleteProductArea,
        saveProductCommandConfig,
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
