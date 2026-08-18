'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  Role,
  WorkItem,
  Decision,
  FeedbackItem,
  Product,
  ProductArea,
  Project,
  RoadmapItem,
  ActivityItem,
  Proposal,
  WorkItemStatus,
  WorkItemPriority,
  WorkItemType,
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
} from '../data/initialSeed'
import { sanityClient, projectId, dataset } from '../sanity/client'

export type SanitySyncState = 'synced' | 'syncing' | 'local_fallback' | 'seeding' | 'error'

interface OSContextType {
  role: Role
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
  
  // Sanity Cloud Sync
  sanitySyncStatus: SanitySyncState
  seedSanityCloud: () => Promise<{ success: boolean; message: string }>
  refreshFromSanity: () => Promise<void>

  // Proposal Actions
  updateProposalStatus: (id: string, status: Proposal['status']) => void
  createWorkItemFromProposal: (proposalId: string, taskTitle: string, assignee: 'abdulaziz' | 'ibrahim') => WorkItem

  // Work Item Actions
  addWorkItem: (item: Omit<WorkItem, 'id' | 'createdAt' | 'updatedAt' | 'itemNumber'>) => WorkItem
  updateWorkItem: (id: string, updates: Partial<WorkItem>) => void
  deleteWorkItem: (id: string) => void
  updateWorkItemStatus: (id: string, status: WorkItemStatus) => void
  decomposeWorkItem: (id: string, subtaskTitles: string[]) => void
  toggleSubtask: (itemId: string, subtaskId: string) => void

  // Decision Actions
  addDecision: (decision: Omit<Decision, 'id' | 'decisionNumber'>) => Decision
  updateDecision: (id: string, updates: Partial<Decision>) => void

  // Feedback Actions
  updateFeedbackStatus: (id: string, status: FeedbackItem['status']) => void
  convertFeedbackToWorkItem: (feedbackId: string, itemData: Partial<WorkItem>) => WorkItem

  // Roadmap Actions
  addRoadmapItem: (item: Omit<RoadmapItem, 'id'>) => void
  updateRoadmapHorizon: (id: string, horizon: RoadmapItem['horizon']) => void

  // Intelligence
  suggestClassification: (text: string) => ClassificationSuggestion
  
  // Reset data to initial discovery seed
  resetToInitialSeed: () => void
}

const OSContext = createContext<OSContextType | undefined>(undefined)

const STORAGE_KEYS = {
  ROLE: 'wstar_os_role',
  PROPOSALS: 'wstar_os_proposals',
  WORK_ITEMS: 'wstar_os_work_items',
  DECISIONS: 'wstar_os_decisions',
  FEEDBACK: 'wstar_os_feedback',
  ROADMAP: 'wstar_os_roadmap',
  ACTIVITIES: 'wstar_os_activities',
  PRODUCT_AREAS: 'wstar_os_product_areas',
}

