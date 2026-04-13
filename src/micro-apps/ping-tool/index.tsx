'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Radio, Construction } from 'lucide-react'

const RESULTS = [
  { seq: 1, ttl: 56, time: '12.4 ms', status: 'ok' },
  { seq: 2, ttl: 56, time: '11.8 ms', status: 'ok' },
  { seq: 3, ttl: 56, time: '13.1 ms', status: 'ok' },
  { seq: 4, ttl: 56, time: '12.9 ms', status: 'ok' },
  { seq: 5, ttl: 56, time: 'timeout',  status: 'timeout' },
  { seq: 6, ttl: 56, time: '11.5 ms', status: 'ok' },
]

export default function PingTool() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <Label className="text-xs mb-1.5 block">Host or IP address</Label>
          <Input defaultValue="google.com" placeholder="google.com or 8.8.8.8" className="h-9 font-mono" />
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Packets</Label>
          <Select defaultValue="6">
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="4">4 packets</SelectItem>
              <SelectItem value="6">6 packets</SelectItem>
              <SelectItem value="10">10 packets</SelectItem>
              <SelectItem value="20">20 packets</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 font-mono text-xs text-muted-foreground">
          PING google.com (142.250.180.46): 56 data bytes
        </div>
        <div className="divide-y font-mono text-xs">
          {RESULTS.map(r => (
            <div key={r.seq} className={`px-4 py-2 flex items-center gap-3 ${r.status === 'timeout' ? 'text-destructive' : ''}`}>
              <span className="text-muted-foreground w-16">seq={r.seq}</span>
              {r.status === 'ok' ? (
                <>
                  <span className="text-muted-foreground">ttl={r.ttl}</span>
                  <span className="ml-auto text-green-600 dark:text-green-400">{r.time}</span>
                </>
              ) : (
                <span className="ml-auto text-destructive">Request timeout</span>
              )}
            </div>
          ))}
        </div>
        <div className="px-4 py-3 border-t bg-muted/20 grid grid-cols-4 gap-2 text-xs text-center">
          {[['Sent', '6'], ['Received', '5'], ['Lost', '1 (16.7%)'], ['Avg RTT', '12.3 ms']].map(([l, v]) => (
            <div key={l}>
              <p className="text-muted-foreground">{l}</p>
              <p className="font-mono font-semibold mt-0.5">{v}</p>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <Radio className="h-4 w-4" /> Start Ping
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
