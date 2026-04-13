'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Hash, Construction, Copy, Upload } from 'lucide-react'

const ALGOS = [
  { name: 'MD5',     bits: 128, hex: 'd41d8cd98f00b204e9800998ecf8427e' },
  { name: 'SHA-1',   bits: 160, hex: 'da39a3ee5e6b4b0d3255bfef95601890afd80709' },
  { name: 'SHA-256', bits: 256, hex: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
  { name: 'SHA-384', bits: 384, hex: '38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b' },
  { name: 'SHA-512', bits: 512, hex: 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e' },
  { name: 'SHA3-256',bits: 256, hex: 'a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a' },
]

export default function HashGenerator() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="space-y-2">
        <Label className="text-xs">Input text or file</Label>
        <textarea rows={4} disabled placeholder="Type or paste text to hash…"
          className="w-full rounded-lg border bg-muted/30 p-3 text-sm font-mono resize-none opacity-60 cursor-not-allowed" />
        <div className="flex gap-2">
          <Button size="sm" variant="outline" disabled className="gap-1.5 opacity-60">
            <Upload className="h-3.5 w-3.5" /> Upload file
          </Button>
          <span className="text-xs text-muted-foreground self-center">or drag & drop any file</span>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Hash outputs</div>
        <div className="divide-y">
          {ALGOS.map(({ name, bits, hex }) => (
            <div key={name} className="px-4 py-3 space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">{name}</Badge>
                <span className="text-[10px] text-muted-foreground">{bits}-bit</span>
                <button disabled className="ml-auto opacity-40 cursor-not-allowed">
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
              <code className="text-[11px] font-mono text-muted-foreground break-all block">{hex}</code>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60"><Hash className="h-4 w-4" /> Generate Hashes</Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
