'use client'

import React, { useState, useEffect } from 'react'
import { WorkItem } from '../types'
import { useOS } from '../context/OSContext'
import { X, Sparkles, CheckSquare, Plus, Loader2, Zap, Clock, ShieldCheck } from 'lucide-react'

interface DecompositionModalProps {
  item: WorkItem | null
  isOpen: boolean
  onClose: () => void
}

interface SubtaskItem {
  title: string
  estimatedMinutes?: number
  verificationCriterion?: string
}

export function DecompositionModal({
  item,
  isOpen,
  onClose,
}: DecompositionModalProps) {
  const { decomposeWorkItem } = useOS()
  const [subtasks, setSubtasks] = useState<SubtaskItem[]>([])
  const [newSubtask, setNewSubtask] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [planSummary, setPlanSummary] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && item) {
      // Check if item already has subtasks
      if (item.subtasks && item.subtasks.length > 0) {
        setSubtasks(item.subtasks.map((st) => ({ title: st.title })))
        return
      }

      // Fetch dynamic decomposition from Gemini AI
      const fetchAiDecomposition = async () => {
        setIsGenerating(true)
        try {
          const res = await fetch('/api/os/ai/decompose', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: item.title,
              description: item.description,
              type: item.type,
              codeReference: item.codeReference,
            }),
          })

          if (res.ok) {
            const json = await res.json()
            if (json.success && json.result) {
              setSubtasks(json.result.subtasks || [])
              setPlanSummary(json.result.summary || null)
              return
            }
          }
        } catch (error) {
          console.warn('[AI Decomposition Fallback]:', error)
        } finally {
          setIsGenerating(false)
        }

        // Heuristic fallback if AI is offline
        if (item.title.toLowerCase().includes('gpa')) {
          setSubtasks([
            { title: 'Define 5.0 Nigerian GPA scale grade points (A=5, B=4, C=3, D=2, E=1, F=0)', estimatedMinutes: 20 },
            { title: 'Build interactive course credit unit and expected grade selector UI', estimatedMinutes: 45 },
            { title: 'Implement real-time SGPA and cumulative CGPA calculation formula', estimatedMinutes: 30 },
            { title: 'Write comprehensive unit tests for carryovers and zero-credit courses', estimatedMinutes: 30 },
          ])
        } else {
          setSubtasks([
            { title: `Technical specification and edge cases for: ${item.title}`, estimatedMinutes: 20 },
            { title: 'Implement core service / schema changes', estimatedMinutes: 60 },
            { title: 'Build reactive UI components and bind controllers', estimatedMinutes: 60 },
            { title: 'Perform end-to-end QA and verify error states', estimatedMinutes: 30 },
          ])
        }
      }

      fetchAiDecomposition()
    }
  }, [isOpen, item])

  if (!isOpen || !item) return null

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return
    setSubtasks([...subtasks, { title: newSubtask.trim() }])
    setNewSubtask('')
  }

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    decomposeWorkItem(
      item.id,
      subtasks.map((st) => st.title)
    )
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg max-h-[90vh] bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Task Decomposition Assistant
                </h2>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5" />
                  Gemini Flash AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Break complex tickets into high-velocity sequential checklists.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
              Target Ticket
            </div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              [{item.itemNumber}] {item.title}
            </div>
            {planSummary && (
              <div className="mt-2 text-[11px] text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 p-2 rounded border border-purple-100 dark:border-purple-900 font-medium">
                🎯 {planSummary}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Actionable Checklist ({subtasks.length} subtasks)
              </label>
              {isGenerating && (
                <div className="flex items-center gap-1 text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Gemini reasoning...</span>
                </div>
              )}
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {subtasks.map((st, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 group space-y-1.5 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1">
                      <CheckSquare className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                      <span className="font-medium text-slate-900 dark:text-white leading-relaxed">
                        {st.title}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveSubtask(idx)}
                      className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {(st.estimatedMinutes || st.verificationCriterion) && (
                    <div className="flex flex-wrap items-center gap-2 pl-5.5 text-[10px] text-slate-500">
                      {st.estimatedMinutes && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 font-mono">
                          <Clock className="w-2.5 h-2.5" />
                          ~{st.estimatedMinutes}m
                        </span>
                      )}
                      {st.verificationCriterion && (
                        <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" />
                          {st.verificationCriterion}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Custom Subtask */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Add custom subtask..."
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddSubtask()
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Auto-saves checklist to Sanity cloud
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={subtasks.length === 0}
              className="px-4 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Apply Checklist ({subtasks.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
