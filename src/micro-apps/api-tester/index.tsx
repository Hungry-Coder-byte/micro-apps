'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import type { MicroAppComponentProps } from '@/registry/types'
import { Send, Plus, Trash2 } from 'lucide-react'
import { useClipboard } from '@/hooks/useClipboard'
import { Copy, Check } from 'lucide-react'

interface Header { key: string; value: string; enabled: boolean }
interface ApiResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  body: string
  timing: number
}

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
const STATUS_COLORS: Record<number, string> = {}

function statusColor(s: number) {
  if (s < 200) return 'text-blue-500'
  if (s < 300) return 'text-green-500'
  if (s < 400) return 'text-yellow-500'
  return 'text-red-500'
}

export default function ApiTester({ serverFetch }: MicroAppComponentProps) {
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1')
  const [method, setMethod] = useState('GET')
  const [headers, setHeaders] = useState<Header[]>([{ key: 'Content-Type', value: 'application/json', enabled: true }])
  const [body, setBody] = useState('')
  const [authType, setAuthType] = useState('none')
  const [authValue, setAuthValue] = useState('')
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { copy, copied } = useClipboard()

  async function send() {
    if (!url) return
    setError('')
    setLoading(true)
    try {
      const activeHeaders = headers.filter(h => h.enabled && h.key)
      const headersObj: Record<string, string> = {}
      activeHeaders.forEach(h => { headersObj[h.key] = h.value })

      const data = await serverFetch!('api-tester', {
        url,
        method,
        headers: JSON.stringify(headersObj),
        body: body || '',
        auth_type: authType,
        auth_value: authValue,
      }) as ApiResponse
      setResponse(data)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  function addHeader() {
    setHeaders(prev => [...prev, { key: '', value: '', enabled: true }])
  }

  function removeHeader(i: number) {
    setHeaders(prev => prev.filter((_, j) => j !== i))
  }

  function updateHeader(i: number, field: keyof Header, value: string | boolean) {
    setHeaders(prev => prev.map((h, j) => j === i ? { ...h, [field]: value } : h))
  }

  let formattedBody = ''
  if (response?.body) {
    try {
      formattedBody = JSON.stringify(JSON.parse(response.body), null, 2)
    } catch {
      formattedBody = response.body
    }
  }

  return (
    <div className="space-y-4">
      {/* URL Bar */}
      <div className="flex gap-2">
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className="w-32 font-mono font-bold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {METHODS.map(m => <SelectItem key={m} value={m} className="font-mono">{m}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://api.example.com/endpoint"
          className="flex-1 font-mono"
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <Button onClick={send} disabled={loading || !url} className="gap-2 shrink-0">
          <Send className="h-4 w-4" />
          {loading ? 'Sending...' : 'Send'}
        </Button>
      </div>

      <Tabs defaultValue="headers">
        <TabsList>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="auth">Auth</TabsTrigger>
        </TabsList>

        <TabsContent value="headers" className="space-y-2 mt-3">
          {headers.map((h, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input type="checkbox" checked={h.enabled} onChange={e => updateHeader(i, 'enabled', e.target.checked)} className="shrink-0" />
              <Input
                value={h.key}
                onChange={e => updateHeader(i, 'key', e.target.value)}
                placeholder="Header name"
                className="flex-1 font-mono text-sm"
              />
              <Input
                value={h.value}
                onChange={e => updateHeader(i, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1 font-mono text-sm"
              />
              <button onClick={() => removeHeader(i)} className="text-muted-foreground hover:text-destructive shrink-0">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addHeader} className="gap-2">
            <Plus className="h-4 w-4" /> Add Header
          </Button>
        </TabsContent>

        <TabsContent value="body" className="mt-3">
          <Textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder='{"key": "value"}'
            className="min-h-[160px] font-mono text-sm"
          />
        </TabsContent>

        <TabsContent value="auth" className="space-y-3 mt-3">
          <Select value={authType} onValueChange={setAuthType}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Auth</SelectItem>
              <SelectItem value="bearer">Bearer Token</SelectItem>
              <SelectItem value="basic">Basic Auth</SelectItem>
            </SelectContent>
          </Select>
          {authType !== 'none' && (
            <Input
              value={authValue}
              onChange={e => setAuthValue(e.target.value)}
              placeholder={authType === 'bearer' ? 'your-token-here' : 'username:password'}
              className="font-mono"
            />
          )}
        </TabsContent>
      </Tabs>

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}

      {response && (
        <div className="space-y-3">
          {/* Status bar */}
          <div className="flex items-center gap-4 rounded-md border bg-muted/50 p-3">
            <span className={`font-bold text-lg font-mono ${statusColor(response.status)}`}>{response.status}</span>
            <span className="text-muted-foreground">{response.statusText}</span>
            <span className="text-sm text-muted-foreground ml-auto">{response.timing}ms</span>
          </div>

          <Tabs defaultValue="response-body">
            <TabsList>
              <TabsTrigger value="response-body">Response Body</TabsTrigger>
              <TabsTrigger value="response-headers">Headers ({Object.keys(response.headers).length})</TabsTrigger>
            </TabsList>
            <TabsContent value="response-body" className="mt-3">
              <div className="relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => copy(formattedBody)}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <pre className="rounded-md border bg-muted p-4 text-sm font-mono overflow-auto max-h-[500px] whitespace-pre-wrap">
                  {formattedBody || '(empty body)'}
                </pre>
              </div>
            </TabsContent>
            <TabsContent value="response-headers" className="mt-3">
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(response.headers).map(([k, v]) => (
                      <tr key={k} className="border-t first:border-t-0 hover:bg-muted/30">
                        <td className="px-3 py-2 font-mono font-medium text-primary whitespace-nowrap">{k}</td>
                        <td className="px-3 py-2 font-mono text-muted-foreground break-all">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
