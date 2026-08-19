/**
 * WSTAR OS Server-Side Gemini AI Engine
 * Cost-optimized intelligence layer utilizing Gemini Flash & Flash-Lite
 */

import { env } from '../config/env'

export interface GeminiCallOptions {
  model?: 'gemini-flash-latest' | 'gemini-3.5-flash-lite' | 'gemini-3.6-flash' | 'gemini-3.7-flash'
  temperature?: number
  maxOutputTokens?: number
  jsonMode?: boolean
  systemInstruction?: string
}

export async function callGemini(
  prompt: string,
  options: GeminiCallOptions = {}
): Promise<string> {
  const apiKey = env.geminiApiKey
  const model = options.model || 'gemini-flash-latest'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const requestBody: any = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: options.temperature ?? 0.2,
      maxOutputTokens: options.maxOutputTokens ?? 8192,
    },
  }

  if (options.systemInstruction) {
    requestBody.systemInstruction = {
      parts: [{ text: options.systemInstruction }],
    }
  }

  if (options.jsonMode) {
    requestBody.generationConfig.responseMimeType = 'application/json'
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    })

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}))
      const errorMessage = errorJson?.error?.message || `HTTP ${res.status}`

      // If primary model fails or is unavailable, fallback to gemini-3.6-flash
      if (model !== 'gemini-3.6-flash' && res.status !== 400) {
        console.warn(`[Gemini Engine] Primary model ${model} failed (${errorMessage}), falling back to gemini-3.6-flash...`)
        return callGemini(prompt, { ...options, model: 'gemini-3.6-flash' })
      }

      throw new Error(`Gemini API Error: ${errorMessage}`)
    }

    const data = await res.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      throw new Error('Gemini returned an empty response candidate')
    }

    return text
  } catch (error: any) {
    console.error('[Gemini Engine Invocation Error]:', error)
    throw error
  }
}

/**
 * Call Gemini with structured JSON parsing and robust extraction
 */
export async function callGeminiJson<T>(
  prompt: string,
  options: Omit<GeminiCallOptions, 'jsonMode'> = {}
): Promise<T> {
  const responseText = await callGemini(prompt, {
    ...options,
    jsonMode: true,
  })

  // 1. First attempt: match markdown code block
  let jsonString = responseText.trim()
  const codeBlockMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  if (codeBlockMatch && codeBlockMatch[1]) {
    jsonString = codeBlockMatch[1].trim()
  } else {
    // 2. Fallback: extract substring between first { or [ and last } or ]
    const firstObj = responseText.indexOf('{')
    const firstArr = responseText.indexOf('[')
    const startIdx = firstObj === -1 ? firstArr : firstArr === -1 ? firstObj : Math.min(firstObj, firstArr)

    const lastObj = responseText.lastIndexOf('}')
    const lastArr = responseText.lastIndexOf(']')
    const endIdx = Math.max(lastObj, lastArr)

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      jsonString = responseText.substring(startIdx, endIdx + 1).trim()
    }
  }

  try {
    return JSON.parse(jsonString) as T
  } catch (initialErr) {
    // 3. Last-resort cleanup: remove trailing commas before closing braces/brackets
    try {
      const sanitized = jsonString
        .replace(/,\s*([}\]])/g, '$1')
        .replace(/[\u0000-\u001F]+/g, ' ')
      return JSON.parse(sanitized) as T
    } catch (fallbackErr) {
      console.error('[Gemini JSON Parse Error] Raw text:', responseText)
      throw new Error('Failed to parse Gemini response as structured JSON')
    }
  }
}
