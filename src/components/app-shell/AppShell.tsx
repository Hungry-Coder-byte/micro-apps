'use client'

import React, { Suspense, useCallback, useEffect } from 'react'
import { loadApp } from '@/registry/loader'
import type { RegisteredApp } from '@/registry/types'
import Link from 'next/link'
import { ChevronRight, Copy, Check } from 'lucide-react'
import { categoryMeta } from '@/registry/categories'
import { useRecentApps } from '@/hooks/useRecentApps'
import { useClipboard } from '@/hooks/useClipboard'
import { Badge } from '@/components/ui/badge'
import * as LucideIcons from 'lucide-react'

function Spinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  )
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; slug: string },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; slug: string }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error } }
  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
          <p className="font-semibold text-destructive">Failed to load app</p>
          <p className="text-sm text-muted-foreground mt-1">{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })} className="mt-3 text-sm underline">Try again</button>
        </div>
      )
    }
    return this.props.children
  }
}

export function AppShell({ manifest, slug }: { manifest: Omit<RegisteredApp, 'load'>; slug: string }) {
  const LazyApp = loadApp(slug)
  const { addRecent } = useRecentApps()
  const { copy, copied } = useClipboard()
  const meta = categoryMeta[manifest.category]

  useEffect(() => { addRecent(manifest.slug) }, [manifest.slug])

  const serverFetch = useCallback(async (service: string, params: Record<string, string>) => {
    const qs = new URLSearchParams(params).toString()
    const res = await fetch(`/api/proxy/${service}?${qs}`)
    const json = await res.json()
    if (!json.ok) throw new Error(json.error ?? 'Request failed')
    return json.data
  }, [])

  const IconComp = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[manifest.icon] ?? LucideIcons.Wrench

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/apps?category=${manifest.category}`} className="hover:text-foreground">{meta.label}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{manifest.title}</span>
        </div>
      </div>

      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`rounded-xl p-3 ${meta.color} text-white`}>
                <IconComp className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{manifest.title}</h1>
                <p className="text-muted-foreground mt-1">{manifest.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {manifest.tags.slice(0, 5).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => copy(window.location.href)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground border rounded-md px-3 py-1.5 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* App Content */}
      <main className="container mx-auto px-4 py-8">
        <ErrorBoundary slug={manifest.slug}>
          <Suspense fallback={<Spinner />}>
            <LazyApp serverFetch={manifest.executionMode === 'server-assisted' ? serverFetch : undefined} />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  )
}
