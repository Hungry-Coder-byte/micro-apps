'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useClipboard } from '@/hooks/useClipboard'
import { Copy, Check, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [sortKeys, setSortKeys] = useState(false)
  const { copy, copied } = useClipboard()

  function parse() {
    try {
      return JSON.parse(input)
    } catch (e) {
      setError((e as Error).message)
      return null
    }
  }

  function sortObject(obj: unknown): unknown {
    if (Array.isArray(obj)) return obj.map(sortObject)
    if (obj && typeof obj === 'object') {
      return Object.keys(obj as object).sort().reduce((acc, key) => {
        acc[key] = sortObject((obj as Record<string, unknown>)[key])
        return acc
      }, {} as Record<string, unknown>)
    }
    return obj
  }

  function format() {
    setError('')
    const parsed = parse()
    if (parsed === null && error) return
    const data = sortKeys ? sortObject(parsed) : parsed
    setOutput(JSON.stringify(data, null, 2))
  }

  function minify() {
    setError('')
    const parsed = parse()
    if (parsed === null && error) return
    setOutput(JSON.stringify(parsed))
  }

  function validate() {
    setError('')
    try {
      JSON.parse(input)
      setError('')
      setOutput('✓ Valid JSON')
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <Button onClick={format}>Format / Pretty Print</Button>
        <Button onClick={minify} variant="outline">Minify</Button>
        <Button onClick={validate} variant="outline">Validate</Button>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={sortKeys}
            onChange={e => setSortKeys(e.target.checked)}
            className="rounded"
          />
          Sort Keys
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Input JSON</label>
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='Paste your JSON here, e.g. {"name":"Alice","age":30}'
            className="font-mono text-sm min-h-[400px]"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Output</label>
            {output && !error && (
              <Button size="sm" variant="ghost" onClick={() => copy(output)}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            )}
          </div>
          {error && (
            <div className="flex items-start gap-2 rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span className="font-mono">{error}</span>
            </div>
          )}
          {output && !error && (
            <pre className="w-full min-h-[400px] overflow-auto rounded-md border bg-muted p-3 text-sm font-mono whitespace-pre-wrap break-all">
              {output}
            </pre>
          )}
          {output === '✓ Valid JSON' && (
            <div className="flex items-center gap-2 rounded-md border border-green-500 bg-green-50 dark:bg-green-950 p-3 text-sm text-green-700 dark:text-green-300">
              <CheckCircle2 className="h-4 w-4" />
              Valid JSON
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
