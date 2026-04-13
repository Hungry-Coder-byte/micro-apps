'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock4 } from 'lucide-react'

const SCHEDULED = [
  { channel: 'Slack — #deployments', message: 'Reminder: production freeze at 18:00 UTC', sendAt: '2026-04-12 17:45', status: 'Pending' },
  { channel: 'Email — team@acme.com', message: 'Weekly standup notes', sendAt: '2026-04-14 09:00', status: 'Pending' },
  { channel: 'Slack — #alerts', message: 'Maintenance window starting now', sendAt: '2026-04-11 22:00', status: 'Sent' },
]

export default function ScheduledMessageComposer() {
  return (
    <div className="max-w-2xl mx-auto space-y-5 opacity-70 pointer-events-none select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Scheduled Message Composer</h2>
        <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 text-xs">Coming Soon</Badge>
      </div>

      <div className="rounded-xl border p-4 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">New Scheduled Message</p>
        <div className="space-y-2">
          <div className="h-9 rounded-md border bg-muted/40 w-full" />
          <div className="h-20 rounded-md border bg-muted/40 w-full" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-9 rounded-md border bg-muted/40" />
            <div className="h-9 rounded-md border bg-muted/40" />
          </div>
        </div>
        <Button size="sm" disabled><Clock4 className="h-4 w-4 mr-1.5" />Schedule Message</Button>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Scheduled Queue</div>
        <div className="divide-y">
          {SCHEDULED.map((s, i) => (
            <div key={i} className="px-4 py-3 space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{s.channel}</span>
                <Badge variant="outline" className={`text-[10px] ${s.status === 'Sent' ? 'text-green-600 border-green-300' : 'text-amber-600 border-amber-300'}`}>{s.status}</Badge>
              </div>
              <p className="text-sm">{s.message}</p>
              <p className="text-[10px] text-muted-foreground font-mono">{s.sendAt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
