import React from 'react'
import { WorkItemPriority } from '../types'
import { AlertCircle, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react'

interface PriorityBadgeProps {
  priority: WorkItemPriority
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const configs: Record<
    WorkItemPriority,
    { label: string; bg: string; text: string; dot: string; icon: any }
  > = {
    critical: {
      label: 'P0 Critical',
      bg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
      text: 'text-red-600 dark:text-red-400',
      dot: 'bg-red-500',
      icon: AlertCircle,
    },
    high: {
      label: 'P1 High',
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      text: 'text-amber-600 dark:text-amber-400',
      dot: 'bg-amber-500',
      icon: AlertTriangle,
    },
    medium: {
      label: 'P2 Medium',
      bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20',
      text: 'text-slate-600 dark:text-slate-300',
      dot: 'bg-slate-400',
      icon: ArrowUp,
    },
    low: {
      label: 'P3 Low',
      bg: 'bg-slate-500/5 text-slate-500 dark:text-slate-400 border-slate-500/10',
      text: 'text-slate-500 dark:text-slate-500',
      dot: 'bg-slate-500',
      icon: ArrowDown,
    },
  }

  const config = configs[priority] || configs.medium

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${config.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  )
}
