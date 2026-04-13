'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquare } from 'lucide-react'

const BLOCK_JSON = `{
  "blocks": [
    {
      "type": "header",
      "text": { "type": "plain_text", "text": "🚀 Deployment Complete" }
    },
    {
      "type": "section",
      "text": { "type": "mrkdwn", "text": "*Service:* api-server\\n*Version:* v2.4.1" }
    },
    {
      "type": "actions",
      "elements": [{ "type": "button", "text": { "type": "plain_text", "text": "View Logs" } }]
    }
  ]
}`

export default function SlackMessageFormatter() {
  return (
    <div className="max-w-3xl mx-auto space-y-5 opacity-70 pointer-events-none select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Slack Block Kit Builder</h2>
        <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 text-xs">Coming Soon</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Block Kit JSON</p>
          <pre className="text-[11px] font-mono bg-muted/40 rounded-xl border p-3 h-56 overflow-auto text-muted-foreground">{BLOCK_JSON}</pre>
          <div className="flex gap-2">
            <Button size="sm" disabled>Validate</Button>
            <Button size="sm" variant="outline" disabled>Copy</Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Preview</p>
          <div className="rounded-xl border bg-[#1a1d21] p-4 space-y-3 h-56">
            <p className="text-white font-bold text-sm">🚀 Deployment Complete</p>
            <div className="text-[#d1d2d3] text-xs space-y-0.5">
              <p><span className="font-bold text-white">Service:</span> api-server</p>
              <p><span className="font-bold text-white">Version:</span> v2.4.1</p>
            </div>
            <button className="bg-white text-[#1d1c1d] text-xs font-medium px-3 py-1.5 rounded">View Logs</button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border p-4 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Block Types</p>
        <div className="flex flex-wrap gap-2">
          {['Header','Section','Divider','Image','Actions','Context','Input'].map((b) => (
            <Badge key={b} variant="outline" className="text-xs"><MessageSquare className="h-3 w-3 mr-1" />{b}</Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
