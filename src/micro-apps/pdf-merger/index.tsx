'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Construction, Upload, Download, ChevronUp, ChevronDown, Scissors } from 'lucide-react'

const FILES = [
  { name: 'cover_page.pdf',   pages: 1,  size: '0.2 MB' },
  { name: 'chapter_01.pdf',   pages: 24, size: '1.8 MB' },
  { name: 'chapter_02.pdf',   pages: 31, size: '2.4 MB' },
  { name: 'appendix_A.pdf',   pages: 8,  size: '0.6 MB' },
]

export default function PdfMerger() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border-2 border-dashed border-muted p-8 text-center opacity-60 cursor-not-allowed">
          <Upload className="h-7 w-7 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm font-medium">Merge PDFs</p>
          <p className="text-xs text-muted-foreground mt-1">Drop multiple PDFs to combine into one</p>
        </div>
        <div className="rounded-xl border-2 border-dashed border-muted p-8 text-center opacity-60 cursor-not-allowed">
          <Scissors className="h-7 w-7 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm font-medium">Split PDF</p>
          <p className="text-xs text-muted-foreground mt-1">Extract pages or split by ranges</p>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center justify-between">
          <span className="text-xs font-medium">Files to merge (drag to reorder)</span>
          <span className="text-xs text-muted-foreground">64 pages · 5.0 MB total</span>
        </div>
        <div className="divide-y">
          {FILES.map(({ name, pages, size }, i) => (
            <div key={name} className="px-4 py-2.5 flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-4 shrink-0">{i + 1}</span>
              <FileText className="h-4 w-4 text-red-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono truncate">{name}</p>
                <p className="text-[10px] text-muted-foreground">{pages} pages · {size}</p>
              </div>
              <div className="flex gap-0.5 shrink-0">
                <button disabled className="opacity-40 cursor-not-allowed p-1"><ChevronUp className="h-3.5 w-3.5" /></button>
                <button disabled className="opacity-40 cursor-not-allowed p-1"><ChevronDown className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60"><Download className="h-4 w-4" /> Merge & Download</Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
