'use client'

import React, { useState } from 'react'
import { useOS } from '../context/OSContext'
import { Source } from '../types'
import { ProposalComparisonResponse } from '@/app/api/os/ai/compare-proposals/route'
import {
  X,
  Scale,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Layers,
  ArrowLeftRight,
  ShieldCheck,
  CheckSquare,
} from 'lucide-react'

interface ProposalComparisonModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProposalComparisonModal({ isOpen, onClose }: ProposalComparisonModalProps) {
  const { sources, addWorkItem } = useOS()

  const [docAId, setDocAId] = useState<string>(sources[0]?.id || '')
  const [docBId, setDocBId] = useState<string>(sources[1]?.id || sources[0]?.id || '')
  const [isLoading, setIsLoading] = useState(false)
  const [comparison, setComparison] = useState<ProposalComparisonResponse | null>(null)
  const [createdCount, setCreatedCount] = useState<number | null>(null)

  if (!isOpen) return null

  const handleCompare = async () => {
    const docA = sources.find((s) => s.id === docAId)
    const docB = sources.find((s) => s.id === docBId)

    if (!docA || !docB) return

    setIsLoading(true)
    setComparison(null)
    setCreatedCount(null)

    try {
      const res = await fetch('/api/os/ai/compare-proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docA, docB }),
      })

      const data = await res.json()
      if (data.success && data.comparison) {
        setComparison(data.comparison)
      }
    } catch (err) {
      console.error('Failed to compare proposals:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateMigrationTasks = () => {
    if (!comparison || !comparison.recommendedActionItems) return

    let count = 0
    comparison.recommendedActionItems.forEach((action) => {
      addWorkItem({
        title: action,
        description: `Migration action item generated from proposal comparison: "${comparison.comparisonTitle}"`,
        type: 'task',
        status: 'todo',
        priority: 'high',
        productId: 'ace-acad',
        assignee: action.toLowerCase().includes('ibrahim') ? 'ibrahim' : 'abdulaziz',
      })
      count++
    })

    setCreatedCount(count)
  }

  const docA = sources.find((s) => s.id === docAId)
  const docB = sources.find((s) => s.id === docBId)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-sans">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                  Historical Proposal Intelligence & Diff Engine
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  AI Diff
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Compare architectural shifts, storage economics, and legal postures across WSTAR specs
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
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Document Selectors Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            {/* Doc A */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Base Document (Doc A)</span>
              </label>
              <select
                value={docAId}
                onChange={(e) => setDocAId(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
              >
                {sources.map((s) => (
                  <option key={s.id} value={s.id}>
                    [{s.sourceNumber}] {s.title}
                  </option>
                ))}
              </select>
              {docA && (
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                  {docA.summary || 'Canonical company record'}
                </p>
              )}
            </div>

            {/* Doc B */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Comparison Target (Doc B)</span>
              </label>
              <select
                value={docBId}
                onChange={(e) => setDocBId(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-purple-500"
              >
                {sources.map((s) => (
                  <option key={s.id} value={s.id}>
                    [{s.sourceNumber}] {s.title}
                  </option>
                ))}
              </select>
              {docB && (
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                  {docB.summary || 'Canonical company record'}
                </p>
              )}
            </div>
          </div>

          {/* Trigger Button */}
          {!comparison && !isLoading && (
            <div className="text-center py-4">
              <button
                type="button"
                onClick={handleCompare}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all hover:scale-102 cursor-pointer"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>Run Deep AI Diff & Architecture Audit</span>
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-500 mx-auto" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Cross-referencing documents against Flutter codebase & architecture...
              </div>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                Comparing storage overhead, API schemas, safe-harbor legal shielding, and execution risk.
              </p>
            </div>
          )}

          {/* Comparison Results */}
          {comparison && (
            <div className="space-y-6 animate-in fade-in">
              {/* Executive Verdict Card */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <div className="flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Executive Recommendation</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20">
                    High Confidence
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                  {comparison.comparisonTitle}
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {comparison.summary}
                </p>
                <div className="p-2.5 rounded-lg bg-white/60 dark:bg-slate-900/60 text-xs font-semibold text-emerald-800 dark:text-emerald-200 mt-2 border border-emerald-500/20">
                  Verdict: {comparison.verdict}
                </div>
              </div>

              {/* Dimensional Diff Matrix */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Key Architectural Dimensions & Trade-Offs</span>
                </h4>

                <div className="space-y-3">
                  {comparison.dimensions.map((dim, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2"
                    >
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {dim.dimension}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/30">
                          <span className="text-[10px] font-bold text-blue-600 uppercase block mb-0.5">
                            Doc A Approach:
                          </span>
                          <span className="text-slate-700 dark:text-slate-300">{dim.docAValue}</span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-900/30">
                          <span className="text-[10px] font-bold text-purple-600 uppercase block mb-0.5">
                            Doc B Approach:
                          </span>
                          <span className="text-slate-700 dark:text-slate-300">{dim.docBValue}</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                        ✨ <span className="font-bold">Advantage: </span>
                        {dim.advantage}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deprecated vs Reusable Assets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Deprecated */}
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2">
                  <h5 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    <span>Decommission / Deprecate</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {comparison.deprecatedElements.map((dep, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{dep}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Reusable */}
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                  <h5 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Retain & Reuse</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {comparison.reusableAssets.map((asset, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{asset}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Migration Action Items */}
              {comparison.recommendedActionItems && (
                <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Recommended Migration Steps</span>
                    </h5>

                    {createdCount === null ? (
                      <button
                        type="button"
                        onClick={handleCreateMigrationTasks}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition-all cursor-pointer"
                      >
                        Convert All to Work Items
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        ✓ Created {createdCount} work items!
                      </span>
                    )}
                  </div>

                  <ul className="space-y-2 text-xs text-slate-800 dark:text-slate-200">
                    {comparison.recommendedActionItems.map((action, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-bold text-indigo-500">{i + 1}.</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            Close
          </button>

          {comparison && (
            <button
              type="button"
              onClick={handleCompare}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Re-run Comparison</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
