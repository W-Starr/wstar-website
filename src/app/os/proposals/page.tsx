'use client'

import React, { useState } from 'react'
import { useOS } from '@/os/context/OSContext'
import { Proposal } from '@/os/types'
import { ProposalDetailModal } from '@/os/components/ProposalDetailModal'
import {
  FileCode,
  Sparkles,
  Layers,
  Shield,
  TrendingUp,
  Calendar,
  Users,
  ArrowRight,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
} from 'lucide-react'

export default function ProposalsPage() {
  const { proposals, role } = useOS()
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredProposals = (proposals || []).filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.proposalNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.executiveSummary.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusBadge = (status: Proposal['status']) => {
    switch (status) {
      case 'approved_for_scoping':
        return { label: 'Approved for Scoping', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' }
      case 'recommended_tier2':
        return { label: 'Tier 2 Recommended', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' }
      case 'staged_for_execution':
        return { label: 'Staged for Execution', bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' }
      default:
        return { label: 'Under Review', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' }
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            <FileCode className="w-4 h-4" />
            <span>Strategic Architecture & Scaling Hub</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
            Strategic Proposals & Expansion Horizons
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
            Formal technical proposals, scaling memos, and architectural blueprints. Deep-dive into technical tiers, financial projections, and extract implementation tasks directly into the work stream.
          </p>
        </div>
      </div>

      {/* High-Level Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Active Proposals
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">
            {proposals.length} Specs
          </div>
          <p className="text-[11px] text-slate-500">
            Ready for MVP scoping & staged execution.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-purple-500 uppercase tracking-wider">
            Scaling Model (PROP-001)
          </div>
          <div className="text-xl font-bold text-purple-600 dark:text-purple-400 font-heading">
            Class Rep Drives
          </div>
          <p className="text-[11px] text-slate-500">
            100+ dept scaling with safe harbor hosting.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-blue-500 uppercase tracking-wider">
            AI Ingestion Cost (PROP-002)
          </div>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400 font-mono">
            ~$0.02 / Course
          </div>
          <p className="text-[11px] text-slate-500">
            Gemini 2.0 Flash batch syllabus parsing.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider">
            Storage Pipeline (PROP-003)
          </div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-heading">
            3-Zone Staging
          </div>
          <p className="text-[11px] text-slate-500">
            Ghostscript compression & Gemini OCR.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search proposals, memos, architectures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Filter className="w-3.5 h-3.5" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Categories</option>
            <option value="Content Scaling & UGC">Content Scaling & UGC</option>
            <option value="AI & Adaptive Learning">AI & Adaptive Learning</option>
            <option value="Architecture & Ingestion">Architecture & Ingestion</option>
          </select>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
        >
          <option value="all">All Statuses</option>
          <option value="approved_for_scoping">Approved for Scoping</option>
          <option value="recommended_tier2">Tier 2 Recommended</option>
          <option value="staged_for_execution">Staged for Execution</option>
        </select>
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredProposals.map((proposal) => {
          const status = getStatusBadge(proposal.status)
          return (
            <div
              key={proposal.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {proposal.proposalNumber}
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${status.bg}`}>
                    {status.label}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {proposal.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {proposal.subtitle}
                  </p>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-3 text-[11px] text-slate-400 border-y border-slate-100 dark:border-slate-800/80 py-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{proposal.date}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <Users className="w-3 h-3" />
                    <span className="truncate">{proposal.authors[0]}</span>
                  </div>
                </div>

                {/* Brief Snippet */}
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {proposal.executiveSummary}
                </p>

                {/* Approach & ROI Box */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Recommended Approach
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    {proposal.recommendedTierOrApproach.name}
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-500">Cost:</span>
                    <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {proposal.recommendedTierOrApproach.estimatedCost}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-400 font-mono">
                  {proposal.phases.length} Phases • {proposal.actionItems.length} Actions
                </div>

                <button
                  onClick={() => setSelectedProposal(proposal)}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <span>Deep Dive</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Proposal Detail Modal */}
      <ProposalDetailModal
        proposal={selectedProposal}
        onClose={() => setSelectedProposal(null)}
      />
    </div>
  )
}
