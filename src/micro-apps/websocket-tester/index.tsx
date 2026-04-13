'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plug, Construction, Send, Trash2 } from 'lucide-react'

const MESSAGES = [
  { dir: 'sent',     time: '10:42:01', content: '{"action":"subscribe","channel":"prices"}' },
  { dir: 'received', time: '10:42:01', content: '{"status":"ok","channel":"prices","id":"abc123"}' },
  { dir: 'received', time: '10:42:05', content: '{"channel":"prices","data":{"BTC":65420.00,"ETH":3210.50}}' },
  { dir: 'received', time: '10:42:10', content: '{"channel":"prices","data":{"BTC":65391.00,"ETH":3215.20}}' },
  { dir: 'sent',     time: '10:42:15', content: '{"action":"ping"}' },
  { dir: 'received', time: '10:42:15', content: '{"action":"pong","ts":1712345735}' },
]

export default function WebsocketTester() {
  const [format, setFormat] = useState<'text' | 'json'>('json')

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Connection */}
      <div className="flex gap-2">
        <Input defaultValue="wss://echo.websocket.org" className="h-10 font-mono flex-1 text-xs" placeholder="wss://your-server.com/ws" />
        <Button disabled className="gap-2 h-10 opacity-60">
          <Plug className="h-4 w-4" /> Connect
        </Button>
      </div>

      <div className="rounded-xl border p-3 space-y-2">
        <p className="text-xs text-muted-foreground font-medium">Common test servers</p>
        <div className="flex flex-wrap gap-1.5">
          {['wss://echo.websocket.org', 'ws://localhost:8080', 'wss://ws.postman-echo.com/raw'].map(url => (
            <button key={url} disabled
              className="text-[10px] px-2 py-1 rounded border font-mono text-muted-foreground opacity-60 cursor-not-allowed">
              {url}
            </button>
          ))}
        </div>
      </div>

      {/* Message log */}
      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium">Message log</span>
          </div>
          <Button size="icon" variant="ghost" className="h-6 w-6 opacity-60" disabled>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="max-h-60 overflow-y-auto divide-y opacity-70">
          {MESSAGES.map((msg, i) => (
            <div key={i} className={`px-4 py-2.5 text-xs font-mono flex items-start gap-3 ${msg.dir === 'sent' ? 'bg-primary/5' : ''}`}>
              <span className="text-muted-foreground text-[10px] shrink-0 mt-0.5">{msg.time}</span>
              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 shrink-0 ${msg.dir === 'sent' ? 'text-blue-600 border-blue-400/40' : 'text-green-600 border-green-400/40'}`}>
                {msg.dir === 'sent' ? '↑ sent' : '↓ recv'}
              </Badge>
              <span className="break-all text-muted-foreground">{msg.content}</span>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      {/* Send message */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Label className="text-xs shrink-0">Format</Label>
          <div className="flex gap-1 p-0.5 bg-muted rounded-md">
            {(['text','json'] as const).map(f => (
              <button key={f} onClick={() => setFormat(f)}
                className={`text-xs px-2.5 py-1 rounded transition-colors ${format === f ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}>
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <textarea rows={3} defaultValue={'{"action":"ping"}'} disabled
            className="flex-1 rounded-lg border bg-muted/30 p-3 text-xs font-mono resize-none opacity-60 cursor-not-allowed" />
          <Button disabled className="gap-2 self-end opacity-60">
            <Send className="h-4 w-4" /> Send
          </Button>
        </div>
      </div>

      <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
        <Construction className="h-3.5 w-3.5" /> Coming soon
      </Badge>
    </div>
  )
}
