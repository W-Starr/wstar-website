'use client'

import { useCallback, useEffect, useRef, useState, type DragEvent, type FormEvent } from 'react'
import {
  AlertCircle,
  Calendar,
  Check,
  Eye,
  FileText,
  ImageIcon,
  Loader2,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react'
import styles from './studio.module.css'
import {
  CATEGORY_LABELS,
  CATEGORY_OPTIONS,
  EXCERPT_MAX,
  formatDate,
  formatFileSize,
  slugify,
  type PublicationCategory,
  type PublicationDraft,
  type PublicationStatus,
} from './types'

interface PublicationEditorProps {
  mode: 'create' | 'edit'
  draft: PublicationDraft
  saving: boolean
  onChange: (patch: Partial<PublicationDraft>) => void
  onSubmit: () => void
  onClose: () => void
  onDelete?: () => void
}

interface UploadState {
  progress: number
  active: boolean
}

/** Uploads through XHR so the drawer can show real progress on large PDFs. */
function uploadAsset(
  file: File,
  kind: 'pdf' | 'image',
  onProgress: (percent: number) => void
): Promise<{ url: string; filename: string; size: number }> {
  return new Promise((resolve, reject) => {
    const body = new FormData()
    body.append('file', file)
    body.append('kind', kind)

    const request = new XMLHttpRequest()
    request.open('POST', '/api/publications/upload')

    request.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }

    request.onload = () => {
      try {
        const json = JSON.parse(request.responseText)
        if (request.status >= 200 && request.status < 300 && json.success) {
          resolve({ url: json.url, filename: json.filename, size: json.size })
        } else {
          reject(new Error(json.error || 'Upload failed.'))
        }
      } catch {
        reject(new Error('Upload failed: unexpected server response.'))
      }
    }

    request.onerror = () => reject(new Error('Upload failed: network error.'))
    request.send(body)
  })
}

