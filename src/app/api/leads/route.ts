import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { leadSubmissionSchema } from '@/lib/leads'
import { checkRateLimit } from '@/os/lib/rateLimit'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN

const writeClient = token && projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-03-01',
      token,
      useCdn: false,
    })
  : null

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rate = checkRateLimit(`leads:${ip}`, { maxRequests: 5, windowMs: 10 * 60 * 1000 })
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      )
    }

    const rawBody = await req.json()
    const parseResult = leadSubmissionSchema.safeParse(rawBody)

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: 'Please check the form and try again.' },
        { status: 400 }
      )
    }

    const { formType, name, email, details, website } = parseResult.data

    // Honeypot: silently "succeed" so bots don't learn to avoid the field, but don't persist anything.
    if (website) {
      return NextResponse.json({ success: true })
    }

    if (!writeClient) {
      console.error('[Leads API] SANITY_API_WRITE_TOKEN not configured — lead submission was NOT persisted:', {
        formType,
        name,
        email,
      })
      return NextResponse.json(
        { success: false, error: 'Submissions are temporarily unavailable. Please email us directly.' },
        { status: 503 }
      )
    }

    const id = `lead-${formType}-${Date.now()}`
    await writeClient.createOrReplace({
      _id: id,
      _type: 'lead',
      formType,
      name,
      email,
      details,
      status: 'new',
      submittedAt: new Date().toISOString(),
      sourceIp: ip,
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('[Leads API] Submission failed:', error)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again or email us directly.' },
      { status: 500 }
    )
  }
}
