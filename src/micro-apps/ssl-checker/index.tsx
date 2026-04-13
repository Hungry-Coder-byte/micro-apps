'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShieldCheck, Construction, CheckCircle2, AlertTriangle } from 'lucide-react'

const PREVIEW = {
  domain: 'example.com',
  issued_to: 'example.com',
  issued_by: "Let's Encrypt Authority X3",
  valid_from: 'Jan 12, 2024',
  valid_until: 'Apr 12, 2025',
  days_remaining: 87,
  protocol: 'TLS 1.3',
  cipher: 'TLS_AES_256_GCM_SHA384',
  san: ['example.com', 'www.example.com'],
  chain_valid: true,
}

export default function SslChecker() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <Label className="text-xs mb-1.5 block">Domain or URL</Label>
        <div className="flex gap-2">
          <Input defaultValue="example.com" placeholder="example.com or https://example.com" className="h-10 font-mono" />
          <Button disabled className="gap-2 h-10 px-5 opacity-60">
            <ShieldCheck className="h-4 w-4" /> Check
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Checks port 443 by default. Append :port for custom ports.</p>
      </div>

      {/* Result preview */}
      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-3 border-b bg-green-500/10 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-700 dark:text-green-400">Certificate valid for {PREVIEW.domain}</span>
          <Badge className="ml-auto bg-green-500/20 text-green-700 dark:text-green-400 border-green-400/30 text-xs">{PREVIEW.days_remaining} days left</Badge>
        </div>
        <div className="grid grid-cols-2 gap-px bg-border">
          {[
            ['Issued to',       PREVIEW.issued_to],
            ['Issued by',       PREVIEW.issued_by],
            ['Valid from',      PREVIEW.valid_from],
            ['Valid until',     PREVIEW.valid_until],
            ['Protocol',        PREVIEW.protocol],
            ['Cipher suite',    PREVIEW.cipher],
            ['Chain valid',     PREVIEW.chain_valid ? '✓ Yes' : '✗ No'],
            ['SANs',            PREVIEW.san.join(', ')],
          ].map(([label, value]) => (
            <div key={label} className="bg-background px-4 py-2.5">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
              <p className="text-xs font-mono mt-0.5 truncate">{value}</p>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
        <Construction className="h-3.5 w-3.5" /> Coming soon
      </Badge>
    </div>
  )
}
