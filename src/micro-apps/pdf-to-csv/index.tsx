'use client'

import { useState } from 'react'
import { PdfDropzone } from '@/components/pdf-dropzone'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, Construction } from 'lucide-react'

export default function PdfToCsv() {
  const [file, setFile] = useState<File | null>(null)

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <PdfDropzone file={file} onFile={setFile} label="Drop a PDF containing tables" />

      <div className="rounded-xl border p-5 space-y-4">
        <h3 className="text-sm font-medium">Table Extraction Options</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs mb-1.5 block">Detection method</Label>
            <Select defaultValue="auto">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto-detect</SelectItem>
                <SelectItem value="lattice">Grid lines (lattice)</SelectItem>
                <SelectItem value="stream">Whitespace (stream)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Delimiter</Label>
            <Select defaultValue="comma">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="comma">Comma (,)</SelectItem>
                <SelectItem value="tab">Tab</SelectItem>
                <SelectItem value="semicolon">Semicolon (;)</SelectItem>
                <SelectItem value="pipe">Pipe (|)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs mb-1.5 block">Pages</Label>
            <Select defaultValue="all">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All pages</SelectItem>
                <SelectItem value="first">First page</SelectItem>
                <SelectItem value="range">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Output</Label>
            <Select defaultValue="one">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="one">One CSV file</SelectItem>
                <SelectItem value="per-table">One per table</SelectItem>
                <SelectItem value="per-page">One per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <Table className="h-4 w-4" /> Extract Tables to CSV
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Server processing — coming soon
        </Badge>
      </div>
    </div>
  )
}
