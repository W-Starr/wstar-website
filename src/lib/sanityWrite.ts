import { createClient, type SanityClient } from '@sanity/client'

/**
 * Server-only Sanity client authenticated with SANITY_API_WRITE_TOKEN.
 *
 * Returns `null` rather than throwing when the token is absent, so callers can
 * degrade with a clear 503 instead of crashing the route.
 */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-03-01'
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN

export const sanityWriteClient: SanityClient | null =
  token && projectId
    ? createClient({ projectId, dataset, apiVersion, token, useCdn: false })
    : null

export const isSanityWriteConfigured = Boolean(sanityWriteClient)

export const SANITY_WRITE_UNCONFIGURED_MESSAGE =
  'Sanity write access is not configured on the server. Set SANITY_API_WRITE_TOKEN in the environment.'
