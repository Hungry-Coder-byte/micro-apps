'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, Construction, Copy } from 'lucide-react'

const DIRECTIVES = [
  { name: "default-src",   value: "'self'",                  desc: 'Fallback for all fetch directives' },
  { name: "script-src",    value: "'self' 'nonce-{random}'", desc: 'Allowed script sources' },
  { name: "style-src",     value: "'self' fonts.googleapis.com", desc: 'Allowed style sources' },
  { name: "img-src",       value: "'self' data: https:",     desc: 'Allowed image sources' },
  { name: "font-src",      value: "'self' fonts.gstatic.com",desc: 'Allowed font sources' },
  { name: "connect-src",   value: "'self' api.example.com",  desc: 'Allowed XHR/fetch targets' },
  { name: "frame-src",     value: "'none'",                  desc: 'Allowed iframe sources' },
  { name: "object-src",    value: "'none'",                  desc: 'Disallows plugins (Flash etc.)' },
  { name: "base-uri",      value: "'self'",                  desc: 'Restricts <base> tag URLs' },
  { name: "form-action",   value: "'self'",                  desc: 'Allowed form submission URLs' },
  { name: "upgrade-insecure-requests", value: '',            desc: 'Upgrade HTTP to HTTPS' },
]

const HEADER = `Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{random}'; style-src 'self' fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' fonts.gstatic.com; connect-src 'self' api.example.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests`

export default function CspBuilder() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="rounded-xl border p-3 space-y-2">
        <p className="text-xs text-muted-foreground font-medium">Presets</p>
        <div className="flex flex-wrap gap-1.5">
          {['Strict', 'Moderate', 'Google Fonts', 'CDN + Analytics', 'Report-only mode'].map(p => (
            <button key={p} disabled
              className="text-xs px-2.5 py-1 rounded-md border text-muted-foreground opacity-60 cursor-not-allowed">{p}</button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Directives</div>
        <div className="divide-y">
          {DIRECTIVES.map(({ name, value, desc }) => (
            <div key={name} className="px-4 py-2.5 grid grid-cols-5 gap-2 items-start text-xs">
              <code className="font-mono font-semibold col-span-2 pt-0.5">{name}</code>
              <code className="font-mono text-muted-foreground col-span-2 break-all pt-0.5">{value || <span className="italic opacity-60">flag only</span>}</code>
              <span className="text-muted-foreground text-[10px] pt-0.5">{desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center justify-between">
          <span className="text-xs font-medium">Generated header</span>
          <button disabled className="opacity-40 cursor-not-allowed"><Copy className="h-3.5 w-3.5 text-muted-foreground" /></button>
        </div>
        <pre className="p-4 text-[11px] font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap break-all">{HEADER}</pre>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60"><ShieldCheck className="h-4 w-4" /> Build CSP</Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
