'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

type Mode = 'price-to-sale' | 'markup' | 'find-original'

export default function DiscountCalculator() {
  const [mode, setMode] = useState<Mode>('price-to-sale')
  const [currency, setCurrency] = useState('$')

  // Mode 1: original price + discount %
  const [original, setOriginal] = useState('100')
  const [discountPct, setDiscountPct] = useState('20')

  // Mode 2: cost + markup %
  const [cost, setCost] = useState('50')
  const [markupPct, setMarkupPct] = useState('40')

  // Mode 3: sale price + original price
  const [salePrice, setSalePrice] = useState('80')
  const [origForDisc, setOrigForDisc] = useState('100')

  const result1 = useMemo(() => {
    const p = parseFloat(original), d = parseFloat(discountPct)
    if (!p || isNaN(d) || p <= 0 || d < 0 || d > 100) return null
    const saving = p * d / 100
    return { sale: p - saving, saving, pct: d }
  }, [original, discountPct])

  const result2 = useMemo(() => {
    const c = parseFloat(cost), m = parseFloat(markupPct)
    if (!c || isNaN(m) || c <= 0 || m < 0) return null
    const profit = c * m / 100
    const sell = c + profit
    const margin = (profit / sell) * 100
    return { sell, profit, margin }
  }, [cost, markupPct])

  const result3 = useMemo(() => {
    const s = parseFloat(salePrice), o = parseFloat(origForDisc)
    if (!s || !o || s <= 0 || o <= 0 || s > o) return null
    const saving = o - s
    const pct = (saving / o) * 100
    return { saving, pct }
  }, [salePrice, origForDisc])

  const MODES: { id: Mode; label: string }[] = [
    { id: 'price-to-sale',  label: 'Sale Price' },
    { id: 'markup',         label: 'Markup / Margin' },
    { id: 'find-original',  label: 'Discount %' },
  ]

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Mode tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg">
        {MODES.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)}
            className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${mode === m.id ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'}`}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Label className="text-xs">Currency</Label>
        <select value={currency} onChange={e => setCurrency(e.target.value)}
          className="h-8 border rounded-md px-2 text-sm bg-background">
          {['$','€','£','₹','¥'].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {mode === 'price-to-sale' && (
        <div className="space-y-4">
          <div>
            <Label className="text-xs mb-1.5 block">Original Price</Label>
            <div className="flex">
              <span className="h-9 border rounded-l-md px-3 flex items-center text-sm bg-muted/50 border-r-0">{currency}</span>
              <Input value={original} onChange={e => setOriginal(e.target.value)} type="number" min={0} className="rounded-l-none h-9" />
            </div>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Discount</Label>
            <div className="flex">
              <Input value={discountPct} onChange={e => setDiscountPct(e.target.value)} type="number" min={0} max={100} className="rounded-r-none h-9" />
              <span className="h-9 border rounded-r-md px-3 flex items-center text-sm bg-muted/50 border-l-0">%</span>
            </div>
          </div>
          {result1 && (
            <div className="rounded-xl border p-5 space-y-3">
              <Row label="Sale Price"  value={`${currency}${fmt(result1.sale)}`}   big green />
              <Row label="You Save"    value={`${currency}${fmt(result1.saving)}`} />
              <Row label="Discount"    value={`${result1.pct}%`} />
            </div>
          )}
        </div>
      )}

      {mode === 'markup' && (
        <div className="space-y-4">
          <div>
            <Label className="text-xs mb-1.5 block">Cost Price</Label>
            <div className="flex">
              <span className="h-9 border rounded-l-md px-3 flex items-center text-sm bg-muted/50 border-r-0">{currency}</span>
              <Input value={cost} onChange={e => setCost(e.target.value)} type="number" min={0} className="rounded-l-none h-9" />
            </div>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Markup</Label>
            <div className="flex">
              <Input value={markupPct} onChange={e => setMarkupPct(e.target.value)} type="number" min={0} className="rounded-r-none h-9" />
              <span className="h-9 border rounded-r-md px-3 flex items-center text-sm bg-muted/50 border-l-0">%</span>
            </div>
          </div>
          {result2 && (
            <div className="rounded-xl border p-5 space-y-3">
              <Row label="Selling Price"  value={`${currency}${fmt(result2.sell)}`}   big green />
              <Row label="Profit"         value={`${currency}${fmt(result2.profit)}`} />
              <Row label="Profit Margin"  value={`${result2.margin.toFixed(2)}%`} />
            </div>
          )}
        </div>
      )}

      {mode === 'find-original' && (
        <div className="space-y-4">
          <div>
            <Label className="text-xs mb-1.5 block">Original Price</Label>
            <div className="flex">
              <span className="h-9 border rounded-l-md px-3 flex items-center text-sm bg-muted/50 border-r-0">{currency}</span>
              <Input value={origForDisc} onChange={e => setOrigForDisc(e.target.value)} type="number" min={0} className="rounded-l-none h-9" />
            </div>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Sale Price</Label>
            <div className="flex">
              <span className="h-9 border rounded-l-md px-3 flex items-center text-sm bg-muted/50 border-r-0">{currency}</span>
              <Input value={salePrice} onChange={e => setSalePrice(e.target.value)} type="number" min={0} className="rounded-l-none h-9" />
            </div>
          </div>
          {result3 && (
            <div className="rounded-xl border p-5 space-y-3">
              <Row label="Discount %"  value={`${result3.pct.toFixed(2)}%`}          big green />
              <Row label="You Save"    value={`${currency}${fmt(result3.saving)}`} />
            </div>
          )}
          {parseFloat(salePrice) > parseFloat(origForDisc) && (
            <p className="text-xs text-destructive">Sale price must be less than original price</p>
          )}
        </div>
      )}
    </div>
  )
}

function Row({ label, value, big, green }: { label: string; value: string; big?: boolean; green?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`font-bold font-mono ${big ? 'text-xl' : 'text-sm'} ${green ? 'text-green-600 dark:text-green-400' : ''}`}>{value}</span>
    </div>
  )
}
