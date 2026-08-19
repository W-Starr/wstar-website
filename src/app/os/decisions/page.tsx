'use client'

import React, { useState } from 'react'
import { useOS } from '@/os/context/OSContext'
import { Decision } from '@/os/types'
import { DecisionDetailModal } from '@/os/components/DecisionDetailModal'
import { DecisionCreateModal } from '@/os/components/DecisionCreateModal'
import {
  FileText,
  Plus,
  Search,
  Scale,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react'

export default function DecisionsPage() {
  const { decisions } = useOS()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [productFilter, setProductFilter] = useState<'all' | 'ace-acad' | 'plantiq' | 'wstar-core'>('all')

  const filteredDecisions = decisions.filter((d) => {
    const matchesProduct = productFilter === 'all' || d.productId === productFilter
    if (!matchesProduct) return false

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

  return (
    <div className="space-y-6 animate-in fade-in duration-150 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Scale className="w-4 h-4" />
            <span>Organizational Memory & Governance</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1 font-heading">
            Architectural Decision Records (ADR)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable log of technical, product, and corporate governance decisions co-ratified by Abdulaziz & Ibrahim.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-xs transition-all hover:scale-102 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log Decision</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search decisions by title, reason, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 w-full sm:w-auto overflow-x-auto">
          {(['all', 'ace-acad', 'plantiq', 'wstar-core'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setProductFilter(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                productFilter === p
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {p === 'all' ? 'All Products' : p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Decisions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDecisions.map((dec) => (
          <div
            key={dec.id}
            onClick={() => setSelectedDecision(dec)}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900/60">
                    {dec.decisionNumber}
                  </span>
                  {dec.productId && (
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {dec.productId}
                    </span>
                  )}
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    dec.status === 'accepted'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                      : dec.status === 'proposed'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {dec.status.toUpperCase()}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug font-heading">
                {dec.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 mt-2 leading-relaxed">
                {dec.decision}
              </p>

              {dec.alternativesConsidered && dec.alternativesConsidered.length > 0 && (
                <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>{dec.alternativesConsidered.length} alternatives evaluated</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {dec.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {dec.participants?.length || 2} Co-Signers
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredDecisions.length === 0 && (
        <div className="p-12 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
          <Scale className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No decisions match your query</p>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your keyword filter or product scope.</p>
        </div>
      )}

      {/* Create Modal */}
      <DecisionCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* Detail Modal */}
      <DecisionDetailModal
        decision={selectedDecision}
        isOpen={Boolean(selectedDecision)}
        onClose={() => setSelectedDecision(null)}
      />
    </div>
  )
}
