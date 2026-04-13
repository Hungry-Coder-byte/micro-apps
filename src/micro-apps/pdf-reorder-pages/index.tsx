'use client'

import { useState } from 'react'
import { PdfDropzone } from '@/components/pdf-dropzone'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ArrowUpDown, Construction } from 'lucide-react'

export default function PdfReorderPages() {
  const [file, setFile] = useState<File | null>(null)
  const [order, setOrder] = useState('')

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <PdfDropzone file={file} onFile={setFile} label="Drop a PDF to reorder its pages" />

      <div className="rounded-xl border p-5 space-y-4">
        <h3 className="text-sm font-medium">Page Order</h3>
        <div>
          <Label className="text-xs mb-1.5 block">New page order</Label>
          <Input value={order} onChange={e => setOrder(e.target.value)} placeholder="e.g. 3, 1, 2, 5, 4 (comma-separated page numbers)" className="h-9" />
          <p className="text-xs text-muted-foreground mt-1">Enter page numbers in the desired order. Pages not listed will be appended at the end.</p>
        </div>
        <div className="bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
          <p><strong>Example:</strong> Original has 5 pages → Enter <code className="bg-muted px-1 rounded">3,1,2,5,4</code> to swap order</p>
          <p>Drag-and-drop page preview coming soon</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <ArrowUpDown className="h-4 w-4" /> Reorder & Download
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
