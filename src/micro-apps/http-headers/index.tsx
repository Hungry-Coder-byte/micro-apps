'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { MicroAppComponentProps } from '@/registry/types'
import { Search } from 'lucide-react'

const IMPORTANT_HEADERS = ['content-type', 'content-security-policy', 'x-frame-options', 'x-xss-protection', 'strict-transport-security', 'access-control-allow-origin', 'cache-control', 'etag', 'last-modified', 'server', 'x-powered-by']
const SECURITY_HEADERS = new Set(['content-security-policy', 'x-frame-options', 'x-xss-protection', 'strict-transport-security', 'x-content-type-options', 'referrer-policy', 'permissions-policy'])
const CORS_HEADERS = new Set(['access-control-allow-origin', 'access-control-allow-methods', 'access-control-allow-headers', 'access-control-max-age', 'access-control-allow-credentials'])

interface HeaderResult {
  url: string
  status: number
  statusText: string
  headers: Record<string, string>
}

export default function HttpHeaders({ serverFetch }: MicroAppComponentProps) {
  const [url, setUrl] = useState('https://example.com')
  const [result, setResult] = useState<HeaderResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function fetch_headers() {
    if (!url) return
    setError('')
    setLoading(true)
    try {
      const data = await serverFetch!('http-headers', { url }) as HeaderResult
      setResult(data)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  function statusColor(s: number) {
    if (s < 200) return 'text-blue-500'
    if (s < 300) return 'text-green-500'
    if (s < 400) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="font-mono"
          onKeyDown={e => e.key === 'Enter' && fetch_headers()}
        />
        <Button onClick={fetch_headers} disabled={loading || !url} className="gap-2 shrink-0">
          <Search className="h-4 w-4" />
          {loading ? 'Fetching...' : 'Fetch Headers'}
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-md border bg-muted/50 p-3">
            <span className={`font-bold text-lg font-mono ${statusColor(result.status)}`}>{result.status}</span>
            <span className="text-muted-foreground">{result.statusText}</span>
            <span className="font-mono text-sm text-muted-foreground ml-auto truncate">{result.url}</span>
          </div>

          <div className="rounded-md border overflow-hidden">
            <div className="bg-muted px-4 py-2 text-sm font-semibold">
              {Object.keys(result.headers).length} Headers
            </div>
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(result.headers)
                  .sort(([a], [b]) => {
                    const ai = IMPORTANT_HEADERS.indexOf(a)
                    const bi = IMPORTANT_HEADERS.indexOf(b)
                    if (ai !== -1 && bi !== -1) return ai - bi
                    if (ai !== -1) return -1
                    if (bi !== -1) return 1
                    return a.localeCompare(b)
                  })
                  .map(([k, v]) => (
                    <tr key={k} className="border-t hover:bg-muted/30">
                      <td className="px-3 py-2 whitespace-nowrap align-top">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium text-primary">{k}</span>
                          {SECURITY_HEADERS.has(k) && <Badge variant="destructive" className="text-xs py-0">security</Badge>}
                          {CORS_HEADERS.has(k) && <Badge variant="secondary" className="text-xs py-0">cors</Badge>}
                        </div>
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground break-all">{v}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
