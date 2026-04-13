'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useClipboard } from '@/hooks/useClipboard'
import { Copy, Check, RefreshCw } from 'lucide-react'

export default function ApiMockGenerator() {
  const [schema, setSchema] = useState('')
  const [mockCount, setMockCount] = useState(1)
  const [mocks, setMocks] = useState<string[]>([])
  const [error, setError] = useState('')
  const { copy, copied } = useClipboard()

  function generateMocks() {
    setError('')
    try {
      if (!schema.trim()) {
        setError('Please enter a JSON schema or example')
        return
      }

      const parsed = JSON.parse(schema)
      const generated: string[] = []

      for (let i = 0; i < Math.min(mockCount, 50); i++) {
        generated.push(JSON.stringify(generateMock(parsed), null, 2))
      }
      setMocks(generated)
    } catch (e) {
      setError(`Error: ${(e as Error).message}`)
    }
  }

  function generateMock(schema: any): any {
    if (typeof schema === 'string') {
      if (schema.includes('@email')) return `user${Math.random().toString(36).slice(2)}@example.com`
      if (schema.includes('@name')) return ['John', 'Jane', 'Bob', 'Alice'][Math.floor(Math.random() * 4)]
      if (schema.includes('@url')) return `https://example.com/${Math.random().toString(36).slice(2)}`
      if (schema.includes('@date')) return new Date(Date.now() - Math.random() * 31536000000).toISOString()
      if (schema.includes('@uuid')) return crypto.randomUUID()
      if (schema.includes('@phone')) return `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`
      return schema
    }

    if (typeof schema === 'number') {
      return Math.floor(Math.random() * 1000)
    }

    if (typeof schema === 'boolean') {
      return Math.random() > 0.5
    }

    if (Array.isArray(schema)) {
      const length = Math.floor(Math.random() * 3) + 1
      return Array.from({ length }, () => generateMock(schema[0] || {}))
    }

    if (typeof schema === 'object' && schema !== null) {
      const result: any = {}
      for (const key in schema) {
        result[key] = generateMock(schema[key])
      }
      return result
    }

    return null
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="schema">
        <TabsList>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="schema" className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">JSON Schema or Example Object</label>
            <Textarea
              value={schema}
              onChange={e => setSchema(e.target.value)}
              placeholder={'{\n  "id": "@uuid",\n  "name": "@name",\n  "email": "@email",\n  "createdAt": "@date"\n}'}
              className="font-mono text-sm min-h-[200px]"
            />
            <p className="text-xs text-muted-foreground">
              Use @uuid, @email, @name, @url, @date, @phone for special values
            </p>
          </div>

          <div className="flex gap-4 items-end">
            <div className="space-y-1">
              <label className="text-sm font-medium">Number of Examples (1–50)</label>
              <Input
                type="number"
                min={1}
                max={50}
                value={mockCount}
                onChange={e => setMockCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                className="w-32"
              />
            </div>
            <Button onClick={generateMocks} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Generate
            </Button>
          </div>

          {error && (
            <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive font-mono">
              {error}
            </div>
          )}
        </TabsContent>

        <TabsContent value="examples" className="space-y-4 mt-4">
          {mocks.length === 0 ? (
            <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
              <p>No mocks generated yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{mocks.length} Example{mocks.length !== 1 ? 's' : ''}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copy(mocks.join('\n---\n'))}
                  className="gap-2"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  Copy All
                </Button>
              </div>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {mocks.map((mock, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Example {i + 1}</span>
                      <button
                        onClick={() => copy(mock)}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                    <pre className="rounded-md border bg-muted p-2 text-xs font-mono overflow-auto max-h-[200px] whitespace-pre-wrap">
                      {mock}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
