'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useOS } from '@/os/context/OSContext'
import { WorkItem, Decision, FeedbackItem } from '@/os/types'
import { StatusBadge } from '@/os/components/StatusBadge'
import { PriorityBadge } from '@/os/components/PriorityBadge'
import { WorkItemDetailModal } from '@/os/components/WorkItemDetailModal'
import { DecompositionModal } from '@/os/components/DecompositionModal'
import {
  Sparkles,
  Bug,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  CheckSquare,
  HelpCircle,
  FileText,
  Activity,
  Layers,
  FileCode,
} from 'lucide-react'

export default function OSDashboardPage() {
  const {
    role,
    workItems,
    productAreas,
    feedbackItems,
    decisions,
    projects,
    proposals,
    activities,
    updateWorkItemStatus,
  } = useOS()

  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null)
  const [decompositionItem, setDecompositionItem] = useState<WorkItem | null>(null)

  // Filters for Abdulaziz View
  const abdulazizFocusItems = workItems
    .filter((w) => w.assignee === 'abdulaziz' && w.status !== 'done')
    .sort((a, b) => {
      const pOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      return pOrder[a.priority] - pOrder[b.priority]
    })
    .slice(0, 3)

  const needsAttentionBugs = workItems.filter(
    (w) => w.type === 'bug' && w.status !== 'done'
  )

  const pendingFeedback = feedbackItems.filter((f) => f.status === 'new')

  // Filters for Ibrahim (CEO) View
  const ceoPendingItems = workItems.filter(
    (w) => w.assignee === 'ibrahim' && w.status !== 'done'
  )

  const inProgressWork = workItems.filter((w) => w.status === 'in_progress')

  const totalMaturity = Math.round(
    productAreas.reduce((acc, a) => acc + a.maturity, 0) / productAreas.length
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Dynamic Header & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              WSTAR Central Executive Hub
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1 font-heading">
            {role === 'engineer' ? "Abdulaziz's Daily Focus" : "Ibrahim's Executive Overview"}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {role === 'engineer'
              ? 'Ace Acad engineering velocity, P0 bug diagnostics, and syllabus ingestion.'
              : 'Company health, milestone progress, launch readiness, and governance.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">
                Ace Acad Overall Health
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {totalMaturity}% Maturity Score
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PERSPECTIVE A: ABDULAZIZ (ENGINEERING / TECH LEAD VIEW)                    */}
      {/* ========================================================================= */}
      {role === 'engineer' && (
        <div className="space-y-8">
          {/* 1. Today's Top Focus */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>YOUR FOCUS TODAY (Top 3 Highest Leverage Items)</span>
              </div>
              <Link
                href="/os/work"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                View all work ({workItems.length}) →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {abdulazizFocusItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-blue-500/50 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                        {item.itemNumber}
                      </span>
                      <PriorityBadge priority={item.priority} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {item.description}
                    </p>
                    {item.codeReference && (
                      <div className="text-[11px] font-mono text-slate-400 truncate bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded">
                        {item.codeReference}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <StatusBadge status={item.status} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        updateWorkItemStatus(
                          item.id,
                          item.status === 'in_progress' ? 'done' : 'in_progress'
                        )
                      }}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {item.status === 'in_progress' ? 'Mark Done' : 'Start Task'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Strategic Scaling & AI Pipelines Banner */}
          <section className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                <FileCode className="w-4 h-4" />
                <span>Next Architecture Pipelines (3 Proposals)</span>
              </div>
              <h3 className="text-sm font-bold font-heading text-white">
                Class Rep UGC Drives • Tier 2 Hybrid AI Ingestion • 3-Zone Staging Quarantine
              </h3>
              <p className="text-xs text-slate-300">
                Extracted roadmap specs ready for implementation after P0 MVP stabilization.
              </p>
            </div>
            <Link
              href="/os/proposals"
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
            >
              <span>Inspect Proposals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </section>

          {/* 2. Critical Bugs & Product Health Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Critical Bugs Requiring Fix */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <Bug className="w-4 h-4 text-red-500" />
                  <span>CRITICAL BUGS ({needsAttentionBugs.length})</span>
                </div>
                <span className="text-xs text-slate-400">P0 Blockers</span>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-2xs overflow-hidden">
                {needsAttentionBugs.map((bug) => (
                  <div
                    key={bug.id}
                    onClick={() => setSelectedItem(bug)}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 shrink-0 mt-0.5">
                        <Bug className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                            {bug.itemNumber}
                          </span>
                          <PriorityBadge priority={bug.priority} />
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-1">
                          {bug.title}
                        </h4>
                        {bug.codeReference && (
                          <div className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                            {bug.codeReference}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <StatusBadge status={bug.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ace Acad Module Health Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <Layers className="w-4 h-4 text-blue-500" />
                  <span>ACE ACAD PRODUCT HEALTH</span>
                </div>
                <Link
                  href="/os/ace-acad"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Deep dive →
                </Link>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs space-y-3">
                {productAreas.slice(0, 6).map((area) => (
                  <div key={area.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span className="truncate pr-2">{area.name}</span>
                      <span className="font-mono text-slate-500 shrink-0">
                        {area.maturity}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          area.maturity >= 85
                            ? 'bg-emerald-500'
                            : area.maturity >= 70
                            ? 'bg-blue-500'
                            : area.maturity >= 30
                            ? 'bg-purple-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${area.maturity}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PERSPECTIVE B: IBRAHIM (CEO & EXECUTIVE STRATEGY VIEW)                    */}
      {/* ========================================================================= */}
      {role === 'ceo' && (
        <div className="space-y-8">
          {/* High-Level Executive Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase">
                Company Status
              </div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Healthy (Beta Active)</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Foundations solid. Free pilot ready for 100L ABU Zaria cohort.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase">
                Strategic Proposals
              </div>
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>3 Active Specs</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Class Rep UGC, Tier 2 Hybrid AI, and Staging storage.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase">
                Awaiting CEO Input
              </div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {ceoPendingItems.length} Decisions/Tasks
              </div>
              <p className="text-[11px] text-slate-500">
                Bridge Ambassador playbook, monetization, & NDPC registration.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase">
                Customer Feedback
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">
                {pendingFeedback.length} Untriaged
              </div>
              <p className="text-[11px] text-slate-500">
                Incoming reports directly from Firestore feedback channel.
              </p>
            </div>
          </div>

          {/* Strategic Proposals Hub Showcase */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <FileCode className="w-4 h-4 text-purple-500" />
                <span>STRATEGIC PROPOSALS & EXPANSION BLUEPRINTS</span>
              </div>
              <Link
                href="/os/proposals"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Open proposals hub →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {proposals.map((prop) => (
                <Link
                  key={prop.id}
                  href="/os/proposals"
                  className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-purple-500/50 transition-all space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                      {prop.proposalNumber}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      {prop.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {prop.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {prop.subtitle}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{prop.phases.length} Phases</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {prop.recommendedTierOrApproach.estimatedCost}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Strategic Overview: What Abdulaziz is Working On vs Waiting for CEO */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Waiting for CEO */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  <span>ACTION REQUIRED BY CEO ({ceoPendingItems.length})</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-2xs overflow-hidden">
                {ceoPendingItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {item.itemNumber}
                      </span>
                      <PriorityBadge priority={item.priority} />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* What Abdulaziz (Engineering) is currently doing */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span>ACTIVE ENGINEERING WORK ({inProgressWork.length})</span>
                </div>
                <Link
                  href="/os/work"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  View full sprint →
                </Link>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-2xs overflow-hidden">
                {inProgressWork.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                        {item.itemNumber}
                      </span>
                      <StatusBadge status={item.status} />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    {item.subtasks && item.subtasks.length > 0 && (
                      <div className="text-[11px] text-slate-400">
                        Subtasks: {item.subtasks.filter((st) => st.completed).length} /{' '}
                        {item.subtasks.length} completed
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* This Week's Projects & Milestones */}
          <section className="space-y-3">
            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>ACTIVE INITIATIVES & MILESTONES</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {p.name}
                    </h3>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {p.progress}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{p.summary}</p>

                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                    {p.milestones.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2
                            className={`w-3.5 h-3.5 ${
                              m.completed ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                          <span className={m.completed ? 'line-through text-slate-400' : ''}>
                            {m.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{m.dueDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Modals */}
      <WorkItemDetailModal
        item={selectedItem}
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        onOpenDecomposition={(item) => {
          setSelectedItem(null)
          setDecompositionItem(item)
        }}
      />

      <DecompositionModal
        item={decompositionItem}
        isOpen={Boolean(decompositionItem)}
        onClose={() => setDecompositionItem(null)}
      />
    </div>
  )
}
