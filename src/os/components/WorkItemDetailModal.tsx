'use client'

import React, { useState } from 'react'
import { useOS } from '../context/OSContext'
import { WorkItem, WorkItemStatus } from '../types'
import { StatusBadge } from './StatusBadge'
import { PriorityBadge } from './PriorityBadge'
import {
  X,
  Sparkles,
  Calendar,
  User,
  CheckCircle2,
  Trash2,
  Plus,
  ExternalLink,
  Code2,
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
  const {
    updateWorkItemStatus,
    toggleSubtask,
    addSubtask,
    deleteWorkItem,
    productAreas,
  } = useOS()

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')

  if (!isOpen || !item) return null

  const area = productAreas.find((a) => a.id === item.productAreaId)

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubtaskTitle.trim()) return
    addSubtask(item.id, newSubtaskTitle.trim())
    setNewSubtaskTitle('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-900 dark:text-white">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {item.itemNumber}
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <StatusBadge status={item.status} />
              <PriorityBadge priority={item.priority} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
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
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto flex-1">
          {/* Title */}
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight font-heading">
              {item.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-xs text-slate-400">
              <span>Product: <strong>{item.productId}</strong></span>
              <span>•</span>
              <span>Area: <strong>{area?.name || 'General'}</strong></span>
              <span>•</span>
              <span>Assignee: <strong>{item.assignee === 'abdulaziz' ? 'Abdulaziz' : 'Ibrahim (CEO)'}</strong></span>
            </div>
          </div>

          {/* Quick Status Control Bar */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 mr-1 sm:mr-2">
              Status:
            </span>
            {(['backlog', 'todo', 'in_progress', 'blocked', 'done'] as WorkItemStatus[]).map(
              (s) => (
                <button
                  key={s}
                  onClick={() => updateWorkItemStatus(item.id, s)}
                  className={`px-2 sm:px-2.5 py-1 rounded text-[10px] sm:text-xs font-medium transition-colors ${
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
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                {item.description}
              </p>
            </div>
          )}

          {/* Code Reference / File Link */}
          {item.codeReference && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                <span>Code / Architecture Anchor</span>
              </h3>
              <div className="p-2.5 rounded-lg bg-slate-900 text-slate-200 font-mono text-xs border border-slate-800 flex items-center justify-between gap-2">
                <span className="truncate">{item.codeReference}</span>
                <span className="text-[10px] text-slate-400 shrink-0">Discovered in Repo</span>
              </div>
            </div>
          )}

          {/* AI Task Decomposition Trigger */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400">
                <Sparkles className="w-4 h-4" />
                <span>AI Subtask Decomposition</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Break this complex work item down into an actionable, step-by-step checklist.
              </p>
            </div>
            <button
              onClick={() => onOpenDecomposition(item)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors shrink-0 self-start sm:self-auto"
            >
              Decompose Item
            </button>
          </div>

          {/* Subtasks Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Action Checklist ({item.subtasks?.filter((st) => st.completed).length || 0}/
                {item.subtasks?.length || 0})
              </h3>
            </div>

            <div className="space-y-2">
              {item.subtasks && item.subtasks.length > 0 ? (
                item.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    onClick={() => toggleSubtask(item.id, subtask.id)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border transition-colors cursor-pointer text-xs ${
                      subtask.completed
                        ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-400 line-through'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 hover:border-blue-500/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => {}}
                      className="mt-0.5 rounded text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span className="flex-1">{subtask.title}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 italic p-3 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                  No subtasks created yet. Click &quot;Decompose Item&quot; above or add one below.
                </div>
              )}
            </div>

            {/* Quick Add Subtask Input */}
            <form onSubmit={handleAddSubtask} className="flex gap-2 mt-3">
              <input
                type="text"
                placeholder="Add subtask manually..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between text-xs text-slate-500">
          <span>Reported by: <strong>{item.reporter || 'Abdulaziz'}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
