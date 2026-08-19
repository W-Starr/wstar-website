'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useOS } from '../context/OSContext'
import { Role } from '../types'
import {
  ShieldCheck,
  UserCheck,
  RefreshCw,
  Bell,
  Cloud,
  Sparkles,
  Zap,
  Menu,
  LogOut,
  AlertTriangle,
  FileText,
  MessageSquare,
  Clock,
  ArrowRight,
  CheckCircle2,
  X,
} from 'lucide-react'

interface TopHeaderProps {
  title?: string
  onToggleMobileSidebar?: () => void
  onOpenQuickCapture?: () => void
  onOpenUniversalCapture?: () => void
}

export function TopHeader({
  title,
  onToggleMobileSidebar,
  onOpenQuickCapture,
  onOpenUniversalCapture,
}: TopHeaderProps) {
  const {
    role,
    currentUser,
    setRole,
    workItems,
    proposals,
    feedbackItems,
    activities,
    sanitySyncStatus,
    refreshFromSanity,
  } = useOS()

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'alerts' | 'activity'>('alerts')

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }
    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isNotificationsOpen])

  // Calculated alerts
  const criticalBugs = workItems.filter(
    (i) => i.priority === 'critical' && i.status !== 'done'
  )
  const pendingProposals = proposals.filter(
    (p) => p.status === 'under_review' || p.status === 'recommended_tier2'
  )
  const newFeedback = feedbackItems.filter((f) => f.status === 'new')

  const totalAlertCount = criticalBugs.length + pendingProposals.length + newFeedback.length
  const recentActivities = (activities || []).slice(0, 8)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setSyncMessage('Fetching live data from Sanity...')
    await refreshFromSanity()
    setIsRefreshing(false)
    setSyncMessage('Sanity data updated')
    setTimeout(() => setSyncMessage(null), 3000)
  }

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 w-full">
      {/* Left: Mobile Hamburger + Context Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-colors shrink-0 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <div className="min-w-0 truncate">
          <h1 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
            <span className="truncate">{title || 'WSTAR OS'}</span>
            <span className="text-[11px] font-normal text-slate-400 hidden sm:inline truncate">
              • {role === 'engineer' ? 'Abdulaziz View' : 'Ibrahim (CEO) View'}
            </span>
          </h1>
        </div>
      </div>

      {/* Right: Role Switcher & Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Universal AI Natural Language Capture Trigger */}
        {onOpenUniversalCapture && (
          <button
            onClick={onOpenUniversalCapture}
            title="Universal Natural Language Capture (Ctrl+K)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] sm:text-xs font-semibold shadow-xs transition-all hover:scale-102 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Universal AI</span>
            <span className="text-[10px] font-mono opacity-80 border border-white/20 px-1 rounded hidden lg:inline">
              ⌘K
            </span>
          </button>
        )}

        {/* Sanity Cloud Refresh Action */}
        <div className="relative">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            title={
              sanitySyncStatus === 'synced'
                ? 'Sanity Live: Connected to cloud dataset (Click to refresh)'
                : 'Click to fetch latest from Sanity'
            }
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg border text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
              sanitySyncStatus === 'synced'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                : sanitySyncStatus === 'syncing' || isRefreshing
                ? 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 animate-pulse'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
            }`}
          >
            {sanitySyncStatus === 'synced' ? (
              <>
                <Cloud className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="hidden md:inline">Sanity Live</span>
              </>
            ) : isRefreshing || sanitySyncStatus === 'syncing' ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500 shrink-0" />
                <span className="hidden md:inline">Refreshing...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="hidden md:inline">Fetch Sanity</span>
              </>
            )}
          </button>

          {syncMessage && (
            <div className="absolute right-0 top-full mt-2 w-64 sm:w-72 p-2.5 rounded-lg bg-slate-900 text-white text-[11px] shadow-xl border border-slate-800 z-50 animate-in fade-in">
              {syncMessage}
            </div>
          )}
        </div>

        {/* Quick Capture Action Trigger */}
        {onOpenQuickCapture && (
          <button
            onClick={onOpenQuickCapture}
            title="Quick Capture (N)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] sm:text-xs font-semibold shadow-xs transition-all hover:scale-102 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Quick Capture</span>
            <span className="md:hidden">New</span>
          </button>
        )}

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
            title={totalAlertCount > 0 ? `${totalAlertCount} actionable alerts` : 'Notifications & Activity'}
            className={`p-1.5 sm:p-2 rounded-lg border transition-colors cursor-pointer relative ${
              isNotificationsOpen
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {totalAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {totalAlertCount}
              </span>
            )}
          </button>

          {/* Popover Dropdown Panel */}
          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Header */}
              <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-heading">
                    Notification Center
                  </h3>
                  {totalAlertCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold">
                      {totalAlertCount} pending
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30 text-xs">
                <button
                  onClick={() => setActiveTab('alerts')}
                  className={`flex-1 py-2 text-center font-semibold transition-colors cursor-pointer border-b-2 ${
                    activeTab === 'alerts'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Action Queue ({totalAlertCount})
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`flex-1 py-2 text-center font-semibold transition-colors cursor-pointer border-b-2 ${
                    activeTab === 'activity'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Recent Activity
                </button>
              </div>

              {/* Body */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-1">
                {activeTab === 'alerts' ? (
                  totalAlertCount === 0 ? (
                    <div className="p-8 text-center space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        All Caught Up!
                      </div>
                      <p className="text-[11px] text-slate-400">
                        No critical bugs, pending proposals, or un-triaged feedback.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Critical Bugs */}
                      {criticalBugs.map((bug) => (
                        <Link
                          key={bug.id}
                          href="/os/work"
                          onClick={() => setIsNotificationsOpen(false)}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors group"
                        >
                          <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 shrink-0 mt-0.5">
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">
                                Critical Bug
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 font-medium">
                                {bug.itemNumber}
                              </span>
                            </div>
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate mt-0.5 group-hover:text-red-600 dark:group-hover:text-red-400">
                              {bug.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              Assignee: {bug.assignee || 'Unassigned'}
                            </p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 dark:group-hover:text-slate-200 shrink-0 self-center" />
                        </Link>
                      ))}

                      {/* Pending Proposals */}
                      {pendingProposals.map((prop) => (
                        <Link
                          key={prop.id}
                          href="/os/proposals"
                          onClick={() => setIsNotificationsOpen(false)}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-colors group"
                        >
                          <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                                Review Required
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 font-medium">
                                {prop.proposalNumber}
                              </span>
                            </div>
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate mt-0.5 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                              {prop.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              Status: {prop.status}
                            </p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 dark:group-hover:text-slate-200 shrink-0 self-center" />
                        </Link>
                      ))}

                      {/* New Feedback */}
                      {newFeedback.map((fb) => (
                        <Link
                          key={fb.id}
                          href="/os/feedback"
                          onClick={() => setIsNotificationsOpen(false)}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors group"
                        >
                          <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                            <MessageSquare className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                                User Feedback
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 font-medium">
                                {fb.type}
                              </span>
                            </div>
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate mt-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                              {fb.subject}
                            </h4>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {fb.description}
                            </p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 dark:group-hover:text-slate-200 shrink-0 self-center" />
                        </Link>
                      ))}
                    </>
                  )
                ) : (
                  recentActivities.length === 0 ? (
                    <div className="p-8 text-center space-y-2">
                      <Clock className="w-8 h-8 text-slate-400 mx-auto" />
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        No Recent Activity
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Actions and updates will appear here automatically.
                      </p>
                    </div>
                  ) : (
                    recentActivities.map((act) => (
                      <div
                        key={act.id}
                        className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors space-y-0.5"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {act.actor}
                          </span>
                          <span className="text-slate-400 font-mono">
                            {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-800 dark:text-slate-200">
                          <span className="font-medium text-slate-600 dark:text-slate-400">{act.action}</span>: {act.targetTitle}
                        </p>
                      </div>
                    ))
                  )
                )}
              </div>

              {/* Footer */}
              <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between text-[11px]">
                <Link
                  href="/os/work"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Work Stream →
                </Link>
                <Link
                  href="/os/activity"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  Full Activity Log
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Role Toggle Switch */}
        <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setRole('engineer')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
              role === 'engineer'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Engineer</span>
          </button>
          <button
            onClick={() => setRole('ceo')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
              role === 'ceo'
                ? 'bg-purple-600 text-white shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">CEO</span>
          </button>
        </div>

        {/* User Identity / Logout */}
        {currentUser && (
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {currentUser.name.split(' ')[0]}
            </span>
            <button
              onClick={async () => {
                await fetch('/api/os/auth/logout', { method: 'POST' })
                window.location.href = '/os/login'
              }}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
