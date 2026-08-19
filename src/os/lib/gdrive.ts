import { SourceType, SourceProvider } from '@/os/types'

export interface ParsedSourceUrl {
  isValid: boolean
  provider: SourceProvider
  sourceType: SourceType
  externalId?: string
  canonicalUrl: string
  suggestedTitle: string
  mimeType?: string
}

/**
 * Parses any pasted URL or document link to extract metadata and Drive IDs
 */
export function parseSourceUrl(rawUrl: string): ParsedSourceUrl {
  const url = rawUrl.trim()

  if (!url) {
    return {
      isValid: false,
      provider: 'manual',
      sourceType: 'manual_note',
      canonicalUrl: '',
      suggestedTitle: 'Untitled Note',
    }
  }

  // 1. Google Docs
  const docMatch = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/i)
  if (docMatch) {
    const fileId = docMatch[1]
    return {
      isValid: true,
      provider: 'google_drive',
      sourceType: 'gdrive',
      externalId: fileId,
      canonicalUrl: `https://docs.google.com/document/d/${fileId}/edit`,
      suggestedTitle: 'Google Document',
      mimeType: 'application/vnd.google-apps.document',
    }
  }

  // 2. Google Spreadsheets
  const sheetMatch = url.match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/i)
  if (sheetMatch) {
    const fileId = sheetMatch[1]
    return {
      isValid: true,
      provider: 'google_drive',
      sourceType: 'gdrive',
      externalId: fileId,
      canonicalUrl: `https://docs.google.com/spreadsheets/d/${fileId}/edit`,
      suggestedTitle: 'Google Spreadsheet',
      mimeType: 'application/vnd.google-apps.spreadsheet',
    }
  }

  // 3. Google Presentations / Slides
  const slideMatch = url.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/i)
  if (slideMatch) {
    const fileId = slideMatch[1]
    return {
      isValid: true,
      provider: 'google_drive',
      sourceType: 'gdrive',
      externalId: fileId,
      canonicalUrl: `https://docs.google.com/presentation/d/${fileId}/edit`,
      suggestedTitle: 'Google Presentation',
      mimeType: 'application/vnd.google-apps.presentation',
    }
  }

  // 4. Google Drive Generic File
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i)
  if (fileMatch) {
    const fileId = fileMatch[1]
    return {
      isValid: true,
      provider: 'google_drive',
      sourceType: 'gdrive',
      externalId: fileId,
      canonicalUrl: `https://drive.google.com/file/d/${fileId}/view`,
      suggestedTitle: 'Google Drive File',
      mimeType: 'application/pdf',
    }
  }

  // 5. Google Drive Open Query Parameter
  const openMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/i)
  if (openMatch) {
    const fileId = openMatch[1]
    return {
      isValid: true,
      provider: 'google_drive',
      sourceType: 'gdrive',
      externalId: fileId,
      canonicalUrl: `https://drive.google.com/open?id=${fileId}`,
      suggestedTitle: 'Google Drive Asset',
    }
  }

  // 6. Google Drive Folders
  const folderMatch = url.match(/drive\.google\.com\/drive\/folders\/([a-zA-Z0-9_-]+)/i)
  if (folderMatch) {
    const fileId = folderMatch[1]
    return {
      isValid: true,
      provider: 'google_drive',
      sourceType: 'gdrive',
      externalId: fileId,
      canonicalUrl: `https://drive.google.com/drive/folders/${fileId}`,
      suggestedTitle: 'Google Drive Shared Folder',
      mimeType: 'application/vnd.google-apps.folder',
    }
  }

  // 7. GitHub Issues & PRs
  const githubIssueMatch = url.match(/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/i)
  if (githubIssueMatch) {
    const [, owner, repo, issueNum] = githubIssueMatch
    return {
      isValid: true,
      provider: 'github',
      sourceType: 'github_issue',
      externalId: issueNum,
      canonicalUrl: url,
      suggestedTitle: `GitHub Issue #${issueNum} (${owner}/${repo})`,
    }
  }

  const githubPrMatch = url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/i)
  if (githubPrMatch) {
    const [, owner, repo, prNum] = githubPrMatch
    return {
      isValid: true,
      provider: 'github',
      sourceType: 'github_pr',
      externalId: prNum,
      canonicalUrl: url,
      suggestedTitle: `GitHub PR #${prNum} (${owner}/${repo})`,
    }
  }

  // 8. General Web URL
  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname.replace(/^www\./, '')
    const pathParts = parsed.pathname.split('/').filter(Boolean)
    const lastPart = pathParts.length > 0 ? pathParts[pathParts.length - 1].replace(/[-_]/g, ' ') : ''
    
    return {
      isValid: true,
      provider: 'web',
      sourceType: 'url',
      canonicalUrl: url,
      suggestedTitle: lastPart ? `${lastPart} (${hostname})` : `${hostname} Reference`,
    }
  } catch {
    return {
      isValid: false,
      provider: 'manual',
      sourceType: 'manual_note',
      canonicalUrl: url,
      suggestedTitle: 'Manual Reference',
    }
  }
}
