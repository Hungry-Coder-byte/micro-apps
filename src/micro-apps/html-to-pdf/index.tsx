'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Code2, Globe, Construction } from 'lucide-react'

export default function HtmlToPdf() {
  const [mode, setMode] = useState<'html' | 'url'>('html')
  const [html, setHtml] = useState('')
  const [url, setUrl] = useState('')

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div className="flex gap-2">
        {(['html', 'url'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`text-sm px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${mode === m ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted/50'}`}>
            {m === 'html' ? <Code2 className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
            {m === 'html' ? 'Paste HTML' : 'From URL'}
          </button>
        ))}
      </div>

      {mode === 'html' ? (
        <div>
          <Label className="text-xs mb-1.5 block">HTML content</Label>
          <Textarea
            value={html} onChange={e => setHtml(e.target.value)}
            placeholder="<html><body><h1>Hello World</h1><p>Your content here...</p></body></html>"
            rows={10} className="font-mono text-sm resize-none"
          />
        </div>
      ) : (
        <div>
          <Label className="text-xs mb-1.5 block">Web page URL</Label>
          <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/page" className="h-9" />
          <p className="text-xs text-muted-foreground mt-1">The page will be rendered with CSS and converted to PDF</p>
        </div>
      )}

      <div className="rounded-xl border p-5 space-y-4">
        <h3 className="text-sm font-medium">PDF Options</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <Label className="text-xs mb-1.5 block">Page size</Label>
            <Select defaultValue="a4">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="a4">A4</SelectItem>
                <SelectItem value="letter">Letter</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Orientation</Label>
            <Select defaultValue="portrait">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="portrait">Portrait</SelectItem>
                <SelectItem value="landscape">Landscape</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Margin</Label>
            <Select defaultValue="normal">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <Globe className="h-4 w-4" /> Generate PDF
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Puppeteer/Playwright — coming soon
        </Badge>
      </div>
    </div>
  )
}
