import { NextRequest, NextResponse } from 'next/server'
import { callGeminiJson } from '@/os/lib/gemini'
import { checkRateLimit } from '@/os/lib/rateLimit'
import { logger } from '@/os/lib/logger'
import { ExtractedEntities } from '@/os/types'

const SYSTEM_PROMPT = `
You are the AI Chief Technical Architect and Strategic Intelligence Officer for WSTAR Technologies in Nigeria.
WSTAR's co-founders are Abdulaziz Abdulwahab (Lead Technical Architect) and Ibrahim Abdulwahab (Founder & CEO).
WSTAR's flagship products are Ace Acad (EdTech for Nigerian tertiary universities: ABU Zaria, UNILAG, UI, etc.), PlantIQ (AgriTech), and WSTAR Core.

Your mission is to read an unstructured source document (product proposal, meeting note, strategy pitch, or architecture specification) and extract structured organizational intelligence so founders can review and add prospective work items to WSTAR OS without manual data entry.

Assignee Assignment Rules:
- "abdulaziz": Flutter architecture, Dart, Drift SQLite, Firebase, backend APIs, Google Drive webhooks, technical debt, algorithms, security.
- "ibrahim": Business strategy, Class Rep compensation, campus marketing, NDPA 2023 legal compliance, investor decks (Tony Elumelu Foundation), partnerships.

Extract strictly into this JSON schema:
{
  "summary": "2-3 sentence concise executive summary of the document",
  "proposedInitiative": {
    "title": "Short title of the overarching project/initiative",
    "description": "Clear 1-2 sentence description of what the initiative achieves",
    "targetQuarter": "e.g. Q3-Q4 2026",
    "selected": true
  },
  "workstreams": [
    {
      "id": "ws-tech",
      "name": "e.g. Technical Architecture & Engineering",
      "description": "Focus area description",
      "suggestedLead": "abdulaziz",
      "tasks": [
        {
          "title": "Actionable task title with concrete scope",
          "type": "task",
          "priority": "high",
          "productId": "ace-acad",
          "assignee": "abdulaziz",
          "selected": true
        }
      ]
    }
  ],
  "decisions": [
    {
      "title": "Short title of architectural or strategic choice",
      "decision": "What is being chosen or agreed upon",
      "reason": "Why this choice is made over alternatives",
      "selected": true
    }
  ],
  "risks": [
    {
      "risk": "Description of risk",
      "impact": "High",
      "mitigation": "Concrete preventative or fallback step"
    }
  ],
  "dependencies": ["Prerequisite 1", "Prerequisite 2"],
  "openQuestions": ["Unresolved question 1 needing founder decision"],
  "assumptions": ["Underlying assumption 1"],
  "deadlines": ["Key timeline or target date"],
  "peopleAndOwners": ["Abdulaziz (Tech)", "Ibrahim (GTM)"],
  "referencedDocuments": ["List of referenced specs or earlier documents"],
  "supersededProposalNotes": "Notes on whether this proposal replaces, pivots, or updates older proposals"
}
`

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
    const limit = checkRateLimit(`ai-analyze-source:${ip}`, { maxRequests: 15, windowMs: 60000 })
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please wait a moment before analyzing another document.' },
        { status: 429 }
      )
    }

    const { sourceTitle, sourceContent, sourceUrl, productId } = await req.json()

    if (!sourceTitle && !sourceContent) {
      return NextResponse.json(
        { success: false, error: 'Please provide either sourceTitle or sourceContent to analyze.' },
        { status: 400 }
      )
    }

    logger.info(`Analyzing source document: ${sourceTitle || 'Untitled'}`, 'AI-SOURCE-ANALYSIS')

    const userPrompt = `Analyze this company document and extract actionable WSTAR OS organizational records:
Title: ${sourceTitle || 'Strategic Document'}
Product Scope: ${productId || 'ace-acad'}
Document URL / Origin: ${sourceUrl || 'Internal Document'}
Content / Notes:
${sourceContent || sourceTitle}`

    const extractedEntities = await callGeminiJson<ExtractedEntities>(userPrompt, {
      model: 'gemini-flash-latest',
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.2,
    })

    return NextResponse.json({
      success: true,
      extractedEntities,
    })
  } catch (error: any) {
    logger.error('Source Analysis Failed', 'AI-SOURCE-ANALYSIS', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'AI Source Analysis failed to complete.',
      },
      { status: 500 }
    )
  }
}
