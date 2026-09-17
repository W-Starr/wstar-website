import { NextRequest, NextResponse } from 'next/server'
import { createFounderSessionToken, FOUNDERS, AUTH_COOKIE_NAME } from '@/lib/auth'
import { checkRateLimit } from '@/os/lib/rateLimit'
import { logger } from '@/os/lib/logger'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
    const limit = checkRateLimit(`auth-login:${ip}`, { maxRequests: 8, windowMs: 60000 })
    if (!limit.allowed) {
      logger.warn(`Brute force login rate limit triggered from IP: ${ip}`, 'AUTH')
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again in 1 minute.' },
        { status: 429 }
      )
    }

    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    const founderConfig = FOUNDERS[normalizedEmail]

    if (!founderConfig) {
      logger.warn(`Failed login attempt for unknown email: ${normalizedEmail}`, 'AUTH')
      return NextResponse.json(
        { error: 'Invalid founder credentials' },
        { status: 401 }
      )
    }

    // Verify password
    if (!founderConfig.defaultPassword || password !== founderConfig.defaultPassword) {
      if (!founderConfig.defaultPassword) {
        logger.error(`Founder login rejected: password environment variable not set for ${normalizedEmail}`, 'AUTH')
      } else {
        logger.warn(`Failed password for founder account: ${normalizedEmail}`, 'AUTH')
      }
      return NextResponse.json(
        { error: 'Invalid founder credentials' },
        { status: 401 }
      )
    }

    const user = {
      id: normalizedEmail.split('@')[0],
      email: normalizedEmail,
      name: founderConfig.name,
      role: founderConfig.role,
    }

    const token = await createFounderSessionToken(user)
    logger.info(`Founder authenticated successfully: ${user.name} (${user.email})`, 'AUTH')

    const response = NextResponse.json({
      success: true,
      user,
      message: `Authenticated as ${user.name}`,
    })

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error: any) {
    logger.error('Authentication handler crashed', 'AUTH', error)
    return NextResponse.json(
      { error: error?.message || 'Authentication error' },
      { status: 500 }
    )
  }
}
