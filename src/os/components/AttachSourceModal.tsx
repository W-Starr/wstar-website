'use client'

import React, { useState, useEffect } from 'react'
import { useOS } from '../context/OSContext'
import { parseSourceUrl, ParsedSourceUrl } from '../lib/gdrive'
import { ProductId, SourceType, SourceProvider } from '../types'
import {
  X,
  Link as LinkIcon,
  Sparkles,
  FileText,
  FileCode,
  FolderGit2,
  Globe,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HardDrive,
} from 'lucide-react'

interface AttachSourceModalProps {
  isOpen: boolean
  onClose: () => void
  onSourceAttached?: (sourceId: string, shouldAnalyze: boolean) => void
  initialUrl?: string
  defaultProductId?: ProductId
}

import { GooglePickerButton } from './GooglePickerButton'

export function AttachSourceModal({
  isOpen,
  onClose,
  onSourceAttached,
  initialUrl = '',
  defaultProductId = 'ace-acad',
}: AttachSourceModalProps) {
  const { addSource, products } = useOS()

  const [rawUrl, setRawUrl] = useState(initialUrl)
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [productId, setProductId] = useState<ProductId>(defaultProductId)
  const [parsedInfo, setParsedInfo] = useState<ParsedSourceUrl | null>(null)
  const [activeTab, setActiveTab] = useState<'link' | 'note'>('link')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle file picked from Google Drive Picker
  const handleGoogleDrivePicked = (file: {
    id: string
    name: string
    mimeType: string
    url: string
    content?: string
    author?: string
  }) => {
    setRawUrl(file.url)
    setTitle(file.name)
    if (file.content) {
      setContent(file.content)
    }
  }

  // Real-time URL Detection
  useEffect(() => {
    if (activeTab === 'link' && rawUrl.trim()) {
      const parsed = parseSourceUrl(rawUrl)
      setParsedInfo(parsed)
      if (!title || title === 'Google Document' || title === 'Google Drive File' || title.endsWith('Reference')) {
        setTitle(parsed.suggestedTitle)
      }
    } else {
      setParsedInfo(null)
    }
  }, [rawUrl, activeTab])

  if (!isOpen) return null

  const handleSubmit = (shouldAnalyze = false) => {
    if (activeTab === 'link' && !rawUrl.trim() && !title.trim()) return
    if (activeTab === 'note' && !title.trim() && !content.trim()) return

    setIsSubmitting(true)

    try {
      let sourceType: SourceType = 'manual_note'
      let provider: SourceProvider = 'manual'
      let externalUrl = rawUrl.trim() || undefined
      let externalId: string | undefined = undefined
      let mimeType: string | undefined = undefined

      if (activeTab === 'link' && parsedInfo?.isValid) {
        sourceType = parsedInfo.sourceType
        provider = parsedInfo.provider
        externalId = parsedInfo.externalId
        externalUrl = parsedInfo.canonicalUrl
        mimeType = parsedInfo.mimeType
      }

      const newSource = addSource({
        sourceType,
        provider,
        title: title.trim() || (parsedInfo?.suggestedTitle ?? 'Untitled Source'),
        summary: summary.trim() || undefined,
        content: content.trim() || undefined,
        externalId,
        externalUrl,
        mimeType,
        relatedProductId: productId,
        aiStatus: 'pending',
        tags: [productId, provider === 'google_drive' ? 'Google Drive' : 'Reference'],
      })

      if (onSourceAttached) {
        onSourceAttached(newSource.id, shouldAnalyze)
      }

      onClose()
    } catch (err) {
      console.error('Failed to attach source:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col font-sans">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
                Attach External Source
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Link Google Drive proposals, strategy docs, or operational notes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('link')}
              className={`pb-2 text-xs font-semibold px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'link'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Google Drive / URL Link</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('note')}
              className={`pb-2 text-xs font-semibold px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'note'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Meeting Note / Text</span>
            </button>
          </div>

          {/* Interactive Google Drive Picker trigger */}
          <div className="pb-2">
            <GooglePickerButton onFilePicked={handleGoogleDrivePicked} />
          </div>
        </div>

        {/* Body Form */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {activeTab === 'link' ? (
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Google Drive or External URL <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Paste URL or use button above</span>
                </div>
                <div className="relative">
                  <input
                    type="url"
                    required
                    placeholder="https://docs.google.com/document/d/... or GitHub / Web link"
                    value={rawUrl}
                    onChange={(e) => setRawUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* URL Detection Banner */}
              {parsedInfo && parsedInfo.isValid && (
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-200 animate-in fade-in">
                  {parsedInfo.provider === 'google_drive' ? (
                    <FolderGit2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  ) : parsedInfo.provider === 'github' ? (
                    <FileCode className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                  ) : (
                    <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold flex items-center gap-1.5">
                      <span>Detected: {parsedInfo.provider === 'google_drive' ? 'Google Drive Document' : parsedInfo.provider}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    </div>
                    {parsedInfo.externalId && (
                      <p className="text-[10px] text-blue-700 dark:text-blue-300 font-mono truncate">
                        ID: {parsedInfo.externalId}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Meeting Notes / Raw Text Content <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                required
                placeholder="Paste transcript, meeting decisions, or unstructured strategy thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Source Title
            </label>
            <input
              type="text"
              placeholder="e.g. Proposal: Cohort-Based UGC & The 'Class Rep' Model"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Product Scope */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Related Product Scope
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value as ProductId)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
          </div>

          {/* Summary / Context Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Context Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="Brief context or key reason this document was created..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              Attach Source
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-all hover:scale-102 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Attach & AI Analyze</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
