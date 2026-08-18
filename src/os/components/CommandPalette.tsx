'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOS } from '../context/OSContext'
import {
  Search,
  CheckSquare,
  Sparkles,
  FileText,
  MessageSquare,
  Compass,
  LayoutDashboard,
  Plus,
  UserCheck,
  ShieldCheck,
  ExternalLink,
  FileCode,
} from 'lucide-react'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onOpenQuickCapture: () => void
}

export function CommandPalette({
  isOpen,
  onClose,
  onOpenQuickCapture,
}: CommandPaletteProps) {
  const router = useRouter()
  const { workItems, decisions, feedbackItems, proposals, role, setRole } = useOS()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) onClose()
        else onOpenQuickCapture()
      }
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onOpenQuickCapture])

  if (!isOpen) return null

  const filteredProposals = (proposals || []).filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.proposalNumber.toLowerCase().includes(query.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3)

  const filteredWork = workItems.filter(
    (w) =>
      w.title.toLowerCase().includes(query.toLowerCase()) ||
      w.itemNumber.toLowerCase().includes(query.toLowerCase()) ||
      w.description?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5)

  const filteredDecisions = decisions.filter(
    (d) =>
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.decisionNumber.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3)

  const filteredFeedback = feedbackItems.filter((f) =>
    f.subject.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3)

  const navigateTo = (path: string) => {
    router.push(path)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Search Input */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0 ml-2" />
          <input
            type="text"
            autoFocus
            placeholder="Search proposals, work, bugs, decisions, feedback, or jump..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3">
          {/* Quick Actions Section */}
          <div>
            <div className="px-3 py-1 text-[11px] font-semibold uppercase text-slate-400 dark:text-slate-500">
              Quick Actions
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  onClose()
                  onOpenQuickCapture()
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Create New Work Item / Bug</span>
              </button>

              <button
                onClick={() => {
                  setRole(role === 'engineer' ? 'ceo' : 'engineer')
                  onClose()
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {role === 'engineer' ? (
                  <UserCheck className="w-4 h-4 text-indigo-500" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                )}
                <span>Switch to {role === 'engineer' ? 'Ibrahim (CEO)' : 'Abdulaziz (Lead Eng)'} Perspective</span>
              </button>

              <button
                onClick={() => navigateTo('/os/proposals')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-950/60 hover:text-purple-700 transition-colors"
              >
                <FileCode className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Open Strategic Proposals Hub (3 Active)</span>
              </button>
            </div>
          </div>

          {/* Filtered Proposals */}
          {filteredProposals.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold uppercase text-purple-500">
                Strategic Proposals
              </div>
              <div className="space-y-0.5">
                {filteredProposals.map((prop) => (
                  <button
                    key={prop.id}
                    onClick={() => navigateTo('/os/proposals')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-left"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                        {prop.proposalNumber}
                      </span>
                      <span className="truncate font-semibold">{prop.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {prop.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Section */}
          {query.length === 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold uppercase text-slate-400 dark:text-slate-500">
                Navigation
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => navigateTo('/os')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-400" />
                  <span>Personal Dashboard</span>
                </button>
                <button
                  onClick={() => navigateTo('/os/work')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <CheckSquare className="w-4 h-4 text-slate-400" />
                  <span>Work & Bug Tracker</span>
                </button>
                <button
                  onClick={() => navigateTo('/os/ace-acad')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Sparkles className="w-4 h-4 text-slate-400" />
                  <span>Ace Acad Command Center</span>
                </button>
                <button
                  onClick={() => navigateTo('/os/proposals')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <FileCode className="w-4 h-4 text-slate-400" />
                  <span>Strategic Proposals Hub</span>
                </button>
                <button
                  onClick={() => navigateTo('/os/feedback')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <span>Customer Feedback Hub</span>
                </button>
                <button
                  onClick={() => navigateTo('/os/decisions')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>Decision Ledger (ADR)</span>
                </button>
                <button
                  onClick={() => navigateTo('/os/roadmap')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Compass className="w-4 h-4 text-slate-400" />
                  <span>Roadmap (Now / Next / Later)</span>
                </button>
              </div>
            </div>
          )}

          {/* Filtered Work Items */}
          {filteredWork.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold uppercase text-slate-400 dark:text-slate-500">
                Work Items & Bugs
              </div>
              <div className="space-y-0.5">
                {filteredWork.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigateTo('/os/work')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono font-semibold text-slate-500">
                        {item.itemNumber}
                      </span>
                      <span className="truncate">{item.title}</span>
                    </div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 shrink-0 ml-2">
                      {item.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filtered Decisions */}
          {filteredDecisions.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold uppercase text-slate-400 dark:text-slate-500">
                Decisions (ADR)
              </div>
              <div className="space-y-0.5">
                {filteredDecisions.map((dec) => (
                  <button
                    key={dec.id}
                    onClick={() => navigateTo('/os/decisions')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono font-semibold text-blue-500">
                        {dec.decisionNumber}
                      </span>
                      <span className="truncate">{dec.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {dec.date}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
