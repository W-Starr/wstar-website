import { NextRequest, NextResponse } from 'next/server'
import { parseSourceUrl } from '@/os/lib/gdrive'
import { logger } from '@/os/lib/logger'
import { checkRateLimit } from '@/os/lib/rateLimit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
    const limit = checkRateLimit(`sources-parse:${ip}`, { maxRequests: 30, windowMs: 60000 })
    if (!limit.allowed) {
      return NextResponse.json({ success: false, error: 'Rate limit exceeded.' }, { status: 429 })
    }

    const body = await req.json()
    const { url, title, notes, productId } = body

    if (!url && !title && !notes) {
      return NextResponse.json(
        { success: false, error: 'Please provide either a URL, title, or note content.' },
        { status: 400 }
      )
    }

    if (url) {
      const parsed = parseSourceUrl(url)
      return NextResponse.json({
        success: true,
        source: {
          sourceType: parsed.sourceType,
          provider: parsed.provider,
          title: title || parsed.suggestedTitle,
          externalId: parsed.externalId,
          externalUrl: parsed.canonicalUrl,
          mimeType: parsed.mimeType,
          relatedProductId: productId || 'ace-acad',
          summary: notes || '',
        },
      })
    }

    // Manual Note / Upload fallback
    return NextResponse.json({
      success: true,
      source: {
        sourceType: 'manual_note',
        provider: 'manual',
        title: title || 'Executive Operational Note',
        relatedProductId: productId || 'ace-acad',
        content: notes || '',
        summary: notes ? notes.slice(0, 160) : '',
      },
    })
  } catch (error: any) {
    logger.error('Error parsing source', 'SOURCES-API', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process source' },
      { status: 500 }
    )
  }
}
