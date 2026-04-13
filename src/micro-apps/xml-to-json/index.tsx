'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeftRight } from 'lucide-react'

const XML = `<users>
  <user id="1">
    <name>Alice</name>
    <role>Engineer</role>
  </user>
  <user id="2">
    <name>Bob</name>
    <role>Designer</role>
  </user>
</users>`

const JSON_OUT = `{
  "users": {
    "user": [
      { "@id": "1", "name": "Alice", "role": "Engineer" },
      { "@id": "2", "name": "Bob",   "role": "Designer" }
    ]
  }
}`

export default function XmlToJson() {
  return (
    <div className="max-w-3xl mx-auto space-y-5 opacity-70 pointer-events-none select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">XML ↔ JSON Converter</h2>
        <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 text-xs">Coming Soon</Badge>
      </div>

      <div className="flex gap-2 items-center">
        <select className="text-xs border rounded-md px-2 py-1.5 bg-muted/40 text-muted-foreground" disabled>
          <option>XML → JSON</option>
          <option>JSON → XML</option>
        </select>
        <Button size="sm" disabled><ArrowLeftRight className="h-4 w-4 mr-1.5" />Convert</Button>
        <Button size="sm" variant="outline" disabled>Copy Output</Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">XML Input</p>
          <pre className="text-[11px] font-mono bg-muted/40 rounded-xl border p-3 h-52 overflow-auto text-blue-600">{XML}</pre>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">JSON Output</p>
          <pre className="text-[11px] font-mono bg-muted/40 rounded-xl border p-3 h-52 overflow-auto text-green-600">{JSON_OUT}</pre>
        </div>
      </div>

      <div className="rounded-xl border p-3 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Options</p>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {['Preserve attributes (@)', 'Compact output', 'Prettify', 'Ignore comments', 'Array coercion'].map(o => (
            <label key={o} className="flex items-center gap-1.5">
              <input type="checkbox" disabled className="accent-primary" defaultChecked={o === 'Preserve attributes (@)' || o === 'Prettify'} />
              {o}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
