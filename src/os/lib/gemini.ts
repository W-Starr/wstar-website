/**
 * WSTAR OS Server-Side Gemini AI Engine
 * Cost-optimized intelligence layer utilizing Gemini Flash & Flash-Lite
 */

import { env } from '../config/env'

export interface GeminiCallOptions {
  model?: 'gemini-3.5-flash-lite' | 'gemini-flash-latest' | 'gemini-3.6-flash'
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
  const model = options.model || 'gemini-3.5-flash-lite'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const requestBody: any = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: options.temperature ?? 0.2,
      maxOutputTokens: options.maxOutputTokens ?? 1024,
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

      // If primary model is unavailable or rate-limited, fallback to gemini-flash-latest
      if (model !== 'gemini-flash-latest' && res.status !== 400) {
        console.warn(`[Gemini Engine] Primary model ${model} failed (${errorMessage}), falling back to gemini-flash-latest...`)
        return callGemini(prompt, { ...options, model: 'gemini-flash-latest' })
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
 * Call Gemini with structured JSON parsing
 */
export async function callGeminiJson<T>(
  prompt: string,
  options: Omit<GeminiCallOptions, 'jsonMode'> = {}
): Promise<T> {
  const responseText = await callGemini(prompt, {
    ...options,
    jsonMode: true,
  })

  try {
    // Strip markdown code fences if present in JSON output
    const cleanJson = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim()
    return JSON.parse(cleanJson) as T
  } catch (e) {
    console.error('[Gemini JSON Parse Error] Raw text:', responseText)
    throw new Error('Failed to parse Gemini response as structured JSON')
  }
}
