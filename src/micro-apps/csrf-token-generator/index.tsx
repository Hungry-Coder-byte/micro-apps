'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShieldAlert } from 'lucide-react'

const SAMPLE_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.csrfToken.abc123xyz'

const METHODS = [
  { name: 'Double Submit Cookie', strength: 'Medium', desc: 'Send token in both cookie and request body; server verifies they match.' },
  { name: 'Synchronizer Token Pattern', strength: 'Strong', desc: 'Server-side session-bound token validated on every state-changing request.' },
  { name: 'SameSite Cookie Attribute', strength: 'Strong', desc: 'Set SameSite=Strict or Lax on session cookie; browser blocks cross-site sends.' },
  { name: 'Custom Request Header', strength: 'Medium', desc: 'Use a custom header (e.g. X-CSRF-Token); relies on same-origin restriction for XHR/fetch.' },
]

export default function CsrfTokenGenerator() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 opacity-70 pointer-events-none select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Generate & Validate CSRF Tokens</h2>
        <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 text-xs">Coming Soon</Badge>
      </div>

      <div className="rounded-xl border p-4 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Token Output</p>
        <div className="font-mono text-sm break-all bg-muted/40 rounded-lg px-3 py-2 text-muted-foreground">{SAMPLE_TOKEN}</div>
        <div className="flex gap-2">
          <Button size="sm" disabled>Generate Token</Button>
          <Button size="sm" variant="outline" disabled>Copy</Button>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">CSRF Prevention Methods</div>
        <div className="divide-y">
          {METHODS.map((m) => (
            <div key={m.name} className="px-4 py-3 flex gap-3 items-start">
              <ShieldAlert className="h-4 w-4 mt-0.5 text-muted-foreground/40 shrink-0" />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{m.name}</span>
                  <Badge variant="outline" className="text-[10px]">{m.strength}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border p-4 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Validate Token</p>
        <div className="h-8 rounded-md bg-muted/40 w-full" />
        <Button size="sm" disabled>Validate</Button>
      </div>
    </div>
  )
}
