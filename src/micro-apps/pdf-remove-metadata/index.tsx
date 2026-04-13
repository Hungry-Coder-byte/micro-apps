'use client'

import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import { PdfDropzone } from '@/components/pdf-dropzone'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { downloadPdf } from '@/lib/pdf-client'
import { ShieldOff, Loader2, RotateCcw, Download } from 'lucide-react'

interface MetaInfo { title: string; author: string; subject: string; keywords: string; creator: string; producer: string }

export default function PdfRemoveMetadata() {
  const [file, setFile] = useState<File | null>(null)
  const [meta, setMeta] = useState<MetaInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function loadFile(f: File | null) {
    setFile(f); setMeta(null); setDone(false)
    if (!f) return
    try {
      const bytes = await f.arrayBuffer()
      const doc = await PDFDocument.load(bytes)
      setMeta({
        title: doc.getTitle() ?? '',
        author: doc.getAuthor() ?? '',
        subject: doc.getSubject() ?? '',
        keywords: doc.getKeywords() ?? '',
        creator: doc.getCreator() ?? '',
        producer: doc.getProducer() ?? '',
      })
    } catch { setMeta(null) }
  }

  async function handleStrip() {
    if (!file) return
    setLoading(true); setError(''); setDone(false)
    try {
      const bytes = await file.arrayBuffer()
      const doc = await PDFDocument.load(bytes)
      doc.setTitle(''); doc.setAuthor(''); doc.setSubject('')
      doc.setKeywords([]); doc.setCreator(''); doc.setProducer('')
      doc.setCreationDate(new Date(0)); doc.setModificationDate(new Date(0))
      downloadPdf(await doc.save(), 'clean.pdf')
      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    } finally {
      setLoading(false)
    }
  }

  const hasMeta = meta && Object.values(meta).some(v => v)

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <PdfDropzone file={file} onFile={loadFile} />

      {meta && (
        <div className="rounded-xl border p-5 space-y-3">
          <h3 className="text-sm font-medium">Detected Metadata</h3>
          {hasMeta ? (
            <div className="space-y-1.5">
              {(Object.entries(meta) as [string, string][]).filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="flex items-start gap-3 text-sm">
                  <span className="text-muted-foreground capitalize w-20 shrink-0">{k}</span>
                  <span className="break-all">{v}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No metadata found in this PDF.</p>
          )}
          {hasMeta && <Badge variant="outline" className="text-xs text-amber-600 border-amber-500/30">Metadata will be stripped</Badge>}
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={handleStrip} disabled={!file || loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldOff className="h-4 w-4" />}
          {loading ? 'Stripping…' : 'Remove Metadata'}
        </Button>
        {file && <Button variant="ghost" size="icon" onClick={() => { setFile(null); setMeta(null); setDone(false) }}><RotateCcw className="h-4 w-4" /></Button>}
      </div>

      {error && <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
      {done && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
          <Download className="h-4 w-4" /> clean.pdf downloaded — all metadata removed.
        </div>
      )}
    </div>
  )
}
