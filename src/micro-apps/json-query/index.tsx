'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useClipboard } from '@/hooks/useClipboard'
import { Copy, Check, ArrowRight } from 'lucide-react'
import * as jmespath from 'jmespath'

export default function JsonQuery() {
  const [json, setJson] = useState('')
  const [query, setQuery] = useState('')
  const { copy, copied } = useClipboard()

  const result = useMemo(() => {
    if (!json.trim() || !query.trim()) return null

    try {
      const parsed = JSON.parse(json)
      return jmespath.search(parsed, query)
    } catch {
      return null
    }
  }, [json, query])

  const hasError = json.trim() && query.trim() && result === undefined

  const examples = [
    { label: 'Get all names', query: '[*].name' },
    { label: 'Filter > 30', query: "[?age > `30`]" },
    { label: 'First item', query: '[0]' },
    { label: 'Sort by age', query: 'sort_by(@, &age)' },
    { label: 'Map values', query: '[*].{name: name, id: id}' },
    { label: 'Get unique', query: 'unique(@)' },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">JSON Data</label>
          <Textarea
            value={json}
            onChange={e => setJson(e.target.value)}
            placeholder={'[\n  {"name":"John","age":30},\n  {"name":"Jane","age":28}\n]'}
            className="font-mono text-sm min-h-[300px]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Result</label>
            {result !== null && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copy(JSON.stringify(result, null, 2))}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy
              </Button>
            )}
          </div>
          <Textarea
            value={result !== null ? JSON.stringify(result, null, 2) : ''}
            readOnly
            placeholder="Live preview will appear here..."
            className="font-mono text-sm min-h-[300px] bg-muted"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">JMESPath Query</label>
        <Textarea
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="[*].name"
          className="font-mono text-sm min-h-[80px]"
        />
      </div>

      {hasError && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
          Invalid query or JSON
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {examples.map((ex, i) => (
          <Button
            key={i}
            size="sm"
            variant="outline"
            onClick={() => setQuery(ex.query)}
            className="text-xs"
          >
            {ex.label}
          </Button>
        ))}
      </div>

      <div className="rounded-md border bg-blue-50 dark:bg-blue-950 p-3 space-y-2">
        <p className="text-xs font-semibold text-primary">JMESPath Syntax Help:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono text-muted-foreground">
          <div>
            <div className="font-semibold text-foreground mb-1">Array Operations</div>
            <div>[*] - All items</div>
            <div>[0] - First item</div>
            <div>[-1] - Last item</div>
            <div>[1:3] - Slice 1-3</div>
          </div>
          <div>
            <div className="font-semibold text-foreground mb-1">Filtering</div>
            <div>?expression - Filter</div>
            <div>{"@.field > 30"} - Comparison</div>
            <div>{"@ > 'string'"} - String compare</div>
            <div>length(@) - Get length</div>
          </div>
          <div>
            <div className="font-semibold text-foreground mb-1">Projections</div>
            <div>[*].field - Extract field</div>
            <div>{'{name: @.name}'} - Rename</div>
            <div>sort_by(@, &field) - Sort</div>
            <div>unique(@) - Unique items</div>
          </div>
          <div>
            <div className="font-semibold text-foreground mb-1">Functions</div>
            <div>keys(@) - Get keys</div>
            <div>values(@) - Get values</div>
            <div>reverse(@) - Reverse</div>
            <div>join(',', @) - Join</div>
          </div>
        </div>
      </div>
    </div>
  )
}
