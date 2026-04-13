'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Link2, Construction, ArrowUpDown } from 'lucide-react'

const EXAMPLES = [
  { label: 'Space',           raw: 'hello world',                     encoded: 'hello%20world' },
  { label: 'Special chars',   raw: 'price: $10 & tax=5%',             encoded: 'price%3A%20%2410%20%26%20tax%3D5%25' },
  { label: 'Unicode',         raw: 'Héllo Wörld',                     encoded: 'H%C3%A9llo%20W%C3%B6rld' },
  { label: 'URL params',      raw: 'q=hello world&lang=en',           encoded: 'q%3Dhello%20world%26lang%3Den' },
  { label: 'Email address',   raw: 'user+tag@example.com',            encoded: 'user%2Btag%40example.com' },
]

const SAMPLE_RAW = 'https://example.com/search?q=hello world&category=food & drink&sort=price asc'
const SAMPLE_ENC = 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world%26category%3Dfood%20%26%20drink%26sort%3Dprice%20asc'

export default function UrlEncoder() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="space-y-2">
        <Label className="text-xs">Input (raw text or encoded URL)</Label>
        <textarea rows={3} defaultValue={SAMPLE_RAW} disabled
          className="w-full rounded-lg border bg-muted/30 p-3 text-xs font-mono resize-none opacity-60 cursor-not-allowed" />
      </div>

      <div className="flex items-center gap-3 justify-center">
        <Button disabled className="gap-2 opacity-60 h-8 text-xs">Encode →</Button>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        <Button disabled className="gap-2 opacity-60 h-8 text-xs">← Decode</Button>
      </div>

      <div className="space-y-2 opacity-70">
        <Label className="text-xs">Output</Label>
        <textarea rows={3} defaultValue={SAMPLE_ENC} readOnly
          className="w-full rounded-lg border bg-muted/30 p-3 text-xs font-mono resize-none" />
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Common encoding examples</div>
        <div className="divide-y">
          {EXAMPLES.map(({ label, raw, encoded }) => (
            <div key={label} className="px-4 py-2.5 grid grid-cols-3 gap-2 text-xs">
              <span className="text-muted-foreground">{label}</span>
              <code className="font-mono text-primary break-all">{raw}</code>
              <code className="font-mono text-muted-foreground break-all">{encoded}</code>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
        <Construction className="h-3.5 w-3.5" /> Coming soon
      </Badge>
    </div>
  )
}
