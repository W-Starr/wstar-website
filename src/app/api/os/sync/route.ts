import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { syncRequestSchema } from '@/os/lib/validation'

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

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json()

    // 1. Zod Runtime Schema Validation
    const parseResult = syncRequestSchema.safeParse(rawBody)
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed on mutation payload',
          details: parseResult.error.format(),
        },
        { status: 400 }
      )
    }

    const { action, docType, id, data } = parseResult.data

    if (!writeClient) {
      return NextResponse.json({
        success: true,
        mode: 'local_fallback',
        message: 'No SANITY_API_WRITE_TOKEN configured in server env. Operating in local optimistic mode.',
      })
    }

    if (action === 'create') {
      const created = await writeClient.createOrReplace({
        _id: id,
        _type: docType,
        ...data,
      })
      return NextResponse.json({ success: true, mode: 'sanity_live', doc: created })
    }

    if (action === 'patch') {
      try {
        const patched = await writeClient
          .patch(id)
          .set(data || {})
          .commit({ autoGenerateArrayKeys: true })
        return NextResponse.json({ success: true, mode: 'sanity_live', doc: patched })
      } catch (patchErr: any) {
        // If document doesn't exist yet in Sanity, upsert it with createIfNotExists
        if (
          patchErr.statusCode === 404 ||
          patchErr.message?.includes('not found') ||
          patchErr.message?.includes('does not exist')
        ) {
          const upserted = await writeClient.createIfNotExists({
            _id: id,
            _type: docType,
            ...data,
          })
          return NextResponse.json({ success: true, mode: 'sanity_live', doc: upserted })
        }
        throw patchErr
      }
    }

    if (action === 'delete') {
      try {
        await writeClient.delete(id)
      } catch (delErr: any) {
        if (delErr.statusCode !== 404) throw delErr
      }
      return NextResponse.json({ success: true, mode: 'sanity_live' })
    }

    return NextResponse.json({ success: false, error: 'Unsupported mutation action' }, { status: 400 })
  } catch (error: any) {
    console.error('[WSTAR OS Sync Error]:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
