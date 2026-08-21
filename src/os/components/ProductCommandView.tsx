'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useOS } from '@/os/context/OSContext'
import { WorkItem, Project, ProductCommandConfig } from '@/os/types'
import { WorkItemDetailModal } from '@/os/components/WorkItemDetailModal'
import { DecompositionModal } from '@/os/components/DecompositionModal'
import { ProjectDetailModal } from '@/os/components/ProjectDetailModal'
import { ProductCommandSynthesizerModal } from '@/os/components/ProductCommandSynthesizerModal'
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Database,
  FileCode2,
  Layers,
  FileText,
  ShieldAlert,
  ArrowUpRight,
  Route,
  Activity,
  ArrowRight,
  UploadCloud,
  FileCode,
  FolderKanban,
  Calendar,
  Users,
  Edit3,
  Search,
  CheckSquare,
  AlertTriangle,
  Clock,
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

  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null)
  const [decompositionItem, setDecompositionItem] = useState<WorkItem | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isSynthesizerOpen, setIsSynthesizerOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [domainSearchQuery, setDomainSearchQuery] = useState('')
  const [workFilterTab, setWorkFilterTab] = useState<'all' | 'bug' | 'tech_debt' | 'feature'>('all')

  // Find product metadata
  const currentProduct = useMemo(() => {
    return products.find(
      (p) => p.id.toLowerCase() === productId.toLowerCase() || p.name.toLowerCase() === productId.toLowerCase()
    )
  }, [products, productId])

  const productName = currentProduct?.name || defaultFallbackName || (productId === 'ace-acad' ? 'Ace Acad' : productId === 'plantiq' ? 'PlantIQ' : productId)
  const productTagline = currentProduct?.tagline || currentProduct?.description || defaultFallbackTagline || 'Product architecture, domain inventory, discovered debt, and active initiatives.'

  // Find stored command center config from Sanity or fallback to initialConfig / defaults
  const activeConfig: ProductCommandConfig = useMemo(() => {
    const fromStore = productCommandConfigs.find(
      (c) => c.productId.toLowerCase() === productId.toLowerCase()
    )
    if (fromStore) return fromStore
    if (initialConfig) return initialConfig

    // Default Fallback
    if (productId === 'ace-acad') {
      return {
        productId: 'ace-acad',
        productName: 'Ace Acad (ABU Zaria 100L Pilot)',
        versionBadge: 'Flutter Engine • v1.0.0+3',
        architecturePillars: [
          {
            label: 'Target Cohort',
            value: '100-Level Freshmen',
            description: '12 Faculties, 60+ Departments, 13 core science/general curriculum courses at ABU Zaria.',
            badgeColor: 'blue',
          },
          {
            label: 'Pedagogical Loop',
            value: 'Read → Quiz → Progress',
            description: 'Bounded pdfrx reading sessions with real-time pass-mark progression.',
            badgeColor: 'emerald',
          },
          {
            label: 'Offline Engine',
            value: 'Sandboxed Local Storage',
            description: 'Full study session & quiz loop operational in low-bandwidth campus hostels via Drift SQLite.',
            badgeColor: 'purple',
          },
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
          {
            label: 'Target Cohort',
            value: 'Smallholder Farmers',
            description: 'Rural agricultural clusters in Northern Nigeria across Maize, Cassava, and Tomato value chains.',
            badgeColor: 'emerald',
          },
          {
            label: 'Diagnostic Loop',
            value: 'Capture → Infer → Action',
            description: 'Edge MobileNet leaf disease classification with localized USSD/SMS treatment advisories.',
            badgeColor: 'blue',
          },
          {
            label: 'Offline Engine',
            value: 'LoRaWAN & TFLite Edge',
            description: 'Zero-cloud offline disease inference and soil moisture telemetry synchronization.',
            badgeColor: 'purple',
          },
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
      architecturePillars: [
        { label: 'Market Focus', value: 'Target Domain', description: 'Core customer value proposition', badgeColor: 'blue' },
        { label: 'Core Loop', value: 'Input → Process → Value', description: 'Primary user workflow', badgeColor: 'emerald' },
        { label: 'Architecture', value: 'Cloud Synchronized', description: 'Underlying data and engine platform', badgeColor: 'purple' },
      ],
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

  // Filtered Proposals
  const filteredProposals = useMemo(() => {
    return proposals.filter((p) => {
      const prod = (p.productId || '').toLowerCase()
      const target = productId.toLowerCase()
      return prod === target || prod.replace(/^product-/, '') === target
    })
  }, [proposals, productId])

  // Filtered Domain Registry Rows
  const filteredDomainRows = useMemo(() => {
    if (!domainSearchQuery.trim()) return activeConfig.domainRegistry.rows
    const query = domainSearchQuery.toLowerCase()
    return activeConfig.domainRegistry.rows.filter((row) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(query))
    )
  }, [activeConfig.domainRegistry.rows, domainSearchQuery])

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Sparkles className="w-4 h-4" />
            <span>Product Command Center</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            {activeConfig.productName || productName}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            {productTagline}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
            {activeConfig.versionBadge}
          </span>

          <button
            type="button"
            onClick={() => {
              setIsEditMode(false)
              setIsSynthesizerOpen(true)
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-all active:scale-95 flex items-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Synthesize with AI</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsEditMode(true)
              setIsSynthesizerOpen(true)
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Dashboard</span>
          </button>
        </div>
      </div>

      {/* 3 Architecture Overview Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activeConfig.architecturePillars.map((pillar, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
              <span>{pillar.label}</span>
              <span
                className={`font-mono text-xs font-bold ${
                  pillar.badgeColor === 'emerald'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : pillar.badgeColor === 'purple'
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-blue-600 dark:text-blue-400'
                }`}
              >
                Pillar {idx + 1}
              </span>
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {pillar.value}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>

      {/* Product Areas Health & Maturity Breakdown */}
      {filteredProductAreas.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>PRODUCT AREAS & MATURITY BREAKDOWN</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {filteredProductAreas.length} Areas Tracked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProductAreas.map((area) => (
              <div
                key={area.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {area.name}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-500">
                    {area.maturity}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {area.description}
                </p>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      area.maturity >= 85
                        ? 'bg-emerald-500'
                        : area.maturity >= 70
                        ? 'bg-blue-500'
                        : area.maturity >= 40
                        ? 'bg-purple-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${area.maturity}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400">
                  Lead: <strong>{area.owner}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Strategic Proposals & Expansion Horizons Banner */}
      {filteredProposals.length > 0 && (
        <section className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                <FileCode className="w-4 h-4" />
                <span>Next Horizon Strategic Proposals</span>
              </div>
              <h3 className="text-base font-bold font-heading">
                {filteredProposals.length} Proposals Ready for Expansion
              </h3>
              <p className="text-xs text-slate-300">
                Architecture, monetization models, and scaling initiatives.
              </p>
            </div>

            <Link
              href="/os/proposals"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
            >
              <span>Open Proposals Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
            {filteredProposals.map((p) => (
              <Link
                key={p.id}
                href="/os/proposals"
                className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 space-y-1.5 transition-colors group"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono font-bold text-purple-400">{p.proposalNumber}</span>
                  <span className="text-[10px] text-slate-400">{p.category}</span>
                </div>
                <div className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                  {p.title}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {p.subtitle}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Domain Specific Registry Table */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>{activeConfig.domainRegistry.title}</span>
            </h3>
            {activeConfig.domainRegistry.subtitle && (
              <span className="text-xs text-slate-400">
                {activeConfig.domainRegistry.subtitle}
              </span>
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={domainSearchQuery}
              onChange={(e) => setDomainSearchQuery(e.target.value)}
              placeholder="Search registry items..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800 sticky top-0">
                <tr>
                  {activeConfig.domainRegistry.columns.map((col, cIdx) => (
                    <th
                      key={col.key}
                      className={`p-3 ${cIdx === 0 ? 'pl-4' : ''} ${
                        cIdx === activeConfig.domainRegistry.columns.length - 1 ? 'pr-4' : ''
                      }`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDomainRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={activeConfig.domainRegistry.columns.length || 1}
                      className="p-6 text-center text-slate-400"
                    >
                      No registry items match query or domain registry is empty.
                    </td>
                  </tr>
                ) : (
                  filteredDomainRows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      {activeConfig.domainRegistry.columns.map((col, cIdx) => {
                        const val = row[col.key] || ''
                        const isMono = col.isMono || col.key === 'code' || col.key === 'id'
                        return (
                          <td
                            key={col.key}
                            className={`p-3 ${cIdx === 0 ? 'pl-4 font-bold' : ''} ${
                              cIdx === activeConfig.domainRegistry.columns.length - 1 ? 'pr-4' : ''
                            } ${isMono ? 'font-mono text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}
                          >
                            {col.key === 'status' ? (
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  val.toLowerCase().includes('verified') || val.toLowerCase().includes('trained')
                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    : val.toLowerCase().includes('pending') || val.toLowerCase().includes('progress')
                                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                }`}
                              >
                                {val}
                              </span>
                            ) : (
                              val
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Technical Lifecycle Pipeline Blueprint */}
      {activeConfig.lifecyclePipeline && (
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Route className="w-4 h-4 text-purple-600" />
            <span>{activeConfig.lifecyclePipeline.title}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeConfig.lifecyclePipeline.stages.map((stage) => (
              <div
                key={stage.stageNumber}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2 relative group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                    STAGE {stage.stageNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      stage.status.toLowerCase().includes('active') || stage.status.toLowerCase().includes('verified')
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
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {stage.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Active Strategic Projects for this Product */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-blue-600" />
            <span>ACTIVE STRATEGIC PROJECTS & INITIATIVES</span>
          </h3>
          <Link
            href="/os/projects"
            className="text-xs font-semibold text-blue-600 hover:text-blue-500 flex items-center gap-1"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
            No projects registered for {productName} yet. Create one in the{' '}
            <Link href="/os/projects" className="text-blue-600 underline">
              Projects Hub
            </Link>
            .
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((proj) => {
              const linkedTasks = workItems.filter(
                (w) => w.projectId === proj.id || w.projectId === proj.id.replace(/^project-/, '')
              )
              const doneTasks = linkedTasks.filter((w) => w.status === 'done')
              const completedMilestones = (proj.milestones || []).filter((m) => m.completed)

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
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        proj.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : proj.status === 'at_risk'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
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
                      <span>{proj.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{ width: `${proj.progress}%` }}
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
                        Milestones: <strong>{completedMilestones.length}/{proj.milestones?.length || 0}</strong>
                      </span>
                      <span>
                        Tasks: <strong>{doneTasks.length}/{linkedTasks.length}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Discovered Codebase Debt & P0 Bugs Work Stream */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>DISCOVERED TECHNICAL DEBT & ACTION ITEMS</span>
            </h3>
            <span className="text-xs text-slate-400">
              {productWorkItems.length} items logged for {productName}
            </span>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-xs">
            <button
              onClick={() => setWorkFilterTab('all')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                workFilterTab === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({productWorkItems.length})
            </button>
            <button
              onClick={() => setWorkFilterTab('bug')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                workFilterTab === 'bug'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Bugs ({productWorkItems.filter((w) => w.type === 'bug').length})
            </button>
            <button
              onClick={() => setWorkFilterTab('tech_debt')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                workFilterTab === 'tech_debt'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tech Debt ({productWorkItems.filter((w) => w.type === 'tech_debt').length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredWorkItems.length === 0 ? (
            <div className="col-span-2 p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
              No work items matching current filter for {productName}.
            </div>
          ) : (
            filteredWorkItems.slice(0, 10).map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs space-y-2 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-slate-400">
                    {item.itemNumber}
                  </span>
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

                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {item.description}
                </p>

                {item.codeReference && (
                  <div className="font-mono text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-2 py-1 rounded truncate">
                    {item.codeReference}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Modals */}
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
