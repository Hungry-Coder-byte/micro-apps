'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileSearch, Construction, Upload, CheckCircle2 } from 'lucide-react'

const DETAILS = [
  ['MIME type',       'image/png'],
  ['Extension',       '.png'],
  ['Magic bytes',     '89 50 4E 47 0D 0A 1A 0A'],
  ['Description',     'Portable Network Graphics'],
  ['Category',        'Image'],
  ['Binary',          'Yes'],
  ['Compressible',    'No (already compressed)'],
  ['Standard',        'ISO/IEC 15948:2004'],
]

const BATCH = [
  { name: 'report.pdf',       claimed: '.pdf', detected: 'application/pdf',       match: true  },
  { name: 'data.csv.xlsx',    claimed: '.xlsx', detected: 'text/csv',              match: false },
  { name: 'photo.jpg',        claimed: '.jpg', detected: 'image/jpeg',             match: true  },
  { name: 'archive.tar.gz',   claimed: '.gz',  detected: 'application/gzip',       match: true  },
  { name: 'doc_fake.pdf',     claimed: '.pdf', detected: 'application/msword',     match: false },
]

export default function FileTypeDetector() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="rounded-xl border-2 border-dashed border-muted p-10 text-center opacity-60 cursor-not-allowed">
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm font-medium">Drop a file to detect its true type</p>
        <p className="text-xs text-muted-foreground mt-1">Reads magic bytes — ignores file extension claims</p>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Detected type for example.png</div>
        <div className="divide-y">
          {DETAILS.map(([k, v]) => (
            <div key={k} className="px-4 py-2.5 grid grid-cols-3 gap-2 text-xs">
              <span className="text-muted-foreground">{k}</span>
              <code className="col-span-2 font-mono break-all">{v}</code>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Batch scan — extension vs. magic bytes</div>
        <div className="divide-y">
          {BATCH.map(({ name, claimed, detected, match }) => (
            <div key={name} className="px-4 py-2.5 flex items-center gap-3 text-xs">
              <div className="flex-1 min-w-0">
                <p className="font-mono truncate">{name}</p>
                <p className="text-muted-foreground text-[10px]">Detected: {detected}</p>
              </div>
              <Badge variant="outline" className={`text-[10px] px-1.5 shrink-0 ${match ? 'text-green-600 border-green-400/40' : 'text-red-600 border-red-400/40'}`}>
                {match ? '✓ match' : '✗ mismatch'}
              </Badge>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60"><FileSearch className="h-4 w-4" /> Detect Type</Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
