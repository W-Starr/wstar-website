export const CATEGORY_OPTIONS = [
  { value: 'announcement', label: 'Announcement' },
  { value: 'press-release', label: 'Press Release' },
  { value: 'publication', label: 'Publication' },
  { value: 'report', label: 'Report' },
] as const

export type PublicationCategory = (typeof CATEGORY_OPTIONS)[number]['value']
export type PublicationStatus = 'draft' | 'published'

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORY_OPTIONS.map((option) => [option.value, option.label])
)

/** A publication as returned by `/api/publications/items`. */
export interface PublicationItem {
  _id: string
  _updatedAt?: string
  title: string
  slug?: string
  category: PublicationCategory
  status: PublicationStatus
  excerpt: string
  publishedAt: string
  author?: string
  pdfUrl?: string
  pdfFilename?: string
  pdfSize?: number
  coverImageUrl?: string
}

/** The editable shape held by the drawer form. */
export interface PublicationDraft {
  title: string
  slug: string
  category: PublicationCategory
  status: PublicationStatus
  excerpt: string
  publishedAt: string
  author: string
  pdfUrl?: string
  pdfFilename?: string
  pdfSize?: number
  coverImageUrl?: string
}

export interface StudioSession {
  key: string
  name: string
  initials: string
}

export const EXCERPT_MAX = 600

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 96)
}

export function formatDate(value?: string): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatFileSize(bytes?: number): string | null {
  if (!bytes) return null
  const mb = bytes / (1024 * 1024)
  if (mb >= 1) return `${mb.toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

/** `YYYY-MM-DD` for `<input type="date">`, in the viewer's local timezone. */
export function toDateInputValue(value?: string): string {
  const date = value ? new Date(value) : new Date()
  const safe = Number.isNaN(date.getTime()) ? new Date() : date
  const offsetMs = safe.getTimezoneOffset() * 60_000
  return new Date(safe.getTime() - offsetMs).toISOString().split('T')[0]
}

export function emptyDraft(): PublicationDraft {
  return {
    title: '',
    slug: '',
    category: 'announcement',
    status: 'draft',
    excerpt: '',
    publishedAt: toDateInputValue(),
    author: 'WSTAR Technologies',
  }
}

export function draftFromItem(item: PublicationItem): PublicationDraft {
  return {
    title: item.title || '',
    slug: item.slug || '',
    category: item.category || 'announcement',
    status: item.status || 'draft',
    excerpt: item.excerpt || '',
    publishedAt: toDateInputValue(item.publishedAt),
    author: item.author || '',
    pdfUrl: item.pdfUrl,
    pdfFilename: item.pdfFilename,
    pdfSize: item.pdfSize,
    coverImageUrl: item.coverImageUrl,
  }
}
