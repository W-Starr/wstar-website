import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { logger } from '@/os/lib/logger'
import { checkRateLimit } from '@/os/lib/rateLimit'
import { ProductId, Source, SourceType } from '@/os/types'

/**
 * Permanent Automated Google Drive Synchronizer
 * Uses Google Service Account to crawl and index company Drive folders.
 */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
    const limit = checkRateLimit(`gdrive-sync:${ip}`, { maxRequests: 10, windowMs: 60000 })
    if (!limit.allowed) {
      return NextResponse.json({ success: false, error: 'Rate limit exceeded. Please wait a moment.' }, { status: 429 })
    }

    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not configured.',
        },
        { status: 400 }
      )
    }

    let credentials: any
    try {
      // Remove wrapping single quotes if present
      let rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY.trim()
      if (rawKey.startsWith("'") && rawKey.endsWith("'")) {
        rawKey = rawKey.slice(1, -1)
      }
      credentials = JSON.parse(rawKey)
    } catch (e: any) {
      logger.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY', 'GDRIVE-SYNC', { error: e?.message || String(e) })
      return NextResponse.json(
        { success: false, error: 'Invalid GOOGLE_SERVICE_ACCOUNT_KEY JSON format.' },
        { status: 500 }
      )
    }

    const authClient = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: [
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/drive.metadata.readonly',
      ],
    })

    const drive = google.drive({ version: 'v3', auth: authClient })

    logger.info('Querying Google Drive files via Service Account...', 'GDRIVE-SYNC')

    // 1. Fetch all files accessible to Service Account
    const res = await drive.files.list({
      pageSize: 150,
      fields: 'files(id, name, mimeType, description, webViewLink, iconLink, modifiedTime, createdTime, parents, owners, size)',
      q: "trashed = false",
      orderBy: 'modifiedTime desc',
    })

    const files = res.data.files || []
    logger.info(`Found ${files.length} items in Google Drive`, 'GDRIVE-SYNC')

    // 2. Build folder lookup map
    const folderMap = new Map<string, string>()
    files.forEach((f) => {
      if (f.mimeType === 'application/vnd.google-apps.folder' && f.id && f.name) {
        folderMap.set(f.id, f.name)
      }
    })

    // 3. Process documents (filter out empty folders)
    const docFiles = files.filter((f) => f.mimeType !== 'application/vnd.google-apps.folder')
    const syncedSources: Partial<Source>[] = []

    for (const file of docFiles) {
      if (!file.id || !file.name) continue

      let parentName = ''
      if (file.parents && file.parents.length > 0) {
        parentName = folderMap.get(file.parents[0]) || ''
      }

      // Determine product scope based on folder / file name
      let productId: ProductId = 'wstar-core'
      const lowerName = `${file.name} ${parentName}`.toLowerCase()
      if (lowerName.includes('ace-acad') || lowerName.includes('ace acad') || lowerName.includes('course') || lowerName.includes('syllabus') || lowerName.includes('student')) {
        productId = 'ace-acad'
      } else if (lowerName.includes('plantiq') || lowerName.includes('plant') || lowerName.includes('iot') || lowerName.includes('solar')) {
        productId = 'plantiq'
      }

      // Determine tags based on folder taxonomy
      const tags: string[] = ['Google Drive']
      if (lowerName.includes('executive') || lowerName.includes('governance') || lowerName.includes('cac')) tags.push('Executive')
      if (lowerName.includes('legal') || lowerName.includes('agreement') || lowerName.includes('nda')) tags.push('Legal')
      if (lowerName.includes('strategy') || lowerName.includes('business plan') || lowerName.includes('proposal')) tags.push('Strategy')
      if (lowerName.includes('design') || lowerName.includes('ui') || lowerName.includes('brand')) tags.push('Design')
      if (lowerName.includes('engineering') || lowerName.includes('srs') || lowerName.includes('architecture')) tags.push('Engineering')
      if (lowerName.includes('hr') || lowerName.includes('people') || lowerName.includes('operations')) tags.push('Operations')
      if (lowerName.includes('partnership') || lowerName.includes('aimoga') || lowerName.includes('solutions')) tags.push('Partnerships')

      let content: string | undefined = undefined

      // Attempt text export for Google Docs
      if (file.mimeType === 'application/vnd.google-apps.document') {
        try {
          const exportRes = await drive.files.export(
            { fileId: file.id, mimeType: 'text/plain' },
            { responseType: 'text' }
          )
          content = typeof exportRes.data === 'string' ? exportRes.data : String(exportRes.data)
        } catch (e) {
          // Fallback if export fails
          content = file.description || undefined
        }
      }

      syncedSources.push({
        sourceType: 'gdrive',
        provider: 'google_drive',
        title: file.name,
        summary: file.description || `Google Drive document located in ${parentName || 'WSTAR Corporate Drive'}.`,
        content,
        externalId: file.id,
        externalUrl: file.webViewLink || `https://docs.google.com/document/d/${file.id}/edit`,
        mimeType: file.mimeType || undefined,
        author: file.owners?.[0]?.displayName || file.owners?.[0]?.emailAddress || 'WSTAR Team',
        relatedProductId: productId,
        aiStatus: 'pending',
        tags,
      })
    }

    return NextResponse.json({
      success: true,
      totalDriveItems: files.length,
      syncedDocumentsCount: syncedSources.length,
      syncedSources,
      foldersFound: Array.from(folderMap.values()),
    })
  } catch (error: any) {
    logger.error('Drive Sync Error', 'GDRIVE-SYNC', { error: error.message || String(error) })
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to sync Google Drive files.' },
      { status: 500 }
    )
  }
}
