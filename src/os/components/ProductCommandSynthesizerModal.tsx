'use client'

import React, { useState, useMemo } from 'react'
import { useOS } from '@/os/context/OSContext'
import {
  ProductCommandConfig,
  ProductArchitecturePillar,
  ProductDomainColumn,
  ProductLifecycleStage,
} from '@/os/types'
import {
  Sparkles,
  X,
  FileText,
  CheckSquare,
  Square,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Plus,
  Trash2,
  Edit3,
  Layers,
  Database,
  Route,
  RefreshCw,
  FolderOpen,
} from 'lucide-react'

interface ProductCommandSynthesizerModalProps {
  productId: string
  productName: string
  isOpen: boolean
  onClose: () => void
  existingConfig?: ProductCommandConfig | null
  initialEditMode?: boolean
}

type WizardStep = 'select_sources' | 'synthesizing' | 'review'

export function ProductCommandSynthesizerModal({
  productId,
  productName,
  isOpen,
  onClose,
  existingConfig,
  initialEditMode = false,
}: ProductCommandSynthesizerModalProps) {
  const { sources, saveProductCommandConfig, productAreas } = useOS()

  // Auto-select sources related to this product or tagged with it
  const defaultSelectedSourceIds = useMemo(() => {
    return sources
      .filter((s) => {
        const prod = (s.relatedProductId || '').toLowerCase()
        const title = (s.title || '').toLowerCase()
        const tags = (s.tags || []).map((t) => t.toLowerCase())
        const target = productId.toLowerCase()
        return prod === target || title.includes(target) || tags.some((t) => t.includes(target))
      })
      .map((s) => s.id)
  }, [sources, productId])

  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>(defaultSelectedSourceIds)
  const [customContext, setCustomContext] = useState('')
  const [step, setStep] = useState<WizardStep>(initialEditMode && existingConfig ? 'review' : 'select_sources')
  const [isSynthesizing, setIsSynthesizing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Editable config state
  const [draftConfig, setDraftConfig] = useState<ProductCommandConfig>(() => {
    if (existingConfig) return existingConfig
    return {
      productId,
      productName,
      versionBadge: 'v1.0.0',
      architecturePillars: [
        { label: 'Target Audience', value: 'Freshmen Cohort', description: 'Core user persona', badgeColor: 'blue' },
        { label: 'Core Loop', value: 'Read → Quiz → Progress', description: 'Pedagogical loop', badgeColor: 'emerald' },
        { label: 'Storage Model', value: 'Local Sandboxed SQLite', description: 'Offline engine', badgeColor: 'purple' },
      ],
      domainRegistry: {
        title: 'DOMAIN INVENTORY REGISTRY',
        subtitle: 'Core inventory items',
        columns: [
          { key: 'code', label: 'Item Code', isMono: true },
          { key: 'title', label: 'Title / Name' },
          { key: 'status', label: 'Status' },
        ],
        rows: [],
      },
      lifecyclePipeline: {
        title: 'TECHNICAL LIFECYCLE PIPELINE',
        stages: [
          { stageNumber: 1, name: 'Ingestion', status: 'Active', description: 'Raw asset ingestion' },
          { stageNumber: 2, name: 'Processing', status: 'In Progress', description: 'Transformation & parsing' },
          { stageNumber: 3, name: 'Delivery', status: 'Planned', description: 'Client consumption' },
        ],
      },
    }
  })

  // Suggested product areas from AI
  const [suggestedAreas, setSuggestedAreas] = useState<
    { name: string; description: string; owner: string; maturity: number }[]
  >([])

  if (!isOpen) return null

  const toggleSourceSelection = (id: string) => {
    setSelectedSourceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSelectAllSources = () => {
    if (selectedSourceIds.length === sources.length) {
      setSelectedSourceIds([])
    } else {
      setSelectedSourceIds(sources.map((s) => s.id))
    }
  }

  const runAiSynthesis = async () => {
    try {
      setIsSynthesizing(true)
      setErrorMessage(null)
      setStep('synthesizing')

      const res = await fetch('/api/os/ai/synthesize-product-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          productName,
          sourceIds: selectedSourceIds,
          customContext,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to synthesize product command center')
      }

      if (data.result && data.result.config) {
        setDraftConfig({
          ...data.result.config,
          sourceIds: selectedSourceIds,
          lastSynthesizedAt: new Date().toISOString(),
        })
        if (data.result.suggestedProductAreas) {
          setSuggestedAreas(data.result.suggestedProductAreas)
        }
      }

      setStep('review')
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during synthesis')
      setStep('select_sources')
    } finally {
      setIsSynthesizing(false)
    }
  }

  const handleSave = () => {
    saveProductCommandConfig(draftConfig)
    onClose()
  }

  // Helper mutations on draft config
  const updatePillar = (index: number, field: keyof ProductArchitecturePillar, val: string) => {
    const updated = [...draftConfig.architecturePillars]
    updated[index] = { ...updated[index], [field]: val }
    setDraftConfig({ ...draftConfig, architecturePillars: updated })
  }

  const addDomainRow = () => {
    const newRow: Record<string, any> = {}
    draftConfig.domainRegistry.columns.forEach((col) => {
      newRow[col.key] = col.key === 'code' ? `ITEM-${draftConfig.domainRegistry.rows.length + 1}` : 'New Entry'
    })
    setDraftConfig({
      ...draftConfig,
      domainRegistry: {
        ...draftConfig.domainRegistry,
        rows: [...draftConfig.domainRegistry.rows, newRow],
      },
    })
  }

  const updateDomainRow = (rowIndex: number, colKey: string, val: string) => {
    const updatedRows = [...draftConfig.domainRegistry.rows]
    updatedRows[rowIndex] = { ...updatedRows[rowIndex], [colKey]: val }
    setDraftConfig({
      ...draftConfig,
      domainRegistry: {
        ...draftConfig.domainRegistry,
        rows: updatedRows,
      },
    })
  }

  const removeDomainRow = (rowIndex: number) => {
    const updatedRows = draftConfig.domainRegistry.rows.filter((_, i) => i !== rowIndex)
    setDraftConfig({
      ...draftConfig,
      domainRegistry: {
        ...draftConfig.domainRegistry,
        rows: updatedRows,
      },
    })
  }

  const updatePipelineStage = (stageIdx: number, field: keyof ProductLifecycleStage, val: any) => {
    if (!draftConfig.lifecyclePipeline) return
    const updatedStages = [...draftConfig.lifecyclePipeline.stages]
    updatedStages[stageIdx] = { ...updatedStages[stageIdx], [field]: val }
    setDraftConfig({
      ...draftConfig,
      lifecyclePipeline: {
        ...draftConfig.lifecyclePipeline,
        stages: updatedStages,
      },
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {step === 'review'
                  ? `Configure Command Center: ${productName}`
                  : `AI Command Synthesizer: ${productName}`}
              </h2>
              <p className="text-xs text-slate-500">
                {step === 'select_sources' && 'Select & verify source documentation to ground the AI synthesis.'}
                {step === 'synthesizing' && 'Gemini is synthesizing architecture pillars, domain registries, and pipelines...'}
                {step === 'review' && 'Review and fine-tune your opinionated command center before saving to Sanity Cloud.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3 mx-5 mt-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* STEP 1: SELECT & VERIFY SOURCES */}
          {step === 'select_sources' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-blue-600" />
                    <span>Source Intelligence Verification</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select the exact documentation Gemini should synthesize from.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSelectAllSources}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-500"
                >
                  {selectedSourceIds.length === sources.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              {/* Source Document Cards List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                {sources.length === 0 ? (
                  <div className="col-span-2 p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                    No synced sources found in Source Intelligence. The AI will synthesize using domain foundations.
                  </div>
                ) : (
                  sources.map((source) => {
                    const isSelected = selectedSourceIds.includes(source.id)
                    return (
                      <div
                        key={source.id}
                        onClick={() => toggleSourceSelection(source.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-purple-50/60 dark:bg-purple-950/30 border-purple-300 dark:border-purple-800'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="mt-0.5 text-purple-600 dark:text-purple-400">
                          {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-400" />}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-bold text-slate-400">
                              {source.sourceNumber}
                            </span>
                            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {source.provider}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {source.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-2">
                            {source.summary || 'No summary generated yet.'}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Custom Instructions */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Founder Directives & Custom Focus (Optional)</span>
                </label>
                <textarea
                  value={customContext}
                  onChange={(e) => setCustomContext(e.target.value)}
                  placeholder="e.g. Focus heavily on Sub-Saharan farm clusters, MobileNet edge inference accuracy, and 10 key crop disease classifications (Maize, Cassava, Tomato)..."
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white resize-none h-20"
                />
              </div>
            </div>
          )}

          {/* STEP 2: SYNTHESIZING PROGRESS */}
          {step === 'synthesizing' && (
            <div className="p-12 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center animate-pulse">
                <Loader2 className="w-7 h-7 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Synthesizing Authoritative Command Center...
                </h3>
                <p className="text-xs text-slate-500 max-w-md">
                  Gemini is reading {selectedSourceIds.length} verified source documents and extracting technical architecture pillars, domain registries, and lifecycle stages.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: INTERACTIVE REVIEW & TWEAK */}
          {step === 'review' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Version Badge & Basic Meta */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    Engine Version & Architecture Stamp
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Badge displayed on the product command center header.
                  </p>
                </div>
                <input
                  type="text"
                  value={draftConfig.versionBadge}
                  onChange={(e) => setDraftConfig({ ...draftConfig, versionBadge: e.target.value })}
                  placeholder="e.g. Edge ML Engine • v0.3.0"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white w-64"
                />
              </div>

              {/* 3 Architecture Pillars */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>3 Core Technical Pillars</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {draftConfig.architecturePillars.map((pillar, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
                    >
                      <input
                        type="text"
                        value={pillar.label}
                        onChange={(e) => updatePillar(idx, 'label', e.target.value)}
                        placeholder="Pillar Label (e.g. TARGET COHORT)"
                        className="w-full text-[11px] font-bold text-slate-400 uppercase bg-transparent border-b border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:outline-hidden"
                      />
                      <input
                        type="text"
                        value={pillar.value}
                        onChange={(e) => updatePillar(idx, 'value', e.target.value)}
                        placeholder="Pillar Value (e.g. Freshmen 100L)"
                        className="w-full text-xs font-bold text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:outline-hidden"
                      />
                      <textarea
                        value={pillar.description}
                        onChange={(e) => updatePillar(idx, 'description', e.target.value)}
                        placeholder="1-2 sentences description..."
                        className="w-full text-[11px] text-slate-500 bg-transparent resize-none h-14 focus:outline-hidden"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Domain Registry Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{draftConfig.domainRegistry.title || 'Domain Registry Table'}</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {draftConfig.domainRegistry.rows.length} domain inventory items generated.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addDomainRow}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Row</span>
                  </button>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-60 overflow-y-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800 sticky top-0">
                      <tr>
                        {draftConfig.domainRegistry.columns.map((col) => (
                          <th key={col.key} className="p-2.5 pl-3">
                            {col.label}
                          </th>
                        ))}
                        <th className="p-2.5 pr-3 w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {draftConfig.domainRegistry.rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          {draftConfig.domainRegistry.columns.map((col) => (
                            <td key={col.key} className="p-2 pl-3">
                              <input
                                type="text"
                                value={row[col.key] || ''}
                                onChange={(e) => updateDomainRow(rowIdx, col.key, e.target.value)}
                                className={`w-full text-xs bg-transparent focus:outline-hidden ${
                                  col.isMono ? 'font-mono font-bold text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                                }`}
                              />
                            </td>
                          ))}
                          <td className="p-2 pr-3 text-right">
                            <button
                              type="button"
                              onClick={() => removeDomainRow(rowIdx)}
                              className="text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Technical Lifecycle Pipeline */}
              {draftConfig.lifecyclePipeline && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Route className="w-3.5 h-3.5 text-purple-600" />
                    <span>Lifecycle Pipeline Stages</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {draftConfig.lifecyclePipeline.stages.map((stage, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono font-bold text-purple-600">Stage {stage.stageNumber}</span>
                          <input
                            type="text"
                            value={stage.status}
                            onChange={(e) => updatePipelineStage(sIdx, 'status', e.target.value)}
                            className="text-[10px] font-semibold text-right text-slate-500 bg-transparent w-20 focus:outline-hidden"
                          />
                        </div>
                        <input
                          type="text"
                          value={stage.name}
                          onChange={(e) => updatePipelineStage(sIdx, 'name', e.target.value)}
                          placeholder="Stage Name"
                          className="w-full text-xs font-bold text-slate-900 dark:text-white bg-transparent focus:outline-hidden"
                        />
                        <textarea
                          value={stage.description}
                          onChange={(e) => updatePipelineStage(sIdx, 'description', e.target.value)}
                          placeholder="Stage Description"
                          className="w-full text-[11px] text-slate-500 bg-transparent resize-none h-10 focus:outline-hidden"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
          <div>
            {step === 'review' && (
              <button
                type="button"
                onClick={() => setStep('select_sources')}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-Synthesize from Sources</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60 transition-colors"
            >
              Cancel
            </button>

            {step === 'select_sources' && (
              <button
                type="button"
                onClick={runAiSynthesis}
                disabled={isSynthesizing}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-xs transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Synthesize with AI</span>
              </button>
            )}

            {step === 'review' && (
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Save Command Center</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
