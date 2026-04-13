'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useClipboard } from '@/hooks/useClipboard'
import { Copy, Check, RefreshCw } from 'lucide-react'

export default function UuidGenerator() {
  const [quantity, setQuantity] = useState(5)
  const [uppercase, setUppercase] = useState(false)
  const [hyphens, setHyphens] = useState(true)
  const [uuids, setUuids] = useState<string[]>([])
  const { copy, copied } = useClipboard()

  function generate() {
    const generated: string[] = []
    for (let i = 0; i < Math.min(quantity, 100); i++) {
      let id = crypto.randomUUID()
      if (!hyphens) id = id.replace(/-/g, '')
      if (uppercase) id = id.toUpperCase()
      generated.push(id)
    }
    setUuids(generated)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-1">
          <label className="text-sm font-medium">Quantity (1–100)</label>
          <Input
            type="number"
            min={1}
            max={100}
            value={quantity}
            onChange={e => setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
            className="w-28"
          />
        </div>
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} className="rounded" />
            Uppercase
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={hyphens} onChange={e => setHyphens(e.target.checked)} className="rounded" />
            Include hyphens
          </label>
        </div>
        <Button onClick={generate} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Generate
        </Button>
      </div>

      {uuids.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{uuids.length} UUID{uuids.length !== 1 ? 's' : ''} generated</label>
            <Button size="sm" variant="outline" onClick={() => copy(uuids.join('\n'))}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copy All
            </Button>
          </div>
          <div className="rounded-md border bg-muted overflow-hidden">
            {uuids.map((uuid, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 border-b last:border-b-0 hover:bg-background/50 group">
                <code className="text-sm font-mono">{uuid}</code>
                <button
                  onClick={() => copy(uuid)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {uuids.length === 0 && (
        <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
          <p>Click Generate to create UUIDs</p>
          <p className="text-xs mt-1">Uses crypto.randomUUID() — cryptographically secure UUID v4</p>
        </div>
      )}
    </div>
  )
}
