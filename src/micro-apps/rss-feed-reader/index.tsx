'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Rss } from 'lucide-react'

const SAMPLE_FEED = 'https://feeds.feedburner.com/TechCrunch'

const ITEMS = [
  { title: 'The future of AI in enterprise software', date: '2026-04-12', source: 'TechCrunch' },
  { title: 'How edge computing is reshaping cloud infrastructure', date: '2026-04-11', source: 'TechCrunch' },
  { title: 'Open-source LLMs are catching up to proprietary models', date: '2026-04-10', source: 'TechCrunch' },
  { title: 'Why developer productivity tools are booming', date: '2026-04-09', source: 'TechCrunch' },
]

export default function RssFeedReader() {
  return (
    <div className="max-w-2xl mx-auto space-y-5 opacity-70 pointer-events-none select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">RSS / Atom Feed Reader</h2>
        <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 text-xs">Coming Soon</Badge>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 font-mono text-sm px-3 py-2 rounded-md border bg-muted/40 text-muted-foreground truncate">{SAMPLE_FEED}</div>
        <Button size="sm" disabled>Fetch Feed</Button>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center gap-2 text-xs font-medium">
          <Rss className="h-3.5 w-3.5 text-orange-500" /> TechCrunch — 4 articles
        </div>
        <div className="divide-y">
          {ITEMS.map((item, i) => (
            <div key={i} className="px-4 py-3 flex items-start justify-between gap-3">
              <p className="text-sm font-medium leading-snug">{item.title}</p>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-0.5">{item.date}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border p-4 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Saved Feeds</p>
        <div className="space-y-1">
          {['TechCrunch', 'Hacker News', 'CSS-Tricks'].map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Rss className="h-3 w-3 text-orange-400" /> {f}
            </div>
          ))}
        </div>
        <Button size="sm" variant="outline" disabled>+ Add Feed</Button>
      </div>
    </div>
  )
}
