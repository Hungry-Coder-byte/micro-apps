'use client'

import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import JSZip from 'jszip'
import { PdfDropzone } from '@/components/pdf-dropzone'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Scissors, Loader2, RotateCcw, Download } from 'lucide-react'

function pdfBlob(bytes: Uint8Array) { return new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' }) }
function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = name; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default function PdfSplit() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [splitAt, setSplitAt] = useState('')
  const [mode, setMode] = useState<'split-at' | 'all-pages'>('split-at')
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

  async function handleSplit() {
    if (!file) return
    setLoading(true); setError(''); setDone(false)
    try {
      const bytes = await file.arrayBuffer()
      const src = await PDFDocument.load(bytes)
      const total = src.getPageCount()

      if (mode === 'split-at') {
        const at = parseInt(splitAt)
        if (isNaN(at) || at < 1 || at >= total) throw new Error(`Split point must be between 1 and ${total - 1}`)
        // Part 1
        const part1 = await PDFDocument.create()
        const pages1 = await part1.copyPages(src, Array.from({ length: at }, (_, i) => i))
        pages1.forEach(p => part1.addPage(p))
        downloadBlob(pdfBlob(await part1.save()), 'part-1.pdf')
        // Part 2
        const part2 = await PDFDocument.create()
        const pages2 = await part2.copyPages(src, Array.from({ length: total - at }, (_, i) => at + i))
        pages2.forEach(p => part2.addPage(p))
        downloadBlob(pdfBlob(await part2.save()), 'part-2.pdf')
      } else {
        // All pages → zip
        const zip = new JSZip()
        for (let i = 0; i < total; i++) {
          const single = await PDFDocument.create()
          const [pg] = await single.copyPages(src, [i])
          single.addPage(pg)
          zip.file(`page-${String(i + 1).padStart(3, '0')}.pdf`, (await single.save()).buffer as ArrayBuffer)
        }
        const blob = await zip.generateAsync({ type: 'blob' })
        downloadBlob(blob, 'pages.zip')
      }
      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Split failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <PdfDropzone file={file} onFile={loadFile} />

      {pageCount > 0 && (
        <div className="rounded-xl border p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{pageCount} pages</Badge>
            <span className="text-sm text-muted-foreground">{file?.name}</span>
          </div>

          <div className="flex gap-3">
            {(['split-at', 'all-pages'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`text-sm px-3 py-1.5 rounded-md border transition-colors ${mode === m ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted/50'}`}>
                {m === 'split-at' ? 'Split at page' : 'All pages → ZIP'}
              </button>
            ))}
          </div>

          {mode === 'split-at' && (
            <div className="max-w-xs">
              <Label className="text-xs mb-1.5 block">Split after page number (1–{pageCount - 1})</Label>
              <Input type="number" min={1} max={pageCount - 1} value={splitAt} onChange={e => setSplitAt(e.target.value)} placeholder={`e.g. ${Math.ceil(pageCount / 2)}`} className="h-9" />
              <p className="text-xs text-muted-foreground mt-1">Downloads part-1.pdf and part-2.pdf</p>
            </div>
          )}
          {mode === 'all-pages' && (
            <p className="text-xs text-muted-foreground">Each page becomes its own PDF, bundled in a ZIP archive.</p>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={handleSplit} disabled={!file || loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scissors className="h-4 w-4" />}
          {loading ? 'Splitting…' : 'Split PDF'}
        </Button>
        {file && <Button variant="ghost" size="icon" onClick={() => { setFile(null); setPageCount(0); setDone(false) }}><RotateCcw className="h-4 w-4" /></Button>}
      </div>

      {error && <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
      {done && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
          <Download className="h-4 w-4" /> Split complete — file(s) downloaded.
        </div>
      )}
    </div>
  )
}
