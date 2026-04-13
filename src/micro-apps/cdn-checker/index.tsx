'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Layers, Construction, CheckCircle2, Clock } from 'lucide-react'

const EDGE_NODES = [
  { region: 'US East',       city: 'New York',     status: 'HIT',  latency: '8 ms',  ip: '104.16.0.1' },
  { region: 'US West',       city: 'Los Angeles',  status: 'HIT',  latency: '12 ms', ip: '104.16.0.2' },
  { region: 'Europe West',   city: 'Frankfurt',    status: 'HIT',  latency: '18 ms', ip: '104.16.0.3' },
  { region: 'Asia Pacific',  city: 'Singapore',    status: 'MISS', latency: '62 ms', ip: '104.16.0.4' },
  { region: 'South America', city: 'São Paulo',    status: 'HIT',  latency: '45 ms', ip: '104.16.0.5' },
  { region: 'Middle East',   city: 'Dubai',        status: 'MISS', latency: '89 ms', ip: '104.16.0.6' },
]

export default function CdnChecker() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <Label className="text-xs mb-1.5 block">URL to check</Label>
        <div className="flex gap-2">
          <Input defaultValue="https://cdn.example.com/assets/logo.png" className="h-9 font-mono flex-1 text-xs" />
          <Button disabled className="h-9 gap-2 opacity-60">
            <Layers className="h-4 w-4" /> Check
          </Button>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">CDN headers</div>
        <div className="divide-y text-xs">
          {[
            ['CF-Cache-Status',  'HIT'],
            ['CF-Ray',           '87a1b2c3d4e5f6a7-IAD'],
            ['Cache-Control',    'public, max-age=31536000'],
            ['Age',              '7842'],
            ['CDN Provider',     'Cloudflare'],
          ].map(([k, v]) => (
            <div key={k} className="px-4 py-2.5 grid grid-cols-3 gap-2">
              <code className="font-mono text-muted-foreground">{k}</code>
              <code className="col-span-2 font-mono break-all">{v}</code>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Edge node status</div>
        <div className="divide-y">
          {EDGE_NODES.map(({ region, city, status, latency, ip }) => (
            <div key={region} className="px-4 py-2.5 flex items-center gap-3 text-xs">
              <div className="flex-1">
                <p className="font-medium">{region}</p>
                <p className="text-muted-foreground text-[10px]">{city} · {ip}</p>
              </div>
              <span className={`flex items-center gap-1 text-[11px] font-mono ${status === 'HIT' ? 'text-green-600 dark:text-green-400' : 'text-amber-600'}`}>
                {status === 'HIT'
                  ? <CheckCircle2 className="h-3.5 w-3.5" />
                  : <Clock className="h-3.5 w-3.5" />}
                {status}
              </span>
              <span className="text-muted-foreground font-mono text-[11px] w-12 text-right">{latency}</span>
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
