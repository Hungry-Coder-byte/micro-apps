'use client'

import { useState } from 'react'
import { PdfDropzone } from '@/components/pdf-dropzone'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { FileText, Construction } from 'lucide-react'

export default function PdfToWord() {
  const [file, setFile] = useState<File | null>(null)

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <PdfDropzone file={file} onFile={setFile} label="Drop a PDF to convert to Word" />

      <div className="rounded-xl border p-5 space-y-4">
        <h3 className="text-sm font-medium">Conversion Options</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs mb-1.5 block">Output format</Label>
            <Select defaultValue="docx">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="docx">DOCX (Word 2007+)</SelectItem>
                <SelectItem value="doc">DOC (Legacy)</SelectItem>
                <SelectItem value="odt">ODT (LibreOffice)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Preserve</Label>
            <Select defaultValue="layout">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="layout">Layout & formatting</SelectItem>
                <SelectItem value="text">Text only</SelectItem>
                <SelectItem value="tables">Tables & structure</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
          <p>• Text-based PDFs convert well; image-only PDFs require OCR</p>
          <p>• Complex layouts (multi-column, headers) may shift during conversion</p>
          <p>• Tables and lists are best preserved in DOCX format</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <FileText className="h-4 w-4" /> Convert to DOCX
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Server processing — coming soon
        </Badge>
      </div>
    </div>
  )
}
