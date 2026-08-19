import { NextRequest, NextResponse } from 'next/server'
import { callGeminiJson } from '@/os/lib/gemini'
import { checkRateLimit } from '@/os/lib/rateLimit'
import { logger } from '@/os/lib/logger'

export interface ExecutiveDigestResult {
  headline: string
  standoutSummary: string
  criticalAlerts: string[]
  completedHighlights: string[]
  recommendedActions: string[]
}

const SYSTEM_PROMPT = `
You are the AI Chief of Staff for WSTAR Technologies operating in Nigeria.
You are generating a daily async handoff briefing for co-founders Abdulaziz Abdulwahab (Lead Technical Architect) and Ibrahim Abdulwahab (Founder & CEO).

Tailoring Rules:
- If role is "engineer" (Abdulaziz): Focus on technical blockers, critical bugs (P0), pending PRs/specs, and architectural decisions.
- If role is "ceo" (Ibrahim): Focus on company milestone progress, customer feedback sentiment, strategic proposals under review, regulatory/business compliance, and commercial readiness.

Return JSON format:
{
  "headline": "Brief executive greeting & status punchline",
  "standoutSummary": "2-3 sentences summarizing the overall state of operations today",
  "criticalAlerts": ["Bullet points of immediate risks, blocked tickets, or urgent decisions"],
  "completedHighlights": ["Bullet points of recently completed milestones or closed bugs"],
  "recommendedActions": ["Top 2-3 highest-leverage actions to focus on today"]
}
`

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
    const limit = checkRateLimit(`ai-digest:${ip}`, { maxRequests: 10, windowMs: 60000 })
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please wait 1 minute.' },
        { status: 429 }
      )
    }

    const { role, itemsSummary } = await req.json()

    const userPrompt = `Generate a daily executive handoff briefing for:
Target Role: ${role === 'engineer' ? 'Abdulaziz (Lead Technical Architect)' : 'Ibrahim (Founder & CEO)'}
Current Operational State:
${JSON.stringify(itemsSummary || {}, null, 2)}`

    logger.info(`Generating executive daily digest for ${role}`, 'AI-DIGEST')

    const digest = await callGeminiJson<ExecutiveDigestResult>(userPrompt, {
      model: 'gemini-flash-latest',
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.3,
    })

    return NextResponse.json({
      success: true,
      digest,
    })
  } catch (error: any) {
    logger.error('AI Digest generation failed', 'AI-DIGEST', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'AI Digest generation failed',
      },
      { status: 500 }
    )
  }
}
