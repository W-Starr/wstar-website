'use client'

import React, { useState } from 'react'
import { useOS } from '../context/OSContext'
import { Role } from '../types'
import { ShieldCheck, UserCheck, RefreshCw, Bell, Cloud, CloudOff, CloudRain, CheckCircle, Sparkles } from 'lucide-react'

interface TopHeaderProps {
  title?: string
}

export function TopHeader({ title }: TopHeaderProps) {
  const {
    role,
    setRole,
    resetToInitialSeed,
    workItems,
    sanitySyncStatus,
    seedSanityCloud,
    refreshFromSanity,
  } = useOS()

  const [isSeeding, setIsSeeding] = useState(false)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)

  const openCriticalBugs = workItems.filter(
    (i) => i.priority === 'critical' && i.status !== 'done'
  ).length

  const handleSeedOrSync = async () => {
    setIsSeeding(true)
    setSyncMessage('Connecting to Sanity dataset...')
    const result = await seedSanityCloud()
    setSyncMessage(result.message)
    setIsSeeding(false)
    setTimeout(() => setSyncMessage(null), 5000)
  }

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Title / Context */}
      <div>
        <h1 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          {title || 'Company Operating System'}
          <span className="text-[11px] font-normal text-slate-400">
            • {role === 'engineer' ? 'Abdulaziz View (Engineering & Tech)' : 'Ibrahim View (Executive & Strategy)'}
          </span>
        </h1>
      </div>

      {/* Role Switcher & Controls */}
      <div className="flex items-center gap-3">
        {/* Sanity Cloud Status / Seed Action */}
        <div className="relative">
          <button
            onClick={handleSeedOrSync}
            disabled={isSeeding}
            title="Sanity Cloud Sync: Real-time multi-device sync for Ibrahim & Abdulaziz"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              sanitySyncStatus === 'synced'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                : sanitySyncStatus === 'syncing' || isSeeding
                ? 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 animate-pulse'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
            }`}
          >
            {sanitySyncStatus === 'synced' ? (
              <>
                <Cloud className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden sm:inline">Sanity Live</span>
              </>
            ) : isSeeding || sanitySyncStatus === 'syncing' ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
                <span className="hidden sm:inline">Syncing Cloud...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Seed Sanity Cloud</span>
              </>
            )}
          </button>

          {syncMessage && (
            <div className="absolute right-0 top-full mt-2 w-72 p-2.5 rounded-lg bg-slate-900 text-white text-[11px] shadow-xl border border-slate-800 z-50 animate-in fade-in">
              {syncMessage}
            </div>
          )}
        </div>

        {/* Reset / Sync button */}
        <button
          onClick={() => {
            if (confirm('Reset workspace to the freshly discovered Ace Acad codebase seed data?')) {
              resetToInitialSeed()
            }
          }}
          title="Reset to Ace Acad Discovery Seed"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 text-xs transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sync Code Seed</span>
        </button>

        {/* Notification Bell with Critical Alert */}
        <div className="relative">
          <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 transition-colors">
            <Bell className="w-4 h-4" />
            {openCriticalBugs > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {openCriticalBugs}
              </span>
            )}
          </button>
        </div>

        {/* Perspective Role Switcher */}
        <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setRole('engineer')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              role === 'engineer'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Abdulaziz</span>
          </button>

          <button
            onClick={() => setRole('ceo')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              role === 'ceo'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Ibrahim (CEO)</span>
          </button>
        </div>
      </div>
    </header>
  )
}
