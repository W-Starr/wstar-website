'use client'

import React, { useState } from 'react'
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
    sanitySyncStatus,
    refreshFromSanity,
  } = useOS()

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)

  const openCriticalBugs = workItems.filter(
    (i) => i.priority === 'critical' && i.status !== 'done'
  ).length

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setSyncMessage('Fetching live data from Sanity...')
    await refreshFromSanity()
    setIsRefreshing(false)
    setSyncMessage('Sanity data updated')
    setTimeout(() => setSyncMessage(null), 3000)
  }

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 z-10 w-full">
      {/* Left: Mobile Hamburger + Context Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
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
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg border text-[11px] sm:text-xs font-medium transition-all ${
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

        {/* Notification Bell with Critical Alert */}
        <div className="relative">
          <button
            title={`${openCriticalBugs} critical bugs`}
            className="p-1.5 sm:p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 transition-colors"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {openCriticalBugs > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-red-500 text-white rounded-full text-[9px] sm:text-[10px] font-bold flex items-center justify-center animate-pulse">
                {openCriticalBugs}
              </span>
            )}
          </button>
        </div>

        {/* Role Toggle Switch */}
        <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setRole('engineer')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-all ${
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
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-all ${
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
              className="p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
