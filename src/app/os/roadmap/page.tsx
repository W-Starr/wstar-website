'use client'

import React from 'react'
import { useOS } from '@/os/context/OSContext'
import { RoadmapItem } from '@/os/types'
import {
  Compass,
  Sparkles,
  Plus,
  Layers,
  ArrowRight,
  CheckCircle2,
  PackageCheck,
  Undo2,
} from 'lucide-react'

export default function RoadmapPage() {
  const { roadmapItems, updateRoadmapHorizon, markRoadmapItemShipped } = useOS()

  const horizons: {
    key: RoadmapItem['horizon']
    label: string
    sub: string
    dot: string
    headerBg: string
  }[] = [
    {
      key: 'now',
      label: 'Now (Active Sprint)',
      sub: 'Immediate Focus (Q3 2026)',
      dot: 'bg-blue-500',
      headerBg: 'border-blue-500/20',
    },
    {
      key: 'next',
      label: 'Next (Upcoming Release)',
      sub: 'Q4 2026 Targets',
      dot: 'bg-amber-500',
      headerBg: 'border-amber-500/20',
    },
    {
      key: 'later',
      label: 'Later (Post-MVP & Scale)',
      sub: '2027 Expansion',
      dot: 'bg-purple-500',
      headerBg: 'border-purple-500/20',
    },
    {
      key: 'shipped',
      label: 'Shipped (Live & Delivered)',
      sub: 'Completed Milestones',
      dot: 'bg-emerald-500',
      headerBg: 'border-emerald-500/20',
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Compass className="w-4 h-4" />
            <span>Strategic Horizons</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1 font-heading">
            Product Roadmap (Now / Next / Later / Shipped)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track strategic company milestones from planning and sprint execution through live deployment.
          </p>
        </div>
      </div>

      {/* Horizon Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {horizons.map((h) => {
          const items = roadmapItems.filter((r) => r.horizon === h.key)

          return (
            <div
              key={h.key}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs flex flex-col space-y-4 min-h-[500px]"
            >
              {/* Column Title */}
              <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {h.key === 'shipped' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <span className={`w-2.5 h-2.5 rounded-full ${h.dot}`} />
                    )}
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-heading">
                      {h.label}
                    </h3>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{h.sub}</p>
                </div>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    h.key === 'shipped'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {items.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3 flex-1">
                {items.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                    {h.key === 'shipped'
                      ? 'No items marked as shipped yet.'
                      : `No items in ${h.label}.`}
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 sm:p-4 rounded-lg border space-y-2.5 transition-all ${
                        h.key === 'shipped'
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/40'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            h.key === 'shipped'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                          }`}
                        >
                          {item.category}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {item.targetQuarter}
                        </span>
                      </div>

                      <h4
                        className={`text-xs font-bold leading-snug ${
                          h.key === 'shipped'
                            ? 'text-emerald-950 dark:text-emerald-200'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {item.title}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Shipped Date badge if shipped */}
                      {h.key === 'shipped' && (
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 pt-1">
                          <PackageCheck className="w-3.5 h-3.5" />
                          <span>Delivered {item.shippedDate ? `on ${item.shippedDate}` : 'to Production'}</span>
                        </div>
                      )}

                      {/* Quick "Mark as Shipped" Action Button on Active items */}
                      {h.key === 'now' && (
                        <button
                          onClick={() => markRoadmapItemShipped(item.id)}
                          className="w-full py-1.5 px-2.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark as Shipped & Done</span>
                        </button>
                      )}

                      {/* Move horizon controls */}
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Shift Horizon:</span>
                        <div className="flex items-center gap-1">
                          {h.key === 'shipped' && (
                            <button
                              onClick={() => updateRoadmapHorizon(item.id, 'now')}
                              className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 font-medium"
                            >
                              <Undo2 className="w-3 h-3" />
                              <span>Reopen to Now</span>
                            </button>
                          )}

                          {h.key === 'now' && (
                            <button
                              onClick={() => updateRoadmapHorizon(item.id, 'next')}
                              className="px-1.5 py-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 font-medium"
                            >
                              Later →
                            </button>
                          )}

                          {h.key === 'next' && (
                            <>
                              <button
                                onClick={() => updateRoadmapHorizon(item.id, 'now')}
                                className="px-1.5 py-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 font-medium"
                              >
                                ← Earlier (Now)
                              </button>
                              <button
                                onClick={() => updateRoadmapHorizon(item.id, 'later')}
                                className="px-1.5 py-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 font-medium"
                              >
                                Later →
                              </button>
                            </>
                          )}

                          {h.key === 'later' && (
                            <button
                              onClick={() => updateRoadmapHorizon(item.id, 'next')}
                              className="px-1.5 py-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 font-medium"
                            >
                              ← Earlier (Next)
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
