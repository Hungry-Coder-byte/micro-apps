'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImageIcon, Construction, Upload, Download } from 'lucide-react'

const FORMATS = ['JPEG', 'PNG', 'WebP', 'AVIF', 'GIF', 'BMP', 'TIFF', 'ICO', 'SVG']

export default function ImageConverter() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="rounded-xl border-2 border-dashed border-muted p-10 text-center opacity-60 cursor-not-allowed">
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm font-medium">Drop images here or click to upload</p>
        <p className="text-xs text-muted-foreground mt-1">Supports JPEG, PNG, WebP, AVIF, GIF, BMP, TIFF</p>
      </div>

      <div className="rounded-xl border p-4 space-y-3 opacity-70">
        <p className="text-xs font-medium">Conversion options</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Output format</Label>
            <Select defaultValue="WebP">
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{FORMATS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Quality</Label>
            <Select defaultValue="85">
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['100 (lossless)', '90', '85', '75', '60', '40'].map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Resize</Label>
            <Select defaultValue="original">
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['Original size', '1920×1080', '1280×720', '800×600', 'Custom'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Preview queue</div>
        <div className="divide-y">
          {[
            { name: 'photo_holiday.jpg',  size: '3.2 MB', out: '0.8 MB', format: 'WebP', saving: '75%' },
            { name: 'logo_design.png',    size: '1.1 MB', out: '0.3 MB', format: 'WebP', saving: '73%' },
            { name: 'banner_promo.jpeg',  size: '2.8 MB', out: '0.7 MB', format: 'WebP', saving: '75%' },
          ].map(({ name, size, out, format, saving }) => (
            <div key={name} className="px-4 py-2.5 flex items-center gap-3 text-xs">
              <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="flex-1 font-mono truncate">{name}</span>
              <span className="text-muted-foreground shrink-0">{size}</span>
              <span className="text-muted-foreground shrink-0">→ {out} {format}</span>
              <Badge variant="outline" className="text-[10px] px-1.5 text-green-600 border-green-400/40 shrink-0">−{saving}</Badge>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60"><Download className="h-4 w-4" /> Convert & Download</Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
