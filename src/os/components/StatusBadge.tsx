import React from 'react'
import { WorkItemStatus } from '../types'

interface StatusBadgeProps {
  status: WorkItemStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const configs: Record<
    WorkItemStatus,
    { label: string; bg: string; text: string; dot: string }
  > = {
    backlog: {
      label: 'Backlog',
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-600 dark:text-slate-300',
      dot: 'bg-slate-400',
    },
    todo: {
      label: 'Todo',
      bg: 'bg-blue-50 dark:bg-blue-950/50',
      text: 'text-blue-700 dark:text-blue-300',
      dot: 'bg-blue-500',
    },
    in_progress: {
      label: 'In Progress',
      bg: 'bg-amber-50 dark:bg-amber-950/50',
      text: 'text-amber-700 dark:text-amber-300',
      dot: 'bg-amber-500',
    },
    blocked: {
      label: 'Blocked',
      bg: 'bg-red-50 dark:bg-red-950/50',
      text: 'text-red-700 dark:text-red-300',
      dot: 'bg-red-500',
    },
    done: {
      label: 'Done',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
      text: 'text-emerald-700 dark:text-emerald-300',
      dot: 'bg-emerald-500',
    },
  }

  const config = configs[status] || configs.todo

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} border border-black/5 dark:border-white/5`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}
