import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { logger } from '@/os/lib/logger'
import { checkRateLimit } from '@/os/lib/rateLimit'
import { ProductId, Source, SourceType } from '@/os/types'

/**
 * Relevant document MIME types for AI organizational intelligence
 */
const ALLOWED_MIME_TYPES = new Set([
  'application/vnd.google-apps.document', // Google Docs
  'application/vnd.google-apps.presentation', // Google Slides
  'application/vnd.google-apps.spreadsheet', // Google Sheets
  'application/pdf', // PDFs
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
])

/**
 * Ignored folder names & paths that hold non-management assets (images, raw scans, templates, archives)
 */
const IGNORED_FOLDER_PATTERNS = [
  '01_brand_assets',
  'vector_svgs',
  'high_res_pngs',
  '01_cac_incorporation',
  'statutory_filings',
  '04_letterheads_&_correspondence/master_templates',
  'master_templates',
  '05_archive',
  'deprecated',
  'old_drafts',
  'binaries',
  'cad_schematics_raw',
]

/**
 * Permanent Automated Google Drive Synchronizer
 * Uses Google Service Account to crawl and selectively index only relevant strategic management documents.
 */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
    const limit = checkRateLimit(`gdrive-sync:${ip}`, { maxRequests: 10, windowMs: 60000 })
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please wait a moment.' },
        { status: 429 }
      )
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

    logger.info('Scanning Google Drive for strategic management documents...', 'GDRIVE-SYNC')

    // 1. Fetch all non-trashed files and folders accessible to Service Account
    const res = await drive.files.list({
      pageSize: 200,
      fields: 'files(id, name, mimeType, description, webViewLink, iconLink, modifiedTime, createdTime, parents, owners, size)',
      q: "trashed = false",
      orderBy: 'modifiedTime desc',
    })

    const files = res.data.files || []
    logger.info(`Fetched ${files.length} total items in Google Drive`, 'GDRIVE-SYNC')

    // 2. Build folder lookup map
    const folderMap = new Map<string, string>()
    files.forEach((f) => {
      if (f.mimeType === 'application/vnd.google-apps.folder' && f.id && f.name) {
        folderMap.set(f.id, f.name)
      }
    })

    // 3. Smart Relevance Filtering (Filters out images, templates, CAC filings, archives)
    const relevantDocFiles = files.filter((file) => {
      // Must not be a folder itself
      if (file.mimeType === 'application/vnd.google-apps.folder') return false

      // Check MIME type against allowed strategic document formats
      if (file.mimeType && !ALLOWED_MIME_TYPES.has(file.mimeType)) {
        return false
      }

      // Check file name extensions for image/binary noise
      const lowerFileName = (file.name || '').toLowerCase()
      if (
        lowerFileName.endsWith('.png') ||
        lowerFileName.endsWith('.jpg') ||
        lowerFileName.endsWith('.jpeg') ||
        lowerFileName.endsWith('.svg') ||
        lowerFileName.endsWith('.ico') ||
        lowerFileName.endsWith('.webp') ||
        lowerFileName.endsWith('.ai') ||
        lowerFileName.endsWith('.psd') ||
        lowerFileName.endsWith('.apk') ||
        lowerFileName.endsWith('.bin') ||
        lowerFileName.endsWith('.hex')
      ) {
        return false
      }

      // Check parent folder paths against ignored asset/archive categories
      let parentName = ''
      if (file.parents && file.parents.length > 0) {
        parentName = folderMap.get(file.parents[0]) || ''
      }
      const lowerParent = parentName.toLowerCase()

      for (const pattern of IGNORED_FOLDER_PATTERNS) {
        if (lowerParent.includes(pattern) || lowerFileName.includes(pattern)) {
          return false
        }
      }

      return true
    })

    logger.info(
      `Filtered ${files.length} total items down to ${relevantDocFiles.length} strategic management documents`,
      'GDRIVE-SYNC'
    )

    const syncedSources: Partial<Source>[] = []

    for (const file of relevantDocFiles) {
      if (!file.id || !file.name) continue

      let parentName = ''
      if (file.parents && file.parents.length > 0) {
        parentName = folderMap.get(file.parents[0]) || ''
      }

      // Determine product scope based on folder / file name
      let productId: ProductId = 'wstar-core'
      const lowerContext = `${file.name} ${parentName}`.toLowerCase()
      if (
        lowerContext.includes('ace-acad') ||
        lowerContext.includes('ace acad') ||
        lowerContext.includes('course') ||
        lowerContext.includes('syllabus') ||
        lowerContext.includes('student') ||
        lowerContext.includes('class rep')
      ) {
        productId = 'ace-acad'
      } else if (
        lowerContext.includes('plantiq') ||
        lowerContext.includes('plant') ||
        lowerContext.includes('iot') ||
        lowerContext.includes('solar') ||
        lowerContext.includes('crop')
      ) {
        productId = 'plantiq'
      }

      // Determine strategic tags based on folder taxonomy
      const tags: string[] = ['Google Drive']
      if (lowerContext.includes('executive') || lowerContext.includes('governance')) tags.push('Executive')
      if (lowerContext.includes('legal') || lowerContext.includes('ndpa') || lowerContext.includes('compliance')) tags.push('Legal')
      if (lowerContext.includes('strategy') || lowerContext.includes('business plan') || lowerContext.includes('proposal')) tags.push('Strategy')
      if (lowerContext.includes('engineering') || lowerContext.includes('srs') || lowerContext.includes('architecture') || lowerContext.includes('prd')) tags.push('Engineering')
      if (lowerContext.includes('hr') || lowerContext.includes('people') || lowerContext.includes('operations')) tags.push('Operations')
      if (lowerContext.includes('grant') || lowerContext.includes('funding') || lowerContext.includes('pitch')) tags.push('Finance')
      if (lowerContext.includes('playbook') || lowerContext.includes('growth') || lowerContext.includes('marketing')) tags.push('Growth')
      if (lowerContext.includes('partnership') || lowerContext.includes('aimoga') || lowerContext.includes('solutions')) tags.push('Partnerships')

      let content: string | undefined = undefined

      // Export plain text for Google Docs
      if (file.mimeType === 'application/vnd.google-apps.document') {
        try {
          const exportRes = await drive.files.export(
            { fileId: file.id, mimeType: 'text/plain' },
            { responseType: 'text' }
          )
          content = typeof exportRes.data === 'string' ? exportRes.data : String(exportRes.data)
        } catch (e) {
          content = file.description || undefined
        }
      }

      syncedSources.push({
        sourceType: 'gdrive',
        provider: 'google_drive',
        title: file.name,
        summary:
          file.description ||
          `Strategic management document located in ${parentName || 'WSTAR Corporate Drive'}.`,
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
      totalDriveItemsScanned: files.length,
      strategicDocumentsIndexed: syncedSources.length,
      syncedSources,
    })
  } catch (error: any) {
    logger.error('Drive Sync Error', 'GDRIVE-SYNC', { error: error.message || String(error) })
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to sync Google Drive files.' },
      { status: 500 }
    )
  }
}
