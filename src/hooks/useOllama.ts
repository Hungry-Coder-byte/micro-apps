import { useState, useRef, useCallback } from 'react'

interface UseOllamaOptions {
  model: string
  system?: string
}

export function useOllama({ model, system }: UseOllamaOptions) {
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const abortRef = useRef<AbortController | null>(null)

  const run = useCallback(async (prompt: string, images?: string[]) => {
    setOutput('')
    setError('')
    setLoading(true)
    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/proxy/ollama', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, prompt, system, images }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        const json = await res.json() as { error?: string }
        throw new Error(json.error ?? `Request failed (${res.status})`)
      }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let text = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value, { stream: true })
        setOutput(text)
      }
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        setError((e as Error).message)
      }
    } finally {
      setLoading(false)
    }
  }, [model, system])

  const stop = useCallback(() => {
    abortRef.current?.abort()
    setLoading(false)
  }, [])

  const reset = useCallback(() => {
    setOutput('')
    setError('')
  }, [])

  return { output, loading, error, run, stop, reset }
}
