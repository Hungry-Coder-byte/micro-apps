'use client'

import { useState } from 'react'
import { PdfDropzone } from '@/components/pdf-dropzone'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ImageIcon, Construction } from 'lucide-react'

export default function PdfToImages() {
  const [file, setFile] = useState<File | null>(null)

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <PdfDropzone file={file} onFile={setFile} label="Drop a PDF to convert to images" />

      <div className="rounded-xl border p-5 space-y-4">
        <h3 className="text-sm font-medium">Export Options</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <Label className="text-xs mb-1.5 block">Format</Label>
            <Select defaultValue="png">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG (lossless)</SelectItem>
                <SelectItem value="jpg">JPEG (smaller)</SelectItem>
                <SelectItem value="webp">WebP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Resolution (DPI)</Label>
            <Select defaultValue="150">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="72">72 DPI (screen)</SelectItem>
                <SelectItem value="150">150 DPI (standard)</SelectItem>
                <SelectItem value="300">300 DPI (print)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Pages</Label>
            <Select defaultValue="all">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All pages</SelectItem>
                <SelectItem value="range">Page range</SelectItem>
                <SelectItem value="first">First page only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="max-w-xs">
          <Label className="text-xs mb-1.5 block">Page range (optional)</Label>
          <Input placeholder="e.g. 1-5, 8, 10" className="h-9" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <ImageIcon className="h-4 w-4" /> Convert to Images (ZIP)
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Server rendering — coming soon
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">PDF → image rendering requires a server-side PDF renderer (Poppler/Ghostscript). Coming in the next release.</p>
    </div>
  )
}
