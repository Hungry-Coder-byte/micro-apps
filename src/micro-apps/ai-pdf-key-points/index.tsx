'use client'

import { useState } from 'react'
import { PdfDropzone } from '@/components/pdf-dropzone'
import { MarkdownOutput } from '@/components/markdown-output'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { extractPdfText } from '@/lib/pdf-client'
import { useOllama } from '@/hooks/useOllama'
import { useClipboard } from '@/hooks/useClipboard'
import { ListChecks, Square, Copy, Check, RotateCcw, Loader2, FileText, Sparkles } from 'lucide-react'

const MODELS = ['gemma3:latest', 'mistral:latest', 'mistral-small3.1', 'llama3:latest']
const EXTRACT_TYPES = [
  { id: 'key-points', label: 'Key Points', prompt: 'Extract the most important key points from this document as a numbered list' },
  { id: 'action-items', label: 'Action Items', prompt: 'Extract all action items, tasks, or to-dos mentioned in this document' },
  { id: 'dates', label: 'Key Dates & Deadlines', prompt: 'Extract all dates, deadlines, and time-sensitive information from this document' },
  { id: 'entities', label: 'People & Organizations', prompt: 'Extract all people names, company names, and organizations mentioned in this document' },
  { id: 'questions', label: 'Questions Raised', prompt: 'List all questions that this document raises or leaves unanswered' },
]

export default function AiPdfKeyPoints() {
  const [file, setFile] = useState<File | null>(null)
  const [pdfText, setPdfText] = useState('')
  const [pageCount, setPageCount] = useState(0)
  const [extracting, setExtracting] = useState(false)
  const [extractErr, setExtractErr] = useState('')
  const [model, setModel] = useState(MODELS[0])
  const [extractType, setExtractType] = useState(EXTRACT_TYPES[0])
  const [maxPoints, setMaxPoints] = useState('10')
  const { output, loading, error, run, stop, reset } = useOllama({ model })
  const { copy, copied } = useClipboard()

  async function handleFile(f: File | null) {
    setFile(f); setPdfText(''); setPageCount(0); setExtractErr(''); reset()
    if (!f) return
    setExtracting(true)
    try {
      const res = await extractPdfText(f)
      setPdfText(res.text); setPageCount(res.pages)
    } catch (e) {
      setExtractErr(e instanceof Error ? e.message : 'Failed to read PDF')
    } finally {
      setExtracting(false)
    }
  }

  function handleExtract() {
    if (!pdfText) return
    const pts = parseInt(maxPoints) || 10
    const truncated = pdfText.slice(0, 12000)
    run(`${extractType.prompt}. Limit to ${pts} items maximum. Format clearly with numbers or bullets.\n\nDocument:\n${truncated}`)
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <PdfDropzone file={file} onFile={handleFile} label="Drop a PDF to extract key information" />

      {extracting && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Reading PDF…
        </div>
      )}
      {extractErr && <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">{extractErr}</div>}

      {pdfText && (
        <>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary"><FileText className="h-3 w-3 mr-1" />{pageCount} pages</Badge>
            <Badge variant="outline">{pdfText.length.toLocaleString()} chars</Badge>
          </div>

          <div className="rounded-xl border p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs mb-1.5 block">Extraction type</Label>
                <Select value={extractType.id} onValueChange={id => setExtractType(EXTRACT_TYPES.find(t => t.id === id) ?? EXTRACT_TYPES[0])}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>{EXTRACT_TYPES.map(t => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}</SelectContent>
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
            <div className="max-w-[140px]">
              <Label className="text-xs mb-1.5 block">Max items</Label>
              <Input type="number" min={3} max={30} value={maxPoints} onChange={e => setMaxPoints(e.target.value)} className="h-9" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleExtract} disabled={loading} className="gap-2">
              {loading ? <><Sparkles className="h-4 w-4" />Extracting…</> : <><ListChecks className="h-4 w-4" />Extract {extractType.label}</>}
            </Button>
            {loading && <Button variant="outline" onClick={stop} className="gap-1.5"><Square className="h-3.5 w-3.5" />Stop</Button>}
            {(output || error) && !loading && <Button variant="ghost" size="icon" onClick={reset}><RotateCcw className="h-4 w-4" /></Button>}
          </div>
        </>
      )}

      {error && <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

      {(output || loading) && (
        <div className="rounded-xl border bg-muted/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs gap-1"><Sparkles className="h-3 w-3" />{model}</Badge>
              <Badge variant="secondary" className="text-xs">{extractType.label}</Badge>
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
