import { NextRequest, NextResponse } from 'next/server'
import { verifyFounderSessionToken, AUTH_COOKIE_NAME } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value

  if (!token) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 })
  }

  const user = await verifyFounderSessionToken(token)

  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 })
  }

  return NextResponse.json({
    authenticated: true,
    user,
  })
}
