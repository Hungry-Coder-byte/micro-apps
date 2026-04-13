'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { useClipboard } from '@/hooks/useClipboard'
import { Copy, Check } from 'lucide-react'

export default function DateFormatter() {
  const [dateInput, setDateInput] = useState(() => new Date().toISOString().slice(0, 16))
  const { copy, copied } = useClipboard()
  const [copiedKey, setCopiedKey] = useState('')

  const formats = useMemo(() => {
    try {
      const date = new Date(dateInput)
      if (isNaN(date.getTime())) return []
      const unixMs = date.getTime()
      const unixS = Math.floor(unixMs / 1000)

      const pad = (n: number, l = 2) => String(n).padStart(l, '0')
      const Y = date.getFullYear()
      const M = pad(date.getMonth() + 1)
      const D = pad(date.getDate())
      const h = pad(date.getHours())
      const m = pad(date.getMinutes())
      const s = pad(date.getSeconds())
      const ms = String(date.getMilliseconds()).padStart(3, '0')
      const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
      const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffS = Math.abs(Math.floor(diffMs / 1000))
      const diffM = Math.floor(diffS / 60)
      const diffH = Math.floor(diffM / 60)
      const diffDays = Math.floor(diffH / 24)
      let relative: string
      if (diffS < 60) relative = diffMs > 0 ? `${diffS} seconds ago` : `in ${diffS} seconds`
      else if (diffM < 60) relative = diffMs > 0 ? `${diffM} minutes ago` : `in ${diffM} minutes`
      else if (diffH < 24) relative = diffMs > 0 ? `${diffH} hours ago` : `in ${diffH} hours`
      else relative = diffMs > 0 ? `${diffDays} days ago` : `in ${diffDays} days`

      return [
        { label: 'ISO 8601', value: date.toISOString() },
        { label: 'ISO Date Only', value: `${Y}-${M}-${D}` },
        { label: 'ISO Date + Time', value: `${Y}-${M}-${D}T${h}:${m}:${s}` },
        { label: 'Unix Timestamp (s)', value: String(unixS) },
        { label: 'Unix Timestamp (ms)', value: String(unixMs) },
        { label: 'RFC 2822', value: date.toUTCString() },
        { label: 'Locale (US)', value: date.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'long' }) },
        { label: 'Locale (UK)', value: date.toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'long' }) },
        { label: 'Short Date', value: `${M}/${D}/${Y}` },
        { label: 'Long Date', value: `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${Y}` },
        { label: 'Time', value: `${h}:${m}:${s}` },
        { label: 'Date + Time (Y-M-D)', value: `${Y}-${M}-${D} ${h}:${m}:${s}` },
        { label: 'Day of Week', value: days[date.getDay()] },
        { label: 'Week Number', value: String(Math.ceil((Math.floor((date.getTime() - new Date(Y, 0, 1).getTime()) / 86400000) + new Date(Y, 0, 1).getDay() + 1) / 7)) },
        { label: 'Relative Time', value: relative },
      ]
    } catch {
      return []
    }
  }, [dateInput])

  function copyValue(key: string, value: string) {
    copy(value)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(''), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="max-w-md space-y-2">
        <label className="text-sm font-medium">Input Date & Time</label>
        <Input
          type="datetime-local"
          value={dateInput}
          onChange={e => setDateInput(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">Or enter a date string: ISO, Unix timestamp, etc.</p>
        <Input
          value={dateInput}
          onChange={e => setDateInput(e.target.value)}
          placeholder="2024-01-15T12:30:00 or 1705320600"
          className="font-mono text-sm"
        />
      </div>

      {formats.length > 0 ? (
        <div className="rounded-md border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Format</th>
                <th className="text-left px-4 py-2 font-medium">Value</th>
                <th className="w-16"></th>
              </tr>
            </thead>
            <tbody>
              {formats.map(f => (
                <tr key={f.label} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-2 text-muted-foreground font-medium whitespace-nowrap">{f.label}</td>
                  <td className="px-4 py-2 font-mono">{f.value}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => copyValue(f.label, f.value)} className="text-muted-foreground hover:text-foreground">
                      {copiedKey === f.label ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          Invalid date. Please enter a valid date/time string.
        </div>
      )}
    </div>
  )
}
