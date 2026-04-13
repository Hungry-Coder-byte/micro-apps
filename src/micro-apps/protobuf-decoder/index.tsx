'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Cpu } from 'lucide-react'

const PROTO = `syntax = "proto3";

message User {
  int32  id    = 1;
  string name  = 2;
  string email = 3;
  bool   active = 4;
}`

const DECODED = `{
  "id": 1,
  "name": "Alice",
  "email": "alice@example.com",
  "active": true
}`

const FIELDS = [
  { field: 1, type: 'varint',           name: 'id',     value: '1' },
  { field: 2, type: 'length-delimited', name: 'name',   value: '"Alice"' },
  { field: 3, type: 'length-delimited', name: 'email',  value: '"alice@example.com"' },
  { field: 4, type: 'varint',           name: 'active', value: 'true' },
]

export default function ProtobufDecoder() {
  return (
    <div className="max-w-3xl mx-auto space-y-5 opacity-70 pointer-events-none select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Protobuf Decoder</h2>
        <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 text-xs">Coming Soon</Badge>
      </div>

      <p className="text-xs text-muted-foreground">Decode Protocol Buffer binary messages using a .proto schema. Paste hex-encoded bytes or upload a binary file.</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">.proto Schema</p>
          <pre className="text-[11px] font-mono bg-muted/40 rounded-xl border p-3 h-44 overflow-auto text-muted-foreground">{PROTO}</pre>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Binary Input (hex)</p>
          <div className="font-mono text-[11px] bg-muted/40 rounded-xl border p-3 h-44 text-muted-foreground break-all">
            0a 01 01 12 05 41 6c 69 63 65 1a 11 61 6c 69 63 65 40 65 78 61 6d 70 6c 65 2e 63 6f 6d 20 01
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button size="sm" disabled><Cpu className="h-4 w-4 mr-1.5" />Decode</Button>
        <Button size="sm" variant="outline" disabled>Upload .bin</Button>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Decoded Fields</div>
        <div className="divide-y font-mono text-xs">
          {FIELDS.map(f => (
            <div key={f.field} className="px-4 py-2 grid grid-cols-4 gap-2">
              <span className="text-muted-foreground">field {f.field}</span>
              <span className="text-blue-500">{f.type}</span>
              <span className="font-medium">{f.name}</span>
              <span className="text-green-600">{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">JSON Output</p>
        <pre className="text-xs font-mono bg-green-50 border border-green-200 rounded-xl p-3 text-green-700">{DECODED}</pre>
      </div>
    </div>
  )
}
