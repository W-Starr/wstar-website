'use client'

import React, { useState } from 'react'
import { useOS } from '../context/OSContext'
import { ProductId } from '../types'
import { X, Scale, Plus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react'
import { showToast } from '../store/toastStore'

interface DecisionCreateModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DecisionCreateModal({ isOpen, onClose }: DecisionCreateModalProps) {
  const { addDecision, products } = useOS()

  const [title, setTitle] = useState('')
  const [decision, setDecision] = useState('')
  const [reason, setReason] = useState('')
  const [status, setStatus] = useState<'proposed' | 'accepted' | 'superseded'>('accepted')
  const [productId, setProductId] = useState<ProductId>('ace-acad')
  const [consequences, setConsequences] = useState('')
  const [alternatives, setAlternatives] = useState<string[]>([])
  const [newAlternative, setNewAlternative] = useState('')

  if (!isOpen) return null

  const handleAddAlternative = () => {
    if (!newAlternative.trim()) return
    setAlternatives([...alternatives, newAlternative.trim()])
    setNewAlternative('')
  }

  const handleRemoveAlternative = (index: number) => {
    setAlternatives(alternatives.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !decision.trim() || !reason.trim()) return

    const newDec = addDecision({
      title: title.trim(),
      decision: decision.trim(),
      reason: reason.trim(),
      status,
      participants: ['Abdulaziz Abdulwahab (Lead Architect)', 'Ibrahim Abdulwahab (CEO)'],
      date: new Date().toISOString().split('T')[0],
      productId,
      consequences: consequences.trim() || undefined,
      alternativesConsidered: alternatives.length > 0 ? alternatives : undefined,
    })

    showToast(`Decision ${newDec.decisionNumber} Logged`, 'success', newDec.title)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
      <div className="w-full max-w-2xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-900 dark:text-white">
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                Log Architectural Decision Record (ADR)
              </h2>
              <p className="text-xs text-slate-500">
                Formalize permanent technical, governance, or strategic decisions.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Decision Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Adopt SuperMemo SM-2 Algorithm for Adaptive Spaced Repetition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          {/* Grid: Status & Product */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              >
                <option value="accepted">✅ Accepted / Ratified</option>
                <option value="proposed">📝 Proposed / Under Review</option>
                <option value="superseded">🔄 Superseded</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Product Scope
              </label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value as ProductId)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Decision Summary */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              What was decided? <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={2}
              placeholder="State the exact technical or product policy ratified..."
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Technical Rationale */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Why was this decision chosen? (Rationale) <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Explain constraints, offline bandwidth limits in Nigeria, cost tradeoffs, or performance benefits..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Alternatives Considered */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Alternatives Considered ({alternatives.length})
            </label>
            {alternatives.length > 0 && (
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {alternatives.map((alt, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <span>• {alt}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAlternative(idx)}
                      className="text-slate-400 hover:text-red-500 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. Leitner Box System, Custom Weighted Random"
                value={newAlternative}
                onChange={(e) => setNewAlternative(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddAlternative()
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={handleAddAlternative}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Consequences & Future Impact */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Consequences & Operational Impact (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="What are the downstream effects or migration requirements?"
              value={consequences}
              onChange={(e) => setConsequences(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Co-ratified by Abdulaziz & Ibrahim
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || !decision.trim() || !reason.trim()}
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Log Decision</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
