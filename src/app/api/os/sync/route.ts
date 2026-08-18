import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qx20j59l'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN

const writeClient = token
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-03-01',
      token,
      useCdn: false,
    })
  : null

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, docType, id, data } = body

    if (!writeClient) {
      return NextResponse.json({
        success: true,
        mode: 'local_fallback',
        message: 'No SANITY_API_WRITE_TOKEN configured in server env. Operating in local optimistic mode.',
      })
    }

    if (action === 'create') {
      const created = await writeClient.create({
        _type: docType,
        ...data,
      })
      return NextResponse.json({ success: true, mode: 'sanity_live', doc: created })
    }

    if (action === 'update' || action === 'patch') {
      const patched = await writeClient.patch(id).set(data).commit()
      return NextResponse.json({ success: true, mode: 'sanity_live', doc: patched })
    }

    if (action === 'delete') {
      await writeClient.delete(id)
      return NextResponse.json({ success: true, mode: 'sanity_live' })
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 })
  } catch (error: any) {
    console.error('Error syncing mutation to Sanity:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
