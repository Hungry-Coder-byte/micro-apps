'use client'

import { useRef } from 'react'
import { FileText, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PdfDropzoneProps {
  file: File | null
  onFile: (f: File | null) => void
  label?: string
  /** Accept multiple files */
  multiple?: boolean
  onFiles?: (files: File[]) => void
  files?: File[]
}

export function PdfDropzone({ file, onFile, label = 'Drop a PDF here or click to browse', multiple, onFiles, files }: PdfDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const dropped = [...e.dataTransfer.files].filter(f => f.type === 'application/pdf')
    if (multiple && onFiles) onFiles(dropped)
    else if (dropped[0]) onFile(dropped[0])
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = [...(e.target.files ?? [])]
    if (multiple && onFiles) onFiles(selected)
    else if (selected[0]) onFile(selected[0])
    e.target.value = ''
  }

  const displayFiles = multiple ? (files ?? []) : (file ? [file] : [])
  const hasFiles = displayFiles.length > 0

  return (
    <div
      className={`rounded-xl border-2 border-dashed transition-colors cursor-pointer ${hasFiles ? 'border-border bg-muted/20' : 'border-border hover:border-primary/40 hover:bg-muted/30'}`}
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => !hasFiles && inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" accept="application/pdf" multiple={multiple} className="hidden" onChange={handleChange} />

      {!hasFiles ? (
        <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
          <Upload className="h-8 w-8 opacity-40" />
          <p className="text-sm">{label}</p>
          <p className="text-xs opacity-60">PDF files only</p>
        </div>
      ) : (
        <div className="p-4 space-y-2">
          {displayFiles.map((f, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
              <FileText className="h-4 w-4 text-rose-500 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{f.name}</p>
                <p className="text-xs text-muted-foreground">{(f.size / 1024).toFixed(1)} KB</p>
              </div>
              <Button
                variant="ghost" size="icon" className="h-6 w-6 shrink-0"
                onClick={e => { e.stopPropagation(); multiple && onFiles ? onFiles(displayFiles.filter((_, j) => j !== i)) : onFile(null) }}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          <button className="text-xs text-muted-foreground hover:text-foreground px-3" onClick={() => inputRef.current?.click()}>
            + Add more PDFs
          </button>
        </div>
      )}
    </div>
  )
}
