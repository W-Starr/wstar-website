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

export type ProductId = 'ace-acad' | 'plantiq' | 'wstar-core' | string

export interface ProductArchitecturePillar {
  label: string
  value: string
  description: string
  badgeColor?: string
}

export interface ProductDomainColumn {
  key: string
  label: string
  isMono?: boolean
}

export interface ProductLifecycleStage {
  stageNumber: number
  name: string
  status: string
  description: string
}

export interface ProductCommandConfig {
  id?: string
  productId: string
  productName?: string
  versionBadge: string
  architecturePillars: ProductArchitecturePillar[]
  domainRegistry: {
    title: string
    subtitle?: string
    columns: ProductDomainColumn[]
    rows: Record<string, any>[]
  }
  lifecyclePipeline?: {
    title: string
    stages: ProductLifecycleStage[]
  }
  sourceIds?: string[]
  lastSynthesizedAt?: string
}

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
  projectId?: string
  assignee: 'abdulaziz' | 'ibrahim' | 'unassigned'
  reporter?: string
  blockerReason?: string
  codeReference?: string
  startDate?: string
  dueDate?: string
  estimatedHours?: number
  storyPoints?: number
  dependencies?: string[] // IDs or itemNumbers of blocking prerequisite tasks
  subtasks?: Subtask[]
  bugMetadata?: BugMetadata
  sourceId?: string
  sourceRef?: SourceRef
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
  sourceId?: string
  sourceRef?: SourceRef
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
  sourceId?: string
}

export interface Project {
  id: string
  name: string
  summary: string
  productId: ProductId
  status: 'planned' | 'active' | 'at_risk' | 'blocked' | 'completed'
  startDate?: string
  targetDate: string
  lead: string
  progress: number // 0-100
  dependencies?: string[] // IDs of prerequisite projects
  milestones: Milestone[]
  sourceId?: string
  sourceRef?: SourceRef
}

export interface Milestone {
  id: string
  projectId: string
  title: string
  startDate?: string
  dueDate: string
  completed: boolean
  dependencies?: string[]
}

export interface RoadmapItem {
  id: string
  title: string
  horizon: 'now' | 'next' | 'later' | 'ideas' | 'shipped'
  productId: ProductId
  description: string
  targetQuarter: string
  category: string
  shippedDate?: string
  sourceId?: string
}

export interface ActivityItem {
  id: string
  actor: string
  action: string
  targetTitle: string
  targetType: 'task' | 'bug' | 'decision' | 'feedback' | 'project' | 'product' | 'proposal' | 'source'
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
  productId?: ProductId
  category: 'Content Scaling & UGC' | 'AI & Adaptive Learning' | 'Architecture & Ingestion' | string
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
  sourceId?: string
  sourceRef?: SourceRef
}

export type SourceType =
  | 'gdrive'
  | 'url'
  | 'document'
  | 'manual_note'
  | 'meeting_note'
  | 'github_issue'
  | 'github_pr'
  | 'other'

export type SourceProvider = 'google_drive' | 'github' | 'web' | 'manual' | 'upload'

export interface ExtractedTask {
  title: string
  type: WorkItemType
  priority: WorkItemPriority
  productId: ProductId
  assignee?: 'abdulaziz' | 'ibrahim'
  selected?: boolean
}

export interface ExtractedWorkstream {
  id: string
  name: string
  description?: string
  suggestedLead?: 'abdulaziz' | 'ibrahim'
  tasks: ExtractedTask[]
}

export interface ExtractedDecision {
  title: string
  decision: string
  reason: string
  selected?: boolean
}

export interface ExtractedRisk {
  risk: string
  impact: 'Low' | 'Medium' | 'High'
  mitigation: string
}

export interface ExtractedEntities {
  summary: string
  proposedInitiative?: {
    title: string
    description: string
    targetQuarter?: string
    selected?: boolean
  }
  workstreams: ExtractedWorkstream[]
  decisions: ExtractedDecision[]
  risks: ExtractedRisk[]
  dependencies: string[]
  openQuestions: string[]
  assumptions: string[]
  deadlines: string[]
  peopleAndOwners: string[]
  referencedDocuments: string[]
  supersededProposalNotes?: string
}

export interface SourceRef {
  id: string
  title: string
  externalUrl?: string
  provider: SourceProvider
}

export interface Source {
  id: string
  sourceNumber: string
  sourceType: SourceType
  provider: SourceProvider
  title: string
  summary?: string
  content?: string
  externalId?: string
  externalUrl?: string
  mimeType?: string
  fileSize?: number
  author?: string
  createdAtExternal?: string
  modifiedAtExternal?: string
  relatedProductId?: ProductId
  relatedProjectId?: string
  relatedWorkItemIds?: string[]
  relatedDecisionIds?: string[]
  relatedProposalIds?: string[]
  aiStatus: 'pending' | 'processing' | 'analyzed' | 'failed'
  aiSummary?: string
  extractedEntities?: ExtractedEntities
  tags?: string[]
  createdAt: string
  updatedAt: string
}
