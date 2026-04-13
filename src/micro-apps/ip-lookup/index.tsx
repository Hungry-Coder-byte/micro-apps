'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { MicroAppComponentProps } from '@/registry/types'
import { Search, Globe, Wifi } from 'lucide-react'

interface IpData {
  query: string
  country: string
  countryCode: string
  regionName: string
  city: string
  zip: string
  lat: number
  lon: number
  timezone: string
  isp: string
  org: string
  as: string
}

export default function IpLookup({ serverFetch }: MicroAppComponentProps) {
  const [ip, setIp] = useState('')
  const [data, setData] = useState<IpData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function lookup(target = ip) {
    setError('')
    setLoading(true)
    try {
      const result = await serverFetch!('ip', { ip: target || 'me' }) as IpData
      setData(result)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="flex gap-2">
        <Input
          value={ip}
          onChange={e => setIp(e.target.value)}
          placeholder="IP address (leave blank for your IP)"
          className="font-mono"
          onKeyDown={e => e.key === 'Enter' && lookup()}
        />
        <Button onClick={() => lookup()} disabled={loading} className="gap-2 shrink-0">
          <Search className="h-4 w-4" />
          {loading ? 'Looking up...' : 'Lookup'}
        </Button>
      </div>
      <Button variant="outline" size="sm" onClick={() => lookup('me')} disabled={loading}>
        <Wifi className="h-4 w-4 mr-2" />
        Lookup My IP
      </Button>

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}

      {data && (
        <div className="rounded-xl border overflow-hidden">
          <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
            <Globe className="h-6 w-6" />
            <div>
              <p className="font-mono text-lg font-bold">{data.query}</p>
              <p className="text-sm opacity-80">{data.city}, {data.regionName}, {data.country}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {[
              { label: 'Country', value: `${data.country} (${data.countryCode})` },
              { label: 'Region', value: data.regionName },
              { label: 'City', value: data.city },
              { label: 'ZIP Code', value: data.zip || '—' },
              { label: 'Latitude', value: String(data.lat) },
              { label: 'Longitude', value: String(data.lon) },
              { label: 'Timezone', value: data.timezone },
              { label: 'ISP', value: data.isp },
              { label: 'Organization', value: data.org || '—' },
              { label: 'AS', value: data.as || '—' },
            ].map(item => (
              <div key={item.label} className="border-t flex items-start gap-3 p-3">
                <span className="text-xs font-medium text-muted-foreground min-w-[100px]">{item.label}</span>
                <span className="text-sm font-mono">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
