'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { KeyRound, Construction, Copy, RefreshCw } from 'lucide-react'

const SAMPLE_PASSWORDS = [
  { pwd: 'K#9mP$vL2nQx@Yw8', strength: 'Very Strong', bits: 104 },
  { pwd: 'correct-horse-battery-staple', strength: 'Strong', bits: 88 },
  { pwd: 'Tr0ub4dor&3',                  strength: 'Strong', bits: 72 },
]

export default function PasswordGenerator() {
  const [length] = useState(16)

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="rounded-xl border p-4 space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-lg border bg-muted/30 px-3 py-2.5 font-mono text-sm opacity-70 select-all">
            K#9mP$vL2nQx@Yw8
          </div>
          <button disabled className="opacity-40 cursor-not-allowed p-2"><Copy className="h-4 w-4 text-muted-foreground" /></button>
          <button disabled className="opacity-40 cursor-not-allowed p-2"><RefreshCw className="h-4 w-4 text-muted-foreground" /></button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <Label>Length: {length}</Label>
            <span className="text-muted-foreground">8 — 128</span>
          </div>
          <input type="range" min={8} max={128} defaultValue={16} disabled
            className="w-full opacity-60 cursor-not-allowed" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            ['Uppercase (A–Z)', true],
            ['Lowercase (a–z)', true],
            ['Numbers (0–9)',   true],
            ['Symbols (!@#…)',  true],
            ['Exclude ambiguous chars (0, O, l, 1)', false],
            ['No consecutive repeats',               false],
          ].map(([label, checked]) => (
            <label key={String(label)} className="flex items-center gap-2 text-xs text-muted-foreground cursor-not-allowed">
              <input type="checkbox" defaultChecked={Boolean(checked)} disabled className="rounded accent-primary" />
              {label}
            </label>
          ))}
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Type</Label>
          <div className="flex gap-1 p-0.5 bg-muted rounded-md w-fit">
            {['Random', 'Passphrase', 'PIN'].map((t, i) => (
              <button key={t} disabled
                className={`text-xs px-3 py-1 rounded transition-colors cursor-not-allowed ${i === 0 ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Batch — 3 passwords</div>
        <div className="divide-y">
          {SAMPLE_PASSWORDS.map(({ pwd, strength, bits }) => (
            <div key={pwd} className="px-4 py-2.5 flex items-center gap-3 text-xs font-mono">
              <span className="flex-1">{pwd}</span>
              <span className="text-muted-foreground text-[10px] shrink-0">{bits} bits</span>
              <Badge variant="outline" className={`text-[10px] px-1.5 shrink-0 ${strength === 'Very Strong' ? 'text-green-600 border-green-400/40' : 'text-blue-600 border-blue-400/40'}`}>{strength}</Badge>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60"><KeyRound className="h-4 w-4" /> Generate</Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
