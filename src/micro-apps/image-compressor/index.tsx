'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Minimize2, Construction, Upload, Download } from 'lucide-react'

const SAMPLES = [
  { name: 'hero_banner.jpg',    original: '4.8 MB', compressed: '0.6 MB', reduction: '87%', w: 3840, h: 2160 },
  { name: 'profile_photo.png',  original: '2.1 MB', compressed: '0.4 MB', reduction: '81%', w: 1200, h: 1200 },
  { name: 'product_shot.webp',  original: '1.4 MB', compressed: '0.2 MB', reduction: '86%', w: 2000, h: 2000 },
]

export default function ImageCompressor() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="rounded-xl border-2 border-dashed border-muted p-10 text-center opacity-60 cursor-not-allowed">
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm font-medium">Drop images here or click to upload</p>
        <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, WebP — up to 20 MB each · batch supported</p>
      </div>

      <div className="rounded-xl border p-4 space-y-3 opacity-70">
        <p className="text-xs font-medium">Compression settings</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            { label: 'Quality', value: '80%' },
            { label: 'Max width', value: '1920 px' },
            { label: 'Max height', value: '1080 px' },
            { label: 'Strip metadata', value: 'Yes (EXIF)' },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border px-3 py-2">
              <p className="text-[10px] text-muted-foreground mb-0.5">{label}</p>
              <p className="font-mono font-medium">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Results</div>
        <div className="divide-y">
          {SAMPLES.map(({ name, original, compressed, reduction, w, h }) => (
            <div key={name} className="px-4 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono truncate">{name}</p>
                <p className="text-[10px] text-muted-foreground">{w}×{h} px</p>
              </div>
              <div className="text-xs text-right shrink-0">
                <p className="text-muted-foreground line-through">{original}</p>
                <p className="font-semibold">{compressed}</p>
              </div>
              <Badge variant="outline" className="text-[10px] px-1.5 text-green-600 border-green-400/40 shrink-0">−{reduction}</Badge>
              <button disabled className="opacity-40 cursor-not-allowed shrink-0">
                <Download className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60"><Minimize2 className="h-4 w-4" /> Compress All</Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
