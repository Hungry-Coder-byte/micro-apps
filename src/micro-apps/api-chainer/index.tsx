'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link2, ArrowDown } from 'lucide-react'

const STEPS = [
  { method: 'GET',  url: 'https://api.example.com/users/{{userId}}',   output: '{ "id": 1, "name": "Alice" }' },
  { method: 'GET',  url: 'https://api.example.com/orders?user={{id}}', output: '[ { "orderId": 42, ... } ]' },
  { method: 'POST', url: 'https://api.example.com/notify',             output: '{ "sent": true }' },
]

export default function ApiChainer() {
  return (
    <div className="max-w-2xl mx-auto space-y-5 opacity-70 pointer-events-none select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">API Chainer</h2>
        <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 text-xs">Coming Soon</Badge>
      </div>

      <p className="text-xs text-muted-foreground">Chain multiple HTTP requests where the response of each step feeds into the next via template variables.</p>

      <div className="space-y-0">
        {STEPS.map((step, i) => (
          <div key={i} className="flex flex-col items-stretch">
            <div className="rounded-xl border p-3 space-y-1.5 bg-muted/10">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-[10px] text-blue-600 border-blue-300">{step.method}</Badge>
                <span className="font-mono text-xs text-muted-foreground truncate">{step.url}</span>
              </div>
              <div className="font-mono text-[10px] text-green-600 bg-green-50 rounded px-2 py-1 truncate">← {step.output}</div>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex items-center justify-center gap-1 py-1">
                <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/40" />
                <span className="text-[10px] text-muted-foreground/50">pipe response</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button size="sm" disabled><Link2 className="h-4 w-4 mr-1.5" />Run Chain</Button>
        <Button size="sm" variant="outline" disabled>+ Add Step</Button>
        <Button size="sm" variant="outline" disabled>Import JSON</Button>
      </div>

      <div className="rounded-xl border p-3 space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Initial Variables</p>
        <div className="font-mono text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">{'{ "userId": 1 }'}</div>
      </div>
    </div>
  )
}
