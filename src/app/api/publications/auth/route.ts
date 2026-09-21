import { NextRequest, NextResponse } from 'next/server'
import {
  applySessionCookie,
  clearSessionCookie,
  createPublicationsToken,
  getPublicationsSession,
  identifyByPassword,
  isPublicationsGateConfigured,
} from '@/lib/publicationsAuth'
import { checkRateLimit } from '@/os/lib/rateLimit'
import { logger } from '@/os/lib/logger'

const LOG_CONTEXT = 'NEWSROOM-AUTH'

/** GET — probe the current studio session (used to restore the UI on reload). */
export async function GET(req: NextRequest) {
  const session = await getPublicationsSession(req)

  if (!session) {
    return NextResponse.json(
      { authenticated: false, session: null, configured: isPublicationsGateConfigured() },
      { status: 200 }
    )
  }

  return NextResponse.json({ authenticated: true, session, configured: true })
}

/** POST — exchange a founder password for a scoped studio session cookie. */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1'
    const limit = checkRateLimit(`publications-auth:${ip}`, { maxRequests: 8, windowMs: 60000 })

    if (!limit.allowed) {
      logger.warn(`Newsroom Studio unlock rate limit triggered from IP: ${ip}`, LOG_CONTEXT)
      return NextResponse.json(
        {
          success: false,
          error: `Too many attempts. Try again in ${Math.ceil(limit.resetMs / 1000)}s.`,
        },
        { status: 429 }
      )
    }

    if (!isPublicationsGateConfigured()) {
      logger.error(
        'Newsroom Studio unlock rejected: no founder password environment variables are set',
        LOG_CONTEXT
      )
      return NextResponse.json(
        {
          success: false,
          error:
            'The studio password is not configured on this deployment. Set FOUNDER_PASSWORD_ABDULAZIZ or FOUNDER_PASSWORD_IBRAHIM.',
        },
        { status: 503 }
      )
    }

    const body = await req.json().catch(() => null)
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!password) {
      return NextResponse.json({ success: false, error: 'Password is required.' }, { status: 400 })
    }

    const session = identifyByPassword(password)

    if (!session) {
      logger.warn(`Failed Newsroom Studio unlock attempt from IP: ${ip}`, LOG_CONTEXT)
      return NextResponse.json(
        { success: false, error: 'Incorrect password. Access denied.' },
        { status: 401 }
      )
    }

    logger.info(`Newsroom Studio unlocked by ${session.name}`, LOG_CONTEXT)

    const token = await createPublicationsToken(session)
    return applySessionCookie(
      NextResponse.json({ success: true, session, message: `Welcome back, ${session.name}.` }),
      token
    )
  } catch (error) {
    logger.error('Newsroom Studio auth handler crashed', LOG_CONTEXT, error)
    return NextResponse.json({ success: false, error: 'Authentication error.' }, { status: 500 })
  }
}

/** DELETE — lock the studio again. */
export async function DELETE() {
  return clearSessionCookie(NextResponse.json({ success: true }))
}
