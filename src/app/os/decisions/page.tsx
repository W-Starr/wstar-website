'use client'

import React, { useState } from 'react'
import { useOS } from '@/os/context/OSContext'
import { Decision } from '@/os/types'
import { DecisionDetailModal } from '@/os/components/DecisionDetailModal'
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

export default function DecisionsPage() {
  const { decisions, addDecision } = useOS()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // New decision form state
  const [title, setTitle] = useState('')
  const [decisionText, setDecisionText] = useState('')
  const [reason, setReason] = useState('')
  const [consequences, setConsequences] = useState('')

  const filteredDecisions = decisions.filter((d) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        d.title.toLowerCase().includes(q) ||
        d.decisionNumber.toLowerCase().includes(q) ||
        d.decision.toLowerCase().includes(q) ||
        d.reason.toLowerCase().includes(q)
      )
    }
    return true
  })

  const handleCreateDecision = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !decisionText.trim() || !reason.trim()) return

    addDecision({
      title: title.trim(),
      decision: decisionText.trim(),
      reason: reason.trim(),
      consequences: consequences.trim() || undefined,
      status: 'accepted',
      participants: ['Abdulaziz Abdulwahab', 'Ibrahim Abdulwahab'],
      date: new Date().toISOString().split('T')[0],
      productId: 'ace-acad',
    })

    setTitle('')
    setDecisionText('')
    setReason('')
    setConsequences('')
    setIsCreating(false)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <FileText className="w-4 h-4" />
            <span>Organizational Memory</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            Decision Ledger (ADR)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Preserve the &quot;Why&quot; behind technical, product, and business choices at WSTAR.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Decision</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search decisions by title, reason, or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Decisions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDecisions.map((dec) => (
          <div
            key={dec.id}
            onClick={() => setSelectedDecision(dec)}
            className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                  {dec.decisionNumber}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                  {dec.status.toUpperCase()}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors leading-snug">
                {dec.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 mt-2 leading-relaxed">
                {dec.decision}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {dec.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {dec.participants.length} Participants
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Record New Decision Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Record New Architectural / Company Decision
              </h3>
              <button
                onClick={() => setIsCreating(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDecision} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Use Sanity CMS for Company OS Data"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  What did we decide?
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="State the decision clearly and concisely..."
                  value={decisionText}
                  onChange={(e) => setDecisionText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Why did we choose this? (Rationale & Context)
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain why this decision was made and what alternatives were rejected..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Consequences & Trade-offs (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="What operational or architectural trade-offs does this introduce?"
                  value={consequences}
                  onChange={(e) => setConsequences(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold"
                >
                  Save Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <DecisionDetailModal
        decision={selectedDecision}
        isOpen={Boolean(selectedDecision)}
        onClose={() => setSelectedDecision(null)}
      />
    </div>
  )
}
