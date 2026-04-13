'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { MicroAppComponentProps } from '@/registry/types'
import { Search } from 'lucide-react'

const RECORD_TYPES = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME', 'SOA', 'PTR']

interface DnsResult {
  domain: string
  type: string
  records: unknown
}

export default function DnsLookup({ serverFetch }: MicroAppComponentProps) {
  const [domain, setDomain] = useState('google.com')
  const [type, setType] = useState('A')
  const [result, setResult] = useState<DnsResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function lookup() {
    setError('')
    setLoading(true)
    try {
      const data = await serverFetch!('dns', { domain, type }) as DnsResult
      setResult(data)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  function renderRecords(records: unknown, type: string) {
    if (!records) return null
    if (type === 'MX' && Array.isArray(records)) {
      return (
        <table className="w-full text-sm">
          <thead className="bg-muted"><tr><th className="text-left px-3 py-2">Priority</th><th className="text-left px-3 py-2">Exchange</th></tr></thead>
          <tbody>
            {(records as {priority: number; exchange: string}[]).map((r, i) => (
              <tr key={i} className="border-t"><td className="px-3 py-2 font-mono">{r.priority}</td><td className="px-3 py-2 font-mono">{r.exchange}</td></tr>
            ))}
          </tbody>
        </table>
      )
    }
    if (type === 'SOA' && typeof records === 'object' && records !== null) {
      return (
        <table className="w-full text-sm">
          <tbody>
            {Object.entries(records as Record<string, unknown>).map(([k, v]) => (
              <tr key={k} className="border-t"><td className="px-3 py-2 text-muted-foreground">{k}</td><td className="px-3 py-2 font-mono">{String(v)}</td></tr>
            ))}
          </tbody>
        </table>
      )
    }
    if (type === 'TXT' && Array.isArray(records)) {
      return (
        <div className="space-y-1">
          {(records as string[][]).map((r, i) => (
            <div key={i} className="font-mono text-sm bg-muted rounded p-2 break-all">{Array.isArray(r) ? r.join('') : String(r)}</div>
          ))}
        </div>
      )
    }
    if (Array.isArray(records)) {
      return (
        <div className="space-y-1">
          {(records as string[]).map((r, i) => (
            <div key={i} className="font-mono text-sm bg-muted rounded p-2">{String(r)}</div>
          ))}
        </div>
      )
    }
    return <pre className="font-mono text-sm bg-muted rounded p-2">{JSON.stringify(records, null, 2)}</pre>
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Input
          value={domain}
          onChange={e => setDomain(e.target.value)}
          placeholder="example.com"
          className="flex-1 min-w-[200px] font-mono"
          onKeyDown={e => e.key === 'Enter' && lookup()}
        />
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
          <SelectContent>
            {RECORD_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={lookup} disabled={loading || !domain} className="gap-2">
          <Search className="h-4 w-4" />
          {loading ? 'Looking up...' : 'Lookup'}
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}

      {result && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-lg">{result.domain}</span>
            <span className="rounded-md bg-primary text-primary-foreground px-2 py-0.5 text-sm font-bold">{result.type}</span>
          </div>
          <div className="rounded-md border overflow-hidden">
            {renderRecords(result.records, result.type)}
          </div>
        </div>
      )}
    </div>
  )
}
