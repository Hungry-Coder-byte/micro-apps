'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Info, Construction, Upload } from 'lucide-react'

const BASIC = [
  ['Filename',       'landscape_photo.jpg'],
  ['File size',      '4.2 MB (4,404,224 bytes)'],
  ['Dimensions',     '4032 × 3024 px'],
  ['Megapixels',     '12.2 MP'],
  ['Color mode',     'RGB (8-bit)'],
  ['DPI',            '72 × 72'],
  ['Format',         'JPEG / JFIF 1.01'],
]

const EXIF = [
  ['Camera',         'Apple iPhone 14 Pro'],
  ['Lens',           '6.86mm f/1.78'],
  ['Shutter speed',  '1/120 s'],
  ['Aperture',       'f/1.8'],
  ['ISO',            '400'],
  ['Focal length',   '6.9 mm (equiv. 26 mm)'],
  ['Flash',          'No flash fired'],
  ['White balance',  'Auto'],
  ['Date taken',     '2024-03-15 14:32:07'],
  ['GPS',            '48.8584° N, 2.2945° E (Paris, France)'],
  ['Software',       'iPhone OS 17.2.1'],
]

export default function ImageMetadata() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="rounded-xl border-2 border-dashed border-muted p-10 text-center opacity-60 cursor-not-allowed">
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm font-medium">Drop an image to read its metadata</p>
        <p className="text-xs text-muted-foreground mt-1">Reads EXIF, IPTC, XMP — all processing is done locally</p>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Basic info</div>
        <div className="divide-y">
          {BASIC.map(([k, v]) => (
            <div key={k} className="px-4 py-2.5 grid grid-cols-3 gap-2 text-xs">
              <span className="text-muted-foreground">{k}</span>
              <span className="col-span-2 font-mono">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">EXIF data</div>
        <div className="divide-y">
          {EXIF.map(([k, v]) => (
            <div key={k} className="px-4 py-2.5 grid grid-cols-3 gap-2 text-xs">
              <span className="text-muted-foreground">{k}</span>
              <span className="col-span-2 font-mono">{v}</span>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60"><Info className="h-4 w-4" /> Read Metadata</Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
