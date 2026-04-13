'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ImageIcon, Upload, X, Construction } from 'lucide-react'

export default function ImageToPdf() {
  const [files, setFiles] = useState<File[]>([])

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = [...(e.target.files ?? [])].filter(f => f.type.startsWith('image/'))
    setFiles(prev => [...prev, ...selected])
    e.target.value = ''
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div className="rounded-xl border-2 border-dashed border-border hover:border-primary/40 transition-colors p-10 text-center cursor-pointer relative" onClick={() => document.getElementById('img-input')?.click()}>
        <input id="img-input" type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-40" />
        <p className="text-sm text-muted-foreground">Drop images here or click to browse</p>
        <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG, WEBP, GIF supported</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border bg-muted/30 px-3 py-2">
              <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm flex-1 truncate">{f.name}</span>
              <span className="text-xs text-muted-foreground">{(f.size / 1024).toFixed(0)} KB</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border p-5 space-y-4">
        <h3 className="text-sm font-medium">PDF Options</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs mb-1.5 block">Page size</Label>
            <Select defaultValue="a4">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="a4">A4</SelectItem>
                <SelectItem value="letter">Letter (US)</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="fit">Fit to image</SelectItem>
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
                <SelectItem value="auto">Auto (per image)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <ImageIcon className="h-4 w-4" /> Convert to PDF
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Server processing — coming soon
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">Image → PDF conversion requires server-side image processing and will be available in an upcoming release.</p>
    </div>
  )
}
