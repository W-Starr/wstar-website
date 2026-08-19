export type Role = 'engineer' | 'ceo' | 'product_manager' | 'operations'

export type WorkItemType =
  | 'task'
  | 'bug'
  | 'feature'
  | 'tech_debt'
  | 'improvement'
  | 'research'

export type WorkItemStatus = 'backlog' | 'todo' | 'in_progress' | 'blocked' | 'done'

export type WorkItemPriority = 'critical' | 'high' | 'medium' | 'low'

export type ProductId = 'ace-acad' | 'plantiq' | 'wstar-core'

export type SanitySyncState = 'local_fallback' | 'syncing' | 'synced' | 'error' | 'seeding'

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export interface BugMetadata {
  reproductionSteps?: string
  expectedBehavior?: string
  actualBehavior?: string
  severity?: 'critical' | 'major' | 'minor'
  environment?: string
}

export interface WorkItem {
  id: string
  itemNumber: string
  title: string
  description?: string
  type: WorkItemType
  status: WorkItemStatus
  priority: WorkItemPriority
  productId: ProductId
  productAreaId?: string
  assignee: 'abdulaziz' | 'ibrahim' | 'unassigned'
  reporter?: string
  blockerReason?: string
  codeReference?: string
  dueDate?: string
  subtasks?: Subtask[]
  bugMetadata?: BugMetadata
  createdAt: string
  updatedAt: string
}

export interface ProductArea {
  id: string
  productId: ProductId
  name: string
  description: string
  maturity: number // 0-100
  owner: string
  iconName: string
  activeItemsCount?: number
}

export interface Product {
  id: ProductId
  name: string
  tagline: string
  description: string
  status: 'beta' | 'development' | 'planning' | 'live' | 'archived'
  targetAudience: string
  version: string
  healthStatus: 'healthy' | 'at_risk' | 'blocked'
  areas: string[]
}

export interface Decision {
  id: string
  decisionNumber: string
  title: string
  decision: string
  reason: string
  status: 'proposed' | 'accepted' | 'superseded'
  participants: string[]
  date: string
  productId?: ProductId
  consequences?: string
  alternativesConsidered?: string[]
}

export interface FeedbackItem {
  id: string
  subject: string
  type: 'Bug Report' | 'Feature Request' | 'General' | 'Praise' | 'Complaint'
  description: string
  userId: string
  timestamp: string
  status: 'new' | 'triaged' | 'converted' | 'dismissed'
  convertedWorkItemId?: string
}

export interface Project {
  id: string
  name: string
  summary: string
  productId: ProductId
  status: 'planned' | 'active' | 'at_risk' | 'blocked' | 'completed'
  targetDate: string
  lead: string
  progress: number // 0-100
  milestones: Milestone[]
}

export interface Milestone {
  id: string
  projectId: string
  title: string
  dueDate: string
  completed: boolean
}

export interface RoadmapItem {
  id: string
  title: string
  horizon: 'now' | 'next' | 'later' | 'ideas'
  productId: ProductId
  description: string
  targetQuarter: string
  category: string
}

export interface ActivityItem {
  id: string
  actor: string
  action: string
  targetTitle: string
  targetType: 'task' | 'bug' | 'decision' | 'feedback' | 'project' | 'product' | 'proposal'
  timestamp: string
  badgeColor?: string
}

export interface ClassificationSuggestion {
  type: WorkItemType
  productId: ProductId
  productAreaId?: string
  priority: WorkItemPriority
  assignee: 'abdulaziz' | 'ibrahim'
  confidence: number
}

export interface ProposalPhase {
  phaseNumber: number
  title: string
  duration: string
  deliverable: string
  tasks: string[]
}

export interface Proposal {
  id: string
  proposalNumber: string
  slug: string
  title: string
  subtitle: string
  category: 'Content Scaling & UGC' | 'AI & Adaptive Learning' | 'Architecture & Ingestion'
  status: 'approved_for_scoping' | 'recommended_tier2' | 'staged_for_execution' | 'under_review'
  date: string
  authors: string[]
  relatedDocuments?: string[]
  filename: string
  executiveSummary: string
  problemStatement: { painPoint: string; impact: string }[]
  proposedSolution: string
  strategicAdvantages: { title: string; description: string }[]
  recommendedTierOrApproach: {
    name: string
    rationale: string
    estimatedCost: string
    roi: string
  }
  keyRisks: {
    risk: string
    likelihood: 'Low' | 'Medium' | 'High'
    impact: 'Low' | 'Medium' | 'High'
    mitigation: string
  }[]
  phases: ProposalPhase[]
  actionItems: string[]
  linkedWorkItemIds?: string[]
  linkedDecisionIds?: string[]
}
