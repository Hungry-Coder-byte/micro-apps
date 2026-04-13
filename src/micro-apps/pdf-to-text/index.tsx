'use client'

import { useState } from 'react'
import { PdfDropzone } from '@/components/pdf-dropzone'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { extractPdfText } from '@/lib/pdf-client'
import { useClipboard } from '@/hooks/useClipboard'
import { FileText, Copy, Check, RotateCcw, Loader2 } from 'lucide-react'

export default function PdfToText() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<{ text: string; pages: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { copy, copied } = useClipboard()

  async function handleExtract() {
    if (!file) return
    setLoading(true); setError('')
    try {
      const res = await extractPdfText(file)
      setResult(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Extraction failed')
    } finally {
      setLoading(false)
    }
  }

  function reset() { setFile(null); setResult(null); setError('') }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <PdfDropzone file={file} onFile={f => { setFile(f); setResult(null) }} />

      <div className="flex gap-2">
        <Button onClick={handleExtract} disabled={!file || loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
          {loading ? 'Extracting…' : 'Extract Text'}
        </Button>
        {result && <Button variant="ghost" size="icon" onClick={reset}><RotateCcw className="h-4 w-4" /></Button>}
      </div>

      {error && <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

      {result && (
        <div className="rounded-xl border bg-muted/30 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium">Extracted Text</span>
              <Badge variant="outline" className="text-xs">{result.pages} pages</Badge>
              <Badge variant="secondary" className="text-xs">{result.text.length.toLocaleString()} chars</Badge>
            </div>
            <Button size="sm" variant="ghost" onClick={() => copy(result.text)} className="h-7 gap-1.5 text-xs">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <pre className="p-4 text-xs font-mono whitespace-pre-wrap max-h-[500px] overflow-y-auto leading-relaxed">
            {result.text || '(No text found — PDF may contain only images)'}
          </pre>
        </div>
      )}
    </div>
  )
}
