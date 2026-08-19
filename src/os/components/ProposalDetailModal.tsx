'use client'

import React, { useState } from 'react'
import { Proposal, ProposalPhase } from '../types'
import { useOS } from '../context/OSContext'
import {
  X,
  FileCode,
  Calendar,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  Plus,
} from 'lucide-react'

interface ProposalDetailModalProps {
  proposal: Proposal | null
  onClose: () => void
}

export function ProposalDetailModal({ proposal, onClose }: ProposalDetailModalProps) {
  const { updateProposalStatus, createWorkItemFromProposal, addWorkItem, workItems, decisions } = useOS()
  const [activeTab, setActiveTab] = useState<'brief' | 'architecture' | 'roadmap' | 'risks' | 'links'>('brief')
  const [extractedTasks, setExtractedTasks] = useState<string[]>([])
  const [extractSuccessMsg, setExtractSuccessMsg] = useState<string | null>(null)
  const [isExtractingAI, setIsExtractingAI] = useState(false)

  if (!proposal) return null

  const handleStatusChange = (newStatus: Proposal['status']) => {
    updateProposalStatus(proposal.id, newStatus)
  }

  const handleExtractTask = (taskTitle: string, assignee: 'abdulaziz' | 'ibrahim' = 'abdulaziz') => {
    const newItem = createWorkItemFromProposal(proposal.id, taskTitle, assignee)
    setExtractedTasks((prev) => [...prev, taskTitle])
    setExtractSuccessMsg(`Created work item ${newItem.itemNumber}: "${taskTitle}"`)
    setTimeout(() => setExtractSuccessMsg(null), 4000)
  }

  const handleAIBatchExtract = async () => {
    try {
      setIsExtractingAI(true)
      const res = await fetch('/api/os/ai/extract-proposal-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalNumber: proposal.proposalNumber,
          title: proposal.title,
          problem: proposal.executiveSummary,
          solution: proposal.proposedSolution,
          phases: proposal.phases,
        }),
      })

      const data = await res.json()
      if (data.tasks && data.tasks.length > 0) {
        let createdCount = 0
        data.tasks.forEach((t: any) => {
          addWorkItem({
            title: t.title,
            description: `${t.description}\n\n[Extracted from ${proposal.proposalNumber}: ${proposal.title}]`,
            type: t.type || 'task',
            priority: t.priority || 'medium',
            status: 'todo',
            productId: 'ace-acad',
            assignee: t.assignee || 'abdulaziz',
            codeReference: proposal.proposalNumber,
          })
          createdCount++
        })

        setExtractSuccessMsg(`✨ AI staged ${createdCount} sprint tasks into the Work Stream!`)
        setTimeout(() => setExtractSuccessMsg(null), 5000)
      }
    } catch (err) {
      console.error('AI extraction error:', err)
    } finally {
      setIsExtractingAI(false)
    }
  }

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

  const statusConfig = getStatusBadge(proposal.status)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-white">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {proposal.proposalNumber}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusConfig.bg}`}>
                {statusConfig.label}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {proposal.category}
              </span>
            </div>

            <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white leading-tight">
              {proposal.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {proposal.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{proposal.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>{proposal.authors.join(', ')}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <FileCode className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-xs">{proposal.filename}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {extractSuccessMsg && (
          <div className="px-6 py-2.5 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{extractSuccessMsg}</span>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('brief')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'brief'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            Executive Brief
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            Architecture & Tier Analysis
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'roadmap'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            Phased Roadmap ({proposal.phases.length} Phases)
          </button>
          <button
            onClick={() => setActiveTab('risks')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'risks'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            Risk Matrix ({proposal.keyRisks.length})
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'links'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            OS Decisions & Work Items
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: EXECUTIVE BRIEF */}
          {activeTab === 'brief' && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Executive Summary
                </div>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                  {proposal.executiveSummary}
                </p>
              </div>

              {/* Problem Statements */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Core Bottlenecks & Problem Statement
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {proposal.problemStatement.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5"
                    >
                      <div className="text-xs font-bold text-red-600 dark:text-red-400">
                        {p.painPoint}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {p.impact}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proposed Solution */}
              <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                  The Proposed Solution
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {proposal.proposedSolution}
                </p>
              </div>

              {/* Strategic Advantages */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Strategic Advantages
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {proposal.strategicAdvantages.map((adv, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                        <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                        <span>{adv.title}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {adv.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Items List */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Immediate Action Items
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                  {proposal.actionItems.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        <span>{item}</span>
                      </div>
                      <button
                        disabled={extractedTasks.includes(item)}
                        onClick={() => handleExtractTask(item, 'abdulaziz')}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all flex items-center gap-1 shrink-0 ${
                          extractedTasks.includes(item)
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                            : 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 active:scale-95'
                        }`}
                      >
                        <Plus className="w-3 h-3" />
                        <span>{extractedTasks.includes(item) ? 'Added to Work' : 'Add to Work'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ARCHITECTURE & TIERS */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              {/* Recommendation Box */}
              <div className="p-5 rounded-xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    Recommended Implementation
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                    {proposal.recommendedTierOrApproach.estimatedCost}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-heading">
                    {proposal.recommendedTierOrApproach.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {proposal.recommendedTierOrApproach.rationale}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <div className="text-slate-400">Estimated Cost</div>
                    <div className="font-semibold text-emerald-400 font-mono mt-0.5">
                      {proposal.recommendedTierOrApproach.estimatedCost}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Target ROI / Velocity</div>
                    <div className="font-semibold text-blue-400 font-mono mt-0.5">
                      {proposal.recommendedTierOrApproach.roi}
                    </div>
                  </div>
                </div>
              </div>

              {/* Source Document Pointer */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-white">
                    Full Engineering & Specification Document
                  </div>
                  <div className="text-slate-500 font-mono text-[11px]">
                    proposals/{proposal.filename}
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                  Verified In Workspace
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PHASED ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Implementation Timeline & Phased Execution
              </div>

              {proposal.phases.map((phase) => (
                <div
                  key={phase.phaseNumber}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">
                        {phase.phaseNumber}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Phase {phase.phaseNumber}: {phase.title}
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {phase.duration}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-slate-900 dark:text-slate-200">Deliverable: </span>
                    {phase.deliverable}
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-semibold uppercase text-slate-400">
                      Key Technical Tasks
                    </div>
                    <div className="space-y-1">
                      {phase.tasks.map((task, tidx) => (
                        <div
                          key={tidx}
                          className="flex items-center justify-between gap-3 text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40"
                        >
                          <span className="text-slate-700 dark:text-slate-300">{task}</span>
                          <button
                            disabled={extractedTasks.includes(task)}
                            onClick={() => handleExtractTask(task, 'abdulaziz')}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all shrink-0 ${
                              extractedTasks.includes(task)
                                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                            }`}
                          >
                            {extractedTasks.includes(task) ? 'In Work' : '+ Add to Work'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: RISK MATRIX */}
          {activeTab === 'risks' && (
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Risk Analysis & Mitigation Strategies
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
                {proposal.keyRisks.map((r, idx) => (
                  <div key={idx} className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        <span>{r.risk}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          Likelihood: {r.likelihood}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-semibold">
                          Impact: {r.impact}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 pl-5">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Mitigation: </span>
                      {r.mitigation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: OS CROSS-LINKS */}
          {activeTab === 'links' && (
            <div className="space-y-6">
              {/* Linked Decisions */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Linked Architectural Decisions (ADR)
                </div>
                <div className="space-y-2">
                  {decisions
                    .filter((d) => proposal.linkedDecisionIds?.includes(d.id))
                    .map((dec) => (
                      <div
                        key={dec.id}
                        className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                            {dec.decisionNumber}
                          </span>
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            {dec.status}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {dec.title}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {dec.decision}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Linked Work Items */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Linked Active Work Items in Stream
                </div>
                <div className="space-y-2">
                  {workItems
                    .filter((w) => proposal.linkedWorkItemIds?.includes(w.id))
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                            {item.itemNumber}
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white truncate max-w-md">
                            {item.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {item.status}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Update Status:</span>
            <button
              onClick={() => handleStatusChange('approved_for_scoping')}
              className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 transition-colors"
            >
              Approve for Scoping
            </button>
            <button
              onClick={() => handleStatusChange('staged_for_execution')}
              className="px-2.5 py-1 rounded text-xs font-semibold bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 transition-colors"
            >
              Stage for Execution
            </button>
            <button
              disabled={isExtractingAI}
              onClick={handleAIBatchExtract}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isExtractingAI ? 'Extracting with Gemini...' : 'AI Extract Sprint Tasks'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold transition-all active:scale-95"
          >
            Close Deep Dive
          </button>
        </div>
      </div>
    </div>
  )
}
