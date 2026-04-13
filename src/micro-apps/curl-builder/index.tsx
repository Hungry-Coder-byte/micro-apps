'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Terminal, Construction, Plus, Copy } from 'lucide-react'

const HEADERS = [
  { key: 'Content-Type', value: 'application/json' },
  { key: 'Authorization', value: 'Bearer YOUR_TOKEN' },
]

const CURL_PREVIEW = `curl -X POST "https://api.example.com/users" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{"name":"Alice","email":"alice@example.com"}' \\
  --compressed \\
  -v`

export default function CurlBuilder() {
  const [method, setMethod] = useState('POST')

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* URL + Method */}
      <div className="flex gap-2">
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className="h-10 w-28 font-mono font-bold shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS'].map(m => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input defaultValue="https://api.example.com/users" className="h-10 font-mono flex-1" placeholder="https://api.example.com/endpoint" />
      </div>

      {/* Headers */}
      <div className="rounded-xl border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium">Headers</p>
          <Button size="sm" variant="outline" className="h-7 gap-1 text-xs opacity-60" disabled>
            <Plus className="h-3.5 w-3.5" /> Add Header
          </Button>
        </div>
        {HEADERS.map((h, i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            <Input defaultValue={h.key} className="h-8 text-xs font-mono" disabled />
            <Input defaultValue={h.value} className="h-8 text-xs font-mono" disabled />
          </div>
        ))}
      </div>

      {/* Body */}
      {method !== 'GET' && method !== 'HEAD' && (
        <div className="rounded-xl border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium">Request Body</p>
            <Select defaultValue="json">
              <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="form">Form Data</SelectItem>
                <SelectItem value="raw">Raw</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <textarea rows={4}
            defaultValue={`{\n  "name": "Alice",\n  "email": "alice@example.com"\n}`}
            className="w-full rounded-lg border bg-muted/30 p-3 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
      )}

      {/* Options */}
      <div className="rounded-xl border p-4 space-y-2">
        <p className="text-xs font-medium mb-2">Options</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {['Follow redirects (-L)', 'Verbose (-v)', 'Compressed', 'Insecure (-k)'].map(opt => (
            <label key={opt} className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input type="checkbox" defaultChecked={opt.includes('Verbose') || opt.includes('Compressed')} className="rounded accent-primary" />
              {opt}
            </label>
          ))}
        </div>
      </div>

      {/* Generated cURL */}
      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium">Generated cURL command</span>
          </div>
          <Button size="sm" variant="ghost" className="h-6 px-2 text-xs gap-1 opacity-60" disabled>
            <Copy className="h-3 w-3" /> Copy
          </Button>
        </div>
        <pre className="p-4 text-xs font-mono text-muted-foreground overflow-x-auto">{CURL_PREVIEW}</pre>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <Terminal className="h-4 w-4" /> Build & Copy
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
