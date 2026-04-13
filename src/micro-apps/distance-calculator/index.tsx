'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowLeftRight } from 'lucide-react'

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function DistanceCalculator() {
  const [lat1, setLat1] = useState('40.7128')
  const [lon1, setLon1] = useState('-74.0060')
  const [lat2, setLat2] = useState('51.5074')
  const [lon2, setLon2] = useState('-0.1278')

  const distance = useMemo(() => {
    const la1 = parseFloat(lat1), lo1 = parseFloat(lon1)
    const la2 = parseFloat(lat2), lo2 = parseFloat(lon2)
    if ([la1, lo1, la2, lo2].some(isNaN)) return null
    if (la1 < -90 || la1 > 90 || la2 < -90 || la2 > 90) return null
    if (lo1 < -180 || lo1 > 180 || lo2 < -180 || lo2 > 180) return null
    return haversine(la1, lo1, la2, lo2)
  }, [lat1, lon1, lat2, lon2])

  function swap() {
    setLat1(lat2); setLon1(lon2)
    setLat2(lat1); setLon2(lon1)
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3 rounded-lg border p-4">
          <h3 className="font-semibold text-sm">Point A</h3>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Latitude (-90 to 90)</label>
            <Input value={lat1} onChange={e => setLat1(e.target.value)} placeholder="40.7128" className="font-mono" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Longitude (-180 to 180)</label>
            <Input value={lon1} onChange={e => setLon1(e.target.value)} placeholder="-74.0060" className="font-mono" />
          </div>
          <p className="text-xs text-muted-foreground">e.g. New York City: 40.7128, -74.0060</p>
        </div>

        <div className="space-y-3 rounded-lg border p-4">
          <h3 className="font-semibold text-sm">Point B</h3>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Latitude (-90 to 90)</label>
            <Input value={lat2} onChange={e => setLat2(e.target.value)} placeholder="51.5074" className="font-mono" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Longitude (-180 to 180)</label>
            <Input value={lon2} onChange={e => setLon2(e.target.value)} placeholder="-0.1278" className="font-mono" />
          </div>
          <p className="text-xs text-muted-foreground">e.g. London: 51.5074, -0.1278</p>
        </div>
      </div>

      <div className="flex justify-center">
        <Button variant="outline" onClick={swap} className="gap-2">
          <ArrowLeftRight className="h-4 w-4" /> Swap Points
        </Button>
      </div>

      {distance !== null ? (
        <div className="rounded-xl border bg-primary text-primary-foreground p-6 text-center">
          <p className="text-sm opacity-80 mb-2">Distance (Haversine formula)</p>
          <p className="text-4xl font-bold">{distance.toFixed(2)} km</p>
          <p className="text-xl mt-2">{(distance * 0.621371).toFixed(2)} miles</p>
          <p className="text-sm opacity-70 mt-2">{(distance * 1000).toFixed(0)} meters</p>
        </div>
      ) : (
        <div className="rounded-md border border-dashed p-6 text-center text-muted-foreground">
          Enter valid coordinates to calculate distance
        </div>
      )}

      <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
        <strong>Note:</strong> Uses the Haversine formula, which calculates the great-circle distance between two points on Earth's surface. This is the shortest distance over the earth's surface (as the crow flies).
      </div>
    </div>
  )
}
