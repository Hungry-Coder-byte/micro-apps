'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Container, Construction, Plus, Trash2, Download } from 'lucide-react'

const SERVICES = [
  { name: 'app',      image: 'node:18-alpine',   ports: '3000:3000', env: 'NODE_ENV=production' },
  { name: 'postgres', image: 'postgres:15',       ports: '5432:5432', env: 'POSTGRES_PASSWORD=secret' },
  { name: 'redis',    image: 'redis:7-alpine',    ports: '6379:6379', env: '' },
]

const PREVIEW = `version: '3.9'

services:
  app:
    image: node:18-alpine
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_PASSWORD=secret
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:`

export default function DockerComposeGenerator() {
  const [services] = useState(SERVICES)

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Services</p>
          <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs opacity-60" disabled>
            <Plus className="h-3.5 w-3.5" /> Add Service
          </Button>
        </div>

        {services.map((svc, i) => (
          <div key={i} className="rounded-xl border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="font-mono">{svc.name}</Badge>
              <Button size="icon" variant="ghost" className="h-7 w-7 opacity-40" disabled>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs mb-1.5 block">Image</Label>
                <Input defaultValue={svc.image} className="h-9 text-xs font-mono" disabled />
              </div>
              <div>
                <Label className="text-xs mb-1.5 block">Ports (host:container)</Label>
                <Input defaultValue={svc.ports} className="h-9 text-xs font-mono" disabled />
              </div>
              <div>
                <Label className="text-xs mb-1.5 block">Environment</Label>
                <Input defaultValue={svc.env} className="h-9 text-xs font-mono" disabled />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Container className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium">docker-compose.yml preview</span>
          </div>
          <Button size="sm" variant="ghost" className="h-6 px-2 text-xs gap-1 opacity-60" disabled>
            <Download className="h-3 w-3" /> Download
          </Button>
        </div>
        <pre className="p-4 text-xs font-mono text-muted-foreground overflow-auto max-h-80">{PREVIEW}</pre>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <Container className="h-4 w-4" /> Generate docker-compose.yml
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
