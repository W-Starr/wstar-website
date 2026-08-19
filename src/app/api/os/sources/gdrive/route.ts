import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { logger } from '@/os/lib/logger'
import { checkRateLimit } from '@/os/lib/rateLimit'

/**
 * Route for fetching Google Drive document metadata and plain text content
 */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
    const limit = checkRateLimit(`gdrive-fetch:${ip}`, { maxRequests: 30, windowMs: 60000 })
    if (!limit.allowed) {
      return NextResponse.json({ success: false, error: 'Rate limit exceeded.' }, { status: 429 })
    }

    const { fileId, accessToken } = await req.json()

    if (!fileId) {
      return NextResponse.json({ success: false, error: 'Missing fileId parameter.' }, { status: 400 })
    }

    let authClient: any = null

    // 1. If Client Access Token is passed from Google Picker (OAuth drive.file scope)
    if (accessToken) {
      const oauth2Client = new google.auth.OAuth2()
      oauth2Client.setCredentials({ access_token: accessToken })
      authClient = oauth2Client
    }
    // 2. Fallback to Service Account if configured in environment
    else if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      try {
        const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY)
        authClient = new google.auth.JWT({
          email: credentials.client_email,
          key: credentials.private_key,
          scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        })
      } catch (e: any) {
        logger.warn('Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY', 'GDRIVE-API', { error: e?.message || String(e) })
      }
    }
    // 3. Fallback to API key for public files
    else if (process.env.NEXT_PUBLIC_GOOGLE_API_KEY) {
      authClient = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
    }

    if (!authClient) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Google Drive authentication required. Provide an OAuth access token, Service Account Key, or API Key.',
        },
        { status: 401 }
      )
    }

    const drive = typeof authClient === 'string'
      ? google.drive({ version: 'v3', auth: authClient })
      : google.drive({ version: 'v3', auth: authClient })

    // Step A: Fetch File Metadata
    logger.info(`Fetching metadata for Google Drive file: ${fileId}`, 'GDRIVE-API')
    const fileRes = await drive.files.get({
      fileId,
      fields: 'id, name, mimeType, description, webViewLink, iconLink, modifiedTime, owners, size',
    })

    const file = fileRes.data
    const mimeType = file.mimeType || ''
    let content = ''

    // Step B: Fetch File Content Based on MIME Type
    if (mimeType === 'application/vnd.google-apps.document') {
      // Export Google Doc as plain text
      const exportRes = await drive.files.export(
        {
          fileId,
          mimeType: 'text/plain',
        },
        { responseType: 'text' }
      )
      content = typeof exportRes.data === 'string' ? exportRes.data : String(exportRes.data)
    } else if (mimeType === 'application/vnd.google-apps.spreadsheet') {
      // Export Sheet as CSV
      const exportRes = await drive.files.export(
        {
          fileId,
          mimeType: 'text/csv',
        },
        { responseType: 'text' }
      )
      content = typeof exportRes.data === 'string' ? exportRes.data : String(exportRes.data)
    } else if (mimeType === 'application/vnd.google-apps.presentation') {
      // Export Slides as plain text
      const exportRes = await drive.files.export(
        {
          fileId,
          mimeType: 'text/plain',
        },
        { responseType: 'text' }
      )
      content = typeof exportRes.data === 'string' ? exportRes.data : String(exportRes.data)
    } else if (
      mimeType.startsWith('text/') ||
      mimeType === 'application/json' ||
      mimeType === 'application/xml' ||
      mimeType === 'text/markdown'
    ) {
      // Direct raw text download
      const getRes = await drive.files.get(
        {
          fileId,
          alt: 'media',
        },
        { responseType: 'text' }
      )
      content = typeof getRes.data === 'string' ? getRes.data : String(getRes.data)
    } else {
      content = `[Binary Document: ${file.name} (${mimeType})]`
    }

    return NextResponse.json({
      success: true,
      metadata: {
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        description: file.description,
        webViewLink: file.webViewLink,
        iconLink: file.iconLink,
        modifiedTime: file.modifiedTime,
        author: file.owners?.[0]?.displayName || file.owners?.[0]?.emailAddress,
        size: file.size ? parseInt(file.size, 10) : undefined,
      },
      content,
    })
  } catch (error: any) {
    logger.error('Google Drive API Error', 'GDRIVE-API', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to retrieve document from Google Drive API',
      },
      { status: 500 }
    )
  }
}
