import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { createClient } from '@sanity/client'
import { logger } from '@/os/lib/logger'
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

function parseFirestoreValue(field: any): any {
  if (!field) return undefined
  if ('stringValue' in field) return field.stringValue
  if ('integerValue' in field) return parseInt(field.integerValue, 10)
  if ('doubleValue' in field) return field.doubleValue
  if ('booleanValue' in field) return field.booleanValue
  if ('timestampValue' in field) return field.timestampValue
  if ('nullValue' in field) return null
  if ('arrayValue' in field) return (field.arrayValue.values || []).map(parseFirestoreValue)
  if ('mapValue' in field) {
    const obj: any = {}
    for (const [k, v] of Object.entries(field.mapValue.fields || {})) {
      obj[k] = parseFirestoreValue(v)
    }
    return obj
  }
  return undefined
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
    const limit = checkRateLimit(`firebase-feedback:${ip}`, { maxRequests: 10, windowMs: 60000 })
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please wait a moment.' },
        { status: 429 }
      )
    }

    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: 'FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not configured.',
        },
        { status: 400 }
      )
    }

    let credentials: any
    try {
      let rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim()
      if (rawKey.startsWith("'") && rawKey.endsWith("'")) {
        rawKey = rawKey.slice(1, -1)
      }
      credentials = JSON.parse(rawKey)
    } catch (e: any) {
      logger.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY', 'FIREBASE-FEEDBACK', { error: e?.message || String(e) })
      return NextResponse.json(
        { success: false, error: 'Invalid FIREBASE_SERVICE_ACCOUNT_KEY JSON format.' },
        { status: 500 }
      )
    }

    const authClient = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/datastore'],
    })

    const tokenResponse = await authClient.authorize()
    const accessToken = tokenResponse.access_token

    if (!accessToken) {
      throw new Error('Failed to obtain Google access token for Firestore API')
    }

    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${credentials.project_id}/databases/(default)/documents/feedback`

    logger.info(`Fetching live feedback from Firestore (${credentials.project_id})...`, 'FIREBASE-FEEDBACK')

    const response = await fetch(firestoreUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Firestore REST API returned ${response.status}: ${errorText}`)
    }

    const firestoreData = await response.json()
    const rawDocuments = firestoreData.documents || []

    const parsedFeedback = rawDocuments.map((doc: any) => {
      const docId = doc.name.split('/').pop() || `fb-${Date.now()}`
      const fields = doc.fields || {}
      
      return {
        id: `feedback-${docId}`,
        subject: parseFirestoreValue(fields.subject) || 'User Feedback',
        type: parseFirestoreValue(fields.type) || 'General',
        description: parseFirestoreValue(fields.description) || '',
        userId: parseFirestoreValue(fields.userId) || 'anonymous',
        timestamp: parseFirestoreValue(fields.timestamp) || doc.createTime || new Date().toISOString(),
        status: parseFirestoreValue(fields.status) || 'new',
      }
    })

    logger.info(`Successfully fetched ${parsedFeedback.length} feedback records from Firebase`, 'FIREBASE-FEEDBACK')

    // If Sanity is configured, sync documents to Sanity
    let syncedToSanity = 0
    if (writeClient && parsedFeedback.length > 0) {
      const tx = writeClient.transaction()
      for (const item of parsedFeedback) {
        tx.createIfNotExists({
          _id: item.id,
          _type: 'feedbackItem',
          subject: item.subject,
          type: item.type,
          description: item.description,
          userId: item.userId,
          timestamp: item.timestamp,
          status: item.status,
        })
        syncedToSanity++
      }
      await tx.commit()
    }

    return NextResponse.json({
      success: true,
      count: parsedFeedback.length,
      syncedToSanity,
      feedback: parsedFeedback,
    })
  } catch (error: any) {
    logger.error('Firebase Feedback Fetch Error', 'FIREBASE-FEEDBACK', { error: error.message || String(error) })
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch feedback from Firebase database.' },
      { status: 500 }
    )
  }
}
