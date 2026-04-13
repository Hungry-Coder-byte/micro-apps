'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Network, Construction, CheckCircle2, XCircle } from 'lucide-react'

const COMMON_PORTS = [
  { port: 21,   service: 'FTP',         status: 'closed' },
  { port: 22,   service: 'SSH',         status: 'open' },
  { port: 25,   service: 'SMTP',        status: 'closed' },
  { port: 53,   service: 'DNS',         status: 'open' },
  { port: 80,   service: 'HTTP',        status: 'open' },
  { port: 443,  service: 'HTTPS',       status: 'open' },
  { port: 3306, service: 'MySQL',       status: 'closed' },
  { port: 5432, service: 'PostgreSQL',  status: 'closed' },
  { port: 6379, service: 'Redis',       status: 'closed' },
  { port: 8080, service: 'HTTP-Alt',    status: 'open' },
]

export default function PortChecker() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <Label className="text-xs mb-1.5 block">Host or IP address</Label>
          <Input defaultValue="example.com" placeholder="example.com or 192.168.1.1" className="h-9 font-mono" />
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Port(s)</Label>
          <Input defaultValue="22, 80, 443" placeholder="80 or 1-1024" className="h-9 font-mono" />
        </div>
      </div>

      <div className="rounded-xl border p-3 space-y-2">
        <p className="text-xs text-muted-foreground">Quick scan presets</p>
        <div className="flex flex-wrap gap-1.5">
          {['Common ports (top 10)', 'Web (80, 443, 8080)', 'Database (3306, 5432, 1433)', 'Mail (25, 110, 143, 587)', 'Custom range'].map(p => (
            <button key={p} disabled
              className="text-xs px-2.5 py-1 rounded-md border border-border text-muted-foreground opacity-60 cursor-not-allowed">
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Scan results for example.com</div>
        <div className="divide-y">
          {COMMON_PORTS.map(({ port, service, status }) => (
            <div key={port} className="px-4 py-2.5 flex items-center gap-3 text-xs">
              <span className="font-mono w-12">{port}</span>
              <span className="text-muted-foreground w-24">{service}</span>
              <span className="flex items-center gap-1.5 ml-auto">
                {status === 'open'
                  ? <><CheckCircle2 className="h-3.5 w-3.5 text-green-500" /><span className="text-green-600 dark:text-green-400">Open</span></>
                  : <><XCircle className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-muted-foreground">Closed</span></>}
              </span>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <Network className="h-4 w-4" /> Check Ports
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
