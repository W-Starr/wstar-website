import { NextRequest, NextResponse } from 'next/server'
import { callGeminiJson } from '@/os/lib/gemini'
import { checkRateLimit } from '@/os/lib/rateLimit'
import { logger } from '@/os/lib/logger'

export interface ClassificationResult {
  type: 'bug' | 'task' | 'feature' | 'tech_debt' | 'improvement' | 'research'
  productId: 'ace-acad' | 'plantiq' | 'wstar-core'
  productAreaId?: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  assignee: 'abdulaziz' | 'ibrahim'
  confidence: number
  reasoning: string
}

const SYSTEM_PROMPT = `
You are the Chief of Staff AI for WSTAR Technologies, an African technology holding company founded by Abdulaziz Abdulwahab (Lead Technical Architect) and Ibrahim Abdulwahab (Founder & CEO).

Products:
1. "ace-acad": Flutter mobile exam preparation platform for Nigerian tertiary students (courses, study paths, offline drift DB, PDF library, flashcards, quizzes).
2. "plantiq": AI-powered agricultural diagnostics and disease detection tool for smallholder farmers.
3. "wstar-core": Corporate governance, investor decks, legal compliance (CAMA 2020, NDPC), and company operating system.

Product Areas for Ace Acad:
- "area-auth": Firebase phone authentication, OTP verification, session management.
- "area-library": PDF viewer, document rendering, offline Drift sync, local storage.
- "area-study-path": Course curriculum tree, modules, learning milestones.
- "area-quiz": Timed mock exams, question banks, offline scoring.
- "area-gamification": Streaks, leaderboard points, XP rewards.

Assignees:
- "abdulaziz": All technical engineering, code fixes, database migrations, Flutter/Next.js architecture, CI/CD, and bug fixes.
- "ibrahim": All business development, pitch decks, investor meetings, pricing/monetization, campus ambassador playbooks, legal filings, and strategy.

Return JSON with exact keys:
{
  "type": "bug" | "task" | "feature" | "tech_debt" | "improvement" | "research",
  "productId": "ace-acad" | "plantiq" | "wstar-core",
  "productAreaId": "area-auth" | "area-library" | "area-study-path" | "area-quiz" | "area-gamification" | null,
  "priority": "critical" | "high" | "medium" | "low",
  "assignee": "abdulaziz" | "ibrahim",
  "confidence": number between 0.5 and 0.99,
  "reasoning": "1 short sentence explaining why"
}
`

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
    const limit = checkRateLimit(`ai-classify:${ip}`, { maxRequests: 30, windowMs: 60000 })
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please wait 1 minute.' },
        { status: 429 }
      )
    }

    const { text, context } = await req.json()

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text prompt is required' }, { status: 400 })
    }

    const userPrompt = `Classify this item:\nTitle: "${text}"\nContext/Notes: "${context || 'None'}"`
    logger.info(`Classifying quick capture: "${text.substring(0, 40)}..."`, 'AI-CLASSIFY')

    const classification = await callGeminiJson<ClassificationResult>(userPrompt, {
      model: 'gemini-3.5-flash-lite',
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.1,
    })

    return NextResponse.json({
      success: true,
      classification,
    })
  } catch (error: any) {
    console.error('[AI Classify Error]:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'AI Classification failed',
      },
      { status: 500 }
    )
  }
}
