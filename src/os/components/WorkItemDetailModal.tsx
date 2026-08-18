'use client'

import React, { useState } from 'react'
import { WorkItem, WorkItemStatus, WorkItemPriority } from '../types'
import { useOS } from '../context/OSContext'
import { StatusBadge } from './StatusBadge'
import { PriorityBadge } from './PriorityBadge'
import {
  X,
  Bug,
  Sparkles,
  CheckSquare,
  AlertTriangle,
  Code2,
  Trash2,
  User,
  Plus,
  CheckCircle2,
  Circle,
} from 'lucide-react'

interface WorkItemDetailModalProps {
  item: WorkItem | null
  isOpen: boolean
  onClose: () => void
  onOpenDecomposition: (item: WorkItem) => void
}

export function WorkItemDetailModal({
  item,
  isOpen,
  onClose,
  onOpenDecomposition,
}: WorkItemDetailModalProps) {
  const { updateWorkItem, deleteWorkItem, updateWorkItemStatus, toggleSubtask, productAreas } = useOS()

  if (!isOpen || !item) return null

  const area = productAreas.find((a) => a.id === item.productAreaId)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {item.itemNumber}
            </span>
            <div className="flex items-center gap-2">
              <StatusBadge status={item.status} />
              <PriorityBadge priority={item.priority} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm(`Delete item ${item.itemNumber}?`)) {
                  deleteWorkItem(item.id)
                  onClose()
                }
              }}
              className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Delete Item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Title */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {item.title}
            </h2>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
              <span>Product: <strong>Ace Acad</strong></span>
              <span>•</span>
              <span>Area: <strong>{area?.name || 'General'}</strong></span>
              <span>•</span>
              <span>Assignee: <strong>{item.assignee === 'abdulaziz' ? 'Abdulaziz' : 'Ibrahim (CEO)'}</strong></span>
            </div>
          </div>

          {/* Quick Status Control Bar */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-500 mr-2">
              Change Status:
            </span>
            {(['backlog', 'todo', 'in_progress', 'blocked', 'done'] as WorkItemStatus[]).map(
              (s) => (
                <button
                  key={s}
                  onClick={() => updateWorkItemStatus(item.id, s)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    item.status === s
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {s.replace('_', ' ').toUpperCase()}
                </button>
              )
            )}
          </div>

          {/* Description */}
          {item.description && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Description & Context
              </h3>
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {item.description}
              </div>
            </div>
          )}

          {/* Bug Reproduction Section (If Bug) */}
          {item.type === 'bug' && item.bugMetadata && (
            <div className="space-y-3 p-4 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40">
              <div className="flex items-center gap-2 text-xs font-bold text-red-800 dark:text-red-300 uppercase tracking-wider">
                <Bug className="w-4 h-4" />
                <span>Bug Diagnostics & Reproduction</span>
              </div>

              {item.bugMetadata.reproductionSteps && (
                <div>
                  <div className="text-[11px] font-semibold text-red-700 dark:text-red-400 mb-1">
                    Steps to Reproduce:
                  </div>
                  <pre className="p-2.5 rounded bg-white/80 dark:bg-slate-900/80 text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap border border-red-100 dark:border-red-900/30">
                    {item.bugMetadata.reproductionSteps}
                  </pre>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {item.bugMetadata.expectedBehavior && (
                  <div className="p-2.5 rounded bg-white/80 dark:bg-slate-900/80 border border-red-100 dark:border-red-900/30">
                    <span className="font-semibold text-emerald-600 block mb-0.5">Expected:</span>
                    <span className="text-slate-700 dark:text-slate-300">{item.bugMetadata.expectedBehavior}</span>
                  </div>
                )}
                {item.bugMetadata.actualBehavior && (
                  <div className="p-2.5 rounded bg-white/80 dark:bg-slate-900/80 border border-red-100 dark:border-red-900/30">
                    <span className="font-semibold text-red-600 block mb-0.5">Actual:</span>
                    <span className="text-slate-700 dark:text-slate-300">{item.bugMetadata.actualBehavior}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Code Reference */}
          {item.codeReference && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                <span>Discovered Code Reference</span>
              </h3>
              <div className="p-2.5 rounded bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800">
                {item.codeReference}
              </div>
            </div>
          )}

          {/* Subtasks / Decomposition Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Decomposed Subtasks ({item.subtasks?.length || 0})</span>
              </h3>
              <button
                onClick={() => onOpenDecomposition(item)}
                className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-medium"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Decompose with Assistant</span>
              </button>
            </div>

            {item.subtasks && item.subtasks.length > 0 ? (
              <div className="space-y-1.5">
                {item.subtasks.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => toggleSubtask(item.id, st.id)}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {st.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span
                      className={
                        st.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-200'
                      }
                    >
                      {st.title}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-center text-xs text-slate-400">
                No subtasks defined yet.{' '}
                <button
                  onClick={() => onOpenDecomposition(item)}
                  className="text-purple-600 dark:text-purple-400 font-semibold hover:underline ml-1"
                >
                  Break down this task →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-400">
          <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
