import { NextRequest, NextResponse } from 'next/server'

const OLLAMA_BASE = 'http://127.0.0.1:11434'

export async function POST(req: NextRequest) {
  const { model, prompt, system, images } = await req.json()

  if (!model || !prompt) {
    return NextResponse.json({ ok: false, error: 'model and prompt are required' }, { status: 400 })
  }

  let ollamaRes: Response
  try {
    ollamaRes = await fetch(`${OLLAMA_BASE}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        system: system ?? '',
        images: images ?? [],
        stream: true,
      }),
    })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Cannot connect to Ollama. Make sure `ollama serve` is running on port 11434.' },
      { status: 503 }
    )
  }

  if (!ollamaRes.ok) {
    const text = await ollamaRes.text()
    return NextResponse.json(
      { ok: false, error: `Ollama error (${ollamaRes.status}): ${text}` },
      { status: 502 }
    )
  }

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      const reader = ollamaRes.body!.getReader()
      const decoder = new TextDecoder()

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          for (const line of chunk.split('\n')) {
            if (!line.trim()) continue
            try {
              const json = JSON.parse(line) as { response?: string; done?: boolean }
              if (json.response) {
                controller.enqueue(encoder.encode(json.response))
              }
            } catch {
              // skip malformed lines
            }
          }
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}

// Health check — list available models
export async function GET() {
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/tags`)
    if (!res.ok) throw new Error('not running')
    const data = await res.json() as { models?: { name: string }[] }
    return NextResponse.json({
      ok: true,
      data: { models: (data.models ?? []).map(m => m.name) },
    })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Ollama is not running. Start it with: ollama serve' },
      { status: 503 }
    )
  }
}
