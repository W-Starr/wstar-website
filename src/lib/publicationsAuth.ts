import { timingSafeEqual } from 'node:crypto'
import { SignJWT, jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/os/config/env'

/**
 * Standalone gate for the Newsroom Studio at /publications/admin.
 *
 * Deliberately separate from the WSTAR OS founder session (`wstar_os_session`):
 * the studio is a single-purpose publishing surface that must stay reachable
 * without granting access to the whole Operating System, so it issues its own
 * short-lived, scoped cookie. Both founder passwords unlock it.
 */

export const PUBLICATIONS_COOKIE_NAME = 'wstar_pub_session'

/** 12h — long enough for a publishing session, short enough to be low-risk. */
const SESSION_TTL_SECONDS = 60 * 60 * 12

const SESSION_SCOPE = 'publications'

export interface PublicationsSession {
  /** Stable identifier of the founder account whose password was used. */
  key: string
  name: string
  initials: string
}

interface StudioAccount {
  key: string
  name: string
  initials: string
  envVar: 'FOUNDER_PASSWORD_ABDULAZIZ' | 'FOUNDER_PASSWORD_IBRAHIM'
  devFallback: string
}

const STUDIO_ACCOUNTS: StudioAccount[] = [
  {
    key: 'abdulaziz',
    name: 'Abdulaziz Abdulwahab',
    initials: 'AA',
    envVar: 'FOUNDER_PASSWORD_ABDULAZIZ',
    devFallback: 'dev_wstar_abdulaziz',
  },
  {
    key: 'ibrahim',
    name: 'Ibrahim Abdulwahab',
    initials: 'IA',
    envVar: 'FOUNDER_PASSWORD_IBRAHIM',
    devFallback: 'dev_wstar_ibrahim',
  },
]

function resolvePassword(account: StudioAccount): string | undefined {
  const configured = process.env[account.envVar]
  if (configured) return configured
  return process.env.NODE_ENV === 'development' ? account.devFallback : undefined
}

/** Constant-time comparison that does not leak length through early return. */
function secureEquals(a: string, b: string): boolean {
  const bufferA = Buffer.from(a, 'utf8')
  const bufferB = Buffer.from(b, 'utf8')
  if (bufferA.length !== bufferB.length) {
    // Still burn a comparison so mismatched lengths cost the same as mismatched bytes.
    timingSafeEqual(bufferA, bufferA)
    return false
  }
  return timingSafeEqual(bufferA, bufferB)
}

/** True when at least one founder password is available to authenticate against. */
export function isPublicationsGateConfigured(): boolean {
  return STUDIO_ACCOUNTS.some((account) => Boolean(resolvePassword(account)))
}

/**
 * Resolve a submitted password to the founder it belongs to.
 * Every configured account is checked so the work done is independent of which
 * password was supplied.
 */
export function identifyByPassword(password: string): PublicationsSession | null {
  let matched: PublicationsSession | null = null

  for (const account of STUDIO_ACCOUNTS) {
    const expected = resolvePassword(account)
    if (!expected) continue
    if (secureEquals(password, expected)) {
      matched = { key: account.key, name: account.name, initials: account.initials }
    }
  }

  return matched
}

const getSecretKey = () => new TextEncoder().encode(env.authSecret)

export async function createPublicationsToken(session: PublicationsSession): Promise<string> {
  return new SignJWT({ ...session, scope: SESSION_SCOPE })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSecretKey())
}

export async function verifyPublicationsToken(token: string): Promise<PublicationsSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    if (payload.scope !== SESSION_SCOPE) return null
    return {
      key: payload.key as string,
      name: payload.name as string,
      initials: payload.initials as string,
    }
  } catch {
    return null
  }
}

export function applySessionCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set(PUBLICATIONS_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  })
  return response
}

export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set(PUBLICATIONS_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  })
  return response
}

export async function getPublicationsSession(req: NextRequest): Promise<PublicationsSession | null> {
  const token = req.cookies.get(PUBLICATIONS_COOKIE_NAME)?.value
  if (!token) return null
  return verifyPublicationsToken(token)
}

/**
 * Guard for studio API routes. Returns either the session or the 401 to return.
 * `/publications/**` is outside the OS middleware matcher, so every studio route
 * must call this itself.
 */
export async function requirePublicationsSession(
  req: NextRequest
): Promise<{ session: PublicationsSession; response?: never } | { session?: never; response: NextResponse }> {
  const session = await getPublicationsSession(req)
  if (!session) {
    return {
      response: NextResponse.json(
        { success: false, error: 'Unauthorized: unlock the Newsroom Studio to continue.' },
        { status: 401 }
      ),
    }
  }
  return { session }
}
