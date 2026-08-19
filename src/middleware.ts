import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { env } from '@/os/config/env'

const AUTH_COOKIE_NAME = 'wstar_os_session'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 1. Allow public routes under /os and auth APIs
  if (
    pathname === '/os/login' ||
    pathname.startsWith('/api/os/auth/') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // 2. Check if route is an OS route or OS API route
  const isOSRoute = pathname.startsWith('/os')
  const isOSApiRoute = pathname.startsWith('/api/os')

  if (!isOSRoute && !isOSApiRoute) {
    return NextResponse.next()
  }

  // 3. Verify session token
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value

  if (!token) {
    if (isOSApiRoute) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required for WSTAR OS API access' },
        { status: 401 }
      )
    }
    const loginUrl = new URL('/os/login', req.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const secret = new TextEncoder().encode(env.authSecret)
    const { payload } = await jwtVerify(token, secret)

    // Forward user headers to downstream routes
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-user-id', (payload.id as string) || '')
    requestHeaders.set('x-user-email', (payload.email as string) || '')
    requestHeaders.set('x-user-role', (payload.role as string) || '')

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch {
    if (isOSApiRoute) {
      return NextResponse.json(
        { error: 'Unauthorized: Session expired or invalid' },
        { status: 401 }
      )
    }
    const loginUrl = new URL('/os/login', req.url)
    loginUrl.searchParams.set('from', pathname)
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete(AUTH_COOKIE_NAME)
    return response
  }
}

export const config = {
  matcher: ['/os/:path*', '/api/os/:path*'],
}
