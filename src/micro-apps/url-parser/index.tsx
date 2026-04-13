'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link2, Construction } from 'lucide-react'

const SAMPLE_URL = 'https://api.example.com:8443/v2/users?role=admin&page=2&limit=50#results'

const PARTS = [
  ['Protocol',    'https'],
  ['Host',        'api.example.com'],
  ['Port',        '8443'],
  ['Path',        '/v2/users'],
  ['Query string','role=admin&page=2&limit=50'],
  ['Fragment',    'results'],
  ['Origin',      'https://api.example.com:8443'],
  ['Full URL',    SAMPLE_URL],
]

const QUERY_PARAMS = [
  { key: 'role',  value: 'admin' },
  { key: 'page',  value: '2' },
  { key: 'limit', value: '50' },
]

export default function UrlParser() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <Label className="text-xs mb-1.5 block">URL to parse</Label>
        <Input defaultValue={SAMPLE_URL} className="h-10 font-mono text-xs" />
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Parsed components</div>
        <div className="divide-y">
          {PARTS.map(([label, value]) => (
            <div key={label} className="px-4 py-2.5 grid grid-cols-3 gap-2 text-xs">
              <span className="text-muted-foreground">{label}</span>
              <code className="col-span-2 font-mono break-all">{value}</code>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Query parameters</div>
        <div className="divide-y">
          {QUERY_PARAMS.map(({ key, value }) => (
            <div key={key} className="px-4 py-2.5 grid grid-cols-2 gap-2 text-xs">
              <code className="font-mono text-primary">{key}</code>
              <code className="font-mono">{value}</code>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <Link2 className="h-4 w-4" /> Parse URL
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
