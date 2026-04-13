'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Smartphone, Construction, Copy } from 'lucide-react'

const PREVIEW = `{
  "name": "My Awesome App",
  "short_name": "AwesomeApp",
  "description": "A progressive web application.",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#ffffff",
  "theme_color": "#6366f1",
  "lang": "en",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ],
  "categories": ["productivity", "utilities"],
  "screenshots": []
}`

export default function PwaManifestGenerator() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="rounded-xl border p-4 space-y-3">
        <p className="text-xs font-medium">App details</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'App name',       val: 'My Awesome App' },
            { label: 'Short name',     val: 'AwesomeApp' },
            { label: 'Start URL',      val: '/' },
            { label: 'Scope',          val: '/' },
            { label: 'Theme color',    val: '#6366f1' },
            { label: 'Background',     val: '#ffffff' },
          ].map(({ label, val }) => (
            <div key={label} className="space-y-1">
              <Label className="text-xs">{label}</Label>
              <Input defaultValue={val} disabled className="h-8 text-xs font-mono opacity-60 cursor-not-allowed" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Display mode</Label>
            <Select defaultValue="standalone">
              <SelectTrigger className="h-8 text-xs opacity-60" disabled><SelectValue /></SelectTrigger>
              <SelectContent>
                {['standalone','fullscreen','minimal-ui','browser'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Orientation</Label>
            <Select defaultValue="portrait">
              <SelectTrigger className="h-8 text-xs opacity-60" disabled><SelectValue /></SelectTrigger>
              <SelectContent>
                {['portrait','landscape','any'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium">manifest.json</span>
          </div>
          <button disabled className="opacity-40 cursor-not-allowed"><Copy className="h-3.5 w-3.5 text-muted-foreground" /></button>
        </div>
        <pre className="p-4 text-xs font-mono text-muted-foreground overflow-x-auto">{PREVIEW}</pre>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60"><Smartphone className="h-4 w-4" /> Generate Manifest</Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
