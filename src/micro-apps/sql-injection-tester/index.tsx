'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { AlertTriangle, Construction, CheckCircle2, XCircle } from 'lucide-react'

const PAYLOADS = [
  { payload: "' OR '1'='1",             risk: 'Critical', type: 'Auth bypass',       safe: false },
  { payload: "'; DROP TABLE users; --",  risk: 'Critical', type: 'Destructive DDL',   safe: false },
  { payload: "' UNION SELECT null,username,password FROM users--", risk: 'High', type: 'UNION injection', safe: false },
  { payload: "1; WAITFOR DELAY '0:0:5'", risk: 'Medium',   type: 'Time-based blind',  safe: false },
  { payload: "Alice O'Brien",            risk: 'Safe',     type: 'Literal apostrophe', safe: true  },
  { payload: "'; SELECT pg_sleep(5); --",risk: 'High',     type: 'PostgreSQL sleep',  safe: false },
]

const RISK_COLOR: Record<string, string> = {
  Critical: 'text-red-600 border-red-400/40',
  High:     'text-orange-600 border-orange-400/40',
  Medium:   'text-yellow-600 border-yellow-400/40',
  Safe:     'text-green-600 border-green-400/40',
}

export default function SqlInjectionTester() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="space-y-2">
        <Label className="text-xs">Input to test</Label>
        <textarea rows={3} defaultValue={"' OR '1'='1"} disabled
          className="w-full rounded-lg border bg-muted/30 p-3 text-sm font-mono resize-none opacity-60 cursor-not-allowed" />
      </div>

      <div className="rounded-xl border p-3 space-y-2">
        <p className="text-xs text-muted-foreground font-medium">Detection mode</p>
        <div className="flex flex-wrap gap-1.5">
          {['Pattern matching', 'Parameterized query test', 'WAF bypass variants', 'Blind injection probes'].map(m => (
            <button key={m} disabled
              className="text-xs px-2.5 py-1 rounded-md border text-muted-foreground opacity-60 cursor-not-allowed">{m}</button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center justify-between">
          <span className="text-xs font-medium">Common payload reference</span>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="text-red-500">5 dangerous</span>
            <span className="text-green-600">1 safe</span>
          </div>
        </div>
        <div className="divide-y">
          {PAYLOADS.map(({ payload, risk, type, safe }) => (
            <div key={payload} className="px-4 py-2.5 flex items-center gap-3 text-xs">
              <span className="shrink-0">
                {safe
                  ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  : <XCircle className="h-3.5 w-3.5 text-red-500" />}
              </span>
              <code className="font-mono flex-1 break-all text-muted-foreground">{payload}</code>
              <span className="text-muted-foreground text-[10px] shrink-0 hidden sm:block">{type}</span>
              <Badge variant="outline" className={`text-[10px] px-1.5 shrink-0 ${RISK_COLOR[risk]}`}>{risk}</Badge>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="rounded-xl border border-amber-400/30 bg-amber-50/30 dark:bg-amber-950/20 px-4 py-3 flex gap-2 text-xs text-amber-700 dark:text-amber-400">
        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
        <span>For educational and authorized testing only. Always use parameterized queries or prepared statements in production code.</span>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60"><AlertTriangle className="h-4 w-4" /> Test Input</Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
