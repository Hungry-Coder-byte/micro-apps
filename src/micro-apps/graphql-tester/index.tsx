'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useClipboard } from '@/hooks/useClipboard'
import type { MicroAppComponentProps } from '@/registry/types'
import { Send, Copy, Check } from 'lucide-react'

export default function GraphqlTester({ serverFetch }: MicroAppComponentProps) {
  const [url, setUrl] = useState('https://api.example.com/graphql')
  const [query, setQuery] = useState('')
  const [variables, setVariables] = useState('')
  const [headers, setHeaders] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { copy, copied } = useClipboard()

  async function execute() {
    setError('')
    setResponse('')

    if (!url.trim() || !query.trim()) {
      setError('Please enter URL and GraphQL query')
      return
    }

    setLoading(true)
    try {
      let parsedVars = {}
      let parsedHeaders = {}

      if (variables.trim()) {
        parsedVars = JSON.parse(variables)
      }

      if (headers.trim()) {
        parsedHeaders = JSON.parse(headers)
      }

      const result = await serverFetch!('graphql', {
        url,
        query,
        variables: JSON.stringify(parsedVars),
        headers: JSON.stringify(parsedHeaders),
      }) as any

      setResponse(typeof result === 'string' ? result : JSON.stringify(result, null, 2))
    } catch (e) {
      setError(`Error: ${(e as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const examples = [
    {
      label: 'Simple query',
      query: `{
  user(id: 1) {
    id
    name
    email
  }
}`,
    },
    {
      label: 'With variables',
      query: `query GetUser($userId: ID!) {
  user(id: $userId) {
    id
    name
    email
  }
}`,
    },
    {
      label: 'Mutation',
      query: `mutation CreateUser($name: String!) {
  createUser(name: $name) {
    id
    name
  }
}`,
    },
  ]

  return (
    <div className="space-y-4">
      <Tabs defaultValue="query">
        <TabsList>
          <TabsTrigger value="query">Query</TabsTrigger>
          <TabsTrigger value="variables">Variables</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="response">Response</TabsTrigger>
        </TabsList>

        <TabsContent value="query" className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Endpoint URL</label>
            <Input
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://api.example.com/graphql"
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">GraphQL Query</label>
            <Textarea
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Enter GraphQL query..."
              className="font-mono text-sm min-h-[250px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-xs">Quick Examples:</label>
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
          </div>
        </TabsContent>

        <TabsContent value="variables" className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Variables (JSON)</label>
            <Textarea
              value={variables}
              onChange={e => setVariables(e.target.value)}
              placeholder={'{\n  "userId": "123"\n}'}
              className="font-mono text-sm min-h-[250px]"
            />
          </div>
        </TabsContent>

        <TabsContent value="headers" className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Headers (JSON)</label>
            <Textarea
              value={headers}
              onChange={e => setHeaders(e.target.value)}
              placeholder={'{\n  "Authorization": "Bearer token"\n}'}
              className="font-mono text-sm min-h-[250px]"
            />
          </div>
        </TabsContent>

        <TabsContent value="response" className="space-y-4 mt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Response</label>
              {response && (
                <Button size="sm" variant="ghost" onClick={() => copy(response)}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  Copy
                </Button>
              )}
            </div>
            <Textarea
              value={response}
              readOnly
              placeholder="Response will appear here..."
              className="font-mono text-sm min-h-[250px] bg-muted"
            />
          </div>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button
        onClick={execute}
        disabled={loading || !url || !query}
        className="w-full gap-2"
      >
        <Send className="h-4 w-4" />
        {loading ? 'Executing...' : 'Execute Query'}
      </Button>
    </div>
  )
}