export function OSProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>('engineer')
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [productAreas, setProductAreas] = useState<ProductArea[]>(initialProductAreas)
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals)
  const [workItems, setWorkItems] = useState<WorkItem[]>(initialWorkItems)
  const [decisions, setDecisions] = useState<Decision[]>(initialDecisions)
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>(initialFeedback)
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>(initialRoadmap)
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities)
  const [sanitySyncStatus, setSanitySyncStatus] = useState<SanitySyncState>('local_fallback')
  const [isLoaded, setIsLoaded] = useState(false)

  // Helper to dispatch background mutation to Sanity API route
  const dispatchSanityMutation = async (action: 'create' | 'update' | 'patch' | 'delete', docType: string, id: string, data?: any) => {
    try {
      setSanitySyncStatus('syncing')
      const res = await fetch('/api/os/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, docType, id, data }),
      })
      const result = await res.json()
      if (result.mode === 'sanity_live') {
        setSanitySyncStatus('synced')
      } else {
        setSanitySyncStatus('local_fallback')
      }
    } catch (e) {
      console.warn('Sanity mutation dispatch failed, continuing in optimistic local mode:', e)
      setSanitySyncStatus('local_fallback')
    }
  }

  // Fetch live state from Sanity with local fallback
  const refreshFromSanity = useCallback(async () => {
    try {
      setSanitySyncStatus('syncing')
      const res = await fetch('/api/os/fetch')
      if (!res.ok) throw new Error('Fetch failed')
      const json = await res.json()
      
      if (json.success && json.hasData && json.data) {
        const d = json.data
        if (d.workItems && d.workItems.length > 0) {
          // Normalize Sanity items
          const mappedWorkItems: WorkItem[] = d.workItems.map((item: any) => ({
            id: item._id.replace('work-', ''),
            itemNumber: item.itemNumber || 'TASK-000',
            title: item.title,
            type: item.type || 'task',
            status: item.status || 'todo',
            priority: item.priority || 'medium',
            productId: item.product?._ref?.replace('product-', '') || 'ace-acad',
            productAreaId: item.productArea?._ref?.replace('area-', '') || 'area-library',
            assignee: item.assignee || 'abdulaziz',
            description: item.description,
            dueDate: item.dueDate,
            codeReference: item.codeReference,
            createdAt: item._createdAt,
            updatedAt: item._updatedAt,
          }))
          setWorkItems(mappedWorkItems)
        }

        if (d.proposals && d.proposals.length > 0) {
          const mappedProposals: Proposal[] = d.proposals.map((p: any) => ({
            id: p._id.replace('proposal-', ''),
            proposalNumber: p.proposalNumber,
            title: p.title,
            subtitle: p.subtitle,
            category: p.category,
            status: p.status,
            date: p.date,
            authors: p.authors || [],
            executiveSummary: p.executiveSummary,
            proposedSolution: p.proposedSolution,
            filename: p.filename,
            slug: p.title?.toLowerCase().replace(/\s+/g, '-'),
            relatedDocuments: [],
            problemStatement: [],
            strategicAdvantages: [],
            recommendedTierOrApproach: { name: 'Tier 2', rationale: '', estimatedCost: '', roi: '' },
            keyRisks: [],
            phases: [],
            actionItems: [],
            linkedWorkItemIds: [],
            linkedDecisionIds: [],
          }))
          // Merge with detailed seed phases if available
          setProposals((prev) =>
            mappedProposals.map((mp) => {
              const match = initialProposals.find((ip) => ip.proposalNumber === mp.proposalNumber)
              return match ? { ...match, status: mp.status } : mp
            })
          )
        }

        if (d.decisions && d.decisions.length > 0) {
          const mappedDecisions: Decision[] = d.decisions.map((dec: any) => ({
            id: dec._id.replace('decision-', ''),
            decisionNumber: dec.decisionNumber,
            title: dec.title,
            decision: dec.decision,
            status: dec.status || 'accepted',
            participants: dec.participants || ['Abdulaziz Abdulwahab', 'Ibrahim Abdulwahab'],
            date: dec.date || new Date().toISOString().split('T')[0],
            consequences: dec.consequences,
          }))
          setDecisions(mappedDecisions)
        }

        setSanitySyncStatus('synced')
      } else {
        setSanitySyncStatus('local_fallback')
      }
    } catch (err) {
      console.warn('Unable to query Sanity remote dataset, utilizing local cache:', err)
      setSanitySyncStatus('local_fallback')
    }
  }, [])

  // Initial Load (Local Storage + Remote Sanity query)
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem(STORAGE_KEYS.ROLE) as Role
      if (savedRole) setRoleState(savedRole)

      const savedProposals = localStorage.getItem(STORAGE_KEYS.PROPOSALS)
      if (savedProposals) setProposals(JSON.parse(savedProposals))

      const savedWork = localStorage.getItem(STORAGE_KEYS.WORK_ITEMS)
      if (savedWork) setWorkItems(JSON.parse(savedWork))

      const savedDecisions = localStorage.getItem(STORAGE_KEYS.DECISIONS)
      if (savedDecisions) setDecisions(JSON.parse(savedDecisions))

      const savedFeedback = localStorage.getItem(STORAGE_KEYS.FEEDBACK)
      if (savedFeedback) setFeedbackItems(JSON.parse(savedFeedback))

      const savedRoadmap = localStorage.getItem(STORAGE_KEYS.ROADMAP)
      if (savedRoadmap) setRoadmapItems(JSON.parse(savedRoadmap))

      const savedActivities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES)
      if (savedActivities) setActivities(JSON.parse(savedActivities))
    } catch (e) {
      console.error('Error loading OS state from storage', e)
    } finally {
      setIsLoaded(true)
      refreshFromSanity()
    }
  }, [refreshFromSanity])

  // Live Sanity Realtime Subscription (Cross-brother / cross-device live updates)
  useEffect(() => {
    if (!projectId || !dataset) return

    try {
      const subscription = sanityClient
        .listen('*[_type in ["workItem", "proposal", "decision", "feedbackItem", "activityItem"]]')
        .subscribe((update) => {
          if (update.result) {
            console.log('Sanity Realtime Event Received:', update)
            refreshFromSanity()
          }
        })

      return () => {
        subscription.unsubscribe()
      }
    } catch (e) {
      console.warn('Realtime subscription listener failed to initialize:', e)
    }
  }, [refreshFromSanity])

  // Save to local storage on change
  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, role)
      localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(proposals))
      localStorage.setItem(STORAGE_KEYS.WORK_ITEMS, JSON.stringify(workItems))
      localStorage.setItem(STORAGE_KEYS.DECISIONS, JSON.stringify(decisions))
      localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedbackItems))
      localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(roadmapItems))
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities))
    } catch (e) {
      console.error('Error saving OS state to storage', e)
    }
  }, [role, proposals, workItems, decisions, feedbackItems, roadmapItems, activities, isLoaded])

  // Seed Sanity Cloud Handler
  const seedSanityCloud = async () => {
    setSanitySyncStatus('seeding')
    try {
      const res = await fetch('/api/os/seed', { method: 'POST' })
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

  const setRole = (newRole: Role) => {
    setRoleState(newRole)
  }

  const logActivity = (
    action: string,
    targetTitle: string,
    targetType: ActivityItem['targetType'],
    badgeColor = 'blue'
  ) => {
    const actorName = role === 'engineer' ? 'Abdulaziz' : 'Ibrahim (CEO)'
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      actor: actorName,
      action,
      targetTitle,
      targetType,
      timestamp: new Date().toISOString(),
      badgeColor,
    }
    setActivities((prev) => [newAct, ...prev])
    dispatchSanityMutation('create', 'activityItem', newAct.id, newAct)
  }

  const updateProposalStatus = (id: string, status: Proposal['status']) => {
    setProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    )
    const p = proposals.find((x) => x.id === id)
    if (p) {
      logActivity(`updated proposal status to ${status.replace('_', ' ')}`, `[${p.proposalNumber}] ${p.title}`, 'proposal', 'blue')
      dispatchSanityMutation('patch', 'proposal', `proposal-${id}`, { status })
    }
  }

  const createWorkItemFromProposal = (
    proposalId: string,
    taskTitle: string,
    assignee: 'abdulaziz' | 'ibrahim'
  ): WorkItem => {
    const proposal = proposals.find((p) => p.id === proposalId)
    const count = workItems.filter((i) => i.type === 'feature' || i.type === 'task').length + 1
    const itemNumber = `TASK-${String(count + 100).padStart(3, '0')}`

    const newItem: WorkItem = {
      id: `item-${Date.now()}`,
      itemNumber,
      title: taskTitle,
      description: `Action item extracted from proposal [${proposal?.proposalNumber || ''}]: ${proposal?.title || ''}`,
      type: 'feature',
      status: 'todo',
      priority: 'high',
      productId: 'ace-acad',
      productAreaId: proposal?.category === 'Content Scaling & UGC' ? 'area-ugc' : 'area-ai-pipeline',
      assignee,
      codeReference: `proposals/${proposal?.filename || ''}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setWorkItems((prev) => [newItem, ...prev])
    logActivity('promoted proposal task to work stream', `[${itemNumber}] ${taskTitle}`, 'task', 'purple')
    dispatchSanityMutation('create', 'workItem', `work-${newItem.id}`, newItem)
    return newItem
  }

  const addWorkItem = (
    itemData: Omit<WorkItem, 'id' | 'createdAt' | 'updatedAt' | 'itemNumber'>
  ): WorkItem => {
    const prefix = itemData.type === 'bug' ? 'BUG' : itemData.type === 'tech_debt' ? 'DEBT' : 'TASK'
    const count = workItems.filter((i) => i.type === itemData.type).length + 1
    const itemNumber = `${prefix}-${String(count).padStart(3, '0')}`

    const newItem: WorkItem = {
      ...itemData,
      id: `item-${Date.now()}`,
      itemNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setWorkItems((prev) => [newItem, ...prev])
    logActivity('created', `[${itemNumber}] ${newItem.title}`, itemData.type === 'bug' ? 'bug' : 'task', itemData.type === 'bug' ? 'red' : 'emerald')
    dispatchSanityMutation('create', 'workItem', `work-${newItem.id}`, newItem)
    return newItem
  }

  const updateWorkItem = (id: string, updates: Partial<WorkItem>) => {
    setWorkItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updates, updatedAt: new Date().toISOString() }
          return updated
        }
        return item
      })
    )
    dispatchSanityMutation('patch', 'workItem', `work-${id}`, updates)
  }

  const deleteWorkItem = (id: string) => {
    const item = workItems.find((i) => i.id === id)
    setWorkItems((prev) => prev.filter((i) => i.id !== id))
    if (item) {
      logActivity('deleted', `[${item.itemNumber}] ${item.title}`, 'task', 'slate')
      dispatchSanityMutation('delete', 'workItem', `work-${id}`)
    }
  }

  const updateWorkItemStatus = (id: string, status: WorkItemStatus) => {
    const item = workItems.find((i) => i.id === id)
    if (!item) return
    updateWorkItem(id, { status })
    logActivity(
      status === 'done' ? 'completed' : status === 'blocked' ? 'blocked' : 'updated status to ' + status,
      `[${item.itemNumber}] ${item.title}`,
      item.type === 'bug' ? 'bug' : 'task',
      status === 'done' ? 'emerald' : status === 'blocked' ? 'red' : 'blue'
    )
  }

  const decomposeWorkItem = (id: string, subtaskTitles: string[]) => {
    const item = workItems.find((i) => i.id === id)
    if (!item) return

    const newSubtasks = subtaskTitles.map((t, idx) => ({
      id: `sub-${Date.now()}-${idx}`,
      title: t,
      completed: false,
    }))

    updateWorkItem(id, { subtasks: [...(item.subtasks || []), ...newSubtasks] })
    logActivity('decomposed into subtasks', `[${item.itemNumber}] ${item.title}`, 'task', 'purple')
  }

  const toggleSubtask = (itemId: string, subtaskId: string) => {
    setWorkItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId && item.subtasks) {
          const updated = {
            ...item,
            subtasks: item.subtasks.map((st) =>
              st.id === subtaskId ? { ...st, completed: !st.completed } : st
            ),
            updatedAt: new Date().toISOString(),
          }
          dispatchSanityMutation('patch', 'workItem', `work-${itemId}`, { subtasks: updated.subtasks })
          return updated
        }
        return item
      })
    )
  }

  const addDecision = (
    decData: Omit<Decision, 'id' | 'decisionNumber'>
  ): Decision => {
    const count = decisions.length + 1
    const decisionNumber = `DEC-${String(count).padStart(3, '0')}`

    const newDec: Decision = {
      ...decData,
      id: `dec-${Date.now()}`,
      decisionNumber,
    }

    setDecisions((prev) => [newDec, ...prev])
    logActivity('recorded architectural decision', `[${decisionNumber}] ${newDec.title}`, 'decision', 'blue')
    dispatchSanityMutation('create', 'decision', `decision-${newDec.id}`, newDec)
    return newDec
  }

  const updateDecision = (id: string, updates: Partial<Decision>) => {
    setDecisions((prev) =>
      prev.map((dec) => (dec.id === id ? { ...dec, ...updates } : dec))
    )
    dispatchSanityMutation('patch', 'decision', `decision-${id}`, updates)
  }

  const updateFeedbackStatus = (id: string, status: FeedbackItem['status']) => {
    setFeedbackItems((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status } : f))
    )
    const item = feedbackItems.find((f) => f.id === id)
    if (item) {
      logActivity(`triaged feedback to ${status}`, item.subject, 'feedback', 'amber')
      dispatchSanityMutation('patch', 'feedbackItem', `feedback-${id}`, { status })
    }
  }

  const convertFeedbackToWorkItem = (
    feedbackId: string,
    itemData: Partial<WorkItem>
  ): WorkItem => {
    const fb = feedbackItems.find((f) => f.id === feedbackId)
    const type: WorkItemType = fb?.type === 'Bug Report' ? 'bug' : 'feature'
    const prefix = type === 'bug' ? 'BUG' : 'TASK'
    const count = workItems.filter((i) => i.type === type).length + 1
    const itemNumber = `${prefix}-${String(count).padStart(3, '0')}`

    const newItem: WorkItem = {
      id: `item-${Date.now()}`,
      itemNumber,
      title: itemData.title || fb?.subject || 'Feedback Item',
      description: itemData.description || fb?.description || '',
      type: itemData.type || type,
      status: 'todo',
      priority: itemData.priority || 'high',
      productId: itemData.productId || 'ace-acad',
      productAreaId: itemData.productAreaId || 'area-feedback',
      assignee: itemData.assignee || 'abdulaziz',
      reporter: fb?.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setWorkItems((prev) => [newItem, ...prev])
    updateFeedbackStatus(feedbackId, 'converted')
    logActivity('converted user feedback to work item', `[${itemNumber}] ${newItem.title}`, type === 'bug' ? 'bug' : 'task', 'purple')
    dispatchSanityMutation('create', 'workItem', `work-${newItem.id}`, newItem)
    return newItem
  }

  const addRoadmapItem = (itemData: Omit<RoadmapItem, 'id'>) => {
    const newItem: RoadmapItem = {
      ...itemData,
      id: `road-${Date.now()}`,
    }
    setRoadmapItems((prev) => [...prev, newItem])
    logActivity('added roadmap item', newItem.title, 'project', 'blue')
    dispatchSanityMutation('create', 'roadmapItem', `roadmap-${newItem.id}`, newItem)
  }

  const updateRoadmapHorizon = (id: string, horizon: RoadmapItem['horizon']) => {
    setRoadmapItems((prev) =>
      prev.map((r) => (r.id === id ? { ...r, horizon } : r))
    )
    const item = roadmapItems.find((r) => r.id === id)
    if (item) {
      logActivity(`shifted roadmap horizon to ${horizon}`, item.title, 'project', 'purple')
      dispatchSanityMutation('patch', 'roadmapItem', `roadmap-${id}`, { horizon })
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
        productId: 'ace-acad',
        confidence: 0.9,
        priority: lower.includes('crash') || lower.includes('exception') ? 'critical' : 'high',
        productAreaId: lower.includes('auth') ? 'area-auth' : lower.includes('pdf') ? 'area-library' : 'area-study-path',
        assignee: 'abdulaziz',
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
        type: 'research',
        productId: 'wstar-core',
        confidence: 0.85,
        priority: 'high',
        assignee: 'ibrahim',
      }
    }

    return {
      type: 'task',
      productId: 'ace-acad',
      confidence: 0.7,
      priority: 'medium',
      assignee: lower.includes('pitch') || lower.includes('investor') || lower.includes('legal') ? 'ibrahim' : 'abdulaziz',
      productAreaId: 'area-library',
    }
  }

  const resetToInitialSeed = () => {
    if (typeof window !== 'undefined') {
      const confirmReset = window.confirm(
        'Reset all OS state back to the authoritative code discovery seed?'
      )
      if (!confirmReset) return
      
      localStorage.removeItem(STORAGE_KEYS.PROPOSALS)
      localStorage.removeItem(STORAGE_KEYS.WORK_ITEMS)
      localStorage.removeItem(STORAGE_KEYS.DECISIONS)
      localStorage.removeItem(STORAGE_KEYS.FEEDBACK)
      localStorage.removeItem(STORAGE_KEYS.ROADMAP)
      localStorage.removeItem(STORAGE_KEYS.ACTIVITIES)

      setProposals(initialProposals)
      setWorkItems(initialWorkItems)
      setDecisions(initialDecisions)
      setFeedbackItems(initialFeedback)
      setProjects(initialProjects)
      setRoadmapItems(initialRoadmap)
      setActivities(initialActivities)
      setSanitySyncStatus('local_fallback')
    }
  }

  return (
    <OSContext.Provider
      value={{
        role,
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
        sanitySyncStatus,
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
        addDecision,
        updateDecision,
        updateFeedbackStatus,
        convertFeedbackToWorkItem,
        addRoadmapItem,
        updateRoadmapHorizon,
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
