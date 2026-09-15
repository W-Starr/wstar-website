'use client'

import React, { useState } from 'react'
import { useOS } from '@/os/context/OSContext'
import { Announcement, AnnouncementStatus } from '@/os/types'
import { AnnouncementModal } from '@/os/components/AnnouncementModal'
import {
  Megaphone,
  Plus,
  Search,
  Calendar,
  FileText,
  ExternalLink,
} from 'lucide-react'

const CATEGORY_LABELS: Record<string, string> = {
  announcement: 'Announcement',
  'press-release': 'Press Release',
  publication: 'Publication',
  report: 'Report',
}

export default function AnnouncementsPage() {
  const { announcements } = useOS()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | AnnouncementStatus>('all')
  const [selected, setSelected] = useState<Announcement | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const filtered = announcements.filter((a) => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter
    if (!matchesStatus) return false

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        (a.author || '').toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-150 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Megaphone className="w-4 h-4" />
            <span>Public Newsroom</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1 font-heading">
            Publications &amp; Announcements
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage PDF announcements, press releases, and reports shown on the public{' '}
            <a href="/publications" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">
              /publications
            </a>{' '}
            page.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-all hover:scale-102 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Publication</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search publications by title, excerpt, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0 w-full sm:w-auto overflow-x-auto">
          {(['all', 'published', 'draft'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                statusFilter === s
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {s === 'all' ? 'All' : s === 'published' ? 'Published' : 'Draft'}
            </button>
          ))}
        </div>
      </div>

      {/* Publications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelected(item)}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {CATEGORY_LABELS[item.category] || item.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.status === 'published'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {item.status.toUpperCase()}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug font-heading">
                {item.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 mt-2 leading-relaxed">
                {item.excerpt}
              </p>

              {item.pdfUrl && (
                <a
                  href={item.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <FileText className="w-3 h-3" />
                  {item.pdfFilename || 'View PDF'}
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {item.publishedAt?.split('T')[0]}
              </span>
              <span>{item.author || 'WSTAR Technologies'}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
          <Megaphone className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No publications match your query</p>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your filters, or create a new publication.</p>
        </div>
      )}

      {/* Create Modal */}
      <AnnouncementModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

      {/* Edit Modal */}
      <AnnouncementModal
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        announcement={selected}
      />
    </div>
  )
}
