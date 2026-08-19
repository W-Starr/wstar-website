'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useOS } from '../context/OSContext'
import { WorkItemType, WorkItemPriority, ProductId } from '../types'
import { X, Sparkles, AlertCircle, ArrowRight } from 'lucide-react'

interface QuickCaptureModalProps {
  isOpen: boolean
  onClose: () => void
}

export function QuickCaptureModal({ isOpen, onClose }: QuickCaptureModalProps) {
  const { addWorkItem, suggestClassification, productAreas, products } = useOS()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<WorkItemType>('task')
  const [priority, setPriority] = useState<WorkItemPriority>('medium')
  const [productId, setProductId] = useState<ProductId>('ace-acad')
  const [productAreaId, setProductAreaId] = useState('area-library')
  const [assignee, setAssignee] = useState<'abdulaziz' | 'ibrahim'>('abdulaziz')
  const [hasUserOverridden, setHasUserOverridden] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setTitle('')
      setDescription('')
      setHasUserOverridden(false)
    }
  }, [isOpen])

  // Real-time classification engine
  useEffect(() => {
    if (!hasUserOverridden && title.trim().length > 3) {
      const suggestion = suggestClassification(title)
      setType(suggestion.type)
      setPriority(suggestion.priority)
      if (suggestion.productAreaId) setProductAreaId(suggestion.productAreaId)
      setAssignee(suggestion.assignee)
    }
  }, [title, hasUserOverridden, suggestClassification])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    addWorkItem({
      title: title.trim(),
      description: description.trim() || undefined,
      type,
      status: 'todo',
      priority,
      productId,
      productAreaId,
      assignee,
      reporter: 'Quick Capture',
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Universal Quick Capture
              </h2>
              <p className="text-[11px] text-slate-500">
                Instantly capture a task, bug, or idea. Auto-classifies as you type.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Main Title Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Title / Action Item <span className="text-red-500">*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              required
              placeholder="e.g. Fix Firestore permission error on new course enrollment"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            />
          </div>

          {/* AI Auto-Suggestion Hint Banner */}
          {title.trim().length > 3 && (
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="text-[11px] sm:text-xs">
                  Auto-suggested: <strong>{type.toUpperCase()}</strong> • Priority <strong>{priority.toUpperCase()}</strong> • Assignee <strong>{assignee === 'abdulaziz' ? 'Abdulaziz' : 'Ibrahim'}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Context / Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Add reproduction steps, reason, or reference..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Classification Selectors Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1">
            {/* Type */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value as WorkItemType)
                  setHasUserOverridden(true)
                }}
                className="w-full px-2 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              >
                <option value="task">⚡ Task</option>
                <option value="bug">🐛 Bug</option>
                <option value="feature">✨ Feature</option>
                <option value="tech_debt">🛠️ Tech Debt</option>
                <option value="improvement">🚀 Improvement</option>
                <option value="research">🔬 Research</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value as WorkItemPriority)
                  setHasUserOverridden(true)
                }}
                className="w-full px-2 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              >
                <option value="critical">🔴 P0 Critical</option>
                <option value="high">🟠 P1 High</option>
                <option value="medium">🟡 P2 Medium</option>
                <option value="low">⚪ P3 Low</option>
              </select>
            </div>

            {/* Product */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                Product
              </label>
              <select
                value={productId}
                onChange={(e) => {
                  setProductId(e.target.value as ProductId)
                  setHasUserOverridden(true)
                }}
                className="w-full px-2 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs truncate"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                Assignee
              </label>
              <select
                value={assignee}
                onChange={(e) => {
                  setAssignee(e.target.value as 'abdulaziz' | 'ibrahim')
                  setHasUserOverridden(true)
                }}
                className="w-full px-2 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              >
                <option value="abdulaziz">Abdulaziz (Tech Lead)</option>
                <option value="ibrahim">Ibrahim (CEO)</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Press Enter to save • Esc to cancel
            </span>
            <div className="flex items-center gap-2 ml-auto w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-4 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Save Item</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
