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
import { Layers, Square, Copy, Check, RotateCcw, Loader2, Sparkles } from 'lucide-react'

const MODELS = ['gemma3:latest', 'mistral:latest', 'llama3:latest']
const SYSTEM = 'You are an expert document analyst. When given a document, identify its major sections and provide a clear, structured section-by-section summary.'

export default function AiPdfSectionSummary() {
  const [file, setFile] = useState<File | null>(null)
  const [pdfText, setPdfText] = useState('')
  const [pages, setPages] = useState(0)
  const [extracting, setExtracting] = useState(false)
  const [extractErr, setExtractErr] = useState('')
  const [model, setModel] = useState(MODELS[0])
  const [detail, setDetail] = useState('medium')
  const { output, loading, error, run, stop, reset } = useOllama({ model, system: SYSTEM })
  const { copy, copied } = useClipboard()

  async function handleFile(f: File | null) {
    setFile(f); setPdfText(''); setPages(0); setExtractErr(''); reset()
    if (!f) return
    setExtracting(true)
    try {
      const res = await extractPdfText(f)
      setPdfText(res.text); setPages(res.pages)
    } catch (e) { setExtractErr(e instanceof Error ? e.message : 'Failed') }
    finally { setExtracting(false) }
  }

  function handleRun() {
    const detailMap: Record<string, string> = {
      brief: '1-2 sentences per section',
      medium: '3-5 sentences per section',
      detailed: 'a full paragraph per section',
    }
    run(`Identify the major sections of this document and provide ${detailMap[detail]} summary for each. Use markdown headers for section names. Then add a "Overall Summary" at the end.\n\nDocument:\n${pdfText.slice(0, 14000)}`)
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <PdfDropzone file={file} onFile={handleFile} label="Drop a PDF for section-by-section analysis" />

      {extracting && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Reading PDF…</div>}
      {extractErr && <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">{extractErr}</div>}

      {pdfText && (
        <div className="rounded-xl border p-4 space-y-3">
          <Badge variant="secondary">{pages} pages · {pdfText.length.toLocaleString()} chars</Badge>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs mb-1.5 block">Detail level</Label>
              <Select value={detail} onValueChange={setDetail}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="brief">Brief (1-2 sentences)</SelectItem>
                  <SelectItem value="medium">Medium (3-5 sentences)</SelectItem>
                  <SelectItem value="detailed">Detailed (full paragraph)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{MODELS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {pdfText && (
        <div className="flex gap-2">
          <Button onClick={handleRun} disabled={loading} className="gap-2">
            <Layers className="h-4 w-4" />{loading ? 'Analyzing sections…' : 'Summarize by Section'}
          </Button>
          {loading && <Button variant="outline" onClick={stop} className="gap-1.5"><Square className="h-3.5 w-3.5" />Stop</Button>}
          {(output || error) && !loading && <Button variant="ghost" size="icon" onClick={reset}><RotateCcw className="h-4 w-4" /></Button>}
        </div>
      )}

      {error && <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

      {(output || loading) && (
        <div className="rounded-xl border bg-muted/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs gap-1"><Sparkles className="h-3 w-3" />{model}</Badge>
              <Badge variant="secondary" className="text-xs">Section Summary</Badge>
            </div>
            {output && (
              <Button size="sm" variant="ghost" onClick={() => copy(output)} className="h-7 gap-1.5 text-xs">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copied ? 'Copied' : 'Copy'}
              </Button>
            )}
          </div>
          <div className="min-h-[60px]">
            <MarkdownOutput content={output} />
            {loading && <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse rounded-sm" />}
          </div>
        </div>
      )}
    </div>
  )
}
