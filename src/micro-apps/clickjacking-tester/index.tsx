'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MousePointerClick, Construction, XCircle, CheckCircle2, AlertCircle } from 'lucide-react'

const RESULTS = [
  { header: 'X-Frame-Options',          value: 'DENY',              status: 'protected',    note: 'Blocks all framing' },
  { header: 'Content-Security-Policy',  value: "frame-ancestors 'none'", status: 'protected', note: 'CSP also prevents framing' },
  { header: 'X-Frame-Options (legacy)', value: '—',                 status: 'n/a',          note: 'Superseded by CSP' },
]

const SITES = [
  { url: 'github.com',    xfo: 'DENY',        csp: "frame-ancestors 'none'", result: 'Protected' },
  { url: 'google.com',    xfo: 'SAMEORIGIN',  csp: '—',                      result: 'Partial' },
  { url: 'example.com',   xfo: '—',           csp: '—',                      result: 'Vulnerable' },
  { url: 'stripe.com',    xfo: 'DENY',        csp: "frame-ancestors 'none'", result: 'Protected' },
]

const RESULT_COLOR: Record<string, string> = {
  Protected:  'text-green-600 border-green-400/40',
  Partial:    'text-yellow-600 border-yellow-400/40',
  Vulnerable: 'text-red-600 border-red-400/40',
}

export default function ClickjackingTester() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <Label className="text-xs mb-1.5 block">URL to test</Label>
        <div className="flex gap-2">
          <Input defaultValue="https://example.com" className="h-9 font-mono flex-1" />
          <Button disabled className="h-9 gap-2 opacity-60">
            <MousePointerClick className="h-4 w-4" /> Test
          </Button>
        </div>
      </div>

      {/* Iframe preview area */}
      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center justify-between">
          <span className="text-xs font-medium">iframe embed test</span>
          <Badge variant="outline" className="text-[10px] text-red-600 border-red-400/40">Embeddable — vulnerable</Badge>
        </div>
        <div className="p-4 bg-muted/10">
          <div className="rounded-lg border-2 border-dashed border-red-400/40 bg-red-50/30 dark:bg-red-950/20 h-32 flex items-center justify-center">
            <div className="text-center">
              <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">Page can be embedded in an iframe</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">No X-Frame-Options or frame-ancestors CSP detected</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Header analysis</div>
        <div className="divide-y">
          {RESULTS.map(({ header, value, status, note }) => (
            <div key={header} className="px-4 py-2.5 flex items-start gap-3 text-xs">
              <span className="shrink-0 mt-0.5">
                {status === 'protected' ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  : <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />}
              </span>
              <div className="flex-1">
                <code className="font-mono font-medium">{header}</code>
                <p className="text-muted-foreground text-[10px] mt-0.5">{note}</p>
              </div>
              <code className="font-mono text-muted-foreground text-[10px] shrink-0">{value}</code>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Popular sites reference</div>
        <div className="divide-y">
          {SITES.map(({ url, xfo, csp, result }) => (
            <div key={url} className="px-4 py-2.5 flex items-center gap-3 text-xs">
              <code className="font-mono flex-1">{url}</code>
              <span className="text-muted-foreground text-[10px] hidden sm:block">{xfo}</span>
              <Badge variant="outline" className={`text-[10px] px-1.5 shrink-0 ${RESULT_COLOR[result]}`}>{result}</Badge>
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
