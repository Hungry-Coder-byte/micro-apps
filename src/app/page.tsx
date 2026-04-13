'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { getClientRegistry, getClientFeatured } from '@/registry/registry'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import { SearchBox } from '@/components/search-box'
import {
  Grid3X3, Plus, ArrowRight, Sparkles, Brain,
  Code2, ArrowLeftRight, Globe, MapPin, FileCode2,
  Zap, Shield, Bot, Database, Braces, Binary,
  Regex, Hash, KeyRound, FileText, DollarSign,
  Clock, Send, Globe2, ListTree, CloudSun,
} from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { categoryMeta } from '@/registry/categories'

const appRegistry = getClientRegistry()

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  developer: Code2,
  data: ArrowLeftRight,
  'api-network': Globe,
  geo: MapPin,
  file: FileCode2,
  productivity: Zap,
  security: Shield,
  automation: Bot,
  'data-processing': Database,
  ai: Brain,
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

const totalTools      = appRegistry.length
const totalCategories = Object.keys(categoryMeta).length

const STATS = [
  { value: `${totalTools}+`, label: 'Tools available',   icon: Grid3X3 },
  { value: `${totalCategories}`,   label: 'Categories',          icon: Database },
  { value: '100%',                 label: 'Free to use',         icon: Sparkles },
  { value: '0',                    label: 'Sign-up required',    icon: Shield },
]

