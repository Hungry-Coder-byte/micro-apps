'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileType2, Construction } from 'lucide-react'

const MIME_SAMPLES = [
  { ext: '.html',  mime: 'text/html',                           category: 'Text',        binary: false },
  { ext: '.json',  mime: 'application/json',                    category: 'Application', binary: false },
  { ext: '.pdf',   mime: 'application/pdf',                     category: 'Application', binary: true  },
  { ext: '.png',   mime: 'image/png',                           category: 'Image',       binary: true  },
  { ext: '.mp4',   mime: 'video/mp4',                           category: 'Video',       binary: true  },
  { ext: '.mp3',   mime: 'audio/mpeg',                          category: 'Audio',       binary: true  },
  { ext: '.zip',   mime: 'application/zip',                     category: 'Application', binary: true  },
  { ext: '.svg',   mime: 'image/svg+xml',                       category: 'Image',       binary: false },
]

export default function MimeTypeLookup() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label className="text-xs mb-1.5 block">File extension or MIME type</Label>
          <Input defaultValue=".pdf" placeholder=".png or image/png" className="h-9 font-mono" />
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Or upload a file</Label>
          <Input type="file" disabled className="h-9 text-xs opacity-60 cursor-not-allowed" />
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">MIME type details for .pdf</div>
        <div className="divide-y text-xs">
          {[
            ['MIME Type',     'application/pdf'],
            ['Extension(s)',  '.pdf'],
            ['Category',      'Application'],
            ['Binary',        'Yes'],
            ['Description',   'Portable Document Format'],
            ['RFC',           'RFC 3778'],
          ].map(([k, v]) => (
            <div key={k} className="px-4 py-2.5 grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">{k}</span>
              <code className="col-span-2 font-mono break-all">{v}</code>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Common MIME types</div>
        <div className="divide-y">
          {MIME_SAMPLES.map(({ ext, mime, category, binary }) => (
            <div key={ext} className="px-4 py-2 flex items-center gap-3 text-xs">
              <code className="font-mono w-14 text-primary shrink-0">{ext}</code>
              <code className="font-mono flex-1 text-muted-foreground">{mime}</code>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">{category}</Badge>
              <span className={`text-[10px] shrink-0 ${binary ? 'text-amber-600' : 'text-green-600'}`}>{binary ? 'Binary' : 'Text'}</span>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <FileType2 className="h-4 w-4" /> Look Up
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
