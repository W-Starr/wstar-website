'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useOS } from '@/os/context/OSContext'
import { WorkItem, Project, ProductCommandConfig, ProductArea } from '@/os/types'
import { useComputedProgress } from '@/os/hooks/useComputedProgress'
import { WorkItemDetailModal } from '@/os/components/WorkItemDetailModal'
import { DecompositionModal } from '@/os/components/DecompositionModal'
import { ProjectDetailModal } from '@/os/components/ProjectDetailModal'
import { ProductAreaDetailModal } from '@/os/components/ProductAreaDetailModal'
import { ProductCommandSynthesizerModal } from '@/os/components/ProductCommandSynthesizerModal'
import { DataRegistryTable } from '@/os/components/DataRegistryTable'
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Layers,
  FolderKanban,
  ArrowRight,
  ShieldAlert,
  Users,
  Route,
  Database,
  ChevronDown,
  ChevronUp,
  Bug,
  ListChecks,
  TrendingUp,
  Edit3,
  Clock,
  Target,
} from 'lucide-react'

interface ProductCommandViewProps {
  productId: string
  defaultFallbackName?: string
  defaultFallbackTagline?: string
  initialConfig?: ProductCommandConfig
}

export function ProductCommandView({
  productId,
  defaultFallbackName,
  defaultFallbackTagline,
  initialConfig,
}: ProductCommandViewProps) {
  const {
    products,
    productAreas,
    workItems,
    proposals,
    projects,
    productCommandConfigs,
  } = useOS()

  const { getProjectProgress, getAreaMaturity, getProductStats } =
    useComputedProgress(workItems, projects, productAreas)

  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null)
  const [decompositionItem, setDecompositionItem] = useState<WorkItem | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedArea, setSelectedArea] = useState<ProductArea | null>(null)
  const [isSynthesizerOpen, setIsSynthesizerOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isContextOpen, setIsContextOpen] = useState(false)
  const [workFilterTab, setWorkFilterTab] = useState<'all' | 'bug' | 'tech_debt' | 'feature'>('all')

  // Find product metadata
  const currentProduct = useMemo(() => {
    return products.find(
      (p) =>
        p.id.toLowerCase() === productId.toLowerCase() ||
        p.name.toLowerCase() === productId.toLowerCase()
    )
  }, [products, productId])

  const productName =
    currentProduct?.name ||
    defaultFallbackName ||
    (productId === 'ace-acad'
      ? 'Ace Acad'
      : productId === 'plantiq'
      ? 'PlantIQ'
      : productId)
  const productTagline =
    currentProduct?.tagline ||
    currentProduct?.description ||
    defaultFallbackTagline ||
    'Projects, tasks, and progress for this product.'

  // Command center config (for the collapsible context section)
  const activeConfig: ProductCommandConfig = useMemo(() => {
    const fromStore = productCommandConfigs.find(
      (c) => c.productId.toLowerCase() === productId.toLowerCase()
    )
    if (fromStore) return fromStore
    if (initialConfig) return initialConfig

    // Minimal default
    if (productId === 'ace-acad') {
      return {
        productId: 'ace-acad',
        productName: 'Ace Acad (ABU Zaria 100L Pilot)',
        versionBadge: 'Flutter Engine • v1.0.0+3',
        architecturePillars: [
          { label: 'Target Cohort', value: '100-Level Freshmen', description: '12 Faculties, 60+ Departments, 13 core science/general curriculum courses at ABU Zaria.', badgeColor: 'blue' },
          { label: 'Pedagogical Loop', value: 'Read → Quiz → Progress', description: 'Bounded pdfrx reading sessions with real-time pass-mark progression.', badgeColor: 'emerald' },
          { label: 'Offline Engine', value: 'Sandboxed Local Storage', description: 'Full study session & quiz loop operational in low-bandwidth campus hostels via Drift SQLite.', badgeColor: 'purple' },
        ],
        domainRegistry: {
          title: '13 CORE 100L FOUNDATIONAL COURSES REGISTRY',
          subtitle: 'Source: scripts/all_new_courses.json & extract_pdf.py',
          columns: [
            { key: 'code', label: 'Course Code', isMono: true },
            { key: 'title', label: 'Course Title' },
            { key: 'level', label: 'Level & Semester' },
            { key: 'status', label: 'Ingestion & Readiness Status' },
          ],
          rows: [
            { code: 'MATH 101', title: 'Elementary Mathematics I (Algebra & Trigonometry)', level: '100L 1st', status: 'Ingested & Verified' },
            { code: 'MATH 102', title: 'Elementary Mathematics II (Calculus & Vectors)', level: '100L 2nd', status: 'Ingested & Verified' },
            { code: 'CHEM 101', title: 'General Chemistry I (Physical & Inorganic)', level: '100L 1st', status: 'Ingested & Verified' },
            { code: 'CHEM 111', title: 'Basic Practical Chemistry I', level: '100L 1st', status: 'Ingested & Verified' },
            { code: 'CHEM 121', title: 'Organic Chemistry I', level: '100L 1st', status: 'Extracted / Pending Ingestion' },
            { code: 'CHEM 122', title: 'Organic Chemistry II', level: '100L 2nd', status: 'Extracted / Pending Ingestion' },
            { code: 'PHYS 101', title: 'General Physics I (Mechanics & Thermal)', level: '100L 1st', status: 'Extracted / Pending Ingestion' },
            { code: 'PHYS 102', title: 'General Physics II (Electricity & Magnetism)', level: '100L 2nd', status: 'Extracted / Pending Ingestion' },
            { code: 'GENS 101', title: 'Use of English & Communication Skills', level: '100L 1st', status: 'Ingested & Verified' },
            { code: 'GENS 103', title: 'Nigerian Peoples & Culture', level: '100L 1st', status: 'Extracted / Pending Ingestion' },
            { code: 'BIO 101', title: 'General Biology I (Cell Biology & Genetics)', level: '100L 1st', status: 'Extracted / Pending Ingestion' },
            { code: 'COSC 101', title: 'Introduction to Computer Science', level: '100L 1st', status: 'Extracted / Pending Ingestion' },
            { code: 'STAT 101', title: 'Elementary Statistics for Sciences', level: '100L 1st', status: 'Extracted / Pending Ingestion' },
          ],
        },
        lifecyclePipeline: {
          title: '3-ZONE INGESTION & QUALITY PIPELINE',
          stages: [
            { stageNumber: 1, name: 'Raw Material Quarantine', status: 'Active', description: 'Faculty syllabi, PDF lecture notes, and past exams uploaded via Google Drive.' },
            { stageNumber: 2, name: 'Ghostscript & OCR Parsing', status: 'Active', description: 'Dual OCR pipeline with PyPDF fallback and image contrast optimization.' },
            { stageNumber: 3, name: 'AI Quiz Extraction & QA', status: 'In Progress', description: 'Gemini structured question generation with Bloom taxonomy validation.' },
            { stageNumber: 4, name: 'Study Path Staging & Ingest', status: 'Verified', description: 'Atomic modules committed to SQLite Drift and Sanity Cloud.' },
          ],
        },
      }
    }

    if (productId === 'plantiq') {
      return {
        productId: 'plantiq',
        productName: 'PlantIQ (Smallholder Agronomy Diagnostics)',
        versionBadge: 'Edge ML & IoT Telemetry • v0.3.0',
        architecturePillars: [
          { label: 'Target Cohort', value: 'Smallholder Farmers', description: 'Rural agricultural clusters in Northern Nigeria across Maize, Cassava, and Tomato value chains.', badgeColor: 'emerald' },
          { label: 'Diagnostic Loop', value: 'Capture → Infer → Action', description: 'Edge MobileNet leaf disease classification with localized USSD/SMS treatment advisories.', badgeColor: 'blue' },
          { label: 'Offline Engine', value: 'LoRaWAN & TFLite Edge', description: 'Zero-cloud offline disease inference and soil moisture telemetry synchronization.', badgeColor: 'purple' },
        ],
        domainRegistry: {
          title: 'CROP DISEASE & DIAGNOSTIC MODELS REGISTRY',
          subtitle: 'Edge ML CNN models & target pathology database',
          columns: [
            { key: 'code', label: 'Model / Crop Code', isMono: true },
            { key: 'title', label: 'Pathology / Crop Condition' },
            { key: 'category', label: 'Severity & Category' },
            { key: 'status', label: 'Model Benchmark Status' },
          ],
          rows: [
            { code: 'PLIQ-MAIZE-01', title: 'Northern Corn Leaf Blight (Exserohilum turcicum)', category: 'Fungal • High Severity', status: 'Model Trained (94.2% F1)' },
            { code: 'PLIQ-MAIZE-02', title: 'Fall Armyworm Infestation (Spodoptera frugiperda)', category: 'Pest • Critical Severity', status: 'Dataset Ingestion (1.2k samples)' },
            { code: 'PLIQ-CASS-01', title: 'Cassava Mosaic Disease (CMD)', category: 'Viral • High Severity', status: 'Model Trained (96.1% F1)' },
            { code: 'PLIQ-CASS-02', title: 'Cassava Brown Streak Disease (CBSD)', category: 'Viral • Critical Severity', status: 'Active Validation' },
            { code: 'PLIQ-TOM-01', title: 'Tomato Early Blight (Alternaria solani)', category: 'Fungal • Medium Severity', status: 'Model Trained (91.8% F1)' },
            { code: 'PLIQ-TOM-02', title: 'Tomato Leaf Curl Virus (ToLCV)', category: 'Viral • High Severity', status: 'Active Validation' },
            { code: 'PLIQ-SOIL-01', title: 'NPK Telemetry Sensor Node Array', category: 'Hardware IoT • Microclimate', status: 'Bench Test Passed (Node v2)' },
          ],
        },
        lifecyclePipeline: {
          title: 'PRECISION AGRONOMY INGESTION & DIAGNOSTIC PIPELINE',
          stages: [
            { stageNumber: 1, name: 'Leaf Photo / Sensor Telemetry', status: 'Active', description: 'Camera scan or hardware sensor pulse recorded by field agent.' },
            { stageNumber: 2, name: 'Edge MobileNetV3 Inference', status: 'Active', description: 'Instant offline CNN classification executed on device within 350ms.' },
            { stageNumber: 3, name: 'Agronomy Rule Engine', status: 'Active', description: 'Translates pathology into organic and affordable chemical interventions.' },
            { stageNumber: 4, name: 'SMS / USSD Voice Dispatch', status: 'In Progress', description: 'Delivers localized Hausa and Yoruba audio/text advisories to farmer phone.' },
          ],
        },
      }
    }

    return {
      productId,
      productName,
      versionBadge: 'v1.0.0',
      architecturePillars: [],
      domainRegistry: {
        title: `${productName.toUpperCase()} DOMAIN REGISTRY`,
        subtitle: 'Core inventory and domain entities',
        columns: [
          { key: 'code', label: 'Code / ID', isMono: true },
          { key: 'title', label: 'Item Name' },
          { key: 'status', label: 'Status' },
        ],
        rows: [],
      },
    }
  }, [productCommandConfigs, initialConfig, productId, productName])

  // ─── Computed Stats ───
  const stats = useMemo(() => getProductStats(productId), [getProductStats, productId])

  // Filtered Product Areas
  const filteredProductAreas = useMemo(() => {
    return productAreas.filter((a) => {
      const p = (a.productId || '').toLowerCase()
      const target = productId.toLowerCase()
      return p === target || p.includes(target) || (target === 'ace-acad' && p === '')
    })
  }, [productAreas, productId])

  // Filtered Projects for this product
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const prod = (p.productId || '').toLowerCase()
      const target = productId.toLowerCase()
      return prod === target || prod.replace(/^product-/, '') === target
    })
  }, [projects, productId])

  // Filtered Work Items
  const productWorkItems = useMemo(() => {
    return workItems.filter((w) => {
      const prod = (w.productId || '').toLowerCase()
      const target = productId.toLowerCase()
      return prod === target || prod.replace(/^product-/, '') === target
    })
  }, [workItems, productId])

  const filteredWorkItems = useMemo(() => {
    if (workFilterTab === 'all') return productWorkItems
    return productWorkItems.filter((w) => w.type === workFilterTab)
  }, [productWorkItems, workFilterTab])

  const hasContextContent =
    (activeConfig.architecturePillars && activeConfig.architecturePillars.length > 0) ||
    (activeConfig.domainRegistry.rows && activeConfig.domainRegistry.rows.length > 0) ||
    activeConfig.lifecyclePipeline

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Target className="w-4 h-4" />
            <span>Product Dashboard</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            {activeConfig.productName || productName}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">{productTagline}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 self-start">
          {activeConfig.versionBadge}
        </span>
      </div>

      {/* ─── Computed Stats Strip ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          label="Overall Progress"
          value={`${stats.overallProgress}%`}
          icon={<TrendingUp className="w-4 h-4" />}
          color="blue"
        />
        <StatCard
          label="Tasks Done"
          value={`${stats.doneTasks} / ${stats.totalTasks}`}
          icon={<CheckCircle2 className="w-4 h-4" />}
          color="emerald"
        />
        <StatCard
          label="In Progress"
          value={String(stats.inProgressTasks)}
          icon={<Clock className="w-4 h-4" />}
          color="purple"
        />
        <StatCard
          label="Open Bugs"
          value={String(stats.openBugs)}
          icon={<Bug className="w-4 h-4" />}
          color={stats.openBugs > 0 ? 'rose' : 'slate'}
        />
        <StatCard
          label="Projects"
          value={`${stats.completedProjects} / ${stats.totalProjects} done`}
          icon={<FolderKanban className="w-4 h-4" />}
          color="slate"
        />
      </div>

      {/* ─── Product Areas with Computed Maturity ─── */}
      {filteredProductAreas.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Product Areas</span>
            <span className="text-xs text-slate-400 font-normal ml-1">
              ({filteredProductAreas.length} areas)
            </span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredProductAreas.map((area) => {
              const computedMaturity = getAreaMaturity(area.id)
              const areaTasksTotal = workItems.filter(
                (w) =>
                  w.productAreaId === area.id ||
                  w.productAreaId === `area-${area.id}`
              ).length
              const areaTasksDone = workItems.filter(
                (w) =>
                  (w.productAreaId === area.id ||
                    w.productAreaId === `area-${area.id}`) &&
                  w.status === 'done'
              ).length

              return (
                <div
                  key={area.id}
                  onClick={() => setSelectedArea(area)}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-md shadow-2xs space-y-2.5 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">
                      {area.name}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {computedMaturity}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {area.description}
                  </p>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        computedMaturity >= 85
                          ? 'bg-emerald-500'
                          : computedMaturity >= 70
                          ? 'bg-blue-500'
                          : computedMaturity >= 40
                          ? 'bg-purple-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${computedMaturity}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>
                      Tasks: <strong>{areaTasksDone}/{areaTasksTotal}</strong>
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:underline flex items-center gap-0.5">
                      <span>View & Add Tasks</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ─── Projects with Computed Progress ─── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-blue-600" />
            <span>Projects</span>
          </h3>
          <Link
            href="/os/projects"
            className="text-xs font-semibold text-blue-600 hover:text-blue-500 flex items-center gap-1"
          >
            <span>All Projects</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
            No projects registered for {productName} yet.{' '}
            <Link href="/os/projects" className="text-blue-600 underline">
              Create one
            </Link>
            .
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredProjects.map((proj) => {
              const computedProgress = getProjectProgress(proj.id)
              const linkedTasks = workItems.filter(
                (w) =>
                  w.projectId === proj.id ||
                  w.projectId === proj.id.replace(/^project-/, '')
              )
              const doneTasks = linkedTasks.filter((w) => w.status === 'done')
              const completedMilestones = (proj.milestones || []).filter(
                (m) => m.completed
              )

              return (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProject(proj)}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs space-y-3 cursor-pointer transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {proj.name}
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase shrink-0 ${
                        proj.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : proj.status === 'active'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : proj.status === 'at_risk'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          : proj.status === 'blocked'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {proj.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {proj.summary}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Progress</span>
                      <span>{computedProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          computedProgress >= 100
                            ? 'bg-emerald-500'
                            : proj.status === 'at_risk'
                            ? 'bg-amber-500'
                            : 'bg-blue-600'
                        }`}
                        style={{ width: `${Math.min(100, computedProgress)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      <span>{proj.lead}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>
                        Milestones:{' '}
                        <strong>
                          {completedMilestones.length}/
                          {proj.milestones?.length || 0}
                        </strong>
                      </span>
                      <span>
                        Tasks:{' '}
                        <strong>
                          {doneTasks.length}/{linkedTasks.length}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ─── Work Items ─── */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-purple-600" />
            <span>Work Items</span>
            <span className="text-xs text-slate-400 font-normal ml-1">
              ({productWorkItems.length} total)
            </span>
          </h3>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-xs">
            {[
              { key: 'all' as const, label: 'All', count: productWorkItems.length },
              { key: 'bug' as const, label: 'Bugs', count: productWorkItems.filter((w) => w.type === 'bug').length },
              { key: 'tech_debt' as const, label: 'Debt', count: productWorkItems.filter((w) => w.type === 'tech_debt').length },
              { key: 'feature' as const, label: 'Features', count: productWorkItems.filter((w) => w.type === 'feature').length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setWorkFilterTab(tab.key)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  workFilterTab === tab.key
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredWorkItems.length === 0 ? (
            <div className="col-span-2 p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
              No work items matching current filter for {productName}.
            </div>
          ) : (
            filteredWorkItems.slice(0, 12).map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs space-y-2 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-slate-400">
                      {item.itemNumber}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        item.status === 'done'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : item.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      item.priority === 'critical'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                        : item.priority === 'high'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h4>

                {item.description && (
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {filteredWorkItems.length > 12 && (
          <Link
            href="/os/work"
            className="block text-center text-xs font-semibold text-blue-600 hover:text-blue-500 py-2"
          >
            View all {filteredWorkItems.length} items →
          </Link>
        )}
      </section>

      {/* ─── Collapsible Product Context ─── */}
      {hasContextContent && (
        <section className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setIsContextOpen(!isContextOpen)}
            className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Product Context & Domain Registry
              </span>
              <span className="text-[10px] text-slate-400">
                Architecture, domain inventory, pipeline
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditMode(false)
                  setIsSynthesizerOpen(true)
                }}
                className="px-2 py-1 rounded-md text-[10px] font-semibold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/60 transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Synthesize
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditMode(true)
                  setIsSynthesizerOpen(true)
                }}
                className="px-2 py-1 rounded-md text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                Edit
              </button>
              {isContextOpen ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </button>

          {isContextOpen && (
            <div className="p-5 space-y-6 bg-white dark:bg-slate-900">
              {/* Architecture Pillars */}
              {activeConfig.architecturePillars &&
                activeConfig.architecturePillars.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Architecture Overview
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {activeConfig.architecturePillars.map((pillar, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-semibold">
                            <span>{pillar.label}</span>
                            <span
                              className={`font-mono ${
                                pillar.badgeColor === 'emerald'
                                  ? 'text-emerald-500'
                                  : pillar.badgeColor === 'purple'
                                  ? 'text-purple-500'
                                  : 'text-blue-500'
                              }`}
                            >
                              P{idx + 1}
                            </span>
                          </div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">
                            {pillar.value}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            {pillar.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Domain Registry Table */}
              {activeConfig.domainRegistry.rows.length > 0 && (
                <DataRegistryTable
                  title={activeConfig.domainRegistry.title}
                  subtitle={activeConfig.domainRegistry.subtitle}
                  icon={<Database className="w-4 h-4 text-emerald-600" />}
                  columns={activeConfig.domainRegistry.columns}
                  rows={activeConfig.domainRegistry.rows}
                />
              )}

              {/* Lifecycle Pipeline */}
              {activeConfig.lifecyclePipeline && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Route className="w-3.5 h-3.5 text-purple-500" />
                    {activeConfig.lifecyclePipeline.title}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {activeConfig.lifecyclePipeline.stages.map((stage) => (
                      <div
                        key={stage.stageNumber}
                        className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                            STAGE {stage.stageNumber}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                              stage.status.toLowerCase().includes('active') ||
                              stage.status.toLowerCase().includes('verified')
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                                : 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300'
                            }`}
                          >
                            {stage.status}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {stage.name}
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          {stage.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ─── Modals ─── */}
      <WorkItemDetailModal
        item={selectedItem}
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        onOpenDecomposition={(item) => setDecompositionItem(item)}
      />

      <DecompositionModal
        item={decompositionItem}
        isOpen={Boolean(decompositionItem)}
        onClose={() => setDecompositionItem(null)}
      />

      <ProjectDetailModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />

      <ProductAreaDetailModal
        area={selectedArea}
        isOpen={Boolean(selectedArea)}
        onClose={() => setSelectedArea(null)}
        onOpenTaskDetail={(t) => setSelectedItem(t)}
      />

      <ProductCommandSynthesizerModal
        productId={productId}
        productName={productName}
        isOpen={isSynthesizerOpen}
        onClose={() => setIsSynthesizerOpen(false)}
        existingConfig={activeConfig}
        initialEditMode={isEditMode}
      />
    </div>
  )
}

// ─── Stat Card Component ───

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: string
  icon: React.ReactNode
  color: 'blue' | 'emerald' | 'purple' | 'rose' | 'slate' | 'amber'
}) {
  const colorMap = {
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40',
    emerald: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40',
    rose: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40',
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40',
    slate: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40',
  }

  return (
    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${colorMap[color]}`}>{icon}</div>
        <span className="text-[10px] font-semibold text-slate-400 uppercase">
          {label}
        </span>
      </div>
      <div className="text-lg font-bold text-slate-900 dark:text-white font-mono tracking-tight">
        {value}
      </div>
    </div>
  )
}
