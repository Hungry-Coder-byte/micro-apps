'use client'

import { useState } from 'react'
import { PDFDocument, degrees } from 'pdf-lib'
import { PdfDropzone } from '@/components/pdf-dropzone'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { downloadPdf, parsePageList } from '@/lib/pdf-client'
import { RotateCw, Loader2, RotateCcw, Download } from 'lucide-react'

export default function PdfRotatePages() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [pageInput, setPageInput] = useState('')
  const [angle, setAngle] = useState('90')
  const [applyAll, setApplyAll] = useState(true)
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

  async function handleRotate() {
    if (!file) return
    setLoading(true); setError(''); setDone(false)
    try {
      const bytes = await file.arrayBuffer()
      const doc = await PDFDocument.load(bytes)
      const deg = parseInt(angle)
      const indices = applyAll
        ? Array.from({ length: pageCount }, (_, i) => i)
        : parsePageList(pageInput, pageCount)
      if (indices.length === 0) throw new Error('No valid pages specified')
      indices.forEach(i => {
        const page = doc.getPage(i)
        const current = page.getRotation().angle
        page.setRotation(degrees((current + deg) % 360))
      })
      downloadPdf(await doc.save(), 'rotated.pdf')
      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Rotation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <PdfDropzone file={file} onFile={loadFile} />

      {pageCount > 0 && (
        <div className="rounded-xl border p-5 space-y-4">
          <Badge variant="secondary">{pageCount} pages</Badge>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs mb-1.5 block">Rotation angle</Label>
              <Select value={angle} onValueChange={setAngle}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">90° clockwise</SelectItem>
                  <SelectItem value="180">180°</SelectItem>
                  <SelectItem value="270">90° counter-clockwise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Apply to</Label>
              <Select value={applyAll ? 'all' : 'specific'} onValueChange={v => setApplyAll(v === 'all')}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All pages</SelectItem>
                  <SelectItem value="specific">Specific pages</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!applyAll && (
            <div>
              <Label className="text-xs mb-1.5 block">Page numbers</Label>
              <Input value={pageInput} onChange={e => setPageInput(e.target.value)} placeholder="e.g. 1, 3, 5-8" className="h-9" />
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={handleRotate} disabled={!file || loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCw className="h-4 w-4" />}
          {loading ? 'Rotating…' : 'Rotate & Download'}
        </Button>
        {file && <Button variant="ghost" size="icon" onClick={() => { setFile(null); setPageCount(0); setDone(false) }}><RotateCcw className="h-4 w-4" /></Button>}
      </div>

      {error && <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
      {done && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
          <Download className="h-4 w-4" /> rotated.pdf downloaded.
        </div>
      )}
    </div>
  )
}