export default function PublicationEditor({
  mode,
  draft,
  saving,
  onChange,
  onSubmit,
  onClose,
  onDelete,
}: PublicationEditorProps) {
  const [dragging, setDragging] = useState(false)
  const [pdfUpload, setPdfUpload] = useState<UploadState>({ progress: 0, active: false })
  const [coverUploading, setCoverUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [slugTouched, setSlugTouched] = useState(mode === 'edit' && Boolean(draft.slug))

  const pdfInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  const busy = saving || pdfUpload.active || coverUploading

  const handleSubmit = useCallback(() => {
    setFormError(null)

    if (draft.title.trim().length < 3) {
      setFormError('Give the publication a title of at least 3 characters.')
      return
    }
    if (draft.excerpt.trim().length < 10) {
      setFormError('Write a summary of at least 10 characters — it is what readers see first.')
      return
    }
    if (draft.status === 'published' && !draft.pdfUrl) {
      setFormError('Attach a PDF before publishing. Save it as a draft if the file is not ready.')
      return
    }

    onSubmit()
  }, [draft, onSubmit])

  // Esc closes the drawer, Cmd/Ctrl+S saves.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) {
        onClose()
        return
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        if (!busy) handleSubmit()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [busy, handleSubmit, onClose])

  const handlePdf = async (file?: File | null) => {
    if (!file) return
    setUploadError(null)
    setPdfUpload({ progress: 0, active: true })

    try {
      const asset = await uploadAsset(file, 'pdf', (progress) =>
        setPdfUpload({ progress, active: true })
      )
      onChange({ pdfUrl: asset.url, pdfFilename: asset.filename, pdfSize: asset.size })
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed.')
    } finally {
      setPdfUpload({ progress: 0, active: false })
    }
  }

  const handleCover = async (file?: File | null) => {
    if (!file) return
    setUploadError(null)
    setCoverUploading(true)

    try {
      const asset = await uploadAsset(file, 'image', () => {})
      onChange({ coverImageUrl: asset.url })
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed.')
    } finally {
      setCoverUploading(false)
    }
  }

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setDragging(false)
    handlePdf(event.dataTransfer.files?.[0])
  }

  const handleTitleChange = (value: string) => {
    const patch: Partial<PublicationDraft> = { title: value }
    if (!slugTouched) patch.slug = slugify(value)
    onChange(patch)
  }

  const excerptLength = draft.excerpt.length
  const pdfSizeLabel = formatFileSize(draft.pdfSize)

  return (
    <>
      <div className={styles.scrim} onClick={() => !busy && onClose()} />

      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'create' ? 'New publication' : 'Edit publication'}
      >
        <header className={styles.drawerHead}>
          <div>
            <h2>{mode === 'create' ? 'New publication' : 'Edit publication'}</h2>
            <p>
              {draft.status === 'published'
                ? 'Live on wstartech.ng/publications once saved.'
                : 'Drafts stay hidden from the public newsroom.'}
            </p>
          </div>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={onClose}
            disabled={busy}
            aria-label="Close editor"
          >
            <X size={16} />
          </button>
        </header>

        <form
          className={styles.drawerBody}
          onSubmit={(event: FormEvent) => {
            event.preventDefault()
            handleSubmit()
          }}
        >
          {(formError || uploadError) && (
            <div className={styles.alert} role="alert">
              <AlertCircle size={15} />
              <span>{formError || uploadError}</span>
            </div>
          )}

          {/* Title */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="pub-title">
              <span>
                Title <span className={styles.required}>*</span>
              </span>
            </label>
            <input
              id="pub-title"
              ref={titleRef}
              className={styles.input}
              placeholder="e.g. WSTAR Closes Pre-Seed Round to Accelerate AI Solutions"
              value={draft.title}
              onChange={(event) => handleTitleChange(event.target.value)}
            />
          </div>

          {/* Slug */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="pub-slug">
              <span>URL slug</span>
              <span className={styles.counter}>Auto-generated from the title</span>
            </label>
            <div className={styles.slugRow}>
              <span className={styles.slugPrefix}>/publications/</span>
              <input
                id="pub-slug"
                className={styles.input}
                placeholder="wstar-pre-seed-round"
                value={draft.slug}
                onChange={(event) => {
                  setSlugTouched(true)
                  onChange({ slug: slugify(event.target.value) })
                }}
              />
            </div>
          </div>

          {/* Category / Status / Date */}
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="pub-category">
                <span>Category</span>
              </label>
              <select
                id="pub-category"
                className={styles.select}
                value={draft.category}
                onChange={(event) =>
                  onChange({ category: event.target.value as PublicationCategory })
                }
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="pub-status">
                <span>Visibility</span>
              </label>
              <select
                id="pub-status"
                className={styles.select}
                value={draft.status}
                onChange={(event) => onChange({ status: event.target.value as PublicationStatus })}
              >
                <option value="draft">Draft — hidden</option>
                <option value="published">Published — live</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="pub-date">
                <span>Date</span>
              </label>
              <input
                id="pub-date"
                type="date"
                className={styles.input}
                value={draft.publishedAt}
                onChange={(event) => onChange({ publishedAt: event.target.value })}
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="pub-excerpt">
              <span>
                Summary <span className={styles.required}>*</span>
              </span>
              <span
                className={`${styles.counter} ${
                  excerptLength > EXCERPT_MAX - 60 ? styles.counterWarn : ''
                }`}
              >
                {excerptLength}/{EXCERPT_MAX}
              </span>
            </label>
            <textarea
              id="pub-excerpt"
              className={styles.textarea}
              rows={4}
              maxLength={EXCERPT_MAX}
              placeholder="Two or three sentences that tell a reader why this matters. Shown on the public listing."
              value={draft.excerpt}
              onChange={(event) => onChange({ excerpt: event.target.value })}
            />
          </div>

          {/* Author */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="pub-author">
              <span>Attribution</span>
              <span className={styles.counter}>Optional</span>
            </label>
            <input
              id="pub-author"
              className={styles.input}
              placeholder="WSTAR Technologies"
              value={draft.author}
              onChange={(event) => onChange({ author: event.target.value })}
            />
          </div>

          {/* PDF */}
          <div className={styles.field}>
            <label className={styles.label}>
              <span>
                PDF document <span className={styles.required}>*</span>
              </span>
              <span className={styles.counter}>Max 25MB</span>
            </label>

            {draft.pdfUrl && !pdfUpload.active ? (
              <div className={styles.filePill}>
                <span className={styles.fileInfo}>
                  <FileText size={16} />
                  <strong>{draft.pdfFilename || 'Attached PDF'}</strong>
                  {pdfSizeLabel && <span>· {pdfSizeLabel}</span>}
                </span>
                <span style={{ display: 'flex', gap: 6 }}>
                  <a
                    href={draft.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.iconBtn}
                    aria-label="Open attached PDF"
                  >
                    <Eye size={15} />
                  </a>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => pdfInputRef.current?.click()}
                    aria-label="Replace PDF"
                  >
                    <UploadCloud size={15} />
                  </button>
                </span>
              </div>
            ) : (
              <label
                className={`${styles.dropzone} ${dragging ? styles.dropzoneActive : ''}`}
                onDragOver={(event) => {
                  event.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                {pdfUpload.active ? (
                  <>
                    <Loader2 size={20} className={styles.spin} />
                    <span>Uploading… {pdfUpload.progress}%</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={20} />
                    <span>Drop a PDF here, or click to browse</span>
                    <span className={styles.dropzoneHint}>PDF only · up to 25MB</span>
                  </>
                )}
                {/* Its own input so the label click target stays inside the dropzone. */}
                <input
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={(event) => handlePdf(event.target.files?.[0])}
                />
              </label>
            )}

            {pdfUpload.active && (
              <div className={styles.progressTrack}>
                <div className={styles.progressBar} style={{ width: `${pdfUpload.progress}%` }} />
              </div>
            )}

            {/* Drives the "Replace PDF" button once a file is attached. */}
            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf"
              hidden
              onChange={(event) => handlePdf(event.target.files?.[0])}
            />
          </div>

          {/* Cover image */}
          <div className={styles.field}>
            <label className={styles.label}>
              <span>Cover image</span>
              <span className={styles.counter}>Optional · PNG, JPEG or WebP · max 8MB</span>
            </label>

            {draft.coverImageUrl ? (
              <div className={styles.filePill}>
                <span className={styles.fileInfo}>
                  <ImageIcon size={16} />
                  <strong>Cover attached</strong>
                </span>
                <button
                  type="button"
                  className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                  onClick={() => onChange({ coverImageUrl: undefined })}
                  aria-label="Remove cover image"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={styles.ghostBtn}
                onClick={() => coverInputRef.current?.click()}
                disabled={coverUploading}
              >
                {coverUploading ? (
                  <Loader2 size={14} className={styles.spin} />
                ) : (
                  <ImageIcon size={14} />
                )}
                <span>{coverUploading ? 'Uploading…' : 'Add cover image'}</span>
              </button>
            )}

            <input
              ref={coverInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              hidden
              onChange={(event) => handleCover(event.target.files?.[0])}
            />
          </div>

          {/* Live preview of the public card */}
          <div className={styles.previewWrap}>
            <p className={styles.previewLabel}>
              <Eye size={13} />
              Public preview
            </p>
            <div className={styles.previewCard}>
              <div className={styles.previewTop}>
                <span className={`${styles.badge} ${styles.badgeCategory}`}>
                  {CATEGORY_LABELS[draft.category]}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>
                  <Calendar size={12} style={{ verticalAlign: '-2px', marginRight: 6 }} />
                  {formatDate(draft.publishedAt)}
                </span>
              </div>
              <h3 className={styles.previewTitle}>
                {draft.title.trim() || 'Your publication title appears here'}
              </h3>
              <p className={styles.previewExcerpt}>
                {draft.excerpt.trim() ||
                  'Your summary appears here — this is the first thing a reader sees on the newsroom.'}
              </p>
              <div className={styles.previewFoot}>
                <span>
                  {draft.author.trim() || 'WSTAR Technologies'}
                  {pdfSizeLabel ? ` · PDF · ${pdfSizeLabel}` : ''}
                </span>
                <span className={styles.previewCta}>
                  <FileText size={14} />
                  View PDF
                </span>
              </div>
            </div>
          </div>
        </form>

        <footer className={styles.drawerFoot}>
          {mode === 'edit' && onDelete ? (
            <button
              type="button"
              className={`${styles.ghostBtn} ${styles.dangerBtn}`}
              onClick={onDelete}
              disabled={busy}
            >
              <Trash2 size={14} />
              Delete
            </button>
          ) : (
            <span className={styles.hint}>
              <span className={styles.kbd}>Esc</span> to close ·{' '}
              <span className={styles.kbd}>Ctrl/⌘ S</span> to save
            </span>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className={styles.ghostBtn} onClick={onClose} disabled={busy}>
              Cancel
            </button>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={handleSubmit}
              disabled={busy}
            >
              {saving ? <Loader2 size={15} className={styles.spin} /> : <Check size={15} />}
              <span>
                {saving
                  ? 'Saving…'
                  : draft.status === 'published'
                    ? 'Save & publish'
                    : 'Save draft'}
              </span>
            </button>
          </div>
        </footer>
      </aside>
    </>
  )
}
