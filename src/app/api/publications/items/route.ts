import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requirePublicationsSession } from '@/lib/publicationsAuth'
import {
  SANITY_WRITE_UNCONFIGURED_MESSAGE,
  sanityWriteClient,
} from '@/lib/sanityWrite'
import { logger } from '@/os/lib/logger'

const LOG_CONTEXT = 'NEWSROOM-ITEMS'

/**
 * CRUD for `announcement` documents behind the Newsroom Studio gate.
 *
 * Documents are written in exactly the shape WSTAR OS already reads
 * (`src/os/context/OSContext.tsx` maps on `_id`), so items created here appear
 * in the OS announcements board and vice versa — one dataset, two surfaces.
 */

const CATEGORIES = ['announcement', 'press-release', 'publication', 'report'] as const
const STATUSES = ['draft', 'published'] as const

const publicationInput = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(200),
  slug: z.string().trim().max(200).optional(),
  category: z.enum(CATEGORIES),
  status: z.enum(STATUSES),
  excerpt: z.string().trim().min(10, 'Summary must be at least 10 characters').max(600),
  publishedAt: z.string().min(4),
  author: z.string().trim().max(120).optional(),
  pdfUrl: z.string().url().optional(),
  pdfFilename: z.string().max(255).optional(),
  pdfSize: z.number().int().nonnegative().optional(),
  coverImageUrl: z.string().url().optional(),
})

const createSchema = publicationInput
const patchSchema = publicationInput.partial().extend({ id: z.string().min(1) })
const deleteSchema = z.object({ id: z.string().min(1) })

const LIST_PROJECTION = `{
  _id, _updatedAt, title, slug, category, status, excerpt,
  publishedAt, author, pdfUrl, pdfFilename, pdfSize, coverImageUrl
}`

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 96)
}

function unconfigured() {
  return NextResponse.json(
    { success: false, error: SANITY_WRITE_UNCONFIGURED_MESSAGE },
    { status: 503 }
  )
}

/**
 * Turn a Sanity client error into something a founder can act on.
 *
 * The common failure in practice is a read-scoped token in
 * SANITY_API_WRITE_TOKEN: reads succeed, every mutation fails with
 * "Insufficient permissions". A generic message hides that completely.
 */
function sanityError(error: unknown, fallback: string): NextResponse {
  const message = error instanceof Error ? error.message : String(error)

  if (/insufficient permissions/i.test(message)) {
    return NextResponse.json(
      {
        success: false,
        error:
          'Sanity rejected the write: SANITY_API_WRITE_TOKEN is read-only. Create a token with Editor permissions in Sanity (Manage → API → Tokens) and redeploy.',
      },
      { status: 403 }
    )
  }

  if (/unauthorized|invalid token/i.test(message)) {
    return NextResponse.json(
      { success: false, error: 'Sanity rejected the token. Check SANITY_API_WRITE_TOKEN.' },
      { status: 403 }
    )
  }

  return NextResponse.json({ success: false, error: fallback }, { status: 502 })
}

function validationError(error: z.ZodError) {
  const first = error.issues[0]
  return NextResponse.json(
    { success: false, error: first?.message || 'Invalid publication payload.' },
    { status: 400 }
  )
}

/** Keep the public, ISR-cached listing in step with studio edits. */
function refreshPublicListing() {
  try {
    revalidatePath('/publications')
  } catch (error) {
    logger.warn('Could not revalidate /publications after a studio mutation', LOG_CONTEXT, {
      reason: String(error),
    })
  }
}

/** GET — every publication, drafts included. Studio-only. */
export async function GET(req: NextRequest) {
  const guard = await requirePublicationsSession(req)
  if (guard.response) return guard.response
  if (!sanityWriteClient) return unconfigured()

  try {
    const items = await sanityWriteClient.fetch(
      `*[_type == "announcement"] | order(publishedAt desc) ${LIST_PROJECTION}`
    )
    return NextResponse.json({ success: true, items })
  } catch (error) {
    logger.error('Failed to load publications for the studio', LOG_CONTEXT, error)
    return sanityError(error, 'Could not load publications from Sanity.')
  }
}

/** POST — create a publication. */
export async function POST(req: NextRequest) {
  const guard = await requirePublicationsSession(req)
  if (guard.response) return guard.response
  if (!sanityWriteClient) return unconfigured()

  const parsed = createSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return validationError(parsed.error)

  const data = parsed.data
  const _id = `announcement-${Date.now()}`

  try {
    const doc = await sanityWriteClient.create({
      _id,
      _type: 'announcement',
      id: _id,
      ...data,
      slug: data.slug?.trim() || slugify(data.title),
      publishedAt: new Date(data.publishedAt).toISOString(),
    })

    refreshPublicListing()
    logger.info(`Publication created by ${guard.session.name}: ${data.title}`, LOG_CONTEXT)

    return NextResponse.json({ success: true, item: doc }, { status: 201 })
  } catch (error) {
    logger.error('Failed to create publication', LOG_CONTEXT, error)
    return sanityError(error, 'Could not save the publication to Sanity.')
  }
}

/** PATCH — update a publication (also used by the inline publish/unpublish toggle). */
export async function PATCH(req: NextRequest) {
  const guard = await requirePublicationsSession(req)
  if (guard.response) return guard.response
  if (!sanityWriteClient) return unconfigured()

  const parsed = patchSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return validationError(parsed.error)

  const { id, ...updates } = parsed.data

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ success: false, error: 'Nothing to update.' }, { status: 400 })
  }

  if (updates.title && !updates.slug) {
    updates.slug = slugify(updates.title)
  }
  if (updates.publishedAt) {
    updates.publishedAt = new Date(updates.publishedAt).toISOString()
  }

  try {
    const doc = await sanityWriteClient
      .patch(id)
      .set(updates)
      .commit({ autoGenerateArrayKeys: true })

    refreshPublicListing()
    logger.info(`Publication updated by ${guard.session.name}: ${id}`, LOG_CONTEXT)

    return NextResponse.json({ success: true, item: doc })
  } catch (error) {
    logger.error(`Failed to update publication ${id}`, LOG_CONTEXT, error)
    return sanityError(error, 'Could not update the publication in Sanity.')
  }
}

/** DELETE — permanently remove a publication. */
export async function DELETE(req: NextRequest) {
  const guard = await requirePublicationsSession(req)
  if (guard.response) return guard.response
  if (!sanityWriteClient) return unconfigured()

  const parsed = deleteSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return validationError(parsed.error)

  try {
    await sanityWriteClient.delete(parsed.data.id)

    refreshPublicListing()
    logger.info(`Publication deleted by ${guard.session.name}: ${parsed.data.id}`, LOG_CONTEXT)

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error(`Failed to delete publication ${parsed.data.id}`, LOG_CONTEXT, error)
    return sanityError(error, 'Could not delete the publication in Sanity.')
  }
}
