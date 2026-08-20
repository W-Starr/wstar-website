'use client'

import React, { useState } from 'react'
import { useOS } from '@/os/context/OSContext'
import { WorkItem } from '@/os/types'
import { CompanyPulseStrip } from '@/os/components/CompanyPulseStrip'
import { GanttTimeline } from '@/os/components/GanttTimeline'
import { DeadlineFeed } from '@/os/components/DeadlineFeed'
import { WorkItemDetailModal } from '@/os/components/WorkItemDetailModal'
import { DecompositionModal } from '@/os/components/DecompositionModal'
import {
  ChartGantt,
  HeartPulse,
  CalendarClock,
} from 'lucide-react'

export default function TimelinePage() {
  const {
    workItems,
    projects,
    feedbackItems,
    activities,
    updateWorkItemStatus,
  } = useOS()

  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null)
  const [decompositionItem, setDecompositionItem] = useState<WorkItem | null>(null)

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* ─── Page Header ─── */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Company Timeline & Pulse
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white tracking-tight mt-1">
          Birds Eye View
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time company progress, project timelines, milestones, and upcoming deadlines at a glance.
        </p>
      </div>

      {/* ─── Section 1: Company Pulse Health Strip ─── */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <HeartPulse className="w-4 h-4 text-emerald-500" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Company Pulse
          </h2>
        </div>
        <CompanyPulseStrip
          workItems={workItems}
          feedbackItems={feedbackItems}
          projects={projects}
          activities={activities}
        />
      </section>

      {/* ─── Section 2 & 3: Timeline + Deadline Feed ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* Main Gantt Timeline */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <ChartGantt className="w-4 h-4 text-blue-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Project Timeline
            </h2>
          </div>
          <GanttTimeline
            projects={projects}
            workItems={workItems}
            onTaskClick={(item) => setSelectedItem(item)}
          />
        </section>

        {/* Deadline Feed Sidebar */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <CalendarClock className="w-4 h-4 text-amber-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Upcoming Deadlines
            </h2>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
            <DeadlineFeed
              projects={projects}
              workItems={workItems}
              daysAhead={60}
              onTaskClick={(item) => setSelectedItem(item)}
            />
          </div>
        </section>
      </div>

      {/* ─── Work Item Detail Modal ─── */}
      <WorkItemDetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onOpenDecomposition={(item) => {
          setDecompositionItem(item)
          setSelectedItem(null)
        }}
      />

      {/* ─── AI Decomposition Modal ─── */}
      <DecompositionModal
        item={decompositionItem}
        isOpen={!!decompositionItem}
        onClose={() => setDecompositionItem(null)}
      />
    </div>
  )
}
