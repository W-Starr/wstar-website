import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-03-01'

export const isSanityConfigured = Boolean(projectId && dataset)

// Public, CDN-backed read client for marketing-site content (published data only).
export const publicSanityClient = createClient({
  projectId: projectId || 'unconfigured',
  dataset,
  apiVersion,
  useCdn: true,
})

export interface PublishedAnnouncement {
  _id: string
  title: string
  slug: string
  category: 'announcement' | 'press-release' | 'publication' | 'report'
  excerpt: string
  publishedAt: string
  author?: string
  pdfUrl?: string
  pdfFilename?: string
  pdfSize?: number
  coverImageUrl?: string
}

export async function getPublishedAnnouncements(): Promise<PublishedAnnouncement[]> {
  if (!isSanityConfigured) return []

  try {
    const query = `*[_type == "announcement" && status == "published"] | order(publishedAt desc){
      _id, title, slug, category, excerpt, publishedAt, author, pdfUrl, pdfFilename, pdfSize, coverImageUrl
    }`
    return await publicSanityClient.fetch(query)
  } catch (error) {
    console.error('[Publications] Failed to fetch published announcements:', error)
    return []
  }
}
