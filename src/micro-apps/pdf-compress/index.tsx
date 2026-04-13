'use client'

import { useState } from 'react'
import { PdfDropzone } from '@/components/pdf-dropzone'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { PackageOpen, Construction } from 'lucide-react'

export default function PdfCompress() {
  const [file, setFile] = useState<File | null>(null)

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <PdfDropzone file={file} onFile={setFile} label="Drop a PDF to compress" />

      {file && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Original size: {(file.size / 1024).toFixed(1)} KB</Badge>
        </div>
      )}

      <div className="rounded-xl border p-5 space-y-4">
        <h3 className="text-sm font-medium">Compression Settings</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs mb-1.5 block">Compression level</Label>
            <Select defaultValue="medium">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (best quality)</SelectItem>
                <SelectItem value="medium">Medium (balanced)</SelectItem>
                <SelectItem value="high">High (smallest file)</SelectItem>
                <SelectItem value="extreme">Extreme (max compression)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Image quality</Label>
            <Select defaultValue="80">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="95">95% (near lossless)</SelectItem>
                <SelectItem value="80">80% (standard)</SelectItem>
                <SelectItem value="60">60% (aggressive)</SelectItem>
                <SelectItem value="40">40% (maximum)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {['Remove annotations', 'Flatten form fields', 'Subset fonts', 'Remove metadata'].map(opt => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-muted-foreground">{opt}</span>
            </label>
          ))}
        </div>
        <div className="bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground">
          Estimated reduction: <strong>30–70%</strong> depending on content. PDFs with many images compress the most.
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <PackageOpen className="h-4 w-4" /> Compress PDF
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Ghostscript — coming soon
        </Badge>
      </div>
    </div>
  )
}
