'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowUpDown } from 'lucide-react'

const VALS: [number, string][] = [
  [1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],
  [100,'C'],[90,'XC'],[50,'L'],[40,'XL'],
  [10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I'],
]

function toRoman(n: number): string {
  if (n <= 0 || n > 3999) return ''
  let result = ''
  for (const [val, sym] of VALS) {
    while (n >= val) { result += sym; n -= val }
  }
  return result
}

function fromRoman(s: string): number | null {
  const map: Record<string, number> = { I:1,V:5,X:10,L:50,C:100,D:500,M:1000 }
  let result = 0, prev = 0
  for (const ch of s.toUpperCase().split('').reverse()) {
    const v = map[ch]
    if (!v) return null
    result += v < prev ? -v : v
    prev = v
  }
  return result > 0 ? result : null
}

export default function RomanNumeralConverter() {
  const [arabic, setArabic] = useState('2024')
  const [roman, setRoman]   = useState('MMXXIV')
  const [arabicErr, setArabicErr] = useState('')
  const [romanErr, setRomanErr]   = useState('')

  function handleArabic(v: string) {
    setArabic(v)
    setArabicErr('')
    const n = parseInt(v)
    if (!v) { setRoman(''); return }
    if (isNaN(n) || n < 1 || n > 3999) {
      setArabicErr('Enter a number between 1 and 3999')
      setRoman('')
      return
    }
    setRoman(toRoman(n))
  }

  function handleRoman(v: string) {
    setRoman(v)
    setRomanErr('')
    if (!v) { setArabic(''); return }
    if (!/^[IVXLCDMivxlcdm]+$/.test(v)) {
      setRomanErr('Only I, V, X, L, C, D, M allowed')
      setArabic('')
      return
    }
    const n = fromRoman(v)
    if (n === null) { setRomanErr('Invalid Roman numeral'); setArabic(''); return }
    setArabic(String(n))
  }

  const quickNums = [1, 4, 9, 14, 40, 90, 399, 444, 1999, 2024, 3999]

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-xs mb-1.5 block">Arabic (1–3999)</Label>
          <Input value={arabic} onChange={e => handleArabic(e.target.value)}
            placeholder="e.g. 2024" type="number" min={1} max={3999}
            className="font-mono text-lg h-11" />
          {arabicErr && <p className="text-xs text-destructive mt-1">{arabicErr}</p>}
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-xs justify-center">
          <div className="flex-1 border-t" />
          <ArrowUpDown className="h-3.5 w-3.5 shrink-0" />
          <div className="flex-1 border-t" />
        </div>

        <div>
          <Label className="text-xs mb-1.5 block">Roman Numeral</Label>
          <Input value={roman} onChange={e => handleRoman(e.target.value)}
            placeholder="e.g. MMXXIV" className="font-mono text-lg h-11 uppercase" />
          {romanErr && <p className="text-xs text-destructive mt-1">{romanErr}</p>}
        </div>
      </div>

      {arabic && roman && !arabicErr && !romanErr && (
        <div className="rounded-xl border bg-muted/30 p-5 text-center">
          <p className="text-4xl font-bold font-mono tracking-wider text-primary">{roman.toUpperCase()}</p>
          <p className="text-sm text-muted-foreground mt-1">= {arabic}</p>
        </div>
      )}

      <div>
        <p className="text-xs text-muted-foreground mb-2">Quick examples</p>
        <div className="flex flex-wrap gap-1.5">
          {quickNums.map(n => (
            <button key={n} onClick={() => handleArabic(String(n))}
              className="text-xs px-2.5 py-1 rounded-md border hover:bg-muted/50 transition-colors font-mono">
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
