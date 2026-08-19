import { NextRequest, NextResponse } from 'next/server'
import { callGeminiJson } from '@/os/lib/gemini'
import { checkRateLimit } from '@/os/lib/rateLimit'
import { logger } from '@/os/lib/logger'
import { ProductId, WorkItemType, WorkItemPriority } from '@/os/types'

const SYSTEM_PROMPT = `
You are the AI Chief Operating Officer and Strategic Command Interpreter for WSTAR Technologies (Nigeria).
The founders are Abdulaziz Abdulwahab (Lead Technical Architect) and Ibrahim Abdulwahab (Founder & CEO).
Products: Ace Acad (EdTech for Nigerian tertiary universities), PlantIQ (AgriTech / Solar IoT), and WSTAR Core.

Your mission is to interpret a complex conversational thought, voice transcript, or stream-of-consciousness instruction from a founder and translate it into a structured, actionable execution plan for WSTAR OS.

Pipeline:
1. Understand: Extract intent, product scope, and any referenced Google Drive documents, proposals, or meetings.
2. Confirm: Generate a human-readable synthesis explaining what WSTAR OS understood and what it proposes to create.
3. Execution Plan: Generate the exact records to create (Initiative, Work Items, Decisions, Roadmap updates).

Assignee Rules:
- "abdulaziz": Flutter architecture, Dart, Drift SQLite, Firebase, backend APIs, Google Drive webhooks, technical debt, algorithms, security.
- "ibrahim": Business strategy, Class Rep compensation, campus marketing, NDPA 2023 legal compliance, investor decks (Tony Elumelu Foundation), partnerships.

Output Schema:
{
  "understoodIntent": "Clear 1-2 sentence explanation of what the founder wants to accomplish",
  "recommendedAction": "e.g. Create new Roadmap Initiative, link Google Drive Source, and generate 4 development tickets",
  "matchedSourceTitle": "Title of existing Google Drive document or source that matches the instruction (if any)",
  "productId": "ace-acad",
  "initiative": {
    "title": "Title of the proposed project / initiative",
    "description": "1-2 sentence description",
    "targetQuarter": "Q3-Q4 2026",
    "horizon": "now"
  },
  "workItems": [
    {
      "title": "Concrete task title",
      "type": "task",
      "priority": "high",
      "assignee": "abdulaziz",
      "productArea": "Engineering & Architecture",
      "description": "Contextual description"
    }
  ],
  "decisions": [
    {
      "title": "Decision title",
      "decision": "What is agreed upon",
      "reason": "Why this approach was selected"
    }
  ],
  "confidence": 0.95
}
`

export interface SourceCommandResponse {
  understoodIntent: string
  recommendedAction: string
  matchedSourceTitle?: string
  productId: ProductId
  initiative?: {
    title: string
    description: string
    targetQuarter?: string
    horizon?: 'now' | 'next' | 'later'
  }
  workItems: Array<{
    title: string
    type: WorkItemType
    priority: WorkItemPriority
    assignee: 'abdulaziz' | 'ibrahim' | 'unassigned'
    productArea?: string
    description?: string
  }>
  decisions: Array<{
    title: string
    decision: string
    reason: string
  }>
  confidence: number
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
    const limit = checkRateLimit(`ai-source-command:${ip}`, { maxRequests: 20, windowMs: 60000 })
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please wait a moment.' },
        { status: 429 }
      )
    }

    const { commandText, currentSources } = await req.json()

    if (!commandText || typeof commandText !== 'string' || !commandText.trim()) {
      return NextResponse.json(
        { success: false, error: 'commandText is required.' },
        { status: 400 }
      )
    }

    logger.info(`Processing Universal Natural Language Command: "${commandText.slice(0, 80)}..."`, 'AI-COMMAND')

    const sourcesContext = Array.isArray(currentSources) && currentSources.length > 0
      ? `\nAvailable Company Google Drive Sources:\n` +
        currentSources.map((s: any) => `- [${s.sourceNumber}] ${s.title} (Product: ${s.relatedProductId})`).join('\n')
      : ''

    const userPrompt = `Founder Natural Language Command:
"${commandText.trim()}"
${sourcesContext}`

    const plan = await callGeminiJson<SourceCommandResponse>(userPrompt, {
      model: 'gemini-flash-latest',
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.2,
    })

    return NextResponse.json({
      success: true,
      plan,
    })
  } catch (error: any) {
    logger.error('Universal Command Interpretation Error', 'AI-COMMAND', { error: error.message || String(error) })
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to interpret natural language command.' },
      { status: 500 }
    )
  }
}
