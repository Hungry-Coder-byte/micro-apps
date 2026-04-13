'use client'

import { useState } from 'react'
import { PdfDropzone } from '@/components/pdf-dropzone'
import { MarkdownOutput } from '@/components/markdown-output'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { extractPdfText } from '@/lib/pdf-client'
import { useOllama } from '@/hooks/useOllama'
import { useClipboard } from '@/hooks/useClipboard'
import { Zap, Square, Copy, Check, RotateCcw, Loader2, Sparkles } from 'lucide-react'

const MODELS = ['gemma3:latest', 'mistral:latest', 'llama3:latest']
const SYSTEM = 'You are an expert at creating ultra-concise TL;DR summaries. Be brutally brief — every word must earn its place.'

export default function AiPdfTldr() {
  const [file, setFile] = useState<File | null>(null)
  const [pdfText, setPdfText] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [extractErr, setExtractErr] = useState('')
  const [model, setModel] = useState(MODELS[0])
  const { output, loading, error, run, stop, reset } = useOllama({ model, system: SYSTEM })
  const { copy, copied } = useClipboard()

  async function handleFile(f: File | null) {
    setFile(f); setPdfText(''); setExtractErr(''); reset()
    if (!f) return
    setExtracting(true)
    try {
      const { text } = await extractPdfText(f)
      setPdfText(text)
    } catch (e) { setExtractErr(e instanceof Error ? e.message : 'Failed') }
    finally { setExtracting(false) }
  }

  function handleRun() {
    run(`Create a TL;DR for this document in 2-4 sentences maximum. Use bold for the most critical insight. Start with the most important takeaway.\n\nDocument:\n${pdfText.slice(0, 10000)}`)
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <PdfDropzone file={file} onFile={handleFile} label="Drop a PDF for an instant TL;DR" />

      {extracting && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Reading PDF…</div>}
      {extractErr && <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">{extractErr}</div>}

      {pdfText && (
        <div className="rounded-xl border p-4 space-y-3">
          <div className="max-w-xs">
            <Label className="text-xs mb-1.5 block">Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>{MODELS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      )}

      {pdfText && (
        <div className="flex gap-2">
          <Button onClick={handleRun} disabled={loading} className="gap-2">
            <Zap className="h-4 w-4" />{loading ? 'Generating TL;DR…' : 'Generate TL;DR'}
          </Button>
          {loading && <Button variant="outline" onClick={stop} className="gap-1.5"><Square className="h-3.5 w-3.5" />Stop</Button>}
          {(output || error) && !loading && <Button variant="ghost" size="icon" onClick={reset}><RotateCcw className="h-4 w-4" /></Button>}
        </div>
      )}

      {error && <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

      {(output || loading) && (
        <div className="rounded-xl border bg-muted/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline" className="text-xs gap-1"><Sparkles className="h-3 w-3" />{model}</Badge>
            {output && (
              <Button size="sm" variant="ghost" onClick={() => copy(output)} className="h-7 gap-1.5 text-xs">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copied ? 'Copied' : 'Copy'}
              </Button>
            )}
          </div>
          <div className="min-h-[40px]">
            <MarkdownOutput content={output} />
            {loading && <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse rounded-sm" />}
          </div>
        </div>
      )}
    </div>
  )
}
