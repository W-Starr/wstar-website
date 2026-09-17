import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/os/config/env'

export interface FounderUser {
  id: string
  email: string
  name: string
  role: 'engineer' | 'ceo'
}

export const FOUNDERS: Record<string, { name: string; role: 'engineer' | 'ceo'; defaultPassword?: string }> = {
  'abdulaziz@wstartech.ng': {
    name: 'Abdulaziz Abdulwahab',
    role: 'engineer',
    defaultPassword:
      process.env.FOUNDER_PASSWORD_ABDULAZIZ ||
      (process.env.NODE_ENV === 'development' ? 'dev_wstar_abdulaziz' : undefined),
  },
  'ibrahim@wstartech.ng': {
    name: 'Ibrahim Abdulwahab',
    role: 'ceo',
    defaultPassword:
      process.env.FOUNDER_PASSWORD_IBRAHIM ||
      (process.env.NODE_ENV === 'development' ? 'dev_wstar_ibrahim' : undefined),
  },
}

export const AUTH_COOKIE_NAME = 'wstar_os_session'

const getJwtSecretKey = () => {
  return new TextEncoder().encode(env.authSecret)
}

/**
 * Sign JWT token for authenticated founder
 */
export async function createFounderSessionToken(user: FounderUser): Promise<string> {
  const secret = getJwtSecretKey()
  return new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

/**
 * Verify JWT token
 */
export async function verifyFounderSessionToken(token: string): Promise<FounderUser | null> {
  try {
    const secret = getJwtSecretKey()
    const { payload } = await jwtVerify(token, secret)
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as 'engineer' | 'ceo',
    }
  } catch {
    return null
  }
}

/**
 * Get current session from Next.js server cookies
 */
export async function getServerSession(): Promise<FounderUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
    if (!token) return null
    return await verifyFounderSessionToken(token)
  } catch {
    return null
  }
}
