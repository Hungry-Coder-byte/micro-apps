'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, ShieldAlert, Globe } from 'lucide-react'

const SAMPLE = {
  ip: '8.8.8.8',
  score: 0,
  country: 'United States',
  org: 'Google LLC',
  asn: 'AS15169',
  type: 'Data Center',
  vpn: false,
  tor: false,
  proxy: false,
  abuse: false,
  verdict: 'Clean',
}

const SOURCES = ['AbuseIPDB', 'Spamhaus', 'Emerging Threats', 'AlienVault OTX', 'GreyNoise', 'Shodan']

export default function IpReputation() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 opacity-70 pointer-events-none select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">IP Reputation Checker</h2>
        <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 text-xs">Coming Soon</Badge>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 h-9 rounded-md bg-muted/40 border" />
        <Button size="sm" disabled>Check IP</Button>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-3 border-b bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground/50" />
            <span className="font-mono text-sm">{SAMPLE.ip}</span>
          </div>
          <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">{SAMPLE.verdict}</Badge>
        </div>
        <div className="grid grid-cols-2 divide-x divide-y">
          {[
            ['Country', SAMPLE.country],
            ['Organisation', SAMPLE.org],
            ['ASN', SAMPLE.asn],
            ['Type', SAMPLE.type],
          ].map(([k, v]) => (
            <div key={k} className="px-4 py-2.5 flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{k}</span>
              <span className="text-sm font-medium">{v}</span>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 border-t flex gap-3">
          {['VPN', 'TOR', 'Proxy', 'Abusive'].map((flag) => (
            <div key={flag} className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
              <span className="text-xs text-muted-foreground">No {flag}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Reputation Sources</div>
        <div className="grid grid-cols-3 gap-px bg-border">
          {SOURCES.map((s) => (
            <div key={s} className="bg-background px-3 py-2 flex items-center gap-2">
              <ShieldAlert className="h-3.5 w-3.5 text-muted-foreground/30" />
              <span className="text-xs text-muted-foreground">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
