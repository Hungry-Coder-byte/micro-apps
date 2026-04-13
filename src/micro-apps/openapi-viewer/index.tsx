'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BookOpen, Construction, Upload, Globe } from 'lucide-react'

const ENDPOINTS = [
  { method: 'GET',    path: '/users',        summary: 'List all users',          status: '200' },
  { method: 'POST',   path: '/users',        summary: 'Create a new user',       status: '201' },
  { method: 'GET',    path: '/users/{id}',   summary: 'Get user by ID',          status: '200' },
  { method: 'PUT',    path: '/users/{id}',   summary: 'Update user',             status: '200' },
  { method: 'DELETE', path: '/users/{id}',   summary: 'Delete user',             status: '204' },
  { method: 'GET',    path: '/products',     summary: 'List products',           status: '200' },
  { method: 'POST',   path: '/products',     summary: 'Create product',          status: '201' },
]

const METHOD_COLORS: Record<string, string> = {
  GET:    'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-400/30',
  POST:   'bg-green-500/15 text-green-600 dark:text-green-400 border-green-400/30',
  PUT:    'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-400/30',
  DELETE: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-400/30',
  PATCH:  'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-400/30',
}

export default function OpenapiViewer() {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="rounded-xl border p-4 space-y-3">
        <p className="text-sm font-medium">Load OpenAPI / Swagger Spec</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs mb-1.5 block">From URL</Label>
            <div className="flex gap-2">
              <Input placeholder="https://api.example.com/openapi.json" className="h-9 text-xs" />
              <Button size="sm" variant="outline" className="gap-1.5 shrink-0 opacity-60" disabled>
                <Globe className="h-3.5 w-3.5" /> Load
              </Button>
            </div>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Upload file</Label>
            <Button variant="outline" className="h-9 w-full gap-2 opacity-60" disabled>
              <Upload className="h-4 w-4" /> Upload .json / .yaml
            </Button>
          </div>
        </div>
      </div>

      {/* Preview of what the viewer looks like */}
      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-3 border-b bg-muted/30 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Petstore API</p>
            <p className="text-xs text-muted-foreground">v3.0 · OAS 3.0</p>
          </div>
          <Badge variant="outline" className="text-xs">7 endpoints</Badge>
        </div>
        <div className="divide-y">
          {ENDPOINTS.map((ep, i) => (
            <div key={i} className="px-4 py-2.5 flex items-center gap-3 hover:bg-muted/10 opacity-60 cursor-not-allowed">
              <Badge variant="outline" className={`font-mono text-[10px] w-16 justify-center shrink-0 ${METHOD_COLORS[ep.method]}`}>
                {ep.method}
              </Badge>
              <code className="text-xs font-mono text-muted-foreground w-44 shrink-0">{ep.path}</code>
              <span className="text-xs text-muted-foreground truncate">{ep.summary}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <BookOpen className="h-4 w-4" /> View & Test API
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
