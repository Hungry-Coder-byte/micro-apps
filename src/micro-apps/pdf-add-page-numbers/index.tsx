'use client'

import { useState } from 'react'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { PdfDropzone } from '@/components/pdf-dropzone'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { downloadPdf } from '@/lib/pdf-client'
import { Hash, Loader2, RotateCcw, Download } from 'lucide-react'

export default function PdfAddPageNumbers() {
  const [file, setFile] = useState<File | null>(null)
  const [position, setPosition] = useState('bottom-center')
  const [startFrom, setStartFrom] = useState('1')
  const [prefix, setPrefix] = useState('')
  const [fontSize, setFontSize] = useState('10')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleApply() {
    if (!file) return
    setLoading(true); setError(''); setDone(false)
    try {
      const bytes = await file.arrayBuffer()
      const doc = await PDFDocument.load(bytes)
      const font = await doc.embedFont(StandardFonts.Helvetica)
      const size = parseInt(fontSize) || 10
      const start = parseInt(startFrom) || 1
      const pages = doc.getPages()

      pages.forEach((page, idx) => {
        const { width, height } = page.getSize()
        const label = `${prefix}${start + idx}`
        const textWidth = font.widthOfTextAtSize(label, size)
        let x = 0, y = 0

        if (position === 'bottom-center') { x = (width - textWidth) / 2; y = 15 }
        else if (position === 'bottom-right') { x = width - textWidth - 20; y = 15 }
        else if (position === 'bottom-left') { x = 20; y = 15 }
        else if (position === 'top-center') { x = (width - textWidth) / 2; y = height - size - 10 }
        else if (position === 'top-right') { x = width - textWidth - 20; y = height - size - 10 }
        else { x = 20; y = height - size - 10 }

        page.drawText(label, { x, y, size, font, color: rgb(0.3, 0.3, 0.3) })
      })

      downloadPdf(await doc.save(), 'numbered.pdf')
      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <PdfDropzone file={file} onFile={f => { setFile(f); setDone(false) }} />

      <div className="rounded-xl border p-5 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <Label className="text-xs mb-1.5 block">Position</Label>
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['bottom-center', 'bottom-right', 'bottom-left', 'top-center', 'top-right', 'top-left'].map(p => (
                  <SelectItem key={p} value={p} className="capitalize">{p.replace('-', ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Start from</Label>
            <Input type="number" min={0} value={startFrom} onChange={e => setStartFrom(e.target.value)} className="h-9" />
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Prefix (optional)</Label>
            <Input value={prefix} onChange={e => setPrefix(e.target.value)} placeholder="Page " className="h-9" />
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Font size</Label>
            <Input type="number" min={6} max={24} value={fontSize} onChange={e => setFontSize(e.target.value)} className="h-9" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Preview: {prefix}{startFrom}, {prefix}{parseInt(startFrom) + 1}, {prefix}{parseInt(startFrom) + 2}…</p>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleApply} disabled={!file || loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Hash className="h-4 w-4" />}
          {loading ? 'Adding numbers…' : 'Add Page Numbers'}
        </Button>
        {file && <Button variant="ghost" size="icon" onClick={() => { setFile(null); setDone(false) }}><RotateCcw className="h-4 w-4" /></Button>}
      </div>

      {error && <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
      {done && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
          <Download className="h-4 w-4" /> numbered.pdf downloaded.
        </div>
      )}
    </div>
  )
}
