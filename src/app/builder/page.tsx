'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { getClientRegistry } from '@/registry/registry'
import { categoryMeta } from '@/registry/categories'
import type { AppManifest } from '@/registry/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, X, ChevronRight, Sparkles, Play, Grid3X3 } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { SearchBox } from '@/components/search-box'

const allApps = getClientRegistry()

function AppIcon({ icon, category }: { icon: string; category: string }) {
  const meta = categoryMeta[category as keyof typeof categoryMeta]
  const IconComp = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[icon] ?? LucideIcons.Wrench
  return (
    <div className={`h-8 w-8 rounded-lg ${meta?.color ?? 'bg-muted'} flex items-center justify-center text-white shrink-0`}>
      <IconComp className="h-4 w-4" />
    </div>
  )
}

export default function BuilderPage() {
  const [search, setSearch] = useState('')
  const [pipeline, setPipeline] = useState<AppManifest[]>([])

  const filtered = useMemo(() => {
    if (!search.trim()) return allApps
    const lower = search.toLowerCase()
    return allApps.filter(a =>
      a.title.toLowerCase().includes(lower) ||
      a.description.toLowerCase().includes(lower) ||
      a.tags.some(t => t.toLowerCase().includes(lower))
    )
  }, [search])

  const addToPipeline = (app: AppManifest) => {
    if (pipeline.find(p => p.slug === app.slug)) return
    setPipeline(prev => [...prev, app])
  }

  const removeFromPipeline = (slug: string) => {
    setPipeline(prev => prev.filter(p => p.slug !== slug))
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    setPipeline(prev => {
      const next = [...prev]
      ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
      return next
    })
  }

  const moveDown = (index: number) => {
    if (index === pipeline.length - 1) return
    setPipeline(prev => {
      const next = [...prev]
      ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
      return next
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

          <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Grid3X3 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span>MicroApps</span>
          </Link>

          <SearchBox
            placeholder="Search tools or describe your problem…"
            className="hidden md:block w-full max-w-sm"
          />

          <div className="flex items-center gap-1 shrink-0">
            <Link href="/apps">
              <Button variant="ghost" size="sm" className="text-sm">Apps</Button>
            </Link>
            <Link href="/builder">
              <Button variant="ghost" size="sm" className="text-sm">Builder</Button>
            </Link>
            <Link href="/custom">
              <Button variant="ghost" size="sm" className="text-sm hidden sm:flex">My Apps</Button>
            </Link>
            <div className="w-px h-5 bg-border mx-1" />
            <ThemeToggle />
            <Link href="/builder">
              <Button size="sm" className="ml-1 gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Builder</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Left: App Picker */}
        <aside className="w-80 border-r flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold mb-3">Add Tools</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tools..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {filtered.map(app => (
              <button
                key={app.slug}
                onClick={() => addToPipeline(app)}
                disabled={!!pipeline.find(p => p.slug === app.slug)}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted transition text-left disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <AppIcon icon={app.icon} category={app.category} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{app.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{app.description}</p>
                </div>
                <Plus className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </aside>

        {/* Center: Pipeline Builder */}
        <main className="flex-1 flex flex-col p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Workflow Builder
            </h1>
            <p className="text-sm text-muted-foreground">
              Chain tools together to build powerful workflows. Output from one tool feeds into the next.
            </p>
          </div>

          {pipeline.length === 0 ? (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed rounded-2xl">
              <div className="text-center max-w-xs">
                <div className="text-4xl mb-3">🔗</div>
                <h3 className="font-semibold mb-1">No tools added yet</h3>
                <p className="text-sm text-muted-foreground">
                  Search and click tools on the left to build your workflow.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {pipeline.map((app, i) => (
                <div key={app.slug}>
                  <Card className="border hover:border-primary/40 transition-colors">
                    <CardHeader className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-5 text-center font-mono">{i + 1}</span>
                        <AppIcon icon={app.icon} category={app.category} />
                        <div className="flex-1">
                          <CardTitle className="text-sm">{app.title}</CardTitle>
                          <CardDescription className="text-xs">{app.description}</CardDescription>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => moveUp(i)}
                            disabled={i === 0}
                          >
                            <ChevronRight className="h-3 w-3 -rotate-90" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => moveDown(i)}
                            disabled={i === pipeline.length - 1}
                          >
                            <ChevronRight className="h-3 w-3 rotate-90" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => removeFromPipeline(app.slug)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {i < pipeline.length - 1 && (
                    <div className="flex items-center justify-center py-1">
                      <div className="h-6 w-px bg-border" />
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-4 flex items-center gap-3">
                <Link href={pipeline.length === 1 ? `/apps/${pipeline[0].slug}` : '#'}>
                  <Button className="flex items-center gap-2" disabled={pipeline.length === 0}>
                    <Play className="h-4 w-4" />
                    {pipeline.length === 1 ? 'Run App' : 'Run Workflow'}
                  </Button>
                </Link>

                <div className="flex gap-1.5 flex-wrap">
                  {pipeline.map(app => (
                    <Badge key={app.slug} variant="outline" className="text-xs">
                      {app.title}
                    </Badge>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto text-muted-foreground"
                  onClick={() => setPipeline([])}
                >
                  Clear all
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
