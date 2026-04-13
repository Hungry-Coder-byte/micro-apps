'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileCode2 } from 'lucide-react'

const TEMPLATE = `Hello, {{name}}!
You have {{count}} new message(s).
{{#if premium}}
  🌟 Thanks for being a premium member.
{{/if}}
Regards, {{company}}`

const DATA = `{
  "name": "Alice",
  "count": 3,
  "premium": true,
  "company": "Acme Corp"
}`

const OUTPUT = `Hello, Alice!
You have 3 new message(s).
  🌟 Thanks for being a premium member.
Regards, Acme Corp`

export default function JsonTemplateEngine() {
  return (
    <div className="max-w-3xl mx-auto space-y-5 opacity-70 pointer-events-none select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">JSON Template Engine</h2>
        <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 text-xs">Coming Soon</Badge>
      </div>

      <p className="text-xs text-muted-foreground">Render Handlebars / Mustache templates with JSON data. Supports conditionals, loops, and helpers.</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Template</p>
          <pre className="text-xs font-mono bg-muted/40 rounded-xl border p-3 h-40 overflow-auto text-muted-foreground">{TEMPLATE}</pre>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">JSON Data</p>
          <pre className="text-xs font-mono bg-muted/40 rounded-xl border p-3 h-40 overflow-auto text-muted-foreground">{DATA}</pre>
        </div>
      </div>

      <div className="flex gap-2">
        <Button size="sm" disabled><FileCode2 className="h-4 w-4 mr-1.5" />Render</Button>
        <select className="text-xs border rounded-md px-2 py-1 bg-muted/40 text-muted-foreground" disabled>
          <option>Handlebars</option>
          <option>Mustache</option>
          <option>Nunjucks</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Output</p>
        <pre className="text-xs font-mono bg-green-50 border border-green-200 rounded-xl p-3 text-green-800">{OUTPUT}</pre>
      </div>
    </div>
  )
}
