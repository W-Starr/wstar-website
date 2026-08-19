'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useOS } from '../context/OSContext'
import { SourceCommandResponse } from '@/app/api/os/ai/source-command/route'
import {
  X,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2,
  HardDrive,
  CheckSquare,
  ShieldCheck,
  RefreshCw,
  CornerDownLeft,
  Bot,
  Layers,
  Clock,
  Compass,
} from 'lucide-react'

interface UniversalCaptureModalProps {
  isOpen: boolean
  onClose: () => void
}

const SUGGESTED_PROMPTS = [
  "I spoke to my brother. He thinks we should make Class Reps responsible for uploading course materials. There's a proposal in Drive. Turn this into our next Ace Acad initiative.",
  "We need to audit our NDPA 2023 legal readiness for under-18 students and assign compliance to Ibrahim.",
  "Abdulaziz should implement the Google Drive Shared Folder webhook sync and add Drift SQLite caching for offline PDF viewing.",
  "Create an ADR decision choosing Gemini Flash over local on-device LLMs for Ace Acad AI Study Paths to minimize app bundle size.",
]

export function UniversalCaptureModal({ isOpen, onClose }: UniversalCaptureModalProps) {
  const {
    sources,
    addWorkItem,
    addDecision,
    addRoadmapItem,
    linkEntityToSource,
  } = useOS()

  const [inputPrompt, setInputPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [plan, setPlan] = useState<SourceCommandResponse | null>(null)
  const [selectedWorkItems, setSelectedWorkItems] = useState<Record<number, boolean>>({})
  const [selectedDecisions, setSelectedDecisions] = useState<Record<number, boolean>>({})
  const [includeInitiative, setIncludeInitiative] = useState(true)
  const [isExecuting, setIsExecuting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 50)
      setPlan(null)
      setSuccessMessage(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleInterpret = async (promptToUse?: string) => {
    const text = promptToUse || inputPrompt
    if (!text.trim()) return

    setIsLoading(true)
    setPlan(null)
    setSuccessMessage(null)

    try {
      const res = await fetch('/api/os/ai/source-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commandText: text.trim(),
          currentSources: sources.map((s) => ({
            id: s.id,
            sourceNumber: s.sourceNumber,
            title: s.title,
            relatedProductId: s.relatedProductId,
          })),
        }),
      })

      const data = await res.json()
      if (data.success && data.plan) {
        setPlan(data.plan)
        const itemMap: Record<number, boolean> = {}
        data.plan.workItems.forEach((_: any, i: number) => {
          itemMap[i] = true
        })
        setSelectedWorkItems(itemMap)

        const decMap: Record<number, boolean> = {}
        data.plan.decisions.forEach((_: any, i: number) => {
          decMap[i] = true
        })
        setSelectedDecisions(decMap)
        setIncludeInitiative(!!data.plan.initiative)
      }
    } catch (err) {
      console.error('Failed to interpret universal command:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExecutePlan = async () => {
    if (!plan) return
    setIsExecuting(true)

    try {
      let tasksCreated = 0
      let decisionsCreated = 0

      // Match linked source if title was referenced
      const matchedSource = sources.find(
        (s) =>
          plan.matchedSourceTitle &&
          s.title.toLowerCase().includes(plan.matchedSourceTitle.toLowerCase())
      )

      // 1. Create Roadmap Initiative
      if (includeInitiative && plan.initiative) {
        addRoadmapItem({
          title: plan.initiative.title,
          description: plan.initiative.description,
          horizon: plan.initiative.horizon || 'now',
          productId: plan.productId || 'ace-acad',
          targetQuarter: plan.initiative.targetQuarter || 'Q3-Q4 2026',
          category: 'Natural Language Strategic Initiative',
          sourceId: matchedSource?.id,
        })
      }

      // 2. Create Work Items
      plan.workItems.forEach((task, i) => {
        if (selectedWorkItems[i]) {
          const newItem = addWorkItem({
            title: task.title,
            description: task.description || `Generated via Universal Capture from founder prompt: "${inputPrompt.slice(0, 60)}..."`,
            type: task.type || 'task',
            status: 'todo',
            priority: task.priority || 'high',
            productId: plan.productId || 'ace-acad',
            assignee: task.assignee || 'abdulaziz',
            sourceId: matchedSource?.id,
            sourceRef: matchedSource
              ? {
                  id: matchedSource.id,
                  title: matchedSource.title,
                  externalUrl: matchedSource.externalUrl,
                  provider: matchedSource.provider,
                }
              : undefined,
          })

          if (matchedSource) {
            linkEntityToSource(matchedSource.id, 'work', newItem.id)
          }
          tasksCreated++
        }
      })

      // 3. Create Decisions
      plan.decisions.forEach((dec, i) => {
        if (selectedDecisions[i]) {
          const newDec = addDecision({
            title: dec.title,
            decision: dec.decision,
            reason: dec.reason,
            status: 'accepted',
            participants: ['Abdulaziz Abdulwahab', 'Ibrahim Abdulwahab'],
            date: new Date().toISOString().split('T')[0],
            productId: plan.productId || 'ace-acad',
            sourceId: matchedSource?.id,
            sourceRef: matchedSource
              ? {
                  id: matchedSource.id,
                  title: matchedSource.title,
                  externalUrl: matchedSource.externalUrl,
                  provider: matchedSource.provider,
                }
              : undefined,
          })

          if (matchedSource) {
            linkEntityToSource(matchedSource.id, 'decision', newDec.id)
          }
          decisionsCreated++
        }
      })

      setSuccessMessage(
        `Executed! Created ${tasksCreated} work items, ${decisionsCreated} decisions${
          includeInitiative && plan.initiative ? ', and 1 roadmap initiative' : ''
        } in WSTAR OS.`
      )

      setTimeout(() => {
        onClose()
      }, 1600)
    } catch (err) {
      console.error('Failed to execute plan:', err)
    } finally {
      setIsExecuting(false)
    }
  }

  const selectedTasksCount = Object.values(selectedWorkItems).filter(Boolean).length
  const selectedDecisionsCount = Object.values(selectedDecisions).filter(Boolean).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] font-sans">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                  Universal Natural Language Capture
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  NLP Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Type any strategic thought, meeting takeaway, or task directive
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Natural Language Prompt Input */}
          <div className="space-y-2">
            <div className="relative">
              <textarea
                ref={textareaRef}
                rows={3}
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault()
                    handleInterpret()
                  }
                }}
                placeholder="What's on your mind? (e.g. 'I spoke to my brother. He thinks we should make Class Reps responsible for uploading course materials...')"
                className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none font-sans leading-relaxed"
              />
              <div className="absolute right-3 bottom-3 flex items-center gap-1.5 text-[10px] text-slate-400">
                <span className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">Ctrl+Enter</span>
                <span>to formulate</span>
              </div>
            </div>

            {/* Prompt Inspiration Chips */}
            {!plan && (
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Try an example thought:
                </div>
                <div className="space-y-1">
                  {SUGGESTED_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setInputPrompt(prompt)
                        handleInterpret(prompt)
                      }}
                      className="w-full text-left p-2 rounded-lg bg-slate-100/60 dark:bg-slate-800/40 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-[11px] text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <span className="truncate pr-2">{prompt}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-500 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="py-12 text-center space-y-3">
              <RefreshCw className="w-7 h-7 animate-spin text-blue-500 mx-auto" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Understanding intent & synthesizing execution plan...
              </div>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Correlating instruction against 12 company Google Drive sources and assigning founder responsibilities.
              </p>
            </div>
          )}

          {/* Success Feedback Alert */}
          {successMessage && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Generated Plan Confirmation (Step 2: Confirm) */}
          {plan && !isLoading && !successMessage && (
            <div className="space-y-5 animate-in fade-in">
              {/* Understanding Summary Card */}
              <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-300">
                  <div className="flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                    <Bot className="w-4 h-4 text-blue-500" />
                    <span>AI Intent Understanding</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 font-mono">
                    Product: {plan.productId}
                  </span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {plan.understoodIntent}
                </p>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-blue-200/60 dark:border-blue-900/40">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Action: </span>
                  {plan.recommendedAction}
                </div>
              </div>

              {/* Matched Google Drive Source Badge if detected */}
              {plan.matchedSourceTitle && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <HardDrive className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Matched Canonical Source:</span>
                    <span className="font-bold text-slate-900 dark:text-white truncate max-w-xs">
                      {plan.matchedSourceTitle}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    Linked
                  </span>
                </div>
              )}

              {/* Proposed Initiative / Roadmap Card */}
              {plan.initiative && (
                <div className="p-4 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeInitiative}
                        onChange={(e) => setIncludeInitiative(e.target.checked)}
                        className="rounded border-slate-400 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
                      />
                      <span>Create Overarching Roadmap Initiative</span>
                    </label>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                      {plan.initiative.targetQuarter || 'Q3-Q4 2026'}
                    </span>
                  </div>
                  <div className="pl-5 text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-bold text-slate-900 dark:text-slate-200">
                      {plan.initiative.title}:{' '}
                    </span>
                    {plan.initiative.description}
                  </div>
                </div>
              )}

              {/* Work Items Checklist */}
              {plan.workItems && plan.workItems.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
                      <span>Prospective Work Items</span>
                    </h3>
                    <span className="text-[11px] text-blue-500 font-semibold">
                      {selectedTasksCount} of {plan.workItems.length} Selected
                    </span>
                  </div>

                  <div className="space-y-2">
                    {plan.workItems.map((task, i) => {
                      const isChecked = !!selectedWorkItems[i]

                      return (
                        <label
                          key={i}
                          className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/40'
                              : 'bg-transparent border-slate-200 dark:border-slate-800 opacity-60'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() =>
                              setSelectedWorkItems((prev) => ({ ...prev, [i]: !prev[i] }))
                            }
                            className="mt-0.5 rounded border-slate-400 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              {task.title}
                            </div>
                            {task.description && (
                              <p className="text-[11px] text-slate-500 mt-0.5">{task.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                              <span className="font-semibold text-slate-500 uppercase">{task.type}</span>
                              <span>•</span>
                              <span className="text-amber-500 font-semibold uppercase">{task.priority}</span>
                              <span>•</span>
                              <span>Assignee: {task.assignee === 'abdulaziz' ? 'Abdulaziz (Tech)' : 'Ibrahim (GTM)'}</span>
                            </div>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Decisions Checklist */}
              {plan.decisions && plan.decisions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Architectural Decisions (ADR)</span>
                    </h3>
                    <span className="text-[11px] text-emerald-500 font-semibold">
                      {selectedDecisionsCount} of {plan.decisions.length} Selected
                    </span>
                  </div>

                  <div className="space-y-2">
                    {plan.decisions.map((dec, i) => {
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
                            onChange={() =>
                              setSelectedDecisions((prev) => ({ ...prev, [i]: !prev[i] }))
                            }
                            className="mt-0.5 rounded border-slate-400 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              {dec.title}
                            </div>
                            <div className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
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
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between gap-3">
          {plan ? (
            <>
              <button
                type="button"
                onClick={() => setPlan(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
              >
                Back / Edit Prompt
              </button>

              <button
                type="button"
                disabled={isExecuting || (selectedTasksCount === 0 && selectedDecisionsCount === 0 && !includeInitiative)}
                onClick={handleExecutePlan}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-all hover:scale-102 flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isExecuting ? 'Creating Records...' : `Confirm & Execute in WSTAR OS (${selectedTasksCount + selectedDecisionsCount})`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isLoading || !inputPrompt.trim()}
                onClick={() => handleInterpret()}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-all hover:scale-102 flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Interpreting...' : 'Understand & Plan'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
