'use client'

import { useState, useMemo, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload } from 'lucide-react'

const UNITS = [
  { key: 'B',   label: 'Bytes (B)',            factor: 1 },
  { key: 'KB',  label: 'Kilobytes (KB)',        factor: 1e3 },
  { key: 'MB',  label: 'Megabytes (MB)',        factor: 1e6 },
  { key: 'GB',  label: 'Gigabytes (GB)',        factor: 1e9 },
  { key: 'TB',  label: 'Terabytes (TB)',        factor: 1e12 },
  { key: 'KiB', label: 'Kibibytes (KiB)',       factor: 1024 },
  { key: 'MiB', label: 'Mebibytes (MiB)',       factor: 1024 ** 2 },
  { key: 'GiB', label: 'Gibibytes (GiB)',       factor: 1024 ** 3 },
  { key: 'TiB', label: 'Tebibytes (TiB)',       factor: 1024 ** 4 },
  { key: 'bit', label: 'Bits',                  factor: 0.125 },
  { key: 'Kbit',label: 'Kilobits (Kbit)',       factor: 125 },
  { key: 'Mbit',label: 'Megabits (Mbit)',       factor: 125000 },
  { key: 'Gbit',label: 'Gigabits (Gbit)',       factor: 125000000 },
]

export default function FileSizeConverter() {
  const [value, setValue] = useState('1')
  const [unit, setUnit] = useState('GB')
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const bytes = useMemo(() => {
    const num = parseFloat(value)
    if (isNaN(num)) return null
    const u = UNITS.find(u => u.key === unit)
    return u ? num * u.factor : null
  }, [value, unit])

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileInfo({ name: file.name, size: file.size })
    setValue(String(file.size))
    setUnit('B')
  }

  function fmt(bytes: number, factor: number, key: string): string {
    const val = bytes / factor
    if (val >= 1000 || val < 0.001 && val > 0) return val.toExponential(4)
    return val.toPrecision(7).replace(/\.?0+$/, '')
  }

  return (
    <div className="space-y-4">
      {/* File upload */}
      <div
        className="rounded-lg border-2 border-dashed p-4 text-center cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => fileRef.current?.click()}
      >
        <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
        <p className="text-sm text-muted-foreground">Upload a file to see its real size</p>
        <input ref={fileRef} type="file" onChange={handleFile} className="hidden" />
      </div>

      {fileInfo && (
        <div className="rounded-md border bg-muted/30 p-3 text-sm">
          <span className="font-medium">{fileInfo.name}</span>
          <span className="text-muted-foreground ml-2">{fileInfo.size.toLocaleString()} bytes</span>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 items-end">
        <div className="flex-1 space-y-1">
          <label className="text-sm font-medium">Value</label>
          <Input
            type="number"
            value={value}
            onChange={e => setValue(e.target.value)}
            className="font-mono text-lg"
            min="0"
          />
        </div>
        <div className="w-48 space-y-1">
          <label className="text-sm font-medium">Unit</label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {UNITS.map(u => <SelectItem key={u.key} value={u.key}>{u.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results table */}
      {bytes !== null && (
        <div className="rounded-md border overflow-hidden">
          <div className="bg-muted px-4 py-2 text-sm font-semibold">
            = {bytes.toLocaleString()} bytes
          </div>
          <table className="w-full text-sm">
            <tbody>
              {UNITS.map(u => (
                <tr key={u.key} className={`border-t hover:bg-muted/30 ${u.key === unit ? 'bg-primary/5' : ''}`}>
                  <td className="px-4 py-2 font-medium w-32">{u.key}</td>
                  <td className="px-4 py-2 text-muted-foreground">{u.label}</td>
                  <td className="px-4 py-2 font-mono font-semibold text-right">{fmt(bytes, u.factor, u.key)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
