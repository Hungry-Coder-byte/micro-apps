'use client'

import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import { PdfDropzone } from '@/components/pdf-dropzone'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { downloadPdf } from '@/lib/pdf-client'
import { Merge, Loader2, RotateCcw } from 'lucide-react'

export default function PdfMerge() {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleMerge() {
    if (files.length < 2) return
    setLoading(true); setError(''); setDone(false)
    try {
      const merged = await PDFDocument.create()
      for (const file of files) {
        const bytes = await file.arrayBuffer()
        const doc = await PDFDocument.load(bytes)
        const pages = await merged.copyPages(doc, doc.getPageIndices())
        pages.forEach(p => merged.addPage(p))
      }
      const outBytes = await merged.save()
      downloadPdf(outBytes, 'merged.pdf')
      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Merge failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
        Add 2 or more PDFs below. They will be merged in the order listed.
      </div>

      <PdfDropzone
        file={null} onFile={() => {}}
        multiple onFiles={setFiles} files={files}
        label="Drop PDFs here or click to browse (select multiple)"
      />

      <div className="flex gap-2 items-center">
        <Button onClick={handleMerge} disabled={files.length < 2 || loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Merge className="h-4 w-4" />}
          {loading ? 'Merging…' : `Merge ${files.length} PDFs`}
        </Button>
        {files.length > 0 && <Button variant="ghost" size="icon" onClick={() => { setFiles([]); setDone(false) }}><RotateCcw className="h-4 w-4" /></Button>}
        {files.length < 2 && <span className="text-xs text-muted-foreground">Add at least 2 PDFs</span>}
      </div>

      {error && <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
      {done && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
          <Badge variant="outline" className="text-green-600 border-green-500/30">Done</Badge>
          Merged PDF downloaded successfully.
        </div>
      )}
    </div>
  )
}
