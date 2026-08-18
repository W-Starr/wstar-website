'use client'

import React from 'react'
import { useOS } from '@/os/context/OSContext'
import { RoadmapItem } from '@/os/types'
import { Compass, Sparkles, Plus, Layers, ArrowRight } from 'lucide-react'

export default function RoadmapPage() {
  const { roadmapItems, updateRoadmapHorizon } = useOS()

  const horizons: { key: RoadmapItem['horizon']; label: string; sub: string; dot: string }[] = [
    { key: 'now', label: 'Now (Active Sprint)', sub: 'Immediate Focus (Q3 2026)', dot: 'bg-emerald-500' },
    { key: 'next', label: 'Next (Upcoming Release)', sub: 'Q4 2026 Targets', dot: 'bg-amber-500' },
    { key: 'later', label: 'Later (Post-MVP & Scale)', sub: '2027 Expansion', dot: 'bg-blue-500' },
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            Product Roadmap (Now / Next / Later)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Answering &quot;What are we building and why?&quot; without overcomplicated roadmap software.
          </p>
        </div>
      </div>

      {/* Horizon Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <span className={`w-2.5 h-2.5 rounded-full ${h.dot}`} />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {h.label}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{h.sub}</p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                  {items.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3 flex-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5 hover:shadow-xs transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {item.targetQuarter}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Move horizon controls */}
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Shift Horizon:</span>
                      <div className="flex items-center gap-1">
                        {h.key !== 'now' && (
                          <button
                            onClick={() =>
                              updateRoadmapHorizon(
                                item.id,
                                h.key === 'later' ? 'next' : 'now'
                              )
                            }
                            className="px-1.5 py-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-600 font-medium"
                          >
                            ← Earlier
                          </button>
                        )}
                        {h.key !== 'later' && (
                          <button
                            onClick={() =>
                              updateRoadmapHorizon(
                                item.id,
                                h.key === 'now' ? 'next' : 'later'
                              )
                            }
                            className="px-1.5 py-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-600 font-medium"
                          >
                            Later →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
