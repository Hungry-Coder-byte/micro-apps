'use client'

import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import { PdfDropzone } from '@/components/pdf-dropzone'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { downloadPdf, parsePageList } from '@/lib/pdf-client'
import { Copy, Loader2, RotateCcw, Download } from 'lucide-react'

export default function PdfExtractPages() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [pageInput, setPageInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function loadFile(f: File | null) {
    setFile(f); setPageCount(0); setDone(false)
    if (!f) return
    try {
      const bytes = await f.arrayBuffer()
      const doc = await PDFDocument.load(bytes)
      setPageCount(doc.getPageCount())
    } catch { setPageCount(0) }
  }

  async function handleExtract() {
    if (!file || !pageInput.trim()) return
    setLoading(true); setError(''); setDone(false)
    try {
      const bytes = await file.arrayBuffer()
      const src = await PDFDocument.load(bytes)
      const indices = parsePageList(pageInput, pageCount)
      if (indices.length === 0) throw new Error('No valid pages specified')
      const out = await PDFDocument.create()
      const pages = await out.copyPages(src, indices)
      pages.forEach(p => out.addPage(p))
      downloadPdf(await out.save(), 'extracted.pdf')
      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Extraction failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <PdfDropzone file={file} onFile={loadFile} />

      {pageCount > 0 && (
        <div className="rounded-xl border p-5 space-y-3">
          <Badge variant="secondary">{pageCount} pages total</Badge>
          <div>
            <Label className="text-xs mb-1.5 block">Pages to extract</Label>
            <Input
              value={pageInput}
              onChange={e => setPageInput(e.target.value)}
              placeholder="e.g. 1, 3, 5-8, 12"
              className="h-9"
            />
            <p className="text-xs text-muted-foreground mt-1">Comma-separated page numbers or ranges (e.g. 1-5, 8, 10-12)</p>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={handleExtract} disabled={!file || !pageInput.trim() || loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
          {loading ? 'Extracting…' : 'Extract Pages'}
        </Button>
        {file && <Button variant="ghost" size="icon" onClick={() => { setFile(null); setPageCount(0); setPageInput(''); setDone(false) }}><RotateCcw className="h-4 w-4" /></Button>}
      </div>

      {error && <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
      {done && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
          <Download className="h-4 w-4" /> extracted.pdf downloaded.
        </div>
      )}
    </div>
  )
}
