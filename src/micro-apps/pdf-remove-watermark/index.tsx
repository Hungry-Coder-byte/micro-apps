'use client'

import { useState } from 'react'
import { PdfDropzone } from '@/components/pdf-dropzone'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Eraser, Construction } from 'lucide-react'

export default function PdfRemoveWatermark() {
  const [file, setFile] = useState<File | null>(null)

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <PdfDropzone file={file} onFile={setFile} label="Drop a watermarked PDF" />

      <div className="rounded-xl border p-5 space-y-4">
        <h3 className="text-sm font-medium">Watermark Detection</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs mb-1.5 block">Watermark type</Label>
            <Select defaultValue="auto">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto-detect</SelectItem>
                <SelectItem value="text">Text watermark</SelectItem>
                <SelectItem value="image">Image watermark</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Watermark text (optional)</Label>
            <Input placeholder="e.g. CONFIDENTIAL" className="h-9" />
          </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-700 dark:text-amber-400">
          ⚠️ Watermark removal only works when the watermark is a separate layer. Burned-in watermarks cannot be removed.
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <Eraser className="h-4 w-4" /> Remove Watermark
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
