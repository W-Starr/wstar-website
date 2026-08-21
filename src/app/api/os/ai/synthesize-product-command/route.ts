import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { callGeminiJson } from '@/os/lib/gemini'
import { checkRateLimit } from '@/os/lib/rateLimit'
import { logger } from '@/os/lib/logger'
import { ProductCommandConfig, ProductArea } from '@/os/types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN

const readClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-03-01',
      token,
      useCdn: false,
    })
  : null

export interface ProductCommandSynthesisResult {
  config: ProductCommandConfig
  suggestedProductAreas?: {
    name: string
    description: string
    owner: string
    maturity: number
  }[]
}

const SYSTEM_PROMPT = `
You are the Lead Systems Architect AI for WSTAR Technologies (investing and operating ventures like Ace Acad, PlantIQ, and WSTAR Core).
Your task is to synthesize a deeply opinionated, high-velocity Product Command Center configuration from provided technical documentation, SRS specifications, and pitch materials.

You must extract and generate:
1. Version Badge: (e.g. "Flutter Engine • v1.0.0+3" or "Edge ML & Telemetry • v0.3.0" or "Solana Protocol • v0.1.2").
2. 3 Architecture Pillars: 
   - 3 distinct fundamental technical, pedagogical, or operational pillars (e.g. Target Cohort/Market, Core Study/Agronomy/Data Loop, Storage/Offline/Edge Architecture).
   - Each with: label (short uppercase header), value (1-4 words bold summary), description (1-2 sentences), badgeColor ('blue' | 'emerald' | 'purple' | 'amber').
3. Domain Registry Table:
   - A highly specific, concrete inventory table critical to the product's execution (e.g. For Ace Acad -> 100L Foundational Courses Registry; For PlantIQ -> Crop Disease & Diagnostic Models Registry; For a Fintech -> Compliance & License Registry; For an IoT project -> Sensor Hardware & Microcontroller Node Registry).
   - Title: uppercase header (e.g. "13 CORE 100L FOUNDATIONAL COURSES REGISTRY" or "CROP DISEASE & DIAGNOSTIC MODELS REGISTRY")
   - Subtitle: reference description
   - Columns: 3-5 columns (e.g. key, label, isMono)
   - Rows: 6-15 structured, realistic domain items matching the documentation.
4. Technical Lifecycle Pipeline:
   - 4-6 sequential stages detailing how data, assets, or events flow through the system (e.g. Ingestion -> Processing -> ML Inference -> Delivery).
   - Each stage with: stageNumber, name, status ('Verified' | 'Active' | 'In Progress' | 'Planned'), description.
5. Suggested Product Areas:
   - 3-6 core architectural modules of this product with realistic initial maturity percentages (30-90%) and owner ('Abdulaziz' or 'Ibrahim').

JSON Output Schema:
{
  "config": {
    "productId": "string",
    "productName": "string",
    "versionBadge": "string",
    "architecturePillars": [
      {
        "label": "string",
        "value": "string",
        "description": "string",
        "badgeColor": "blue"
      }
    ],
    "domainRegistry": {
      "title": "string",
      "subtitle": "string",
      "columns": [
        { "key": "code", "label": "Code", "isMono": true },
        { "key": "name", "label": "Name" },
        { "key": "category", "label": "Category" },
        { "key": "status", "label": "Status" }
      ],
      "rows": [
        { "code": "ITEM-01", "name": "...", "category": "...", "status": "..." }
      ]
    },
    "lifecyclePipeline": {
      "title": "string",
      "stages": [
        {
          "stageNumber": 1,
          "name": "string",
          "status": "string",
          "description": "string"
        }
      ]
    }
  },
  "suggestedProductAreas": [
    {
      "name": "string",
      "description": "string",
      "owner": "Abdulaziz",
      "maturity": 75
    }
  ]
}
`

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
    const limit = checkRateLimit(`ai-product-synth:${ip}`, { maxRequests: 10, windowMs: 60000 })
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please wait 1 minute.' },
        { status: 429 }
      )
    }

    const { productId, productName, sourceIds, customContext } = await req.json()

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 })
    }

    logger.info(`Synthesizing Product Command Center for ${productId} (${productName})`, 'AI-PRODUCT-SYNTH')

    // Fetch source content from Sanity if sourceIds are provided
    let sourcesText = ''
    if (readClient && Array.isArray(sourceIds) && sourceIds.length > 0) {
      try {
        const sources = await readClient.fetch(
          `*[_type == "source" && _id in $sourceIds]{
            _id,
            title,
            summary,
            content,
            keyTakeaways,
            extractedTasks,
            extractedDecisions
          }`,
          { sourceIds }
        )

        sourcesText = sources
          .map(
            (s: any) =>
              `--- SOURCE: ${s.title} ---
Summary: ${s.summary || 'N/A'}
Key Takeaways: ${Array.isArray(s.keyTakeaways) ? s.keyTakeaways.join('; ') : 'N/A'}
Content Excerpt: ${s.content ? s.content.slice(0, 4000) : 'N/A'}`
          )
          .join('\n\n')
      } catch (err: any) {
        logger.warn(`Could not fetch sources from Sanity: ${err.message}`, 'AI-PRODUCT-SYNTH')
      }
    }

    const userPrompt = `Synthesize an authoritative, opinionated Product Command Center for:
Product ID: "${productId}"
Product Name: "${productName || productId}"

Source Documentation & Verified Context:
${sourcesText || 'No attached document text provided; use standard domain expertise.'}

Additional Founder Instructions:
${customContext || 'Synthesize realistic production architecture, domain registries, and pipeline based on product domain.'}
`

    const result = await callGeminiJson<ProductCommandSynthesisResult>(userPrompt, {
      model: 'gemini-3.7-flash',
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.2,
      maxOutputTokens: 8192,
    })

    if (!result || !result.config) {
      throw new Error('Gemini did not return valid ProductCommandConfig structure')
    }

    // Ensure productId is stamped
    result.config.productId = productId
    result.config.productName = productName || result.config.productName || productId
    result.config.lastSynthesizedAt = new Date().toISOString()

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error: any) {
    logger.error('AI Product Command Synthesis failed', 'AI-PRODUCT-SYNTH', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'AI Product Command Synthesis failed',
      },
      { status: 500 }
    )
  }
}
