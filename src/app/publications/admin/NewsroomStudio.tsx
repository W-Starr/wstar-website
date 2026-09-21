'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileText,
  Globe,
  Image as ImageIcon,
  Link2,
  Loader2,
  Lock,
  LogOut,
  Megaphone,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import LockScreen from './LockScreen'
import PublicationEditor from './PublicationEditor'
import styles from './studio.module.css'
import {
  CATEGORY_LABELS,
  CATEGORY_OPTIONS,
  draftFromItem,
  emptyDraft,
  formatDate,
  formatFileSize,
  type PublicationDraft,
  type PublicationItem,
  type StudioSession,
} from './types'

type Gate = 'checking' | 'locked' | 'unlocked'
type StatusFilter = 'all' | 'published' | 'draft'
type ToastTone = 'success' | 'error' | 'info'

interface Toast {
  id: number
  tone: ToastTone
  title: string
  detail?: string
}

interface EditorState {
  mode: 'create' | 'edit'
  id?: string
  draft: PublicationDraft
}

/**
 * The Newsroom Studio: a self-contained, password-gated surface for posting to
 * the public /publications page. Writes go through /api/publications/*, which
 * authenticates the scoped cookie and mutates Sanity with the write token.
 */
export default function NewsroomStudio() {
  const [gate, setGate] = useState<Gate>('checking')
  const [session, setSession] = useState<StudioSession | null>(null)

  const [items, setItems] = useState<PublicationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const [editor, setEditor] = useState<EditorState | null>(null)
  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  const [toasts, setToasts] = useState<Toast[]>([])
  const toastSeq = useRef(0)

  const pushToast = useCallback((tone: ToastTone, title: string, detail?: string) => {
    const id = ++toastSeq.current
    setToasts((current) => [...current, { id, tone, title, detail }])
    setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4200)
  }, [])

  /* ---------------------------------------------------------------- session */

  useEffect(() => {
    let cancelled = false

    fetch('/api/publications/auth')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        if (data.authenticated) {
          setSession(data.session)
          setGate('unlocked')
        } else {
          setGate('locked')
        }
      })
      .catch(() => !cancelled && setGate('locked'))

    return () => {
      cancelled = true
    }
  }, [])

  const loadItems = useCallback(async () => {
    setLoading(true)
    setLoadError(null)

    try {
      const res = await fetch('/api/publications/items')
      const data = await res.json()

      if (res.status === 401) {
        setGate('locked')
        setSession(null)
        return
      }
      if (!res.ok || !data.success) {
        setLoadError(data.error || 'Could not load publications.')
        return
      }

      setItems(data.items || [])
    } catch {
      setLoadError('Connection error while loading publications.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (gate === 'unlocked') loadItems()
  }, [gate, loadItems])

  const handleLock = async () => {
    await fetch('/api/publications/auth', { method: 'DELETE' }).catch(() => {})
    setSession(null)
    setItems([])
    setEditor(null)
    setGate('locked')
  }

  /* --------------------------------------------------------------- mutation */

  const saveDraft = async () => {
    if (!editor) return
    setSaving(true)

    const payload = {
      title: editor.draft.title.trim(),
      slug: editor.draft.slug.trim() || undefined,
      category: editor.draft.category,
      status: editor.draft.status,
      excerpt: editor.draft.excerpt.trim(),
      publishedAt: editor.draft.publishedAt,
      author: editor.draft.author.trim() || undefined,
      pdfUrl: editor.draft.pdfUrl,
      pdfFilename: editor.draft.pdfFilename,
      pdfSize: editor.draft.pdfSize,
      coverImageUrl: editor.draft.coverImageUrl,
    }

    try {
      const isEdit = editor.mode === 'edit' && editor.id
      const res = await fetch('/api/publications/items', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { id: editor.id, ...payload } : payload),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        pushToast('error', 'Could not save', data.error || 'Unknown error.')
        setSaving(false)
        return
      }

      pushToast(
        'success',
        isEdit ? 'Publication updated' : 'Publication created',
        payload.status === 'published' ? 'It is now live on /publications.' : 'Saved as a draft.'
      )
      setEditor(null)
      await loadItems()
    } catch {
      pushToast('error', 'Could not save', 'Connection error.')
    } finally {
      setSaving(false)
    }
  }

  const toggleStatus = async (item: PublicationItem) => {
    const nextStatus = item.status === 'published' ? 'draft' : 'published'

    if (nextStatus === 'published' && !item.pdfUrl) {
      pushToast('error', 'No PDF attached', 'Attach a PDF before publishing this item.')
      return
    }

    setBusyId(item._id)
    try {
      const res = await fetch('/api/publications/items', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item._id, status: nextStatus }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        pushToast('error', 'Could not update', data.error || 'Unknown error.')
        return
      }

      setItems((current) =>
        current.map((entry) => (entry._id === item._id ? { ...entry, status: nextStatus } : entry))
      )
      pushToast(
        'success',
        nextStatus === 'published' ? 'Published' : 'Unpublished',
        nextStatus === 'published' ? 'Now visible on /publications.' : 'Hidden from the public page.'
      )
    } catch {
      pushToast('error', 'Could not update', 'Connection error.')
    } finally {
      setBusyId(null)
    }
  }

  const deleteItem = async (id: string, title: string) => {
    setBusyId(id)
    try {
      const res = await fetch('/api/publications/items', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        pushToast('error', 'Could not delete', data.error || 'Unknown error.')
        return
      }

      setItems((current) => current.filter((entry) => entry._id !== id))
      setEditor(null)
      pushToast('success', 'Publication deleted', title)
    } catch {
      pushToast('error', 'Could not delete', 'Connection error.')
    } finally {
      setBusyId(null)
      setConfirmingId(null)
    }
  }

  const copyPdfLink = async (item: PublicationItem) => {
    if (!item.pdfUrl) return
    try {
      await navigator.clipboard.writeText(item.pdfUrl)
      pushToast('success', 'PDF link copied', item.pdfFilename || item.title)
    } catch {
      pushToast('error', 'Could not copy', 'Clipboard access was blocked.')
    }
  }

  /* --------------------------------------------------------------- derived */

  const stats = useMemo(() => {
    const published = items.filter((item) => item.status === 'published')
    const latest = published
      .map((item) => item.publishedAt)
      .filter(Boolean)
      .sort()
      .pop()

    return {
      total: items.length,
      published: published.length,
      drafts: items.length - published.length,
      latest,
    }
  }, [items])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return items.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false
      if (!query) return true

      return (
        item.title?.toLowerCase().includes(query) ||
        item.excerpt?.toLowerCase().includes(query) ||
        item.author?.toLowerCase().includes(query) ||
        item.pdfFilename?.toLowerCase().includes(query)
      )
    })
  }, [items, search, statusFilter, categoryFilter])

  /* ----------------------------------------------------------------- render */

  if (gate === 'checking') {
    return (
      <div className={styles.shell}>
        <div className={styles.glow} />
        <div className={styles.lockWrap}>
          <Loader2 size={26} className={styles.spin} color="var(--bright-blue)" />
        </div>
      </div>
    )
  }

  if (gate === 'locked') {
    return (
      <div className={styles.shell}>
        <div className={styles.glow} />
        <LockScreen
          onUnlocked={(unlocked) => {
            setSession(unlocked)
            setGate('unlocked')
          }}
        />
      </div>
    )
  }

  return (
    <div className={styles.shell}>
      <div className={styles.glow} />

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <div className={styles.brandMark}>
              <Megaphone size={18} color="#FFFFFF" />
            </div>
            <div className={styles.brandText}>
              <h1>Newsroom Studio</h1>
              <p>Post and manage WSTAR publications</p>
            </div>
          </div>

          <div className={styles.headerActions}>
            {session && (
              <div className={styles.sessionChip}>
                <span className={styles.avatar}>{session.initials}</span>
                <span className={styles.sessionName}>{session.name}</span>
              </div>
            )}
            <Link href="/publications" target="_blank" className={styles.ghostBtn}>
              <ExternalLink size={14} />
              <span>Public page</span>
            </Link>
            <button type="button" className={styles.ghostBtn} onClick={handleLock}>
              <LogOut size={14} />
              <span>Lock</span>
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* Stats */}
        <div className={styles.statGrid}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>
              <FileText size={13} />
              Total
            </p>
            <p className={styles.statValue}>{stats.total}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>
              <Globe size={13} />
              Live
            </p>
            <p className={`${styles.statValue} ${styles.statAccent}`}>{stats.published}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>
              <Pencil size={13} />
              Drafts
            </p>
            <p className={styles.statValue}>{stats.drafts}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>
              <Calendar size={13} />
              Last published
            </p>
            <p className={`${styles.statValue} ${styles.statValueSm}`}>
              {stats.latest ? formatDate(stats.latest) : 'Nothing live yet'}
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.searchField}>
            <Search size={15} />
            <input
              className={styles.searchInput}
              placeholder="Search by title, summary, author, or filename…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className={styles.segmented}>
            {(['all', 'published', 'draft'] as StatusFilter[]).map((value) => (
              <button
                key={value}
                type="button"
                className={`${styles.segment} ${
                  statusFilter === value ? styles.segmentActive : ''
                }`}
                onClick={() => setStatusFilter(value)}
              >
                {value === 'all' ? 'All' : value === 'published' ? 'Live' : 'Drafts'}
              </button>
            ))}
          </div>

          <select
            className={styles.select}
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            className={styles.ghostBtn}
            onClick={loadItems}
            disabled={loading}
            aria-label="Refresh"
          >
            <RefreshCw size={14} className={loading ? styles.spin : undefined} />
          </button>

          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => setEditor({ mode: 'create', draft: emptyDraft() })}
          >
            <Plus size={16} />
            <span>New publication</span>
          </button>
        </div>

        {loadError && (
          <div className={styles.alert} style={{ marginBottom: 18 }} role="alert">
            <AlertCircle size={15} />
            <span>{loadError}</span>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className={styles.rows}>
            <div className={styles.skeleton} />
            <div className={styles.skeleton} />
            <div className={styles.skeleton} />
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <Megaphone size={30} color="var(--gray-500)" />
            <h3>{items.length === 0 ? 'No publications yet' : 'Nothing matches those filters'}</h3>
            <p>
              {items.length === 0
                ? 'Post your first announcement, press release, or report — it appears on the public newsroom the moment you publish it.'
                : 'Try a different search term, status, or category.'}
            </p>
            {items.length === 0 && (
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => setEditor({ mode: 'create', draft: emptyDraft() })}
              >
                <Plus size={16} />
                <span>New publication</span>
              </button>
            )}
          </div>
        ) : (
          <div className={styles.rows}>
            {filtered.map((item) => {
              const isLive = item.status === 'published'
              const size = formatFileSize(item.pdfSize)
              const isBusy = busyId === item._id

              return (
                <article
                  key={item._id}
                  className={`${styles.row} ${isLive ? '' : styles.rowDraft}`}
                >
                  <div className={styles.thumb}>
                    {item.coverImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.coverImageUrl} alt="" />
                    ) : item.pdfUrl ? (
                      <FileText size={20} />
                    ) : (
                      <ImageIcon size={20} />
                    )}
                  </div>

                  <div className={styles.rowBody}>
                    <div className={styles.rowMetaTop}>
                      <span className={`${styles.badge} ${styles.badgeCategory}`}>
                        {CATEGORY_LABELS[item.category] || item.category}
                      </span>
                      <span
                        className={`${styles.badge} ${
                          isLive ? styles.badgeLive : styles.badgeDraft
                        }`}
                      >
                        {isLive ? 'Live' : 'Draft'}
                      </span>
                      {!item.pdfUrl && (
                        <span className={`${styles.badge} ${styles.badgeDraft}`}>No PDF</span>
                      )}
                    </div>

                    <h2 className={styles.rowTitle}>{item.title}</h2>
                    {item.excerpt && <p className={styles.rowExcerpt}>{item.excerpt}</p>}

                    <div className={styles.rowFoot}>
                      <div className={styles.rowMeta}>
                        <span>
                          <Calendar size={12} />
                          {formatDate(item.publishedAt)}
                        </span>
                        <span>{item.author || 'WSTAR Technologies'}</span>
                        {size && (
                          <span>
                            <FileText size={12} />
                            {size}
                          </span>
                        )}
                      </div>

                      <div className={styles.rowActions}>
                        <button
                          type="button"
                          className={styles.ghostBtn}
                          onClick={() => toggleStatus(item)}
                          disabled={isBusy}
                        >
                          {isBusy ? (
                            <Loader2 size={13} className={styles.spin} />
                          ) : isLive ? (
                            <Lock size={13} />
                          ) : (
                            <Globe size={13} />
                          )}
                          <span>{isLive ? 'Unpublish' : 'Publish'}</span>
                        </button>

                        <button
                          type="button"
                          className={styles.iconBtn}
                          onClick={() =>
                            setEditor({ mode: 'edit', id: item._id, draft: draftFromItem(item) })
                          }
                          aria-label={`Edit ${item.title}`}
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          type="button"
                          className={styles.iconBtn}
                          onClick={() => copyPdfLink(item)}
                          disabled={!item.pdfUrl}
                          aria-label="Copy PDF link"
                        >
                          <Link2 size={14} />
                        </button>

                        {confirmingId === item._id ? (
                          <>
                            <button
                              type="button"
                              className={styles.confirmDelete}
                              onClick={() => deleteItem(item._id, item.title)}
                              disabled={isBusy}
                            >
                              <Trash2 size={13} />
                              Confirm delete
                            </button>
                            <button
                              type="button"
                              className={styles.iconBtn}
                              onClick={() => setConfirmingId(null)}
                              aria-label="Cancel delete"
                            >
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                            onClick={() => setConfirmingId(item._id)}
                            aria-label={`Delete ${item.title}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>

      {editor && (
        <PublicationEditor
          mode={editor.mode}
          draft={editor.draft}
          saving={saving}
          onChange={(patch) =>
            setEditor((current) =>
              current ? { ...current, draft: { ...current.draft, ...patch } } : current
            )
          }
          onSubmit={saveDraft}
          onClose={() => setEditor(null)}
          onDelete={
            editor.mode === 'edit' && editor.id
              ? () => deleteItem(editor.id as string, editor.draft.title)
              : undefined
          }
        />
      )}

      {/* Toasts */}
      <div className={styles.toastStack}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${styles.toast} ${
              toast.tone === 'success'
                ? styles.toastSuccess
                : toast.tone === 'error'
                  ? styles.toastError
                  : ''
            }`}
            role="status"
          >
            {toast.tone === 'error' ? (
              <AlertCircle size={16} color="#F87171" />
            ) : (
              <CheckCircle2 size={16} color="#4ADE80" />
            )}
            <div className={styles.toastBody}>
              <strong>{toast.title}</strong>
              {toast.detail && <span>{toast.detail}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
