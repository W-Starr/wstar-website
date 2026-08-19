'use client'

import React, { useState, useEffect } from 'react'
import { useOS } from '../context/OSContext'
import { Source, ExtractedEntities, ExtractedWorkstream, ExtractedTask, ExtractedDecision } from '../types'
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FolderGit2,
  Layers,
  CheckSquare,
  FileText,
  User,
  ExternalLink,
  Zap,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
} from 'lucide-react'

interface SourceAnalysisModalProps {
  source: Source | null
  isOpen: boolean
  onClose: () => void
}

export function SourceAnalysisModal({ source, isOpen, onClose }: SourceAnalysisModalProps) {
  const {
    addWorkItem,
    addDecision,
    addRoadmapItem,
    attachExtractedEntities,
    linkEntityToSource,
  } = useOS()

  const [isLoading, setIsLoading] = useState(false)
  const [entities, setEntities] = useState<ExtractedEntities | null>(null)
  const [selectedTasks, setSelectedTasks] = useState<Record<string, boolean>>({})
  const [selectedDecisions, setSelectedDecisions] = useState<Record<number, boolean>>({})
  const [includeInitiative, setIncludeInitiative] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Initialize or trigger analysis on open
  useEffect(() => {
    if (!isOpen || !source) return

    setFeedbackSuccess(null)
    setErrorMessage(null)

    if (source.extractedEntities) {
      setEntities(source.extractedEntities)
      initSelections(source.extractedEntities)
    } else {
      triggerAnalysis()
    }
  }, [isOpen, source])

  const initSelections = (ent: ExtractedEntities) => {
    const taskMap: Record<string, boolean> = {}
    ent.workstreams.forEach((ws) => {
      ws.tasks.forEach((t, i) => {
        taskMap[`${ws.id}-${i}`] = true
      })
    })
    setSelectedTasks(taskMap)

    const decMap: Record<number, boolean> = {}
    ent.decisions.forEach((_, i) => {
      decMap[i] = true
    })
    setSelectedDecisions(decMap)
    setIncludeInitiative(!!ent.proposedInitiative)
  }

  const triggerAnalysis = async () => {
    if (!source) return
    setIsLoading(true)
    setEntities(null)
    setErrorMessage(null)

    try {
      let contentToAnalyze = source.content || source.summary || ''

      // If document is from Google Drive and has an externalId but no stored content, fetch content from GDrive API first
      if (!contentToAnalyze && source.externalId && source.provider === 'google_drive') {
        try {
          const gdriveRes = await fetch('/api/os/sources/gdrive', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileId: source.externalId }),
          })
          const gdriveData = await gdriveRes.json()
          if (gdriveData.success && gdriveData.content) {
            contentToAnalyze = gdriveData.content
          }
        } catch (gErr) {
          console.warn('[SourceAnalysisModal] Auto-fetch GDrive content notice:', gErr)
        }
      }

      const res = await fetch('/api/os/ai/analyze-source', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceTitle: source.title,
          sourceContent: contentToAnalyze || source.title,
          sourceUrl: source.externalUrl,
          productId: source.relatedProductId,
        }),
      })

      const data = await res.json()
      if (data.success && data.extractedEntities) {
        setEntities(data.extractedEntities)
        initSelections(data.extractedEntities)
        attachExtractedEntities(source.id, data.extractedEntities)
      } else {
        setErrorMessage(data.error || 'Failed to extract entities from document.')
      }
    } catch (err: any) {
      console.error('Failed to run AI Source Analysis:', err)
      setErrorMessage(err?.message || 'Failed to connect to AI analysis service.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !source) return null

  const handleToggleTask = (key: string) => {
    setSelectedTasks((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleToggleDecision = (idx: number) => {
    setSelectedDecisions((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  const handleAddSelectedToWSTAR = async () => {
    if (!entities) return
    setIsAdding(true)

    try {
      let tasksCreated = 0
      let decisionsCreated = 0

      // 1. Add Proposed Initiative to Roadmap if selected
      if (includeInitiative && entities.proposedInitiative) {
        addRoadmapItem({
          title: entities.proposedInitiative.title,
          description: entities.proposedInitiative.description,
          horizon: 'now',
          productId: source.relatedProductId || 'ace-acad',
          targetQuarter: entities.proposedInitiative.targetQuarter || 'Q3-Q4 2026',
          category: 'Strategy & Ingestion',
          sourceId: source.id,
        })
      }

      // 2. Add Selected Tasks to Work Items
      entities.workstreams.forEach((ws) => {
        ws.tasks.forEach((t, i) => {
          const key = `${ws.id}-${i}`
          if (selectedTasks[key]) {
            const newItem = addWorkItem({
              title: t.title,
              description: `Extracted from source: ${source.title} (${ws.name})`,
              type: t.type || 'task',
              status: 'todo',
              priority: t.priority || 'high',
              productId: t.productId || source.relatedProductId || 'ace-acad',
              assignee: t.assignee || 'abdulaziz',
              sourceId: source.id,
              sourceRef: {
                id: source.id,
                title: source.title,
                externalUrl: source.externalUrl,
                provider: source.provider,
              },
            })
            linkEntityToSource(source.id, 'work', newItem.id)
            tasksCreated++
          }
        })
      })

      // 3. Add Selected Decisions to ADRs
      entities.decisions.forEach((d, i) => {
        if (selectedDecisions[i]) {
          const newDec = addDecision({
            title: d.title,
            decision: d.decision,
            reason: d.reason,
            status: 'accepted',
            participants: ['Abdulaziz Abdulwahab', 'Ibrahim Abdulwahab'],
            date: new Date().toISOString().split('T')[0],
            productId: source.relatedProductId || 'ace-acad',
            sourceId: source.id,
            sourceRef: {
              id: source.id,
              title: source.title,
              externalUrl: source.externalUrl,
              provider: source.provider,
            },
          })
          linkEntityToSource(source.id, 'decision', newDec.id)
          decisionsCreated++
        }
      })

      setFeedbackSuccess(`Added ${tasksCreated} tasks and ${decisionsCreated} decisions to WSTAR OS!`)
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      console.error('Failed to create records from source:', err)
    } finally {
      setIsAdding(false)
    }
  }

  const selectedTasksCount = Object.values(selectedTasks).filter(Boolean).length
  const selectedDecisionsCount = Object.values(selectedDecisions).filter(Boolean).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-sans">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                  AI Source Interpretation & Review
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5" />
                  Gemini Flash
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-md">
                {source.title} ({source.sourceNumber})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={triggerAnalysis}
              disabled={isLoading}
              title="Re-run AI Analysis"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Deconstructing Source with Gemini Flash...
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Extracting overarching initiatives, technical workstreams, actionable tickets, and architectural decisions.
              </p>
            </div>
          ) : entities ? (
            <div className="space-y-6">
              {/* Feedback Alert */}
              {feedbackSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{feedbackSuccess}</span>
                </div>
              )}

              {/* Executive Summary */}
              <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Executive AI Summary</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {entities.summary}
                </p>
              </div>

              {/* Proposed Initiative / Roadmap item */}
              {entities.proposedInitiative && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="check-initiative"
                        checked={includeInitiative}
                        onChange={(e) => setIncludeInitiative(e.target.checked)}
                        className="rounded border-slate-400 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                      />
                      <label htmlFor="check-initiative" className="text-xs font-bold text-slate-900 dark:text-white cursor-pointer">
                        Add Overarching Initiative to Roadmap
                      </label>
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                      {entities.proposedInitiative.targetQuarter}
                    </span>
                  </div>
                  <div className="pl-5 text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {entities.proposedInitiative.title}:{' '}
                    </span>
                    {entities.proposedInitiative.description}
                  </div>
                </div>
              )}

              {/* Extracted Workstreams & Tasks */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
                    <span>Prospective Workstreams & Tasks</span>
                  </h3>
                  <span className="text-[11px] text-blue-500 font-semibold">
                    {selectedTasksCount} of {entities.workstreams.reduce((acc, ws) => acc + ws.tasks.length, 0)} Selected
                  </span>
                </div>

                <div className="space-y-3">
                  {entities.workstreams.map((ws) => (
                    <div
                      key={ws.id}
                      className="p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            {ws.name}
                          </h4>
                          {ws.description && (
                            <p className="text-[11px] text-slate-400">{ws.description}</p>
                          )}
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          Lead: {ws.suggestedLead === 'abdulaziz' ? 'Abdulaziz (Tech)' : 'Ibrahim (GTM)'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {ws.tasks.map((task, i) => {
                          const key = `${ws.id}-${i}`
                          const isChecked = !!selectedTasks[key]

                          return (
                            <label
                              key={i}
                              className={`flex items-start gap-2.5 p-2 rounded-lg border transition-all cursor-pointer ${
                                isChecked
                                  ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/40'
                                  : 'bg-transparent border-transparent opacity-60 hover:opacity-100'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleTask(key)}
                                className="mt-0.5 rounded border-slate-400 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                                  {task.title}
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                                  <span className="font-semibold text-slate-500 uppercase">{task.type}</span>
                                  <span>•</span>
                                  <span className="text-amber-500 font-semibold uppercase">{task.priority}</span>
                                  <span>•</span>
                                  <span>Assignee: {task.assignee === 'abdulaziz' ? 'Abdulaziz' : 'Ibrahim'}</span>
                                </div>
                              </div>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extracted Decisions (ADRs) */}
              {entities.decisions && entities.decisions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Extracted Architectural Decisions (ADR)</span>
                    </h3>
                    <span className="text-[11px] text-emerald-500 font-semibold">
                      {selectedDecisionsCount} of {entities.decisions.length} Selected
                    </span>
                  </div>

                  <div className="space-y-2">
                    {entities.decisions.map((dec, i) => {
                      const isChecked = !!selectedDecisions[i]

                      return (
                        <label
                          key={i}
                          className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                              : 'bg-transparent border-slate-200 dark:border-slate-800 opacity-60'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleDecision(i)}
                            className="mt-0.5 rounded border-slate-400 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              {dec.title}
                            </div>
                            <div className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                              <span className="font-semibold text-slate-500">Decision: </span>
                              {dec.decision}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              <span className="font-semibold">Reason: </span>
                              {dec.reason}
                            </div>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Risks & Mitigations */}
              {entities.risks && entities.risks.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                    <span>Identified Risks & Mitigations</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {entities.risks.map((r, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-red-950/10 border border-red-900/30 text-xs space-y-1"
                      >
                        <div className="font-semibold text-red-600 dark:text-red-400 flex items-center justify-between">
                          <span>{r.risk}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 font-bold uppercase">
                            {r.impact}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          <span className="text-slate-300 font-medium">Mitigation: </span>
                          {r.mitigation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Open Questions & Dependencies Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {entities.openQuestions && entities.openQuestions.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                    <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 uppercase">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Open Questions</span>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                      {entities.openQuestions.map((q, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {entities.dependencies && entities.dependencies.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                    <div className="text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 uppercase">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Key Dependencies</span>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                      {entities.dependencies.map((dep, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-purple-500 font-bold">•</span>
                          <span>{dep}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : errorMessage ? (
            <div className="py-12 px-6 text-center space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Analysis Notice</h3>
                <p className="text-xs text-red-600 dark:text-red-400">{errorMessage}</p>
              </div>
              <button
                type="button"
                onClick={triggerAnalysis}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry AI Extraction</span>
              </button>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500">
              No analysis data available. Click refresh to run analysis.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
          >
            Close
          </button>

          <button
            type="button"
            disabled={isAdding || isLoading || !entities || (selectedTasksCount === 0 && selectedDecisionsCount === 0)}
            onClick={handleAddSelectedToWSTAR}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-all hover:scale-102 flex items-center gap-1.5 cursor-pointer"
          >
            <span>{isAdding ? 'Adding Records...' : `Add Selected to WSTAR (${selectedTasksCount + selectedDecisionsCount})`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
