'use client'

import { useState, useEffect, useRef } from 'react'
import { getClientRegistry } from '@/registry/registry'
import type { AppManifest } from '@/registry/types'

const appRegistry = getClientRegistry()

/**
 * Detects if a query looks like a natural-language problem description
 * rather than a keyword search (e.g. "I need to convert JSON to CSV")
 */
function isNaturalLanguage(query: string): boolean {
  const trimmed = query.trim()
  const words = trimmed.split(/\s+/)
  return words.length >= 3 || trimmed.length > 22
}

interface UseAiSearchReturn {
  aiResults: AppManifest[]
  aiLoading: boolean
  /** True when the query is long enough to trigger AI search */
  isAiQuery: boolean
}

export function useAiSearch(query: string, debounceMs = 650): UseAiSearchReturn {
  const [aiResults, setAiResults] = useState<AppManifest[]>([])
  const [aiLoading, setAiLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const controllerRef = useRef<AbortController | null>(null)

  const isAiQuery = isNaturalLanguage(query)

  useEffect(() => {
    // Clear previous timer
    if (timerRef.current) clearTimeout(timerRef.current)
    // Abort previous in-flight request
    controllerRef.current?.abort()

    if (!query.trim() || !isNaturalLanguage(query)) {
      setAiResults([])
      setAiLoading(false)
      return
    }

    setAiLoading(true)

    timerRef.current = setTimeout(async () => {
      const controller = new AbortController()
      controllerRef.current = controller

      try {
        const res = await fetch('/api/search/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
          signal: controller.signal,
        })
        const data = await res.json() as { slugs: string[] }
        const matched = (data.slugs ?? [])
          .map(slug => appRegistry.find(a => a.slug === slug))
          .filter(Boolean) as AppManifest[]
        setAiResults(matched)
      } catch {
        // aborted or Ollama down — stay silent
        setAiResults([])
      } finally {
        setAiLoading(false)
      }
    }, debounceMs)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      controllerRef.current?.abort()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return { aiResults, aiLoading, isAiQuery }
}
