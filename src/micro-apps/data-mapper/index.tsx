'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useClipboard } from '@/hooks/useClipboard'
import { Copy, Check, ArrowRight } from 'lucide-react'
import * as jmespath from 'jmespath'

export default function DataMapper() {
  const [sourceJson, setSourceJson] = useState('')
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const { copy, copied } = useClipboard()

  function transform() {
    setError('')
    setResult('')

    if (!sourceJson.trim() || !expression.trim()) {
      setError('Please enter both source JSON and JMESPath expression')
      return
    }

    try {
      const parsed = JSON.parse(sourceJson)
      const transformed = jmespath.search(parsed, expression)
      setResult(JSON.stringify(transformed, null, 2))
    } catch (e) {
      setError(`Error: ${(e as Error).message}`)
    }
  }

  const examples = [
    { label: 'Get all names', expr: '[*].name', desc: 'Extract all names from array' },
    { label: 'Filter by age > 30', expr: "[?age > `30`]", desc: 'Get items where age is greater than 30' },
    { label: 'Map and select', expr: '[*].{name: name, status: active}', desc: 'Transform objects' },
    { label: 'Get first item', expr: '[0]', desc: 'Access first element' },
    { label: 'Count items', expr: 'length(@)', desc: 'Get array length' },
    { label: 'Sort by field', expr: 'sort_by(@, &age)', desc: 'Sort array by age' },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Source JSON</label>
          <Textarea
            value={sourceJson}
            onChange={e => setSourceJson(e.target.value)}
            placeholder={'[\n  {"name":"John","age":30},\n  {"name":"Jane","age":28}\n]'}
            className="font-mono text-sm min-h-[250px]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Result</label>
            {result && (
              <Button size="sm" variant="ghost" onClick={() => copy(result)}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy
              </Button>
            )}
          </div>
          <Textarea
            value={result}
            readOnly
            placeholder="Result will appear here..."
            className="font-mono text-sm min-h-[250px] bg-muted"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">JMESPath Expression</label>
        <div className="flex gap-2">
          <Textarea
            value={expression}
            onChange={e => setExpression(e.target.value)}
            placeholder="[*].name"
            className="font-mono text-sm min-h-[80px]"
            onKeyDown={e => {
              if (e.key === 'Enter' && e.ctrlKey) transform()
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground">JMESPath query language for JSON transformation</p>
      </div>

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive font-mono">
          {error}
        </div>
      )}

      <Button onClick={transform} className="w-full gap-2">
        <ArrowRight className="h-4 w-4" />
        Transform
      </Button>

      <div className="space-y-2 rounded-md border bg-muted/30 p-3">
        <p className="text-xs font-semibold">Quick Examples:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => setExpression(ex.expr)}
              className="text-left text-xs p-2 rounded border hover:bg-background transition-colors"
            >
              <div className="font-mono font-semibold text-primary">{ex.label}</div>
              <div className="text-muted-foreground">{ex.expr}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{ex.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 rounded-md border bg-blue-50 dark:bg-blue-950 p-3 text-xs text-muted-foreground space-y-1">
        <p className="font-semibold text-primary">JMESPath Help:</p>
        <ul className="list-disc list-inside space-y-0.5 font-mono text-xs">
          <li>[*] - Get all items from array</li>
          <li>[*].field - Extract field from all items</li>
          <li>[?condition] - Filter array</li>
          <li>@.field - Reference current item</li>
          <li>sort_by(@, &field) - Sort by field</li>
          <li>{'{name: name}'} - Create object</li>
        </ul>
      </div>
    </div>
  )
}
