'use client'

import React from 'react'
import { X, Command, Keyboard, Sparkles, Navigation } from 'lucide-react'

interface ShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  if (!isOpen) return null

  const navigationShortcuts = [
    { key: '1', label: 'Executive Dashboard', path: '/os' },
    { key: '2', label: 'Projects & Initiatives Hub', path: '/os/projects' },
    { key: '3', label: 'Source Intelligence', path: '/os/sources' },
    { key: '4', label: 'Work Stream & Bug Tracker', path: '/os/work' },
    { key: '5', label: 'Timeline & Company Pulse', path: '/os/timeline' },
    { key: '6', label: 'Strategic Proposals & Specs', path: '/os/proposals' },
    { key: '7', label: 'Decision Ledger (ADR)', path: '/os/decisions' },
    { key: '8', label: 'Customer Feedback Queue', path: '/os/feedback' },
    { key: '9', label: 'Product Roadmap & Horizons', path: '/os/roadmap' },
    { key: '0', label: 'Activity & Audit Feed', path: '/os/activity' },
  ]

  const actionShortcuts = [
    { keys: ['N'], label: 'Universal Quick Capture (with Gemini Flash AI)' },
    { keys: ['Ctrl', 'K'], altKeys: ['⌘', 'K'], label: 'Open Global Command Palette' },
    { keys: ['?'], label: 'Open this Keyboard Shortcuts Cheat Sheet' },
    { keys: ['Esc'], label: 'Close Active Modal or Drawer' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-900 dark:text-white">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                Keyboard Shortcuts Cheatsheet
              </h2>
              <p className="text-xs text-slate-500">
                High-velocity shortcuts for navigating WSTAR OS.
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

        {/* Shortcuts Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Actions */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Actions & Tools</span>
            </div>
            <div className="space-y-1.5">
              {actionShortcuts.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 text-xs"
                >
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-1">
                    {item.keys.map((k, ki) => (
                      <kbd
                        key={ki}
                        className="px-2 py-1 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono text-[11px] font-bold shadow-2xs text-slate-800 dark:text-slate-200"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Navigation className="w-3.5 h-3.5 text-blue-500" />
              <span>Direct View Navigation</span>
            </div>
            <div className="space-y-1.5">
              {navigationShortcuts.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 text-xs"
                >
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {item.label}
                  </span>
                  <kbd className="px-2 py-1 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono text-[11px] font-bold shadow-2xs text-slate-800 dark:text-slate-200">
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-400">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">?</kbd> anytime to toggle</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