export default function Home() {
  const featured = getClientFeatured()
  const categories = Object.entries(categoryMeta)

  return (
    <div className="min-h-screen bg-background">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

          <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Grid3X3 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span>MicroApps</span>
          </Link>

          {/* Center search */}
          <SearchBox
            placeholder={`Search ${totalTools}+ tools or describe your problem…`}
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

      <main>

        {/* ── HERO ── */}
        <section className="relative overflow-hidden border-b">
          {/* Background blobs */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 -right-32 h-[500px] w-[500px] rounded-full bg-primary/8 blur-3xl" />
            <div className="absolute -bottom-40 -left-32 h-[500px] w-[500px] rounded-full bg-blue-500/6 blur-3xl" />
          </div>

          <div className="container mx-auto px-4 py-20 md:py-28">
            <div className="max-w-3xl mx-auto text-center">

              <Badge variant="outline" className="mb-6 gap-1.5 px-3 py-1 text-xs font-medium">
                <Sparkles className="h-3 w-3 text-primary" />
                {totalTools}+ free developer utilities
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                Every tool a developer
                <br />
                <span className="text-primary">actually needs</span>
              </h1>

              <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                JSON formatters, API testers, regex tools, converters and more —
                all in one place, forever free, no sign-up needed.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                <Link href="/apps">
                  <Button size="lg" className="gap-2 w-full sm:w-auto">
                    <Grid3X3 className="h-4 w-4" />
                    Explore All Tools
                  </Button>
                </Link>
                <Link href="/builder">
                  <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                    <Sparkles className="h-4 w-4" />
                    Open Builder
                  </Button>
                </Link>
              </div>

              {/* Search — mobile only (desktop has navbar search) */}
              <SearchBox
                placeholder="Search tools or describe your problem…"
                className="max-w-md mx-auto md:hidden"
                dropdownWidth="w-full"
                dropdownOffset="left-0"
                inputClassName="h-12 text-base"
              />

            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATS.map(({ value, label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl font-bold leading-none">{value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-14 space-y-20">

          {/* ── FEATURED ── */}
          <section>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Featured Tools</h2>
                <p className="text-muted-foreground text-sm mt-1">Most popular utilities used by developers every day</p>
              </div>
              <Link href="/apps" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featured.slice(0, 8).map(app => (
                <Link key={app.slug} href={`/apps/${app.slug}`}>
                  <Card className="group relative overflow-hidden h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <AppIcon icon={app.icon} category={app.category} />
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm leading-snug group-hover:text-primary transition-colors">
                            {app.title}
                          </CardTitle>
                          <span className="text-xs text-muted-foreground capitalize mt-0.5 block">
                            {categoryMeta[app.category as keyof typeof categoryMeta]?.label ?? app.category}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-xs line-clamp-2 mb-3 leading-relaxed">
                        {app.description}
                      </CardDescription>
                      <div className="flex gap-1.5 flex-wrap">
                        {app.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t flex gap-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
                        <Button size="sm" className="h-7 text-xs flex-1 active:scale-95">Open</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs active:scale-95">+ Add</Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* ── CATEGORIES ── */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Browse by Category</h2>
              <p className="text-muted-foreground text-sm mt-1">Find exactly what you need organized by purpose</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(([cat, meta]) => {
                const count = appRegistry.filter(a => a.category === cat).length
                const CatIcon = categoryIcons[cat] ?? Grid3X3
                const appsInCat = appRegistry.filter(a => a.category === cat).slice(0, 3)

                return (
                  <Link key={cat} href={`/apps?category=${cat}`}>
                    <Card className="group h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 cursor-pointer overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`h-10 w-10 rounded-xl ${meta.color} flex items-center justify-center text-white shadow-sm`}>
                            <CatIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-sm group-hover:text-primary transition-colors">{meta.label}</CardTitle>
                            <p className="text-xs text-muted-foreground">{count} tools</p>
                          </div>
                        </div>
                        <CardDescription className="text-xs leading-relaxed">{meta.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {appsInCat.map(a => (
                            <span key={a.slug} className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground">
                              {a.title}
                            </span>
                          ))}
                          {count > 3 && (
                            <span className="text-xs text-primary font-medium">+{count - 3} more</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* ── POPULAR INDIVIDUAL TOOLS ── */}
          <section>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Quick Access</h2>
                <p className="text-muted-foreground text-sm mt-1">Jump straight into the most-used tools</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {([
                { slug: 'json-formatter', label: 'JSON Formatter', icon: Braces, color: 'bg-blue-500' },
                { slug: 'base64', label: 'Base64', icon: Binary, color: 'bg-indigo-500' },
                { slug: 'regex-tester', label: 'Regex Tester', icon: Regex, color: 'bg-violet-500' },
                { slug: 'uuid-generator', label: 'UUID Gen', icon: Hash, color: 'bg-purple-500' },
                { slug: 'jwt-decoder', label: 'JWT Decoder', icon: KeyRound, color: 'bg-pink-500' },
                { slug: 'html-markdown', label: 'HTML↔MD', icon: FileText, color: 'bg-rose-500' },
                { slug: 'currency-converter', label: 'Currency', icon: DollarSign, color: 'bg-green-500' },
                { slug: 'timezone-converter', label: 'Timezone', icon: Clock, color: 'bg-teal-500' },
                { slug: 'api-tester', label: 'API Tester', icon: Send, color: 'bg-cyan-500' },
                { slug: 'dns-lookup', label: 'DNS Lookup', icon: Globe2, color: 'bg-sky-500' },
                { slug: 'http-headers', label: 'HTTP Headers', icon: ListTree, color: 'bg-blue-600' },
                { slug: 'weather', label: 'Weather', icon: CloudSun, color: 'bg-orange-500' },
              ] as const).map(({ slug, label, icon: Icon, color }) => (
                <Link key={slug} href={`/apps/${slug}`}>
                  <div className="group flex flex-col items-center gap-2 p-4 rounded-xl border bg-card hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-center">
                    <div className={`h-10 w-10 rounded-xl ${color} flex items-center justify-center text-white shadow-sm`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium leading-tight group-hover:text-primary transition-colors">{label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── CTA ROW ── */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* AI Builder CTA */}
            <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
              <Sparkles className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Build with AI</h3>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                Describe the tool you need and AI will generate a fully working React component — deployed instantly.
              </p>
              <div className="flex gap-3">
                <Link href="/custom/new">
                  <Button className="gap-2 active:scale-95">
                    <Plus className="h-4 w-4" />
                    Create App
                  </Button>
                </Link>
                <Link href="/custom">
                  <Button variant="outline" className="active:scale-95">My Apps</Button>
                </Link>
              </div>
            </div>

            {/* Request CTA */}
            <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-green-500/10 via-green-500/5 to-background p-8">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-green-500/10 blur-2xl" />
              <ArrowRight className="h-8 w-8 text-green-600 dark:text-green-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Request a Tool</h3>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                Can't find what you need? Submit a request and our team will build it for you — usually within 48 hours.
              </p>
              <Link href="/request">
                <Button variant="outline" className="gap-2 active:scale-95">
                  Request App
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

          </section>

        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t mt-10 bg-muted/20">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

            <div>
              <div className="flex items-center gap-2 font-bold text-base mb-1">
                <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
                  <Grid3X3 className="h-3 w-3 text-primary-foreground" />
                </div>
                MicroApps
              </div>
              <p className="text-xs text-muted-foreground max-w-xs">
                A free collection of developer utilities. No sign-up, no tracking, just tools.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
              <div>
                <p className="font-medium mb-2 text-xs uppercase tracking-wide text-muted-foreground">Tools</p>
                <div className="space-y-1.5">
                  <Link href="/apps" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">All Apps</Link>
                  <Link href="/apps?category=developer" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Developer</Link>
                  <Link href="/apps?category=security" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Security</Link>
                  <Link href="/apps?category=api-network" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">API & Network</Link>
                </div>
              </div>
              <div>
                <p className="font-medium mb-2 text-xs uppercase tracking-wide text-muted-foreground">Build</p>
                <div className="space-y-1.5">
                  <Link href="/builder" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Workflow Builder</Link>
                  <Link href="/custom/new" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">AI App Generator</Link>
                  <Link href="/custom" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">My Apps</Link>
                  <Link href="/request" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Request a Tool</Link>
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="font-medium mb-2 text-xs uppercase tracking-wide text-muted-foreground">Categories</p>
                <div className="space-y-1.5">
                  <Link href="/apps?category=data" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Data & Conversion</Link>
                  <Link href="/apps?category=geo" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Geo & Location</Link>
                  <Link href="/apps?category=automation" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Automation</Link>
                  <Link href="/apps?category=data-processing" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Data Processing</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} MicroApps. Built for developers.</span>
            <div className="flex items-center gap-1">
              <span>Theme:</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
