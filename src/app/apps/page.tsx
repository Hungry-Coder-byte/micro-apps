'use client'

import { useState, useMemo, Suspense, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getClientRegistry } from '@/registry/registry'
import { categoryMeta } from '@/registry/categories'
import type { AppCategory } from '@/registry/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import { SearchBox } from '@/components/search-box'
import {
  Search, Grid3X3, Sparkles, ChevronRight,
  Code2, ArrowLeftRight, Globe, MapPin, FileCode2,
  Zap, Shield, Bot, Database, LayoutGrid, Star, Brain, Plus,
} from 'lucide-react'
import * as LucideIcons from 'lucide-react'

interface CustomAppCard { id: string; title: string; description: string }

const appRegistry = getClientRegistry()

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  developer:         Code2,
  data:              ArrowLeftRight,
  'api-network':     Globe,
  geo:               MapPin,
  file:              FileCode2,
  productivity:      Zap,
  security:          Shield,
  automation:        Bot,
  'data-processing': Database,
  ai:                Brain,
}

function AppIcon({ icon, category }: { icon: string; category: string }) {
  const meta = categoryMeta[category as keyof typeof categoryMeta]
  const IconComp = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[icon] ?? LucideIcons.Wrench
  return (
    <div className={`h-10 w-10 rounded-xl ${meta?.color ?? 'bg-muted'} flex items-center justify-center text-white shrink-0 shadow-sm`}>
      <IconComp className="h-5 w-5" />
    </div>
  )
}

function AppsContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category') as AppCategory | null
  const [searchTerm, setSearchTerm] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [customApps, setCustomApps] = useState<CustomAppCard[]>([])

  useEffect(() => {
    fetch('/api/custom')
      .then(r => r.json())
      .then(d => { if (d.ok) setCustomApps((d.data || []).slice(0, 6)) })
      .catch(() => { /* non-fatal */ })
  }, [])

  const filtered = useMemo(() => {
    let result = appRegistry
    if (categoryParam) result = result.filter(a => a.category === categoryParam)
    if (searchTerm) {
      const lower = searchTerm.toLowerCase()
      result = result.filter(a =>
        a.title.toLowerCase().includes(lower) ||
        a.description.toLowerCase().includes(lower) ||
        a.tags.some(t => t.toLowerCase().includes(lower))
      )
    }
    return result
  }, [categoryParam, searchTerm])

  const currentCategory = categoryParam ? categoryMeta[categoryParam] : null
  const CatIcon = categoryParam ? (categoryIcons[categoryParam] ?? Grid3X3) : LayoutGrid

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

          <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Grid3X3 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span>MicroApps</span>
          </Link>

          {/* Search */}
          <SearchBox
            placeholder="Search tools or describe your problem…"
            className="hidden md:block w-full max-w-sm"
          />

          <div className="flex items-center gap-1 shrink-0">
            <Link href="/apps">
              <Button variant="ghost" size="sm" className="text-sm font-semibold">Apps</Button>
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

        {/* ── SIDEBAR ── */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 border-r bg-background flex flex-col pt-16
          transition-transform duration-200
          md:static md:translate-x-0 md:z-auto md:pt-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col flex-1 overflow-y-auto p-4">

            {/* Logo (mobile only) */}
            <div className="flex items-center gap-2 font-bold text-base mb-6 md:hidden">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                <Grid3X3 className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              MicroApps
            </div>

            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-2">Navigation</p>

            <nav className="space-y-0.5 mb-6">
              <Link href="/" className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <Grid3X3 className="h-4 w-4" /> Home
              </Link>
              <Link href="/builder" className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <Sparkles className="h-4 w-4" /> Builder
              </Link>
              <Link href="/custom/new" className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <Code2 className="h-4 w-4" /> AI Generator
              </Link>
            </nav>

            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-2">Categories</p>

            <nav className="space-y-0.5">
              <Link
                href="/apps"
                className={`flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-colors ${
                  !categoryParam
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <LayoutGrid className="h-4 w-4" />
                  All Tools
                </span>
                <span className="text-xs font-mono">{appRegistry.length}</span>
              </Link>

              {Object.entries(categoryMeta).map(([cat, meta]) => {
                const Icon = categoryIcons[cat] ?? Grid3X3
                const count = appRegistry.filter(a => a.category === cat).length
                const isActive = categoryParam === cat
                return (
                  <Link
                    key={cat}
                    href={`/apps?category=${cat}`}
                    className={`flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4" />
                      {meta.label}
                    </span>
                    <span className="text-xs font-mono">{count}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="p-4 border-t">
            <p className="text-xs text-muted-foreground">v1.0 • MicroApps</p>
          </div>
        </aside>

        {/* Sidebar overlay (mobile) */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── MAIN ── */}
        <main className="flex-1 min-w-0">

          {/* Breadcrumb */}
          <div className="border-b bg-muted/20">
            <div className="px-4 md:px-6 py-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/apps" className="hover:text-foreground transition-colors">Apps</Link>
              {currentCategory && (
                <>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-foreground font-medium">{currentCategory.label}</span>
                </>
              )}
            </div>
          </div>

          <div className="px-4 md:px-6 py-8">

            {/* ── PAGE HEADER ── */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                {currentCategory ? (
                  <div className={`h-12 w-12 rounded-xl ${currentCategory.color} flex items-center justify-center text-white shadow-md`}>
                    <CatIcon className="h-6 w-6" />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md">
                    <LayoutGrid className="h-6 w-6" />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold">
                    {currentCategory ? currentCategory.label : 'All Tools'}
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {currentCategory ? currentCategory.description : 'Browse 45+ developer utilities'}
                    {' '}· <span className="font-medium text-foreground">{filtered.length} {filtered.length === 1 ? 'tool' : 'tools'}</span>
                  </p>
                </div>
              </div>

              {/* Mobile menu toggle + search */}
              <div className="flex gap-2">
                <SearchBox
                  placeholder="Search…"
                  className="flex-1 sm:w-64 md:hidden"
                  dropdownWidth="w-[340px]"
                  dropdownOffset="left-0"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  Filter
                </Button>
              </div>
            </div>

            {/* ── CATEGORY PILLS ── */}
            <div className="mb-6 flex flex-wrap gap-2">
              <Link href="/apps">
                <Badge
                  variant={!categoryParam ? 'default' : 'outline'}
                  className="cursor-pointer px-3 py-1.5 text-xs gap-1.5 hover:border-primary/60 transition-colors"
                >
                  <LayoutGrid className="h-3 w-3" />
                  All
                </Badge>
              </Link>
              {Object.entries(categoryMeta).map(([cat, meta]) => {
                const Icon = categoryIcons[cat] ?? Grid3X3
                return (
                  <Link key={cat} href={`/apps?category=${cat}`}>
                    <Badge
                      variant={categoryParam === cat ? 'default' : 'outline'}
                      className="cursor-pointer px-3 py-1.5 text-xs gap-1.5 hover:border-primary/60 transition-colors"
                    >
                      <Icon className="h-3 w-3" />
                      {meta.label}
                    </Badge>
                  </Link>
                )
              })}
            </div>

            {/* ── CUSTOM AI APPS SECTION ── */}
            {customApps.length > 0 && !categoryParam && !searchTerm && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    My AI-Generated Apps
                  </h2>
                  <Link href="/custom" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    View all →
                  </Link>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                  {customApps.map(app => (
                    <Link key={app.id} href={`/custom/${app.id}`} className="shrink-0 w-44">
                      <Card className="h-full hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group">
                        <CardHeader className="pb-2 pt-3 px-3">
                          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                          <CardTitle className="text-xs leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {app.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-3 pb-3 pt-0">
                          <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">{app.description}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                  <Link href="/custom/new" className="shrink-0 w-44">
                    <Card className="h-full border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer flex items-center justify-center group">
                      <div className="text-center p-4">
                        <div className="h-8 w-8 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mx-auto mb-2 group-hover:border-primary/40 transition-colors">
                          <Plus className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">New AI App</p>
                      </div>
                    </Card>
                  </Link>
                </div>
              </div>
            )}

            {/* ── APPS GRID ── */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(app => (
                  <Link key={app.slug} href={`/apps/${app.slug}`}>
                    <Card className="group h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 cursor-pointer overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-start gap-3">
                          <AppIcon icon={app.icon} category={app.category} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <CardTitle className="text-sm leading-snug group-hover:text-primary transition-colors">
                                {app.title}
                              </CardTitle>
                              {app.featured && (
                                <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 shrink-0 mt-0.5" />
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground capitalize mt-0.5 block">
                              {categoryMeta[app.category as keyof typeof categoryMeta]?.label}
                            </span>
                          </div>
                        </div>

                        <CardDescription className="text-xs leading-relaxed line-clamp-2 mt-1">
                          {app.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {app.tags.slice(0, 4).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0 font-normal">
                              {tag}
                            </Badge>
                          ))}
                          {app.tags.length > 4 && (
                            <span className="text-xs text-muted-foreground">+{app.tags.length - 4}</span>
                          )}
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
                          <Button size="sm" className="h-7 text-xs flex-1 active:scale-95">Open Tool</Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs active:scale-95">+ Add</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-1">No tools found</h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                  Try a different search term or browse another category
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setSearchTerm('')}>Clear search</Button>
                  <Link href="/apps"><Button>Browse all</Button></Link>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  )
}

export default function AppsPage() {
  return (
    <Suspense>
      <AppsContent />
    </Suspense>
  )
}
