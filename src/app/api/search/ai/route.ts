import { NextRequest, NextResponse } from 'next/server'
import { registry } from '@/registry/registry'

// Compact registry context — title + clipped description + tags
// Kept small so even fast local models can process it reliably
const REGISTRY_CONTEXT = registry
  .map(a => `${a.slug}: ${a.title} — ${a.description.slice(0, 90)} [${a.tags.join(', ')}]`)
  .join('\n')

const SYSTEM_PROMPT = `You are a developer tool recommender. Given a user problem description, return the slugs of the most relevant tools from the list below.

Rules:
- Return ONLY a raw JSON array of slug strings, nothing else
- Maximum 5 slugs, ordered by relevance (best first)
- Only use slugs that exist in the list
- If nothing matches, return []

Available tools:
${REGISTRY_CONTEXT}`

export async function POST(req: NextRequest) {
  try {
    const { query, model = 'gemma3:latest' } = await req.json() as { query: string; model?: string }

    if (!query?.trim()) return NextResponse.json({ slugs: [] })

    const ollamaRes = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        system: SYSTEM_PROMPT,
        prompt: `User problem: "${query}"\n\nReturn matching tool slugs as a JSON array:`,
        stream: false,
        options: { temperature: 0.1, num_predict: 100 },
      }),
      signal: AbortSignal.timeout(12_000),
    })

    if (!ollamaRes.ok) {
      return NextResponse.json({ slugs: [], error: 'Ollama unavailable' })
    }

    const data = await ollamaRes.json() as { response: string }
    const text = data.response.trim()

    // Extract JSON array from anywhere in the response
    const match = text.match(/\[[\s\S]*?\]/)
    if (!match) return NextResponse.json({ slugs: [] })

    const parsed = JSON.parse(match[0]) as unknown[]
    const validSlugs = (parsed as string[]).filter(
      s => typeof s === 'string' && registry.some(a => a.slug === s)
    )

    return NextResponse.json({ slugs: validSlugs.slice(0, 5) })
  } catch (err) {
    // Ollama not running or timed out — silently degrade
    const msg = err instanceof Error ? err.message : 'AI search unavailable'
    return NextResponse.json({ slugs: [], error: msg })
  }
}
