import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qx20j59l'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

const readClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-03-01',
  useCdn: false,
})

export async function GET() {
  try {
    const query = `{
      "workItems": *[_type == "workItem"] | order(_createdAt desc),
      "proposals": *[_type == "proposal"] | order(_createdAt desc),
      "decisions": *[_type == "decision"] | order(date desc),
      "feedbackItems": *[_type == "feedbackItem"] | order(timestamp desc),
      "projects": *[_type == "project"],
      "roadmapItems": *[_type == "roadmapItem"],
      "activities": *[_type == "activityItem"] | order(timestamp desc),
      "products": *[_type == "product"],
      "productAreas": *[_type == "productArea"]
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
    console.error('Error fetching OS data from Sanity:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
