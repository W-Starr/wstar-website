'use client'

import React, { useState } from 'react'
import Link from 'next/link'
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
    workItems,
    updateWorkItemStatus,
    toggleSubtask,
    addSubtask,
    deleteWorkItem,
    productAreas,
  } = useOS()

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')

  if (!isOpen || !item) return null

  // Ensure live status update is reflected inside the modal
  const liveItem = workItems.find((w) => w.id === item.id) || item
  const area = productAreas.find((a) => a.id === liveItem.productAreaId)

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubtaskTitle.trim()) return
    addSubtask(liveItem.id, newSubtaskTitle.trim())
    setNewSubtaskTitle('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-900 dark:text-white">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {liveItem.itemNumber}
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <StatusBadge status={liveItem.status} />
              <PriorityBadge priority={liveItem.priority} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => {
                if (confirm(`Delete item ${liveItem.itemNumber}?`)) {
                  deleteWorkItem(liveItem.id)
                  onClose()
                }
              }}
              className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Delete Item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
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
              {liveItem.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-xs text-slate-400">
              <span>Product: <strong>{liveItem.productId}</strong></span>
              <span>•</span>
              <span>Area: <strong>{area?.name || 'General'}</strong></span>
              <span>•</span>
              <span>Assignee: <strong>{liveItem.assignee === 'abdulaziz' ? 'Abdulaziz' : liveItem.assignee === 'ibrahim' ? 'Ibrahim (CEO)' : 'Unassigned'}</strong></span>
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
                  onClick={() => updateWorkItemStatus(liveItem.id, s)}
                  className={`px-2 sm:px-2.5 py-1 rounded text-[10px] sm:text-xs font-medium transition-colors cursor-pointer ${
                    liveItem.status === s
                      ? s === 'done'
                        ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                        : 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {s.replace('_', ' ').toUpperCase()}
                </button>
              )
            )}
          </div>

          {/* Description */}
          {liveItem.description && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Description & Context
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                {liveItem.description}
              </p>
            </div>
          )}

          {/* Code Reference / Proposal Link */}
          {liveItem.codeReference && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                <span>Codebase / Proposal Reference</span>
              </h3>
              {liveItem.codeReference.startsWith('PR-') || liveItem.codeReference.startsWith('PROP-') ? (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-300">
                      {liveItem.codeReference}
                    </span>
                    <span className="text-xs text-purple-600 dark:text-purple-400">
                      Linked Architecture Specification
                    </span>
                  </div>
                  <Link
                    href="/os/proposals"
                    onClick={onClose}
                    className="flex items-center gap-1 text-xs font-medium text-purple-700 dark:text-purple-300 hover:underline"
                  >
                    <span>View Proposal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 font-mono text-xs text-slate-800 dark:text-slate-200">
                  {liveItem.codeReference}
                </div>
              )}
            </div>
          )}

          {/* Subtasks Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Subtasks & Decomposition (
                {(liveItem.subtasks || []).filter((st) => st.completed).length}/
                {(liveItem.subtasks || []).length})
              </h3>
              <button
                onClick={() => {
                  onOpenDecomposition(liveItem)
                  onClose()
                }}
                className="flex items-center gap-1 text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Subtask Breakdown</span>
              </button>
            </div>

            {/* Subtask list */}
            <div className="space-y-2">
              {(liveItem.subtasks || []).map((subtask) => (
                <div
                  key={subtask.id}
                  onClick={() => toggleSubtask(liveItem.id, subtask.id)}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 pointer-events-none"
                  />
                  <span
                    className={`text-xs ${
                      subtask.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-800 dark:text-slate-200 font-medium'
                    }`}
                  >
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Add Subtask Manual Form */}
            <form onSubmit={handleAddSubtask} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add subtask manually..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!newSubtaskTitle.trim()}
                className="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Metadata Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 space-y-1">
            {liveItem.dueDate && <div>Due Date: {liveItem.dueDate}</div>}
            <div>Created: {new Date(liveItem.createdAt).toLocaleString()}</div>
            <div>Last Updated: {new Date(liveItem.updatedAt).toLocaleString()}</div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Current status: <strong className="capitalize text-slate-800 dark:text-slate-200">{liveItem.status.replace('_', ' ')}</strong>
          </div>
          <div className="flex items-center gap-2">
            {liveItem.status !== 'done' ? (
              <button
                onClick={() => updateWorkItemStatus(liveItem.id, 'done')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark as Done</span>
              </button>
            ) : (
              <button
                onClick={() => updateWorkItemStatus(liveItem.id, 'in_progress')}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Reopen (In Progress)</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
