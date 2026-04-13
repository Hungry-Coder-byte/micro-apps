import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Anthropic from '@anthropic-ai/sdk'

type Params = { params: Promise<{ id: string }> }

const SYSTEM_PROMPT = `You are an expert React developer creating a standalone micro-app component.

STRICT RULES — follow every one or the app will break:
1. Output ONLY raw JavaScript/JSX. No markdown. No \`\`\` fences. No explanations before or after.
2. Do NOT write any import statements. All required globals are pre-loaded.
3. Do NOT write export statements of any kind.
4. Define your main component as exactly: function App() { return (...) }
5. The LAST LINE of your output must be exactly:
   ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
6. Use Tailwind CSS classes for ALL styling. No <style> tags, no inline style objects.
7. The app must be fully self-contained, interactive, and production-quality.

AVAILABLE GLOBALS (no imports needed):
- React, ReactDOM (React 18)
- useState, useEffect, useCallback, useMemo, useRef, useReducer, createContext, useContext
- Tailwind CSS (all utility classes)
- fetch (for API calls if truly necessary — note: no CORS proxy available)
- localStorage, sessionStorage (browser-native)

DESIGN STANDARDS:
- Use a clean, modern design with proper spacing and visual hierarchy
- Support light mode gracefully (white/gray backgrounds, dark text)
- Make the UI polished: add hover states, focus rings, smooth transitions
- Handle loading, error, and empty states explicitly
- Use emoji as icons (e.g. 🔍 📋 ✅ ❌ ⚡ 🎨 🔒 📊 💡 etc.) — no icon library imports
- Ensure the app feels complete and useful, not like a demo

APP TO BUILD:
`

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params
  const body = await req.json()
  const { prompt, provider = 'ollama', modelName, apiKey } = body

  if (!prompt) {
    return NextResponse.json({ ok: false, error: 'Prompt is required' }, { status: 400 })
  }

  const fullPrompt = `${SYSTEM_PROMPT}${prompt}\n\nGenerate the complete App component now:`
  const encoder = new TextEncoder()

  // ────────────────────────────────────────────────────────────────
  // OLLAMA
  // ────────────────────────────────────────────────────────────────
  if (provider === 'ollama') {
    const model = modelName || 'llama3:latest'
    let ollamaRes: Response

    try {
      ollamaRes = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, prompt: fullPrompt, stream: true }),
      })
    } catch {
      return NextResponse.json(
        { ok: false, error: `Cannot connect to Ollama. Make sure it is running: ollama serve` },
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

    let accumulated = ''
    const stream = new ReadableStream({
      async start(controller) {
        const reader = ollamaRes.body!.getReader()
        const dec = new TextDecoder()
        let buf = ''

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            buf += dec.decode(value, { stream: true })
            const lines = buf.split('\n')
            buf = lines.pop() ?? ''

            for (const line of lines) {
              if (!line.trim()) continue
              try {
                const obj = JSON.parse(line)
                if (obj.response) {
                  accumulated += obj.response
                  controller.enqueue(encoder.encode(obj.response))
                }
                if (obj.done) break
              } catch { /* skip bad JSON lines */ }
            }
          }
        } finally {
          controller.close()
          // Persist generated code to DB
          if (accumulated.trim()) {
            await prisma.customApp.update({
              where: { id },
              data: { code: accumulated },
            }).catch(() => { /* non-fatal */ })
          }
        }
      },
    })

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }

  // ────────────────────────────────────────────────────────────────
  // ANTHROPIC
  // ────────────────────────────────────────────────────────────────
  if (provider === 'anthropic') {
    const resolvedKey = apiKey || process.env.ANTHROPIC_API_KEY
    if (!resolvedKey || resolvedKey === 'your_key_here') {
      return NextResponse.json(
        { ok: false, error: 'Anthropic API key is required. Enter it in the model settings or add ANTHROPIC_API_KEY to .env.local' },
        { status: 503 }
      )
    }

    const client = new Anthropic({ apiKey: resolvedKey })
    const model = modelName || 'claude-sonnet-4-6'

    let accumulated = ''

    try {
      const anthropicStream = await client.messages.stream({
        model,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: `${prompt}\n\nGenerate the complete App component now:` }],
      })

      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of anthropicStream) {
              if (
                chunk.type === 'content_block_delta' &&
                chunk.delta.type === 'text_delta'
              ) {
                accumulated += chunk.delta.text
                controller.enqueue(encoder.encode(chunk.delta.text))
              }
            }
          } finally {
            controller.close()
            if (accumulated.trim()) {
              await prisma.customApp.update({
                where: { id },
                data: { code: accumulated },
              }).catch(() => { /* non-fatal */ })
            }
          }
        },
      })

      return new Response(readable, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Anthropic API error'
      return NextResponse.json({ ok: false, error: msg }, { status: 500 })
    }
  }

  // ────────────────────────────────────────────────────────────────
  // OPENAI
  // ────────────────────────────────────────────────────────────────
  if (provider === 'openai') {
    const resolvedKey = apiKey || process.env.OPENAI_API_KEY
    if (!resolvedKey) {
      return NextResponse.json(
        { ok: false, error: 'OpenAI API key is required. Enter it in the model settings.' },
        { status: 503 }
      )
    }

    const model = modelName || 'gpt-4o'
    let openaiRes: Response

    try {
      openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resolvedKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `${prompt}\n\nGenerate the complete App component now:` },
          ],
          stream: true,
          max_tokens: 4096,
        }),
      })
    } catch {
      return NextResponse.json(
        { ok: false, error: 'Cannot connect to OpenAI API. Check your internet connection.' },
        { status: 503 }
      )
    }

    if (!openaiRes.ok) {
      const text = await openaiRes.text()
      let errMsg = `OpenAI error (${openaiRes.status})`
      try {
        const errJson = JSON.parse(text)
        errMsg = errJson.error?.message || errMsg
      } catch { /* use default */ }
      return NextResponse.json({ ok: false, error: errMsg }, { status: 502 })
    }

    let accumulated = ''
    const stream = new ReadableStream({
      async start(controller) {
        const reader = openaiRes.body!.getReader()
        const dec = new TextDecoder()
        let buf = ''

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            buf += dec.decode(value, { stream: true })
            const lines = buf.split('\n')
            buf = lines.pop() ?? ''

            for (const line of lines) {
              if (!line.startsWith('data: ')) continue
              const data = line.slice(6).trim()
              if (data === '[DONE]') return
              try {
                const obj = JSON.parse(data)
                const content = obj.choices?.[0]?.delta?.content
                if (content) {
                  accumulated += content
                  controller.enqueue(encoder.encode(content))
                }
              } catch { /* skip */ }
            }
          }
        } finally {
          controller.close()
          if (accumulated.trim()) {
            await prisma.customApp.update({
              where: { id },
              data: { code: accumulated },
            }).catch(() => { /* non-fatal */ })
          }
        }
      },
    })

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }

  return NextResponse.json(
    { ok: false, error: `Unknown provider: ${provider}` },
    { status: 400 }
  )
}
