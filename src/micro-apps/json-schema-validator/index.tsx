'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, Construction } from 'lucide-react'

const SCHEMA = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["name", "age", "email"],
  "properties": {
    "name": { "type": "string", "minLength": 1 },
    "age":  { "type": "integer", "minimum": 0, "maximum": 120 },
    "email": { "type": "string", "format": "email" },
    "tags": {
      "type": "array",
      "items": { "type": "string" }
    }
  }
}`

const DATA = `{
  "name": "Alice",
  "age": 28,
  "email": "alice@example.com",
  "tags": ["developer", "typescript"]
}`

export default function JsonSchemaValidator() {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">JSON Schema</p>
          <textarea defaultValue={SCHEMA} rows={18}
            className="w-full rounded-lg border bg-muted/30 p-3 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Paste JSON Schema here…" />
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">JSON Data to Validate</p>
          <textarea defaultValue={DATA} rows={10}
            className="w-full rounded-lg border bg-muted/30 p-3 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Paste JSON data here…" />
          <div className="rounded-lg border bg-muted/20 p-3 text-xs text-muted-foreground min-h-[80px] flex items-center justify-center">
            Validation result will appear here
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <ShieldCheck className="h-4 w-4" /> Validate
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
