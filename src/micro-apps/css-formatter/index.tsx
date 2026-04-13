'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Paintbrush, Construction } from 'lucide-react'

const MINIFIED = `.hero{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%)}.hero h1{font-size:3rem;font-weight:700;color:#fff;margin-bottom:1rem;text-shadow:0 2px 4px rgba(0,0,0,.2)}.hero p{font-size:1.125rem;color:rgba(255,255,255,.85);max-width:600px;text-align:center}`

const FORMATTED = `.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero h1 {
  font-size: 3rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.hero p {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.85);
  max-width: 600px;
  text-align: center;
}`

export default function CssFormatter() {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-xs mb-1.5 block">Mode</Label>
          <Select defaultValue="format">
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="format">Format / Beautify</SelectItem>
              <SelectItem value="minify">Minify</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Indent</Label>
          <Select defaultValue="2">
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 spaces</SelectItem>
              <SelectItem value="4">4 spaces</SelectItem>
              <SelectItem value="tab">Tab</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Sort properties</Label>
          <Select defaultValue="none">
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Keep original order</SelectItem>
              <SelectItem value="alpha">Alphabetical</SelectItem>
              <SelectItem value="concentric">Concentric</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">CSS Input</p>
          <textarea defaultValue={MINIFIED} rows={16}
            className="w-full rounded-lg border bg-muted/30 p-3 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Paste CSS here…" />
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Formatted Output</p>
          <div className="w-full h-[calc(16*1.5rem+24px)] rounded-lg border bg-muted/20 p-3 text-xs font-mono text-muted-foreground overflow-auto whitespace-pre-wrap">
            {FORMATTED}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <Paintbrush className="h-4 w-4" /> Format CSS
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
