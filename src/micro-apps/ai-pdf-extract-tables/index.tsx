'use client'

import { useState, useMemo } from 'react'
import { PdfDropzone } from '@/components/pdf-dropzone'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { extractPdfText } from '@/lib/pdf-client'
import { useOllama } from '@/hooks/useOllama'
import { useClipboard } from '@/hooks/useClipboard'
import { Table, Sparkles, Square, Copy, Check, RotateCcw, Loader2, FileText, Download } from 'lucide-react'

const MODELS = ['gemma3:latest', 'mistral:latest', 'llama3:latest']

type Format = 'json' | 'csv' | 'markdown'

const FORMAT_META: Record<Format, { label: string; ext: string; mime: string; system: string }> = {
  json: {
    label: 'JSON',
    ext: 'json',
    mime: 'application/json',
    system: `You are a data extraction assistant. Extract ALL tables from the document text the user provides.
Output ONLY a raw JSON array. Each element represents one table with this shape:
{ "title": "table title or empty string", "headers": ["col1","col2",...], "rows": [["val","val",...], ...] }
Rules:
- Return ONLY the JSON array, no explanation, no markdown fences
- If no tables are found return []
- Preserve all numeric values exactly as they appear`,
  },
  csv: {
    label: 'CSV',
    ext: 'csv',
    mime: 'text/csv',
    system: `You are a data extraction assistant. Extract ALL tables from the document text the user provides.
Output ONLY raw CSV. Separate multiple tables with a blank line and a comment line like: # Table: <title>
Rules:
- Output ONLY CSV, no explanation, no markdown fences
- Use commas as delimiter, quote fields that contain commas or newlines
- If no tables are found output: # No tables found`,
  },
  markdown: {
    label: 'Markdown',
    ext: 'md',
    mime: 'text/markdown',
    system: `You are a data extraction assistant. Extract ALL tables from the document text the user provides.
Output ONLY GitHub-flavoured Markdown tables.
Rules:
- Output ONLY Markdown table syntax, add a heading (## Table N) before each table
- If no tables are found output: _No tables found in this document._`,
  },
}

