import type { Metadata } from 'next'
import NewsroomStudio from './NewsroomStudio'

/**
 * Password-gated publishing surface for the public /publications newsroom.
 *
 * Unlocked with either founder password (FOUNDER_PASSWORD_ABDULAZIZ or
 * FOUNDER_PASSWORD_IBRAHIM); all writes run server-side through
 * /api/publications/* using SANITY_API_WRITE_TOKEN.
 */

export const metadata: Metadata = {
  title: 'Newsroom Studio — WSTAR',
  description: 'Private publishing studio for WSTAR publications and announcements.',
  robots: { index: false, follow: false, nocache: true },
}

/** Auth state lives in a cookie, so never prerender or cache this route. */
export const dynamic = 'force-dynamic'

export default function NewsroomStudioPage() {
  return <NewsroomStudio />
}
