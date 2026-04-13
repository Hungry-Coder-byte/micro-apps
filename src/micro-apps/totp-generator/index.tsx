'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ShieldCheck, Construction, RefreshCw } from 'lucide-react'

export default function TotpGenerator() {
  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="space-y-3">
        <div>
          <Label className="text-xs mb-1.5 block">Secret key (Base32)</Label>
          <Input defaultValue="JBSWY3DPEHPK3PXP" disabled className="h-9 font-mono opacity-60 cursor-not-allowed tracking-widest" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Algorithm', value: 'SHA-1' },
            { label: 'Digits',    value: '6' },
            { label: 'Period',    value: '30 s' },
          ].map(({ label, value }) => (
            <div key={label}>
              <Label className="text-xs mb-1.5 block">{label}</Label>
              <Input defaultValue={value} disabled className="h-9 font-mono text-center opacity-60 cursor-not-allowed" />
            </div>
          ))}
        </div>
      </div>

      {/* Live code display */}
      <div className="rounded-xl border p-6 flex flex-col items-center gap-4 opacity-70">
        <p className="text-xs text-muted-foreground">Current TOTP code</p>
        <div className="flex items-center gap-3">
          <span className="text-5xl font-bold font-mono tracking-[0.3em]">482 916</span>
        </div>
        <div className="w-full">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Valid for</span><span>14 seconds</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '47%' }} />
          </div>
        </div>
        <button disabled className="flex items-center gap-1.5 text-xs text-muted-foreground opacity-60 cursor-not-allowed">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh now
        </button>
      </div>

      {/* QR Code placeholder */}
      <div className="rounded-xl border p-4 flex items-center gap-4 opacity-70">
        <div className="w-24 h-24 rounded-lg bg-muted/50 border flex items-center justify-center shrink-0">
          <span className="text-[10px] text-muted-foreground text-center">QR Code<br/>preview</span>
        </div>
        <div className="text-xs space-y-1">
          <p className="font-medium">Scan with your authenticator</p>
          <p className="text-muted-foreground">Works with Google Authenticator, Authy, 1Password, and any TOTP-compatible app.</p>
          <p className="text-muted-foreground text-[10px] font-mono break-all">otpauth://totp/Example:alice@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Example</p>
        </div>
      </div>

      <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center rounded-lg">(Preview only — functionality coming soon)</div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60"><ShieldCheck className="h-4 w-4" /> Generate TOTP</Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
