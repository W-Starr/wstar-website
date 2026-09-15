'use client'

import React, { useEffect, useState } from 'react'
import { useOS } from '../context/OSContext'
import { Announcement, AnnouncementCategory, AnnouncementStatus } from '../types'
import { X, Megaphone, ArrowRight, Trash2, FileText, UploadCloud, ExternalLink } from 'lucide-react'
import { showToast } from '../store/toastStore'

interface AnnouncementModalProps {
  isOpen: boolean
  onClose: () => void
  announcement?: Announcement | null
}

const CATEGORY_OPTIONS: { value: AnnouncementCategory; label: string }[] = [
  { value: 'announcement', label: 'Announcement' },
  { value: 'press-release', label: 'Press Release' },
  { value: 'publication', label: 'Publication' },
  { value: 'report', label: 'Report' },
]

export function AnnouncementModal({ isOpen, onClose, announcement }: AnnouncementModalProps) {
  const { addAnnouncement, updateAnnouncement, deleteAnnouncement } = useOS()
  const isEditMode = Boolean(announcement)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<AnnouncementCategory>('announcement')
  const [status, setStatus] = useState<AnnouncementStatus>('draft')
  const [excerpt, setExcerpt] = useState('')
  const [publishedAt, setPublishedAt] = useState('')
  const [author, setAuthor] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [existingPdf, setExistingPdf] = useState<{ url?: string; filename?: string; size?: number }>({})
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title)
      setCategory(announcement.category)
      setStatus(announcement.status)
      setExcerpt(announcement.excerpt)
      setPublishedAt(announcement.publishedAt?.split('T')[0] || new Date().toISOString().split('T')[0])
      setAuthor(announcement.author || '')
      setExistingPdf({
        url: announcement.pdfUrl,
        filename: announcement.pdfFilename,
        size: announcement.pdfSize,
      })
    } else {
      setTitle('')
      setCategory('announcement')
      setStatus('draft')
      setExcerpt('')
      setPublishedAt(new Date().toISOString().split('T')[0])
      setAuthor('')
      setExistingPdf({})
    }
    setFile(null)
    setUploadError(null)
  }, [announcement, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploadError(null)

    if (!title.trim() || !excerpt.trim()) return
    if (!isEditMode && !file) {
      setUploadError('Attach a PDF to publish this item.')
      return
    }

    let pdfData = existingPdf

    if (file) {
      setIsUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/os/announcements/upload', {
          method: 'POST',
          body: formData,
        })
        const json = await res.json()

        if (!res.ok || !json.success) {
          throw new Error(json.error || 'Upload failed')
        }

        pdfData = { url: json.url, filename: json.filename, size: json.size }
      } catch (err: any) {
        setIsUploading(false)
        setUploadError(err.message || 'Failed to upload PDF')
        return
      }
      setIsUploading(false)
    }

    const payload = {
      title: title.trim(),
      category,
      status,
      excerpt: excerpt.trim(),
      publishedAt: new Date(publishedAt).toISOString(),
      author: author.trim() || undefined,
      pdfUrl: pdfData.url,
      pdfFilename: pdfData.filename,
      pdfSize: pdfData.size,
    }

    if (isEditMode && announcement) {
      updateAnnouncement(announcement.id, payload)
      showToast('Publication Updated', 'success', title.trim())
    } else {
      addAnnouncement({ ...payload, slug: '' })
      showToast('Publication Created', 'success', title.trim())
    }

    onClose()
  }

  const handleDelete = () => {
    if (!announcement) return
    if (!window.confirm(`Delete "${announcement.title}"? This cannot be undone.`)) return
    deleteAnnouncement(announcement.id)
    showToast('Publication Deleted', 'info', announcement.title)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
      <div className="w-full max-w-2xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden text-slate-900 dark:text-white">
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                {isEditMode ? 'Edit Publication' : 'New Publication'}
              </h2>
              <p className="text-xs text-slate-500">
                Publish a PDF announcement, press release, or report to the public site.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. WSTAR Closes Pre-Seed Round to Accelerate AI Solutions"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Grid: Category, Status, Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AnnouncementCategory)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AnnouncementStatus)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              >
                <option value="draft">📝 Draft (hidden)</option>
                <option value="published">🌐 Published (live)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
              <input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Summary / Excerpt <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="A short summary shown on the public listing page..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Author / Attribution (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. WSTAR Technologies"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          {/* PDF Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              PDF File {!isEditMode && <span className="text-red-500">*</span>}
            </label>

            {existingPdf.url && !file && (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 mb-2">
                <a
                  href={existingPdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-medium hover:underline"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[280px]">{existingPdf.filename || 'Current PDF'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            <label className="flex items-center justify-center gap-2 px-3 py-3 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs cursor-pointer hover:border-blue-400 hover:text-blue-500 transition-colors">
              <UploadCloud className="w-4 h-4" />
              <span>{file ? file.name : existingPdf.url ? 'Replace PDF file...' : 'Choose PDF file...'}</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
            {uploadError && <p className="text-xs text-red-500 mt-1.5">{uploadError}</p>}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {isEditMode ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            ) : (
              <span className="text-[11px] text-slate-400">Visible on /publications once published</span>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || !excerpt.trim() || isUploading}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isUploading ? 'Uploading...' : isEditMode ? 'Save Changes' : 'Create Publication'}</span>
                {!isUploading && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
