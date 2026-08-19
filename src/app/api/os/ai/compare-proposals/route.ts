import { NextRequest, NextResponse } from 'next/server'
import { callGeminiJson } from '@/os/lib/gemini'
import { checkRateLimit } from '@/os/lib/rateLimit'
import { logger } from '@/os/lib/logger'

const SYSTEM_PROMPT = `
You are the Chief Enterprise Architect and Historical Strategy Auditor for WSTAR Technologies (Nigeria).
Your mission is to perform a deep comparative diff between two strategic proposals, technical specs, or architectural designs.

Analyze:
1. Strategic Shift: What fundamental premise changed between Doc A and Doc B? Why was Doc A superseded or revised?
2. Architecture & Technical Impact: Differences in storage overhead, bandwidth, database schemas, APIs, Flutter mobile app changes.
3. Operational & Cost Impact: Server hosting bills, bandwidth costs, operational bottlenecks.
4. Legal & Regulatory Posture: NDPA 2023 compliance, safe-harbor shielding, student user privacy.
5. Migration & Action Path: Specific technical steps to migrate from the old approach to the new approach without regressions.

Output Schema:
{
  "comparisonTitle": "Short descriptive title of the comparison",
  "summary": "2-3 sentence executive summary of the strategic evolution",
  "verdict": "Clear recommendation on which model to follow and why",
  "dimensions": [
    {
      "dimension": "Architecture & Storage",
      "docAValue": "Centralized backend bucket storage requiring heavy compute and manual OCR.",
      "docBValue": "Decentralized Google Drive folder sync with client-side Drift SQLite caching.",
      "advantage": "Doc B is 90% cheaper and scales automatically without server disk exhaustion."
    }
  ],
  "deprecatedElements": [
    "List of components, APIs, or assumptions that should be permanently decommissioned"
  ],
  "reusableAssets": [
    "List of algorithms, models, or UI components that can be reused directly"
  ],
  "recommendedActionItems": [
    "Step 1: Actionable task for Abdulaziz or Ibrahim",
    "Step 2: Actionable task"
  ]
}
`

export interface ProposalComparisonResponse {
  comparisonTitle: string
  summary: string
  verdict: string
  dimensions: Array<{
    dimension: string
    docAValue: string
    docBValue: string
    advantage: string
  }>
  deprecatedElements: string[]
  reusableAssets: string[]
  recommendedActionItems: string[]
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
    const limit = checkRateLimit(`ai-compare-proposals:${ip}`, { maxRequests: 15, windowMs: 60000 })
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please wait a moment.' },
        { status: 429 }
      )
    }

    const { docA, docB } = await req.json()

    if (!docA || !docB) {
      return NextResponse.json(
        { success: false, error: 'Both docA and docB are required for comparison.' },
        { status: 400 }
      )
    }

    logger.info(`Comparing Proposals: "${docA.title}" vs "${docB.title}"`, 'AI-COMPARE')

    const userPrompt = `Compare these two strategic documents:

=== DOCUMENT A ===
Title: ${docA.title}
Author: ${docA.author || 'WSTAR Team'}
Summary: ${docA.summary || docA.aiSummary || 'N/A'}
Content/Snippet: ${docA.content ? docA.content.slice(0, 4000) : 'No raw text attached'}

=== DOCUMENT B ===
Title: ${docB.title}
Author: ${docB.author || 'WSTAR Team'}
Summary: ${docB.summary || docB.aiSummary || 'N/A'}
Content/Snippet: ${docB.content ? docB.content.slice(0, 4000) : 'No raw text attached'}
`

    const comparison = await callGeminiJson<ProposalComparisonResponse>(userPrompt, {
      model: 'gemini-flash-latest',
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.2,
    })

    return NextResponse.json({
      success: true,
      comparison,
    })
  } catch (error: any) {
    logger.error('Proposal Comparison Error', 'AI-COMPARE', { error: error.message || String(error) })
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to compare proposals.' },
      { status: 500 }
    )
  }
}
