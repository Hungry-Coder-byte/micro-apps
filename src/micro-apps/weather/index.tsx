'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { MicroAppComponentProps } from '@/registry/types'
import { Search, Wind, Droplets, Eye, Thermometer, Gauge } from 'lucide-react'

interface WeatherData {
  city: string
  country: string
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  description: string
  humidity: number
  wind_speed: number
  icon: string
  pressure: number
  visibility: number
}

const weatherEmoji: Record<string, string> = {
  '01': '☀️', '02': '⛅', '03': '☁️', '04': '☁️',
  '09': '🌧️', '10': '🌦️', '11': '⛈️', '13': '❄️', '50': '🌫️',
}

export default function Weather({ serverFetch }: MicroAppComponentProps) {
  const [city, setCity] = useState('')
  const [data, setData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function search() {
    if (!city.trim()) return
    setError('')
    setLoading(true)
    try {
      const result = await serverFetch!('weather', { city }) as WeatherData
      setData(result)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const iconCode = data?.icon?.slice(0, 2) ?? ''
  const emoji = weatherEmoji[iconCode] ?? '🌡️'

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="flex gap-2">
        <Input
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="Enter city name (e.g. London, Tokyo)"
          onKeyDown={e => e.key === 'Enter' && search()}
        />
        <Button onClick={search} disabled={loading || !city} className="gap-2 shrink-0">
          <Search className="h-4 w-4" />
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
          {error.includes('not configured') ? (
            <div>
              <strong>API Key Required</strong>
              <p className="mt-1">Add your <code>OPENWEATHERMAP_API_KEY</code> to <code>.env.local</code> to use this app. Get a free key at <a href="https://openweathermap.org/api" target="_blank" rel="noopener" className="underline">openweathermap.org</a>.</p>
            </div>
          ) : error}
        </div>
      )}

      {data && (
        <div className="rounded-xl border overflow-hidden">
          {/* Main display */}
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{data.city}, {data.country}</h2>
                <p className="capitalize opacity-90 mt-1">{data.description}</p>
              </div>
              <span className="text-5xl">{emoji}</span>
            </div>
            <div className="mt-4">
              <p className="text-6xl font-bold">{data.temp}°C</p>
              <p className="opacity-80 mt-1">Feels like {data.feels_like}°C</p>
              <p className="opacity-80 text-sm">H: {data.temp_max}°C · L: {data.temp_min}°C</p>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-0 bg-card">
            {[
              { icon: Droplets, label: 'Humidity', value: `${data.humidity}%` },
              { icon: Wind, label: 'Wind Speed', value: `${data.wind_speed} m/s` },
              { icon: Gauge, label: 'Pressure', value: `${data.pressure} hPa` },
              { icon: Eye, label: 'Visibility', value: `${(data.visibility / 1000).toFixed(1)} km` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 p-4 border-t border-r last:border-r-0 even:border-r-0">
                <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-semibold">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
