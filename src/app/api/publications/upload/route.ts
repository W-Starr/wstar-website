import { NextRequest, NextResponse } from 'next/server'
import { requirePublicationsSession } from '@/lib/publicationsAuth'
import { SANITY_WRITE_UNCONFIGURED_MESSAGE, sanityWriteClient } from '@/lib/sanityWrite'
import { logger } from '@/os/lib/logger'

const LOG_CONTEXT = 'NEWSROOM-UPLOAD'

const MAX_PDF_BYTES = 25 * 1024 * 1024 // 25MB — matches the OS announcement uploader
const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp']

/**
 * Uploads a PDF (kind=pdf) or a cover image (kind=image) to the Sanity asset
 * store using SANITY_API_WRITE_TOKEN, and returns the CDN URL to attach to a
 * publication document.
 */
export async function POST(req: NextRequest) {
  const guard = await requirePublicationsSession(req)
  if (guard.response) return guard.response

  if (!sanityWriteClient) {
    return NextResponse.json(
      { success: false, error: SANITY_WRITE_UNCONFIGURED_MESSAGE },
      { status: 503 }
    )
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')
    const kind = formData.get('kind') === 'image' ? 'image' : 'pdf'

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'No file provided under the "file" field.' },
        { status: 400 }
      )
    }

    if (kind === 'pdf') {
      if (file.type !== 'application/pdf') {
        return NextResponse.json(
          { success: false, error: 'Only PDF files are accepted for publications.' },
          { status: 400 }
        )
      }
      if (file.size > MAX_PDF_BYTES) {
        return NextResponse.json(
          { success: false, error: 'PDF exceeds the 25MB upload limit.' },
          { status: 400 }
        )
      }
    } else {
      if (!IMAGE_TYPES.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: 'Cover image must be a PNG, JPEG, or WebP file.' },
          { status: 400 }
        )
      }
      if (file.size > MAX_IMAGE_BYTES) {
        return NextResponse.json(
          { success: false, error: 'Cover image exceeds the 8MB upload limit.' },
          { status: 400 }
        )
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const asset = await sanityWriteClient.assets.upload(kind === 'image' ? 'image' : 'file', buffer, {
      filename: file.name,
      contentType: file.type,
    })

    logger.info(
      `${kind === 'image' ? 'Cover image' : 'PDF'} uploaded by ${guard.session.name}: ${file.name}`,
      LOG_CONTEXT
    )

    return NextResponse.json({
      success: true,
      assetId: asset._id,
      url: asset.url,
      filename: file.name,
      size: file.size,
    })
  } catch (error) {
    logger.error('Newsroom Studio asset upload failed', LOG_CONTEXT, error)

    // A read-scoped token uploads nothing; say so rather than "Upload failed".
    const message = error instanceof Error ? error.message : String(error)
    if (/insufficient permissions|unauthorized|invalid token/i.test(message)) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Sanity rejected the upload: SANITY_API_WRITE_TOKEN lacks write access. Create a token with Editor permissions in Sanity (Manage → API → Tokens).',
        },
        { status: 403 }
      )
    }

    return NextResponse.json({ success: false, error: 'Upload failed.' }, { status: 500 })
  }
}
