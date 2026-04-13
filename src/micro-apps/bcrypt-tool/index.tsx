'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Lock, Construction, CheckCircle2, XCircle } from 'lucide-react'

const HASH_PREVIEW = '$2b$12$eImiTXuWVxfM37uY4JANjQ.1GgbOt.cNRdI6Ux1nD7z1JfJ9mKBLe'

export default function BcryptTool() {
  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Hash */}
      <div className="rounded-xl border p-4 space-y-3">
        <p className="text-xs font-semibold">Hash a password</p>
        <div>
          <Label className="text-xs mb-1.5 block">Plain-text password</Label>
          <Input defaultValue="MySecureP@ssw0rd!" type="password" disabled className="h-9 font-mono opacity-60 cursor-not-allowed" />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-1">
            <Label className="text-xs">Salt rounds (cost factor)</Label>
            <div className="flex items-center gap-2">
              <input type="range" min={4} max={31} defaultValue={12} disabled className="flex-1 opacity-60 cursor-not-allowed" />
              <span className="font-mono text-sm font-bold w-8 text-center">12</span>
            </div>
            <p className="text-[10px] text-muted-foreground">~400 ms · 2¹² iterations</p>
          </div>
        </div>
        <div className="rounded-lg border bg-muted/30 px-3 py-2.5 opacity-70">
          <p className="text-[10px] text-muted-foreground mb-1">bcrypt hash</p>
          <code className="text-xs font-mono break-all">{HASH_PREVIEW}</code>
        </div>
      </div>

      {/* Verify */}
      <div className="rounded-xl border p-4 space-y-3">
        <p className="text-xs font-semibold">Verify a hash</p>
        <div>
          <Label className="text-xs mb-1.5 block">Plain-text password</Label>
          <Input defaultValue="MySecureP@ssw0rd!" type="password" disabled className="h-9 font-mono opacity-60 cursor-not-allowed" />
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">bcrypt / argon2 hash</Label>
          <Input defaultValue={HASH_PREVIEW} disabled className="h-9 font-mono text-xs opacity-60 cursor-not-allowed" />
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-green-600 opacity-70">
          <CheckCircle2 className="h-4 w-4" /> Password matches the hash
        </div>
      </div>

      {/* Cost comparison */}
      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Cost factor comparison</div>
        <div className="divide-y">
          {[
            { rounds: 10, ms: '~100 ms',  note: 'Minimum recommended' },
            { rounds: 12, ms: '~400 ms',  note: 'Good default (bcrypt default)' },
            { rounds: 14, ms: '~1.5 s',   note: 'High security applications' },
            { rounds: 16, ms: '~6 s',     note: 'Extreme (slow UX)' },
          ].map(({ rounds, ms, note }) => (
            <div key={rounds} className="px-4 py-2.5 flex items-center gap-3 text-xs">
              <span className="font-mono font-bold w-6">{rounds}</span>
              <span className="font-mono text-primary w-16 shrink-0">{ms}</span>
              <span className="text-muted-foreground">{note}</span>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60"><Lock className="h-4 w-4" /> Hash Password</Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
