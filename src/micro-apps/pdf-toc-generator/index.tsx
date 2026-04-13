'use client'

import { useState } from 'react'
import { PdfDropzone } from '@/components/pdf-dropzone'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { List, Construction } from 'lucide-react'

export default function PdfTocGenerator() {
  const [file, setFile] = useState<File | null>(null)

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <PdfDropzone file={file} onFile={setFile} label="Drop a PDF to generate a Table of Contents" />

      <div className="rounded-xl border p-5 space-y-4">
        <h3 className="text-sm font-medium">TOC Settings</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs mb-1.5 block">Insert position</Label>
            <Select defaultValue="start">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Beginning of document</SelectItem>
                <SelectItem value="after-cover">After first page</SelectItem>
                <SelectItem value="end">End of document</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Page number style</Label>
            <Select defaultValue="right">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="right">Right-aligned</SelectItem>
                <SelectItem value="dot-leader">Dot leader (1 ……… 5)</SelectItem>
                <SelectItem value="none">No page numbers</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Heading levels</Label>
            <Select defaultValue="3">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">H1 only</SelectItem>
                <SelectItem value="2">H1 + H2</SelectItem>
                <SelectItem value="3">H1 + H2 + H3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Style</Label>
            <Select defaultValue="minimal">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="styled">Styled with lines</SelectItem>
                <SelectItem value="numbered">Numbered sections</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground">
          A new page is inserted with the table of contents and clickable links to each section.
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <List className="h-4 w-4" /> Generate TOC
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
