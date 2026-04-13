'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { GitCompare, Construction } from 'lucide-react'

const DIFF_LINES = [
  { type: 'unchanged', line: '1',  text: 'The quick brown fox' },
  { type: 'removed',   line: '2',  text: 'jumps over the lazy dog.' },
  { type: 'added',     line: '2',  text: 'leaps over the sleeping cat.' },
  { type: 'unchanged', line: '3',  text: 'Pack my box with five' },
  { type: 'removed',   line: '4',  text: 'dozen liquor jugs.' },
  { type: 'added',     line: '4',  text: 'dozen fizzing wizard jugs.' },
  { type: 'unchanged', line: '5',  text: 'How vexingly quick' },
  { type: 'unchanged', line: '6',  text: 'daft zebras jump!' },
]

export default function TextDiff() {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs mb-1.5 block">Original (A)</Label>
          <textarea rows={5} disabled placeholder="Paste original text…"
            defaultValue={'The quick brown fox\njumps over the lazy dog.\nPack my box with five\ndozen liquor jugs.\nHow vexingly quick\ndaft zebras jump!'}
            className="w-full rounded-lg border bg-muted/30 p-3 text-xs font-mono resize-none opacity-60 cursor-not-allowed" />
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Modified (B)</Label>
          <textarea rows={5} disabled placeholder="Paste modified text…"
            defaultValue={'The quick brown fox\nleaps over the sleeping cat.\nPack my box with five\ndozen fizzing wizard jugs.\nHow vexingly quick\ndaft zebras jump!'}
            className="w-full rounded-lg border bg-muted/30 p-3 text-xs font-mono resize-none opacity-60 cursor-not-allowed" />
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center justify-between">
          <span className="text-xs font-medium">Diff output — unified view</span>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="text-red-500">− 2 removed</span>
            <span className="text-green-600">+ 2 added</span>
          </div>
        </div>
        <div className="font-mono text-xs divide-y">
          {DIFF_LINES.map(({ type, line, text }, i) => (
            <div key={i} className={`px-4 py-1.5 flex gap-3 ${
              type === 'removed' ? 'bg-red-500/10 text-red-700 dark:text-red-400'
              : type === 'added' ? 'bg-green-500/10 text-green-700 dark:text-green-400'
              : 'text-muted-foreground'
            }`}>
              <span className="w-4 shrink-0 text-muted-foreground/50">{line}</span>
              <span className="shrink-0 w-3">
                {type === 'removed' ? '−' : type === 'added' ? '+' : ' '}
              </span>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60"><GitCompare className="h-4 w-4" /> Compare</Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