function downloadText(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Render a quick preview of the extracted tables */
function TablePreview({ output, format }: { output: string; format: Format }) {
  if (format === 'json') {
    try {
      const arr = JSON.parse(output.trim()) as Array<{ title: string; headers: string[]; rows: string[][] }>
      if (!Array.isArray(arr) || arr.length === 0) return <p className="text-sm text-muted-foreground italic">No tables detected in this document.</p>
      return (
        <div className="space-y-6">
          {arr.map((tbl, i) => (
            <div key={i} className="overflow-x-auto rounded-lg border">
              {tbl.title && <div className="px-3 py-2 bg-muted/40 border-b text-xs font-medium">{tbl.title}</div>}
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-muted/20">
                    {tbl.headers.map((h, j) => <th key={j} className="px-3 py-2 text-left font-medium whitespace-nowrap">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {tbl.rows.map((row, j) => (
                    <tr key={j} className="border-b last:border-0 hover:bg-muted/10">
                      {row.map((cell, k) => <td key={k} className="px-3 py-1.5 whitespace-nowrap">{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )
    } catch {
      // JSON not yet complete — show raw while streaming
      return <pre className="text-xs font-mono whitespace-pre-wrap break-all">{output}</pre>
    }
  }

  if (format === 'markdown') {
    // Simple markdown table renderer without extra deps
    const lines = output.split('\n')
    const blocks: JSX.Element[] = []
    let i = 0
    while (i < lines.length) {
      const line = lines[i]
      if (line.startsWith('## ') || line.startsWith('# ')) {
        blocks.push(<p key={i} className="text-xs font-semibold mt-3 mb-1">{line.replace(/^#+\s*/, '')}</p>)
        i++
        continue
      }
      if (line.startsWith('|')) {
        const tableLines: string[] = []
        while (i < lines.length && lines[i].startsWith('|')) { tableLines.push(lines[i]); i++ }
        if (tableLines.length < 2) continue
        const parseRow = (r: string) => r.split('|').slice(1, -1).map(c => c.trim())
        const headers = parseRow(tableLines[0])
        const rows = tableLines.slice(2).map(parseRow)
        blocks.push(
          <div key={i} className="overflow-x-auto rounded-lg border mb-3">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-muted/20">
                  {headers.map((h, j) => <th key={j} className="px-3 py-2 text-left font-medium whitespace-nowrap">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, j) => (
                  <tr key={j} className="border-b last:border-0 hover:bg-muted/10">
                    {row.map((cell, k) => <td key={k} className="px-3 py-1.5 whitespace-nowrap">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        continue
      }
      if (line.startsWith('_') || line.trim()) {
        blocks.push(<p key={i} className="text-xs text-muted-foreground italic">{line.replace(/^_|_$/g, '')}</p>)
      }
      i++
    }
    return <div>{blocks}</div>
  }

  // CSV: show as plain text
  return <pre className="text-xs font-mono whitespace-pre-wrap break-all">{output}</pre>
}

export default function AiPdfExtractTables() {
  const [file, setFile]           = useState<File | null>(null)
  const [pdfText, setPdfText]     = useState('')
  const [pageCount, setPageCount] = useState(0)
  const [extracting, setExtracting] = useState(false)
  const [extractErr, setExtractErr] = useState('')
  const [model, setModel]         = useState(MODELS[0])
  const [format, setFormat]       = useState<Format>('json')
  const [tab, setTab]             = useState<'preview' | 'raw'>('preview')

  const meta = FORMAT_META[format]
  const { output, loading, error, run, stop, reset } = useOllama({ model, system: meta.system })
  const { copy, copied } = useClipboard()

  async function handleFile(f: File | null) {
    setFile(f); setPdfText(''); setPageCount(0); setExtractErr(''); reset()
    if (!f) return
    setExtracting(true)
    try {
      const res = await extractPdfText(f)
      setPdfText(res.text)
      setPageCount(res.pages)
    } catch (e) {
      setExtractErr(e instanceof Error ? e.message : 'Failed to read PDF')
    } finally {
      setExtracting(false)
    }
  }

  function handleExtract() {
    if (!pdfText) return
    // Truncate to ~10k chars (~2500 tokens) — enough for most table-dense pages
    const truncated = pdfText.slice(0, 10000)
    run(`Extract all tables from this document text:\n\n${truncated}`)
    setTab('preview')
  }

  const filename = useMemo(() => {
    const base = file?.name.replace(/\.pdf$/i, '') ?? 'tables'
    return `${base}-tables.${meta.ext}`
  }, [file, meta.ext])

  const tableCount = useMemo(() => {
    if (!output || format !== 'json') return null
    try { const a = JSON.parse(output.trim()); return Array.isArray(a) ? a.length : null }
    catch { return null }
  }, [output, format])

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <PdfDropzone file={file} onFile={handleFile} label="Drop a PDF containing tables" />

      {extracting && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Extracting text from PDF…
        </div>
      )}
      {extractErr && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">{extractErr}</div>
      )}

      {pdfText && (
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary"><FileText className="h-3 w-3 mr-1" />{pageCount} pages</Badge>
          <Badge variant="outline">{pdfText.length.toLocaleString()} chars</Badge>
          {pdfText.length > 10000 && (
            <Badge variant="outline" className="text-amber-600 border-amber-400/40">First 10k chars sent to AI</Badge>
          )}
        </div>
      )}

      {pdfText && (
        <div className="rounded-xl border p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs mb-1.5 block">Output format</Label>
              <Select value={format} onValueChange={v => { setFormat(v as Format); reset() }}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">Structured JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="markdown">Markdown table</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Model</Label>
              <Select value={model} onValueChange={v => { setModel(v); reset() }}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>{MODELS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            AI identifies table-like structures in the extracted text and converts them to {meta.label}.
            Results depend on how clearly the PDF text encodes the table layout.
          </p>
        </div>
      )}

      {pdfText && (
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleExtract} disabled={loading} className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Table className="h-4 w-4" />}
            {loading ? 'Extracting…' : 'Extract Tables with AI'}
          </Button>
          {loading && (
            <Button variant="outline" onClick={stop} className="gap-1.5">
              <Square className="h-3.5 w-3.5" /> Stop
            </Button>
          )}
          {(output || error) && !loading && (
            <Button variant="ghost" size="icon" onClick={reset}><RotateCcw className="h-4 w-4" /></Button>
          )}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
      )}

      {(output || loading) && (
        <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="gap-1 text-xs"><Sparkles className="h-3 w-3" />{model}</Badge>
              <Badge variant="secondary" className="text-xs">{meta.label} output</Badge>
              {tableCount !== null && (
                <Badge variant="outline" className="text-xs text-green-600 border-green-500/40">
                  {tableCount} table{tableCount !== 1 ? 's' : ''} found
                </Badge>
              )}
            </div>
            <div className="flex gap-1.5">
              {output && (
                <>
                  <Button size="sm" variant="ghost" onClick={() => copy(output)} className="h-7 gap-1.5 text-xs">
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                  <Button size="sm" variant="ghost"
                    onClick={() => downloadText(output, filename, meta.mime)}
                    className="h-7 gap-1.5 text-xs">
                    <Download className="h-3.5 w-3.5" /> Download
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Preview / Raw tabs */}
          {output && format !== 'csv' && (
            <div className="flex gap-1">
              {(['preview', 'raw'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`text-xs px-3 py-1 rounded-md transition-colors capitalize ${tab === t ? 'bg-background border shadow-sm' : 'text-muted-foreground hover:bg-muted/50'}`}>
                  {t}
                </button>
              ))}
            </div>
          )}

          <div className="min-h-[80px]">
            {tab === 'preview' && output && format !== 'csv'
              ? <TablePreview output={output} format={format} />
              : <pre className="text-xs font-mono whitespace-pre-wrap break-all">{output}</pre>
            }
            {loading && <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse rounded-sm" />}
          </div>
        </div>
      )}
    </div>
  )
}
