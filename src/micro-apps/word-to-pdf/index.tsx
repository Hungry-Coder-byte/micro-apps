'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { FileText, Upload, X, Construction } from 'lucide-react'

export default function WordToPdf() {
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div
        className={`rounded-xl border-2 border-dashed transition-colors ${file ? 'border-border' : 'border-border hover:border-primary/40 cursor-pointer'} p-8`}
        onClick={() => !file && inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept=".doc,.docx,.odt,.rtf" className="hidden"
          onChange={e => { if (e.target.files?.[0]) setFile(e.target.files[0]); e.target.value = '' }} />
        {!file ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="h-8 w-8 opacity-40" />
            <p className="text-sm">Drop a Word document here or click to browse</p>
            <p className="text-xs opacity-60">DOCX, DOC, ODT, RTF supported</p>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-blue-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); setFile(null) }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-xl border p-5 space-y-4">
        <h3 className="text-sm font-medium">PDF Options</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs mb-1.5 block">Page size</Label>
            <Select defaultValue="auto">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Match document</SelectItem>
                <SelectItem value="a4">Force A4</SelectItem>
                <SelectItem value="letter">Force Letter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Quality</Label>
            <Select defaultValue="standard">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="screen">Screen (smaller)</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="print">Print quality</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <FileText className="h-4 w-4" /> Convert to PDF
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Server processing — coming soon
        </Badge>
      </div>
    </div>
  )
}
