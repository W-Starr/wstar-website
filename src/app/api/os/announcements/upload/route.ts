import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

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

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024 // 25MB

export async function POST(req: NextRequest) {
  try {
    if (!writeClient) {
      return NextResponse.json(
        { success: false, error: 'Sanity write client is not configured on the server' },
        { status: 500 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'No file provided under the "file" field' },
        { status: 400 }
      )
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Only PDF files are accepted' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: 'File exceeds the 25MB upload limit' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const asset = await writeClient.assets.upload('file', buffer, {
      filename: file.name,
      contentType: file.type,
    })

    return NextResponse.json({
      success: true,
      assetId: asset._id,
      url: asset.url,
      filename: file.name,
      size: file.size,
    })
  } catch (error: any) {
    console.error('[WSTAR OS Announcement Upload Error]:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
