import { NextRequest, NextResponse } from 'next/server'
import { callGeminiJson } from '@/os/lib/gemini'
import { checkRateLimit } from '@/os/lib/rateLimit'
import { logger } from '@/os/lib/logger'
import { WorkItemType, WorkItemPriority } from '@/os/types'

export const dynamic = 'force-dynamic'

interface ExtractedTask {
  title: string
  description: string
  type: WorkItemType
  priority: WorkItemPriority
  assignee: 'abdulaziz' | 'ibrahim'
  estimatedHours?: number
  codeReference?: string
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
    const limit = checkRateLimit(`ai-extract:${ip}`, { maxRequests: 10, windowMs: 60000 })
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'AI task extraction rate limit exceeded. Please try again in 1 minute.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { proposalNumber, title, problem, solution, phases } = body

    if (!title || !solution) {
      return NextResponse.json(
        { error: 'Proposal title and solution are required for task extraction' },
        { status: 400 }
      )
    }

    const phasesText = Array.isArray(phases)
      ? phases
          .map(
            (p: any, idx: number) =>
              `Phase ${p.phaseNumber || idx + 1}: ${p.title} (${p.timeline || ''})\nGoals: ${p.goals || ''}\nAction Items:\n${(p.actionItems || []).map((a: string) => `- ${a}`).join('\n')}`
          )
          .join('\n\n')
      : ''

    const prompt = `You are a Principal Software Architect & Product Lead for WSTAR Technology Corp.
Analyze this strategic proposal document and decompose it into a comprehensive list of 4 to 8 concrete engineering, product, or legal work items for the development sprint.

PROPOSAL:
- Identifier: ${proposalNumber || 'PROP-XXX'}
- Title: ${title}
- Problem Statement: ${problem || 'N/A'}
- Solution Architecture: ${solution}
- Implementation Phases:
${phasesText}

TEAM ASSIGNMENT RULES:
- "abdulaziz": Flutter architecture, Dart, Drift offline caching, PDF rendering, Firebase, AI integrations, performance, security.
- "ibrahim": Operations, CAC compliance, legal safe harbor, class rep agreements, university partnerships, student pilot cohorts, pitch decks, financials.

OUTPUT SCHEMA (Return ONLY valid JSON):
{
  "tasks": [
    {
      "title": "Clear, imperative ticket title",
      "description": "2-3 sentences explaining exact technical implementation steps and acceptance criteria.",
      "type": "task" | "bug" | "feature" | "tech_debt",
      "priority": "critical" | "high" | "medium" | "low",
      "assignee": "abdulaziz" | "ibrahim",
      "estimatedHours": 8,
      "codeReference": "${proposalNumber || 'PR-001'}"
    }
  ]
}`

    logger.info(`Decomposing proposal ${proposalNumber} with Gemini`, 'AI-EXTRACT')
    const result = await callGeminiJson<{ tasks: ExtractedTask[] }>(prompt, {
      model: 'gemini-flash-latest',
      temperature: 0.2,
    })

    return NextResponse.json({
      proposalNumber,
      tasks: result.tasks || [],
      count: result.tasks?.length || 0,
    })
  } catch (error) {
    logger.error('Failed to extract tasks from proposal', 'AI-EXTRACT', error)
    return NextResponse.json(
      { error: 'Failed to extract tasks from proposal via AI' },
      { status: 500 }
    )
  }
}
