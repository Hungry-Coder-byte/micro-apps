'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail } from 'lucide-react'

const TEMPLATE = `<h1>Hello, {{name}}!</h1>
<p>Welcome to <strong>{{company}}</strong>. Your account is ready.</p>
<a href="{{cta_url}}">Get Started →</a>`

const VARS = { name: 'Alice', company: 'Acme Corp', cta_url: 'https://example.com' }

export default function EmailTemplateBuilder() {
  return (
    <div className="max-w-3xl mx-auto space-y-5 opacity-70 pointer-events-none select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Email Template Builder</h2>
        <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 text-xs">Coming Soon</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">HTML Template</p>
          <pre className="text-xs font-mono bg-muted/40 rounded-xl border p-3 whitespace-pre-wrap text-muted-foreground">{TEMPLATE}</pre>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled>Upload HTML</Button>
            <Button size="sm" disabled><Mail className="h-3.5 w-3.5 mr-1.5" />Send Test</Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Preview</p>
          <div className="rounded-xl border bg-white p-4 space-y-3 min-h-[140px]">
            <p className="text-base font-bold text-gray-800">Hello, Alice!</p>
            <p className="text-sm text-gray-600">Welcome to <strong>Acme Corp</strong>. Your account is ready.</p>
            <span className="inline-block bg-blue-600 text-white text-xs px-3 py-1.5 rounded-md">Get Started →</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border p-4 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Variables</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(VARS).map(([k, v]) => (
            <div key={k} className="flex items-center gap-2 rounded-lg border px-3 py-1.5 bg-muted/20">
              <span className="font-mono text-xs text-blue-500">{`{{${k}}}`}</span>
              <span className="text-xs text-muted-foreground">=</span>
              <span className="text-xs">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
