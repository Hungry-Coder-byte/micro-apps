'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Construction } from 'lucide-react'

const FIELDS = [
  ['Domain',           'example.com'],
  ['Registrar',        'GoDaddy.com, LLC'],
  ['WHOIS Server',     'whois.godaddy.com'],
  ['Created',          '1995-08-14'],
  ['Updated',          '2023-08-13'],
  ['Expires',          '2025-08-13'],
  ['Status',           'clientDeleteProhibited, clientTransferProhibited'],
  ['Name Servers',     'A.IANA-SERVERS.NET, B.IANA-SERVERS.NET'],
  ['Registrant Org',   'Internet Assigned Numbers Authority'],
  ['Registrant Email', 'hostmaster@iana.org'],
  ['Country',          'US'],
  ['DNSSEC',           'signed'],
]

export default function WhoisLookup() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <Label className="text-xs mb-1.5 block">Domain name or IP</Label>
        <div className="flex gap-2">
          <Input defaultValue="example.com" placeholder="example.com or 8.8.8.8" className="h-10 font-mono" />
          <Button disabled className="gap-2 h-10 px-5 opacity-60">
            <Search className="h-4 w-4" /> Lookup
          </Button>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30">
          <p className="text-xs font-medium">WHOIS data for example.com</p>
        </div>
        <div className="divide-y">
          {FIELDS.map(([label, value]) => (
            <div key={label} className="px-4 py-2.5 grid grid-cols-3 gap-2 text-xs">
              <span className="text-muted-foreground font-medium">{label}</span>
              <span className="col-span-2 font-mono">{value}</span>
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
