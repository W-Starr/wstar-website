/**
 * Centralized Strict Environment Configuration Validator
 * Enforces validated environment variable consumption across WSTAR OS.
 */

export const env = {
  // Sanity Cloud Configuration
  get sanityProjectId(): string {
    const id = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    if (!id) {
      throw new Error(
        '[WSTAR OS Security] Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Please set it in .env.local or Vercel settings.'
      )
    }
    return id
  },

  get sanityDataset(): string {
    return process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  },

  get sanityApiVersion(): string {
    return process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-03-01'
  },

  get sanityWriteToken(): string {
    const token = process.env.SANITY_API_WRITE_TOKEN
    if (!token) {
      throw new Error(
        '[WSTAR OS Security] Missing SANITY_API_WRITE_TOKEN. Server write operations require a valid write token in .env.local.'
      )
    }
    return token
  },

  // Gemini AI Engine Configuration
  get geminiApiKey(): string {
    const key = process.env.GEMINI_API_KEY
    if (!key) {
      throw new Error(
        '[WSTAR OS AI] Missing GEMINI_API_KEY. Please configure the Gemini API key in .env.local.'
      )
    }
    return key
  },

  // Authentication & Session Secret
  get authSecret(): string {
    const secret = process.env.AUTH_SECRET
    if (!secret) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(
          '[WSTAR OS Security] Missing AUTH_SECRET in production. Configure AUTH_SECRET in Vercel environment variables.'
        )
      }
      return 'wstar_os_dev_jwt_secret_local_only_insecure'
    }
    return secret
  },

  // Environment mode
  get isProduction(): boolean {
    return process.env.NODE_ENV === 'production'
  },
}
