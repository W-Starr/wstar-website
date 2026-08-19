'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useOS } from '@/os/context/OSContext'
import { Source, SourceProvider, ProductId } from '@/os/types'
import { AttachSourceModal } from '@/os/components/AttachSourceModal'
import { GooglePickerButton } from '@/os/components/GooglePickerButton'
import { SourceAnalysisModal } from '@/os/components/SourceAnalysisModal'
import {
  HardDrive,
  FolderGit2,
  FileText,
  FileCode,
  Globe,
  Plus,
  Search,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Clock,
  Trash2,
  Filter,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  RefreshCw,
  X,
} from 'lucide-react'

export default function SourcesPage() {
  const { sources, addSource, deleteSource, products, proposals, workItems, decisions } = useOS()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProvider, setSelectedProvider] = useState<string>('all')
  const [selectedProduct, setSelectedProduct] = useState<string>('all')
  const [selectedAiStatus, setSelectedAiStatus] = useState<string>('all')
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false)
  const [selectedSourceForDetail, setSelectedSourceForDetail] = useState<Source | null>(null)
  const [isSyncingDrive, setIsSyncingDrive] = useState(false)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)

  // Direct Google Drive Picker Import Handler
  const handleDirectDrivePicked = (file: {
    id: string
    name: string
    mimeType: string
    url: string
    content?: string
    author?: string
  }) => {
    addSource({
      sourceType: 'gdrive',
      provider: 'google_drive',
      title: file.name,
      content: file.content,
      externalId: file.id,
      externalUrl: file.url,
      mimeType: file.mimeType,
      author: file.author,
      relatedProductId: 'ace-acad',
      aiStatus: 'pending',
      tags: ['Google Drive', 'Direct Import'],
    })
  }

  // Automatic Background Google Drive Sync
  const handleSyncCompanyDrive = async () => {
    setIsSyncingDrive(true)
    setSyncMessage(null)

    try {
      const res = await fetch('/api/os/sources/sync-drive', {
        method: 'POST',
      })

      const data = await res.json()
      if (data.success && data.syncedSources) {
        let addedCount = 0
        data.syncedSources.forEach((doc: any) => {
          // Avoid duplicate imports if externalId already exists
          const exists = sources.some((s) => s.externalId === doc.externalId)
          if (!exists) {
            addSource({
              sourceType: 'gdrive',
              provider: 'google_drive',
              title: doc.title,
              summary: doc.summary,
              content: doc.content,
              externalId: doc.externalId,
              externalUrl: doc.externalUrl,
              mimeType: doc.mimeType,
              author: doc.author,
              relatedProductId: doc.relatedProductId,
              aiStatus: 'pending',
              tags: doc.tags || ['Google Drive', 'Auto-Synced'],
            })
            addedCount++
          }
        })

        setSyncMessage(`Successfully scanned Google Drive: found ${data.totalDriveItems} items, imported ${addedCount} new documents!`)
      } else {
        setSyncMessage(data.error || 'Failed to sync Google Drive.')
      }
    } catch (err: any) {
      setSyncMessage(`Sync error: ${err.message}`)
    } finally {
      setIsSyncingDrive(false)
      setTimeout(() => setSyncMessage(null), 6000)
    }
  }

  // Stats calculation
  const totalSources = sources.length
  const gdriveCount = sources.filter((s) => s.provider === 'google_drive').length
  const analyzedCount = sources.filter((s) => s.aiStatus === 'analyzed').length
  const pendingCount = sources.filter((s) => s.aiStatus === 'pending').length

  // Filtered sources
  const filteredSources = useMemo(() => {
    return sources.filter((s) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchTitle = s.title.toLowerCase().includes(query)
        const matchSummary = s.summary?.toLowerCase().includes(query)
        const matchTags = s.tags?.some((t) => t.toLowerCase().includes(query))
        if (!matchTitle && !matchSummary && !matchTags) return false
      }

      // Provider
      if (selectedProvider !== 'all' && s.provider !== selectedProvider) {
        return false
      }

      // Product
      if (selectedProduct !== 'all' && s.relatedProductId !== selectedProduct) {
        return false
      }

      // AI Status
      if (selectedAiStatus !== 'all' && s.aiStatus !== selectedAiStatus) {
        return false
      }

      return true
    })
  }, [sources, searchQuery, selectedProvider, selectedProduct, selectedAiStatus])

  const getProviderIcon = (provider: SourceProvider) => {
    switch (provider) {
      case 'google_drive':
        return <FolderGit2 className="w-4 h-4 text-blue-500" />
      case 'github':
        return <FileCode className="w-4 h-4 text-purple-500" />
      case 'web':
        return <Globe className="w-4 h-4 text-emerald-500" />
      default:
        return <FileText className="w-4 h-4 text-amber-500" />
    }
  }

  const getProviderBadge = (provider: SourceProvider) => {
    switch (provider) {
      case 'google_drive':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
      case 'github':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
      case 'web':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
      default:
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Source Intelligence Layer
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20">
              Google Drive First
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
            Sources & Company Knowledge Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Canonical documents remain in Google Drive; WSTAR OS extracts, links, and executes organizational intelligence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleSyncCompanyDrive}
            disabled={isSyncingDrive}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingDrive ? 'animate-spin' : ''}`} />
            <span>{isSyncingDrive ? 'Scanning Company Drive...' : 'Sync Company Drive'}</span>
          </button>

          <GooglePickerButton onFilePicked={handleDirectDrivePicked} />

          <button
            onClick={() => setIsAttachModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-all hover:scale-102 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Attach Source Document</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      {syncMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{syncMessage}</span>
          </div>
          <button
            onClick={() => setSyncMessage(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Service Account Connected Banner */}
      <div className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Google Service Account:</span>
          <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400">wstar-os@wstar-os.iam.gserviceaccount.com</span>
          <span className="hidden sm:inline-block text-[11px] text-slate-400">• Permanent 24/7 background sync enabled</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          Editor Verified
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-medium">Total Sources</span>
            <HardDrive className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
            {totalSources}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Indexed company references</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-medium">Google Drive Files</span>
            <FolderGit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-heading">
            {gdriveCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Canonical source of truth</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-medium">AI Analyzed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-heading">
            {analyzedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Deconstructed into entities</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-medium">Pending Analysis</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-heading">
            {pendingCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Ready for intelligence extraction</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search sources, topics, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Provider Filter */}
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            aria-label="Filter by provider"
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Providers</option>
            <option value="google_drive">Google Drive</option>
            <option value="github">GitHub</option>
            <option value="web">Web URLs</option>
            <option value="manual">Manual Notes</option>
            <option value="upload">Uploads</option>
          </select>

          {/* Product Filter */}
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            aria-label="Filter by product"
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* AI Status Filter */}
          <select
            value={selectedAiStatus}
            onChange={(e) => setSelectedAiStatus(e.target.value)}
            aria-label="Filter by AI status"
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All AI Status</option>
            <option value="analyzed">Analyzed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSources.map((source) => {
          const linkedProposal = proposals.find((p) => source.relatedProposalIds?.includes(p.id))
          const hasExtracted = source.extractedEntities && source.extractedEntities.workstreams?.length > 0

          return (
            <div
              key={source.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Header Row: Provider & Sequence */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getProviderBadge(
                        source.provider
                      )}`}
                    >
                      {getProviderIcon(source.provider)}
                      <span className="capitalize">{source.provider.replace('_', ' ')}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">
                      {source.sourceNumber}
                    </span>
                  </div>

                  {/* AI Status Badge */}
                  {source.aiStatus === 'analyzed' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>Analyzed</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                      <Clock className="w-2.5 h-2.5" />
                      <span>Pending AI</span>
                    </span>
                  )}
                </div>

                {/* Title & Product */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {source.title}
                  </h3>
                  {source.relatedProductId && (
                    <span className="inline-block mt-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Scope: {source.relatedProductId}
                    </span>
                  )}
                </div>

                {/* Summary / Snippet */}
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {source.aiSummary || source.summary || source.content || 'No summary available.'}
                </p>

                {/* Extracted Workstream Preview if analyzed */}
                {hasExtracted && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>Extracted Workstreams</span>
                      <span className="text-blue-500 font-semibold">
                        {source.extractedEntities?.workstreams.length} Streams
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {source.extractedEntities?.workstreams.map((ws) => (
                        <span
                          key={ws.id}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                        >
                          {ws.name} ({ws.tasks.length} tasks)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                {source.externalUrl ? (
                  <a
                    href={source.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>Open in {source.provider === 'google_drive' ? 'Google Drive' : 'Source'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400">Internal Note</span>
                )}

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedSourceForDetail(source)}
                    title="AI Extract & Review"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Review & Extract</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Remove source "${source.title}" from WSTAR OS?`)) {
                        deleteSource(source.id)
                      }
                    }}
                    title="Delete source"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {filteredSources.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <HardDrive className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No sources matched your filters
            </div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Attach a Google Drive document, URL, or meeting note to index organizational knowledge.
            </p>
            <button
              onClick={() => setIsAttachModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Attach First Source</span>
            </button>
          </div>
        )}
      </div>

      {/* Attach Source Modal */}
      <AttachSourceModal
        isOpen={isAttachModalOpen}
        onClose={() => setIsAttachModalOpen(false)}
      />

      {/* Source AI Interpretation & Extraction Review Modal */}
      <SourceAnalysisModal
        isOpen={!!selectedSourceForDetail}
        source={selectedSourceForDetail}
        onClose={() => setSelectedSourceForDetail(null)}
      />
    </div>
  )
}
