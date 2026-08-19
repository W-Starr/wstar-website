import { NextRequest, NextResponse } from 'next/server'
import { callGeminiJson } from '@/os/lib/gemini'
import { checkRateLimit } from '@/os/lib/rateLimit'
import { logger } from '@/os/lib/logger'

export interface DecomposedSubtask {
  title: string
  estimatedMinutes?: number
  verificationCriterion?: string
}

export interface DecompositionResult {
  subtasks: DecomposedSubtask[]
  summary: string
}

const SYSTEM_PROMPT = `
You are the Lead Engineering Architect AI for WSTAR Technologies (Ace Acad, PlantIQ, WSTAR OS).
Your task is to decompose a complex feature, bug ticket, or engineering action item into 3-6 clear, actionable, sequential subtasks for the development team.

Rules:
1. Make each subtask concrete, verifiable, and technical.
2. Include reproduction or test verification where appropriate.
3. Keep descriptions concise and imperative (e.g. "Add Drift migration script for version 3 schema", "Write unit test in test/pdf_viewer_test.dart").

Return JSON format:
{
  "summary": "1 short sentence overview of the implementation plan",
  "subtasks": [
    {
      "title": "Clear action-oriented title",
      "estimatedMinutes": 30,
      "verificationCriterion": "How to verify this subtask is complete"
    }
  ]
}
`

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
    const limit = checkRateLimit(`ai-decompose:${ip}`, { maxRequests: 20, windowMs: 60000 })
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please wait 1 minute.' },
        { status: 429 }
      )
    }

    const { title, description, type, codeReference } = await req.json()

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Title is required for decomposition' }, { status: 400 })
    }

    const userPrompt = `Decompose this engineering item into actionable subtasks:
Type: ${type || 'task'}
Title: "${title}"
Description: "${description || 'None'}"
Code Reference: "${codeReference || 'None'}"`

    logger.info(`Decomposing item "${title}" with Gemini`, 'AI-DECOMPOSE')

    const result = await callGeminiJson<DecompositionResult>(userPrompt, {
      model: 'gemini-3.5-flash-lite',
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.2,
    })

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (error: any) {
    logger.error('AI Decomposition failed', 'AI-DECOMPOSE', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'AI Decomposition failed',
      },
      { status: 500 }
    )
  }
}
