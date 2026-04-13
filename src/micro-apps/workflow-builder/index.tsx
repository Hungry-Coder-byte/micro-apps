'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Workflow, ArrowDown } from 'lucide-react'

const NODES = [
  { type: 'Trigger',   label: 'Webhook received',         color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { type: 'Condition', label: 'If status == "active"',     color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { type: 'Action',    label: 'POST to Slack API',         color: 'bg-green-50 border-green-200 text-green-700' },
  { type: 'Action',    label: 'Save to Google Sheets',     color: 'bg-purple-50 border-purple-200 text-purple-700' },
]

export default function WorkflowBuilder() {
  return (
    <div className="max-w-2xl mx-auto space-y-5 opacity-70 pointer-events-none select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Visual Workflow Builder</h2>
        <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 text-xs">Coming Soon</Badge>
      </div>

      <div className="flex gap-2">
        <Button size="sm" disabled><Workflow className="h-4 w-4 mr-1.5" />New Workflow</Button>
        <Button size="sm" variant="outline" disabled>Import JSON</Button>
        <Button size="sm" variant="outline" disabled>Export</Button>
      </div>

      <div className="rounded-xl border p-5 space-y-0 bg-muted/10">
        {NODES.map((node, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className={`w-full rounded-lg border px-4 py-2.5 flex items-center justify-between ${node.color}`}>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide opacity-70">{node.type}</p>
                <p className="text-sm font-medium">{node.label}</p>
              </div>
              <Badge variant="outline" className="text-[10px] border-current opacity-60">{node.type}</Badge>
            </div>
            {i < NODES.length - 1 && (
              <div className="flex flex-col items-center py-1">
                <ArrowDown className="h-4 w-4 text-muted-foreground/40" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-xl border p-4 grid grid-cols-3 gap-3">
        {[['Runs', '248'], ['Success', '241'], ['Errors', '7']].map(([k, v]) => (
          <div key={k} className="text-center">
            <p className="text-2xl font-bold font-mono">{v}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{k}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
