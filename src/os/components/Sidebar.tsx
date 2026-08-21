'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useOS } from '../context/OSContext'
import {
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  MessageSquare,
  Compass,
  FileText,
  Activity,
  PlusCircle,
  ExternalLink,
  Search,
  FileCode,
  HardDrive,
  ChartGantt,
  FolderKanban,
} from 'lucide-react'

interface SidebarProps {
  onOpenQuickCapture: () => void
  onOpenCommandPalette: () => void
  onCloseMobile?: () => void
}

export function Sidebar({
  onOpenQuickCapture,
  onOpenCommandPalette,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname()
  const { workItems, feedbackItems, proposals, sources, projects } = useOS()

  const openBugsCount = workItems.filter(
    (i) => i.type === 'bug' && i.status !== 'done'
  ).length

  const newFeedbackCount = feedbackItems.filter((f) => f.status === 'new').length
  const proposalsCount = proposals?.length || 3
  const sourcesCount = sources?.length || 5
  const activeProjectsCount = projects.filter((p) => p.status === 'active' || p.status === 'at_risk').length

  const navItems = [
    {
      name: 'My Dashboard',
      href: '/os',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'Projects & Hub',
      href: '/os/projects',
      icon: FolderKanban,
      badge: activeProjectsCount > 0 ? `${activeProjectsCount} active` : null,
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
    },
    {
      name: 'Source Intelligence',
      href: '/os/sources',
      icon: HardDrive,
      badge: `${sourcesCount} docs`,
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    },
    {
      name: 'Work & Bugs',
      href: '/os/work',
      icon: CheckSquare,
      badge: openBugsCount > 0 ? `${openBugsCount} bugs` : null,
      badgeColor: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
    },
    {
      name: 'Ace Acad Command',
      href: '/os/ace-acad',
      icon: Sparkles,
      badge: '82% MVP',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    },
    {
      name: 'Timeline & Pulse',
      href: '/os/timeline',
      icon: ChartGantt,
      badge: null,
    },
    {
      name: 'Strategic Proposals',
      href: '/os/proposals',
      icon: FileCode,
      badge: `${proposalsCount} active`,
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
    },
    {
      name: 'Feedback Triage',
      href: '/os/feedback',
      icon: MessageSquare,
      badge: newFeedbackCount > 0 ? `${newFeedbackCount} new` : null,
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    },
    {
      name: 'Decisions (ADR)',
      href: '/os/decisions',
      icon: FileText,
      badge: null,
    },
    {
      name: 'Roadmap',
      href: '/os/roadmap',
      icon: Compass,
      badge: null,
    },
    {
      name: 'Activity Feed',
      href: '/os/activity',
      icon: Activity,
      badge: null,
    },
  ]

  const handleNavClick = () => {
    if (onCloseMobile) {
      onCloseMobile()
    }
  }

  return (
    <aside className="w-full lg:w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col h-full lg:h-screen lg:sticky lg:top-0 z-20 overflow-y-auto">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between">
        <Link href="/os" onClick={handleNavClick} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#196CA4] border border-[#25A6DD]/30 flex items-center justify-center text-white font-bold text-sm shadow-xs group-hover:scale-105 transition-transform font-heading">
            W
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 font-heading">
              WSTAR <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">OS</span>
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500">
              Ace Acad Core
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Action Button & Search Trigger */}
      <div className="px-4 pt-4 pb-2 space-y-2">
        <button
          onClick={onOpenQuickCapture}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#25A6DD] hover:bg-[#1c92c5] text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.97]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Quick Capture</span>
        </button>

        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span>Search / Jump...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 text-slate-400">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-600">
          Navigation
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={`flex items-center justify-between px-3 py-2.5 lg:py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer / Sanity Studio Link */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-900 space-y-2 mt-auto">
        <a
          href="http://localhost:3333"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs transition-colors group"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">Sanity Studio</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
        </a>

        <div className="px-3 py-1 flex items-center justify-between text-[11px] text-slate-400">
          <span>ABU Zaria 100L Cohort</span>
          <span className="font-mono">v1.0.0</span>
        </div>
      </div>
    </aside>
  )
}
