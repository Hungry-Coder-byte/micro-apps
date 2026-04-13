'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeftRight, Construction } from 'lucide-react'

const SAMPLE_RESULTS = [
  { ip: '8.8.8.8',         ptr: 'dns.google',                 ttl: 21600 },
  { ip: '8.8.4.4',         ptr: 'dns.google',                 ttl: 21600 },
  { ip: '1.1.1.1',         ptr: 'one.one.one.one',            ttl: 1800  },
  { ip: '142.250.180.46',  ptr: 'lax17s55-in-f14.1e100.net', ttl: 300   },
]

export default function ReverseDnsLookup() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <Label className="text-xs mb-1.5 block">IP address (IPv4 or IPv6)</Label>
        <div className="flex gap-2">
          <Input defaultValue="8.8.8.8" placeholder="8.8.8.8 or 2001:db8::1" className="h-9 font-mono flex-1" />
          <Button disabled className="h-9 gap-2 opacity-60">
            <ArrowLeftRight className="h-4 w-4" /> Lookup
          </Button>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">PTR record for 8.8.8.8</div>
        <div className="divide-y text-xs">
          {[
            ['PTR Record',     'dns.google'],
            ['TTL',            '21600 seconds (6 hours)'],
            ['Queried at',     '2024-04-10 08:30:12 UTC'],
            ['Resolver',       'System default'],
            ['Reverse zone',   '8.8.8.in-addr.arpa'],
          ].map(([k, v]) => (
            <div key={k} className="px-4 py-2.5 grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">{k}</span>
              <code className="col-span-2 font-mono break-all">{v}</code>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Bulk reverse lookup examples</div>
        <div className="divide-y">
          {SAMPLE_RESULTS.map(({ ip, ptr, ttl }) => (
            <div key={ip} className="px-4 py-2.5 flex items-center gap-3 text-xs font-mono">
              <span className="w-36 shrink-0">{ip}</span>
              <span className="flex-1 text-muted-foreground">{ptr}</span>
              <span className="text-muted-foreground/60 text-[10px] shrink-0">TTL {ttl}</span>
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
