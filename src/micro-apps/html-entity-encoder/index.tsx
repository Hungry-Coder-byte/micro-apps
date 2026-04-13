'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { ArrowLeftRight, Construction } from 'lucide-react'

const ENCODED_SAMPLE = `&lt;div class=&quot;hero&quot;&gt;
  &lt;h1&gt;Hello &amp; Welcome&lt;/h1&gt;
  &lt;p&gt;Copyright &copy; 2024 &mdash; All rights reserved&lt;/p&gt;
  &lt;a href=&quot;https://example.com&quot;&gt;Visit us &rarr;&lt;/a&gt;
&lt;/div&gt;`

const DECODED_SAMPLE = `<div class="hero">
  <h1>Hello & Welcome</h1>
  <p>Copyright © 2024 — All rights reserved</p>
  <a href="https://example.com">Visit us →</a>
</div>`

export default function HtmlEntityEncoder() {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        <button className="text-xs px-3 py-1.5 rounded-md bg-background shadow-sm font-medium">Encode → entities</button>
        <button className="text-xs px-3 py-1.5 rounded-md text-muted-foreground">Decode ← entities</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">HTML Input</Label>
          <textarea defaultValue={DECODED_SAMPLE} rows={14}
            className="w-full rounded-lg border bg-muted/30 p-3 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Paste HTML to encode…" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wide">Encoded Output</Label>
          <div className="w-full h-[calc(14*1.5rem+24px)] rounded-lg border bg-muted/20 p-3 text-xs font-mono text-muted-foreground whitespace-pre-wrap">
            {ENCODED_SAMPLE}
            <p className="text-muted-foreground/50 mt-2 text-[10px]">(Preview only)</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border p-3 space-y-2">
        <p className="text-xs font-medium">Common entity reference</p>
        <div className="grid grid-cols-4 gap-2 text-xs font-mono">
          {[['&amp;','&'],['&lt;','<'],['&gt;','>'],['&quot;','"'],['&apos;',"'"],['&nbsp;','(space)'],['&copy;','©'],['&reg;','®'],['&trade;','™'],['&mdash;','—'],['&rarr;','→'],['&hellip;','…']].map(([entity, char]) => (
            <div key={entity} className="flex items-center gap-1.5 text-muted-foreground">
              <code className="bg-muted px-1 rounded text-[10px]">{entity}</code>
              <span>{char}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <ArrowLeftRight className="h-4 w-4" /> Encode
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
