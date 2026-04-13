'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'

const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

function convertHundreds(n: number): string {
  if (n === 0) return ''
  if (n < 20) return ones[n]
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? '-' + ones[n % 10] : '')
  return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + convertHundreds(n % 100) : '')
}

const GROUPS: [number, string][] = [
  [1e15, 'quadrillion'],
  [1e12, 'trillion'],
  [1e9,  'billion'],
  [1e6,  'million'],
  [1e3,  'thousand'],
  [1,    ''],
]

function numberToWords(n: number): string {
  if (n === 0) return 'zero'
  const neg = n < 0
  const abs = Math.abs(n)
  const parts: string[] = []
  let rem = abs
  for (const [val, name] of GROUPS) {
    if (rem >= val) {
      const chunk = Math.floor(rem / val)
      rem = Math.round(rem % val)
      const words = convertHundreds(chunk)
      parts.push(name ? words + ' ' + name : words)
    }
  }
  return (neg ? 'negative ' : '') + parts.join(', ')
}

export default function NumberToWords() {
  const [input, setInput] = useState('1234567')
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    const trimmed = input.trim().replace(/,/g, '')
    if (!trimmed || !/^-?\d+$/.test(trimmed)) return null
    const n = Number(trimmed)
    if (!Number.isFinite(n)) return 'Number too large'
    if (Math.abs(n) > 999e15) return 'Number too large (max: 999 quadrillion)'
    const w = numberToWords(n)
    return w.charAt(0).toUpperCase() + w.slice(1)
  }, [input])

  function copy() {
    if (!result || typeof result !== 'string') return
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const examples = ['0', '42', '100', '1234', '1000000', '1234567890', '-999']

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div>
        <Label className="text-xs mb-1.5 block">Enter a number</Label>
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. 1234567"
          className="font-mono text-lg h-11"
        />
        <p className="text-xs text-muted-foreground mt-1">Supports integers up to quintillions. Negative numbers supported.</p>
      </div>

      {result && (
        <div className="rounded-xl border bg-muted/20 p-5 space-y-3">
          <p className="text-base leading-relaxed font-medium text-foreground">{result}</p>
          <Button variant="outline" size="sm" className="gap-1.5 h-7 text-xs" onClick={copy}>
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      )}

      {!result && input.trim() && (
        <p className="text-sm text-destructive">Please enter a valid integer</p>
      )}

      <div>
        <p className="text-xs text-muted-foreground mb-2">Try these</p>
        <div className="flex flex-wrap gap-1.5">
          {examples.map(ex => (
            <button key={ex} onClick={() => setInput(ex)}
              className="text-xs px-2.5 py-1 rounded-md border hover:bg-muted/50 transition-colors font-mono">
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
