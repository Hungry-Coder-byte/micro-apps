'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Plus, Bot, Sparkles, Trash2, ExternalLink,
  Clock, Grid3X3, ChevronRight, Loader2,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

interface CustomApp {
  id: string
  title: string
  description: string
  createdAt: string
  code: string
}

export default function CustomAppsPage() {
  const [apps, setApps] = useState<CustomApp[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchApps = () =>
    fetch('/api/custom')
      .then(r => r.json())
      .then(d => { if (d.ok) setApps(d.data || []) })
      .finally(() => setLoading(false))

  useEffect(() => { fetchApps() }, [])

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Delete this app permanently?')) return
    setDeletingId(id)
    await fetch(`/api/custom/${id}`, { method: 'DELETE' })
    setApps(prev => prev.filter(a => a.id !== id))
    setDeletingId(null)
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
          <div className="flex items-center gap-2">
            <Link href="/apps">
              <Button variant="ghost" size="sm">Apps</Button>
            </Link>
            <Link href="/builder">
              <Button variant="ghost" size="sm">Builder</Button>
            </Link>
            <ThemeToggle />
            <Link href="/custom/new">
              <Button size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Create App
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">My AI Apps</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-md">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My AI Apps</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Apps you generated with AI · {loading ? '…' : apps.length} apps
              </p>
            </div>
          </div>
          <Link href="/custom/new">
            <Button className="gap-2">
              <Sparkles className="h-4 w-4" /> Generate New App
            </Button>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : apps.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {apps.map(app => (
              <Link key={app.id} href={`/custom/${app.id}`}>
                <div className="group relative h-full rounded-xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 overflow-hidden cursor-pointer flex flex-col">
                  {/* Card header with gradient */}
                  <div className="h-2 bg-gradient-to-r from-primary/60 via-primary to-purple-500/60" />

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Bot className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-1">
                          {app.title}
                        </h3>
                        <Badge variant="secondary" className="text-[10px] mt-1">AI Generated</Badge>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                      {app.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <div className={`flex items-center gap-1 text-[10px] font-medium ${app.code ? 'text-green-600' : 'text-amber-600'}`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${app.code ? 'bg-green-500' : 'bg-amber-400'}`} />
                        {app.code ? 'Ready' : 'No code yet'}
                      </div>
                    </div>
                  </div>

                  {/* Hover actions */}
                  <div className="absolute bottom-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
                    <button
                      onClick={e => handleDelete(e, app.id)}
                      disabled={deletingId === app.id}
                      className="h-7 w-7 rounded-md border bg-background/90 backdrop-blur-sm flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
                      title="Delete"
                    >
                      {deletingId === app.id
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <Trash2 className="h-3.5 w-3.5" />}
                    </button>
                    <div className="h-7 px-2 rounded-md border bg-background/90 backdrop-blur-sm flex items-center gap-1 text-xs font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                      <ExternalLink className="h-3 w-3" /> Open
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* Create new card */}
            <Link href="/custom/new">
              <div className="h-full min-h-[180px] rounded-xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group">
                <div className="h-12 w-12 rounded-xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center group-hover:border-primary/40 transition-colors">
                  <Plus className="h-6 w-6 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Generate New App</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">With AI in seconds</p>
                </div>
              </div>
            </Link>
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">No apps yet</h2>
            <p className="text-muted-foreground text-sm mb-8 max-w-sm">
              Describe what you want to build and AI will generate a complete, interactive micro-app in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <Link href="/custom/new">
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-4 w-4" /> Generate Your First App
                </Button>
              </Link>
              <Link href="/apps">
                <Button size="lg" variant="outline">Browse Existing Apps</Button>
              </Link>
            </div>

            {/* Sample ideas */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl w-full">
              {[
                { emoji: '🧮', title: 'Loan Calculator', desc: 'Monthly payments with interest' },
                { emoji: '🎨', title: 'Color Palette', desc: 'Generate & copy hex codes' },
                { emoji: '📊', title: 'BMI Calculator', desc: 'With health category labels' },
              ].map(idea => (
                <div key={idea.title} className="rounded-xl border bg-muted/30 p-4 text-left">
                  <span className="text-2xl">{idea.emoji}</span>
                  <p className="text-sm font-medium mt-2">{idea.title}</p>
                  <p className="text-xs text-muted-foreground">{idea.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
