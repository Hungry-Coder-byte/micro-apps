'use client'

import { useState } from 'react'
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib'
import { PdfDropzone } from '@/components/pdf-dropzone'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { downloadPdf } from '@/lib/pdf-client'
import { Droplets, Loader2, RotateCcw, Download } from 'lucide-react'

const POSITIONS = [
  { id: 'center', label: 'Center (diagonal)' },
  { id: 'top', label: 'Top center' },
  { id: 'bottom', label: 'Bottom center' },
]

const COLORS: Record<string, [number, number, number]> = {
  gray: [0.5, 0.5, 0.5],
  red: [0.8, 0.1, 0.1],
  blue: [0.1, 0.2, 0.8],
  green: [0.1, 0.6, 0.2],
}

export default function PdfAddWatermark() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('CONFIDENTIAL')
  const [position, setPosition] = useState('center')
  const [color, setColor] = useState('gray')
  const [opacity, setOpacity] = useState('30')
  const [fontSize, setFontSize] = useState('48')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleApply() {
    if (!file || !text.trim()) return
    setLoading(true); setError(''); setDone(false)
    try {
      const bytes = await file.arrayBuffer()
      const doc = await PDFDocument.load(bytes)
      const font = await doc.embedFont(StandardFonts.HelveticaBold)
      const [r, g, b] = COLORS[color] ?? COLORS.gray
      const alpha = Math.min(1, Math.max(0, parseInt(opacity) / 100))
      const size = parseInt(fontSize) || 48

      for (const page of doc.getPages()) {
        const { width, height } = page.getSize()
        const textWidth = font.widthOfTextAtSize(text, size)
        let x = 0, y = 0, rot = 0

        if (position === 'center') { x = (width - textWidth) / 2; y = height / 2; rot = 45 }
        else if (position === 'top') { x = (width - textWidth) / 2; y = height - size - 20 }
        else { x = (width - textWidth) / 2; y = 20 }

        page.drawText(text, { x, y, size, font, color: rgb(r, g, b), opacity: alpha, rotate: degrees(rot) })
      }

      downloadPdf(await doc.save(), 'watermarked.pdf')
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
        <div>
          <Label className="text-xs mb-1.5 block">Watermark text</Label>
          <Input value={text} onChange={e => setText(e.target.value)} placeholder="CONFIDENTIAL" className="h-9" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <Label className="text-xs mb-1.5 block">Position</Label>
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>{POSITIONS.map(p => <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Color</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>{Object.keys(COLORS).map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Opacity %</Label>
            <Input type="number" min={5} max={100} value={opacity} onChange={e => setOpacity(e.target.value)} className="h-9" />
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Font size</Label>
            <Input type="number" min={12} max={120} value={fontSize} onChange={e => setFontSize(e.target.value)} className="h-9" />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleApply} disabled={!file || !text.trim() || loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Droplets className="h-4 w-4" />}
          {loading ? 'Applying…' : 'Add Watermark'}
        </Button>
        {file && <Button variant="ghost" size="icon" onClick={() => { setFile(null); setDone(false) }}><RotateCcw className="h-4 w-4" /></Button>}
      </div>

      {error && <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
      {done && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
          <Download className="h-4 w-4" /> watermarked.pdf downloaded.
        </div>
      )}
    </div>
  )
}
