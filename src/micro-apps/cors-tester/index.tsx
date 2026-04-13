'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { MicroAppComponentProps } from '@/registry/types'
import { Send, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface CorsResult {
  allowed: boolean
  headers: Record<string, string>
  error?: string
}

export default function CorsTester({ serverFetch }: MicroAppComponentProps) {
  const [url, setUrl] = useState('')
  const [origin, setOrigin] = useState('http://localhost:3000')
  const [method, setMethod] = useState('GET')
  const [result, setResult] = useState<CorsResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function testCors() {
    setError('')
    setResult(null)

    if (!url.trim() || !origin.trim()) {
      setError('Please enter both URL and Origin')
      return
    }

    setLoading(true)
    try {
      const data = await serverFetch!('cors-tester', {
        url,
        origin,
        method,
      }) as CorsResult

      setResult(data)
    } catch (e) {
      setError(`Error: ${(e as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-medium">Target URL</label>
          <Input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://api.example.com/endpoint"
            className="font-mono text-sm"
            onKeyDown={e => e.key === 'Enter' && testCors()}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Origin (Your Server)</label>
          <Input
            value={origin}
            onChange={e => setOrigin(e.target.value)}
            placeholder="http://localhost:3000"
            className="font-mono text-sm"
            onKeyDown={e => e.key === 'Enter' && testCors()}
          />
        </div>

        <div className="flex gap-4 items-end">
          <div className="space-y-1 flex-1">
            <label className="text-sm font-medium">HTTP Method</label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="OPTIONS">OPTIONS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={testCors} disabled={loading} className="gap-2">
            <Send className="h-4 w-4" />
            {loading ? 'Testing...' : 'Test CORS'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive flex gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4 rounded-md border bg-muted/50 p-4">
          <div className="flex items-center gap-3">
            {result.allowed ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                <div>
                  <div className="font-semibold text-green-700 dark:text-green-300">CORS Allowed</div>
                  <div className="text-sm text-muted-foreground">This origin can access this endpoint</div>
                </div>
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                <div>
                  <div className="font-semibold text-red-700 dark:text-red-300">CORS Blocked</div>
                  <div className="text-sm text-muted-foreground">This origin cannot access this endpoint</div>
                </div>
              </>
            )}
          </div>

          {result.error && (
            <div className="rounded-md border border-destructive bg-destructive/10 p-2 text-sm text-destructive font-mono">
              {result.error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Response Headers</label>
            <div className="rounded-md border bg-background overflow-hidden max-h-[400px] overflow-y-auto">
              {Object.keys(result.headers).length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground">No CORS headers present</div>
              ) : (
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(result.headers).map(([key, value]) => (
                      <tr key={key} className="border-b last:border-b-0 hover:bg-muted/50">
                        <td className="px-3 py-2 font-mono font-medium text-primary whitespace-nowrap">{key}</td>
                        <td className="px-3 py-2 font-mono text-muted-foreground break-all text-xs">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="rounded-md border bg-background p-3 text-xs space-y-1 text-muted-foreground font-mono">
            <div>• Access-Control-Allow-Origin: {result.headers['Access-Control-Allow-Origin'] || 'Not set'}</div>
            <div>• Access-Control-Allow-Methods: {result.headers['Access-Control-Allow-Methods'] || 'Not set'}</div>
            <div>• Access-Control-Allow-Headers: {result.headers['Access-Control-Allow-Headers'] || 'Not set'}</div>
          </div>
        </div>
      )}

      {!result && !error && (
        <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
          <p>Enter a URL and origin to test CORS configuration</p>
        </div>
      )}
    </div>
  )
}
