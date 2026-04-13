'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeftRight, Construction } from 'lucide-react'

const YAML_SAMPLE = `name: John Doe
age: 30
address:
  city: New York
  zip: "10001"
skills:
  - JavaScript
  - TypeScript
  - Node.js`

const JSON_SAMPLE = `{
  "name": "John Doe",
  "age": 30,
  "address": {
    "city": "New York",
    "zip": "10001"
  },
  "skills": [
    "JavaScript",
    "TypeScript",
    "Node.js"
  ]
}`

export default function YamlJson() {
  const [direction, setDirection] = useState<'yaml-to-json' | 'json-to-yaml'>('yaml-to-json')
  const [indent, setIndent] = useState('2')

  const isYamlToJson = direction === 'yaml-to-json'

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1 p-1 bg-muted rounded-lg">
          <button onClick={() => setDirection('yaml-to-json')}
            className={`text-xs px-3 py-1.5 rounded-md transition-colors ${direction === 'yaml-to-json' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'}`}>
            YAML → JSON
          </button>
          <button onClick={() => setDirection('json-to-yaml')}
            className={`text-xs px-3 py-1.5 rounded-md transition-colors ${direction === 'json-to-yaml' ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'}`}>
            JSON → YAML
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Indent:</span>
          {['2', '4'].map(n => (
            <button key={n} onClick={() => setIndent(n)}
              className={`px-2 py-1 rounded border text-xs ${indent === n ? 'bg-primary text-primary-foreground border-primary' : 'border-border'}`}>
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{isYamlToJson ? 'YAML Input' : 'JSON Input'}</p>
          <textarea
            defaultValue={isYamlToJson ? YAML_SAMPLE : JSON_SAMPLE}
            rows={14}
            className="w-full rounded-lg border bg-muted/30 p-3 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder={isYamlToJson ? 'Paste YAML here…' : 'Paste JSON here…'}
          />
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{isYamlToJson ? 'JSON Output' : 'YAML Output'}</p>
          <div className="w-full h-[calc(14*1.5rem+24px)] rounded-lg border bg-muted/20 p-3 text-xs font-mono text-muted-foreground flex items-center justify-center">
            Output will appear here
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <ArrowLeftRight className="h-4 w-4" /> Convert
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
