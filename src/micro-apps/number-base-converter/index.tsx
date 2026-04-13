'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'

const BASES = [
  { label: 'Binary',      radix: 2,  prefix: '0b', chars: /^[01]*$/,          placeholder: '1010' },
  { label: 'Octal',       radix: 8,  prefix: '0o', chars: /^[0-7]*$/,         placeholder: '12' },
  { label: 'Decimal',     radix: 10, prefix: '',   chars: /^[0-9]*$/,         placeholder: '10' },
  { label: 'Hexadecimal', radix: 16, prefix: '0x', chars: /^[0-9a-fA-F]*$/,  placeholder: 'A' },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copy}>
      {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
    </Button>
  )
}

export default function NumberBaseConverter() {
  const [values, setValues] = useState(['', '', '', ''])
  const [error, setError] = useState('')

  function handleChange(idx: number, raw: string) {
    const v = raw.replace(/\s/g, '').replace(/^0[bBoOxX]/, '')
    if (!BASES[idx].chars.test(v)) return
    setError('')
    if (!v) { setValues(['', '', '', '']); return }
    const dec = parseInt(v || '0', BASES[idx].radix)
    if (isNaN(dec) || dec < 0 || dec > 2 ** 53) {
      setError('Number too large or invalid')
      return
    }
    setValues(BASES.map(b => dec.toString(b.radix).toUpperCase()))
  }

  const hasValue = values[2] !== ''

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {BASES.map((b, i) => (
          <div key={b.label}>
            <Label className="text-xs mb-1.5 flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-[10px] px-1.5">{b.prefix || '0d'}</Badge>
              {b.label}
            </Label>
            <Input
              value={values[i]}
              onChange={e => handleChange(i, e.target.value)}
              placeholder={b.placeholder}
              className="font-mono"
              spellCheck={false}
            />
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {hasValue && (
        <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Converted values</p>
          {BASES.map((b, i) => (
            <div key={b.label} className="flex items-center justify-between gap-2 text-sm font-mono">
              <span className="text-muted-foreground w-24 shrink-0">{b.label}</span>
              <span className="flex-1 truncate">{b.prefix}{values[i]}</span>
              <CopyButton text={`${b.prefix}${values[i]}`} />
            </div>
          ))}
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        Supports integers from 0 to 2<sup>53</sup>. Type in any field to convert all others.
      </div>
    </div>
  )
}
