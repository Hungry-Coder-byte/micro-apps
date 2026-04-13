'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { MicroAppComponentProps } from '@/registry/types'
import { LocateFixed, Search, MapPin } from 'lucide-react'

interface GeoData {
  ip: string
  city: string
  region: string
  country: string
  loc: string
  org: string
  timezone: string
  postal?: string
}

export default function GeolocationFinder({ serverFetch }: MicroAppComponentProps) {
  const [ip, setIp] = useState('')
  const [data, setData] = useState<GeoData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [geoLoading, setGeoLoading] = useState(false)

  async function lookup(target?: string) {
    setError('')
    setLoading(true)
    try {
      const result = await serverFetch!('geolocation', target ? { ip: target } : {}) as GeoData
      setData(result)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  function useMyLocation() {
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setGeoLoading(false)
        const coords = `${pos.coords.latitude.toFixed(4)},${pos.coords.longitude.toFixed(4)}`
        setData({
          ip: 'Browser Geolocation',
          city: 'Your current location',
          region: '',
          country: '',
          loc: coords,
          org: '',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })
      },
      err => {
        setGeoLoading(false)
        setError(err.message)
      }
    )
  }

  const [lat, lon] = data?.loc?.split(',') ?? ['', '']

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="flex gap-2">
        <Input
          value={ip}
          onChange={e => setIp(e.target.value)}
          placeholder="IP address (leave blank for your IP)"
          className="font-mono"
          onKeyDown={e => e.key === 'Enter' && lookup(ip || undefined)}
        />
        <Button onClick={() => lookup(ip || undefined)} disabled={loading} className="gap-2 shrink-0">
          <Search className="h-4 w-4" />
          {loading ? 'Looking up...' : 'Lookup'}
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => lookup()} disabled={loading} className="gap-2">
          <LocateFixed className="h-4 w-4" /> My IP Location
        </Button>
        <Button variant="outline" onClick={useMyLocation} disabled={geoLoading} className="gap-2">
          <MapPin className="h-4 w-4" /> {geoLoading ? 'Getting...' : 'Browser GPS'}
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}

      {data && (
        <div className="rounded-xl border overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 flex items-center gap-3">
            <MapPin className="h-6 w-6" />
            <div>
              <p className="font-bold text-lg">{[data.city, data.region, data.country].filter(Boolean).join(', ') || 'Unknown location'}</p>
              <p className="text-sm opacity-90 font-mono">{data.ip}</p>
            </div>
          </div>
          <div className="divide-y">
            {[
              { label: 'Coordinates', value: data.loc, link: data.loc ? `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=12` : undefined },
              data.postal && { label: 'Postal Code', value: data.postal },
              { label: 'Timezone', value: data.timezone },
              { label: 'Organization / ISP', value: data.org || '—' },
            ].filter(Boolean).map(item => item && (
              <div key={item.label} className="flex items-start gap-3 p-3 hover:bg-muted/30">
                <span className="text-sm text-muted-foreground min-w-[140px]">{item.label}</span>
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noopener" className="text-sm font-mono text-primary underline">{item.value}</a>
                ) : (
                  <span className="text-sm font-mono">{item.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
