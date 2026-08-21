import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

const readClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-03-01',
      useCdn: false,
    })
  : null

export async function GET() {
  try {
    if (!readClient) {
      return NextResponse.json({
        success: false,
        hasData: false,
        error: 'NEXT_PUBLIC_SANITY_PROJECT_ID is not configured in server environment',
      }, { status: 500 })
    }

    const query = `{
      "workItems": *[_type == "workItem"] | order(_createdAt desc),
      "proposals": *[_type == "proposal"] | order(_createdAt desc),
      "decisions": *[_type == "decision"] | order(date desc),
      "feedbackItems": *[_type == "feedbackItem"] | order(timestamp desc),
      "projects": *[_type == "project"],
      "roadmapItems": *[_type == "roadmapItem"],
      "activities": *[_type == "activityItem"] | order(timestamp desc),
      "products": *[_type == "product"],
      "productAreas": *[_type == "productArea"],
      "productCommandCenters": *[_type == "productCommandCenter"]
    }`

    const data = await readClient.fetch(query)
    const hasData = Boolean(
      (data.workItems && data.workItems.length > 0) ||
      (data.proposals && data.proposals.length > 0) ||
      (data.decisions && data.decisions.length > 0)
    )

    return NextResponse.json({
      success: true,
      hasData,
      data,
    })
  } catch (error: any) {
    console.error('[WSTAR OS Fetch Error]:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
