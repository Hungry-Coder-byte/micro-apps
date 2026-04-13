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
import {
  UserCheck, Sparkles, Square, Copy, Check,
  RotateCcw, Loader2, FileText, Download,
  User, Mail, Phone, MapPin, Link, Briefcase,
  GraduationCap, Wrench, Award, Globe,
} from 'lucide-react'
import { MarkdownOutput } from '@/components/markdown-output'

const MODELS = ['gemma3:latest', 'mistral:latest', 'llama3:latest']

type Format = 'json' | 'yaml' | 'markdown'

const ALL_FIELDS = [
  { id: 'name',            label: 'Full Name',                     icon: User },
  { id: 'email',           label: 'Email',                         icon: Mail },
  { id: 'phone',           label: 'Phone',                         icon: Phone },
  { id: 'location',        label: 'Location',                      icon: MapPin },
  { id: 'linkedin',        label: 'LinkedIn / Portfolio URL',       icon: Link },
  { id: 'summary',         label: 'Professional Summary',          icon: FileText },
  { id: 'experience',      label: 'Work Experience',               icon: Briefcase },
  { id: 'education',       label: 'Education',                     icon: GraduationCap },
  { id: 'skills',          label: 'Skills',                        icon: Wrench },
  { id: 'certifications',  label: 'Certifications',                icon: Award },
  { id: 'languages',       label: 'Languages',                     icon: Globe },
]

function buildSystem(fields: string[], format: Format): string {
  const fieldList = fields.join(', ')

  if (format === 'json') return `You are a resume parser. Extract information from the resume text the user provides.
Output ONLY a raw JSON object — no markdown fences, no explanation.
Extract these fields: ${fieldList}.
JSON shape:
{
  "name": "string or null",
  "email": "string or null",
  "phone": "string or null",
  "location": "string or null",
  "linkedin": "string or null",
  "summary": "string or null",
  "experience": [{"title":"","company":"","dates":"","description":""}],
  "education": [{"degree":"","institution":"","dates":"","gpa":""}],
  "skills": ["skill1","skill2"],
  "certifications": ["cert1"],
  "languages": ["lang1"]
}
Omit fields that were not requested. Use null for fields that are not found. Return ONLY the JSON.`

  if (format === 'yaml') return `You are a resume parser. Extract information from the resume text the user provides.
Output ONLY raw YAML — no markdown fences, no explanation.
Extract these fields: ${fieldList}.
Use nested structure for experience (title, company, dates, description) and education (degree, institution, dates).
Use null for fields that are not found. Return ONLY the YAML.`

  return `You are a resume parser. Extract information from the resume text the user provides.
Output ONLY a clean, readable Markdown document — no explanation outside the document.
Extract these fields: ${fieldList}.
Format as a structured Markdown document with headings for each section.
Use tables for experience and education entries. Use bullet lists for skills.`
}

function downloadText(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// ── JSON structured preview ────────────────────────────────────────────────────
interface ResumeData {
  name?: string | null
  email?: string | null
  phone?: string | null
  location?: string | null
  linkedin?: string | null
  summary?: string | null
  experience?: Array<{ title?: string; company?: string; dates?: string; description?: string }>
  education?: Array<{ degree?: string; institution?: string; dates?: string; gpa?: string }>
  skills?: string[]
  certifications?: string[]
  languages?: string[]
}

function ResumeCard({ data }: { data: ResumeData }) {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    name: User, email: Mail, phone: Phone, location: MapPin, linkedin: Link,
  }

  return (
    <div className="space-y-5">
      {/* Contact info */}
      <div className="rounded-xl border p-4 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Contact</p>
        {(['name','email','phone','location','linkedin'] as const).map(k => {
          const val = data[k]
          if (!val) return null
          const Icon = icons[k]
          return (
            <div key={k} className="flex items-center gap-2 text-sm">
              <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              {k === 'linkedin' || k === 'email'
                ? <a href={k === 'email' ? `mailto:${val}` : val} target="_blank" rel="noopener noreferrer"
                    className="text-primary hover:underline truncate">{val}</a>
                : <span>{val}</span>}
            </div>
          )
        })}
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="rounded-xl border p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Summary</p>
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="rounded-xl border p-4 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Work Experience</p>
          {data.experience.map((exp, i) => (
            <div key={i} className="pl-3 border-l-2 border-primary/30 space-y-0.5">
              <p className="text-sm font-semibold">{exp.title}</p>
              <p className="text-sm text-muted-foreground">{exp.company}</p>
              {exp.dates && <p className="text-xs text-muted-foreground">{exp.dates}</p>}
              {exp.description && <p className="text-xs mt-1 leading-relaxed">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="rounded-xl border p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Education</p>
          {data.education.map((edu, i) => (
            <div key={i} className="pl-3 border-l-2 border-blue-400/40 space-y-0.5">
              <p className="text-sm font-semibold">{edu.degree}</p>
              <p className="text-sm text-muted-foreground">{edu.institution}</p>
              <div className="flex gap-3 text-xs text-muted-foreground">
                {edu.dates && <span>{edu.dates}</span>}
                {edu.gpa && <span>GPA: {edu.gpa}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div className="rounded-xl border p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((s, i) => (
              <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Certs + Languages */}
      {((data.certifications && data.certifications.length > 0) ||
        (data.languages && data.languages.length > 0)) && (
        <div className="grid grid-cols-2 gap-4">
          {data.certifications && data.certifications.length > 0 && (
            <div className="rounded-xl border p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Certifications</p>
              <ul className="space-y-1">
                {data.certifications.map((c, i) => <li key={i} className="text-xs">• {c}</li>)}
              </ul>
            </div>
          )}
          {data.languages && data.languages.length > 0 && (
            <div className="rounded-xl border p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Languages</p>
              <div className="flex flex-wrap gap-1.5">
                {data.languages.map((l, i) => <Badge key={i} variant="outline" className="text-xs">{l}</Badge>)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function AiPdfResumeParser() {
  const [file, setFile]             = useState<File | null>(null)
  const [pdfText, setPdfText]       = useState('')
  const [pageCount, setPageCount]   = useState(0)
  const [extracting, setExtracting] = useState(false)
  const [extractErr, setExtractErr] = useState('')
  const [model, setModel]           = useState(MODELS[0])
  const [format, setFormat]         = useState<Format>('json')
  const [selectedFields, setSelectedFields] = useState<Set<string>>(
    new Set(ALL_FIELDS.map(f => f.id))
  )
  const [tab, setTab] = useState<'preview' | 'raw'>('preview')

  const system = useMemo(
    () => buildSystem([...selectedFields], format),
    [selectedFields, format]
  )

  const { output, loading, error, run, stop, reset } = useOllama({ model, system })
  const { copy, copied } = useClipboard()

  function toggleField(id: string) {
    setSelectedFields(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

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

  function handleParse() {
    if (!pdfText || selectedFields.size === 0) return
    run(`Parse this resume and extract the requested fields:\n\n${pdfText.slice(0, 12000)}`)
    setTab('preview')
  }

  // Try to parse JSON output for the structured preview
  const parsedResume = useMemo<ResumeData | null>(() => {
    if (!output || format !== 'json') return null
    try {
      const match = output.match(/\{[\s\S]*\}/)
      if (!match) return null
      return JSON.parse(match[0]) as ResumeData
    } catch { return null }
  }, [output, format])

  const ext = format === 'json' ? 'json' : format === 'yaml' ? 'yaml' : 'md'
  const mime = format === 'json' ? 'application/json' : format === 'yaml' ? 'text/yaml' : 'text/markdown'
  const filename = `${file?.name.replace(/\.pdf$/i, '') ?? 'resume'}-parsed.${ext}`

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <PdfDropzone file={file} onFile={handleFile} label="Drop a resume PDF to parse" />

      {extracting && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Reading PDF…
        </div>
      )}
      {extractErr && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">{extractErr}</div>
      )}

      {pdfText && (
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary"><FileText className="h-3 w-3 mr-1" />{pageCount} pages</Badge>
          <Badge variant="outline">{pdfText.length.toLocaleString()} chars extracted</Badge>
          {pdfText.length > 12000 && (
            <Badge variant="outline" className="text-amber-600 border-amber-400/40">First 12k chars sent to AI</Badge>
          )}
        </div>
      )}

      {pdfText && (
        <div className="rounded-xl border p-4 space-y-4">
          {/* Fields to extract */}
          <div>
            <p className="text-xs font-medium mb-2">Fields to extract</p>
            <div className="grid grid-cols-2 gap-2">
              {ALL_FIELDS.map(({ id, label, icon: Icon }) => (
                <label key={id} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedFields.has(id)}
                    onChange={() => toggleField(id)}
                    className="rounded accent-primary"
                  />
                  <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => setSelectedFields(new Set(ALL_FIELDS.map(f => f.id)))}
                className="text-xs text-primary hover:underline">Select all</button>
              <span className="text-muted-foreground">·</span>
              <button onClick={() => setSelectedFields(new Set())}
                className="text-xs text-muted-foreground hover:underline">Clear</button>
            </div>
          </div>

          {/* Format + Model */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs mb-1.5 block">Output format</Label>
              <Select value={format} onValueChange={v => { setFormat(v as Format); reset() }}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">Structured JSON</SelectItem>
                  <SelectItem value="yaml">YAML</SelectItem>
                  <SelectItem value="markdown">Readable Markdown</SelectItem>
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
            Works best on text-based PDFs. Multi-column or scanned resumes may have reduced accuracy.
          </p>
        </div>
      )}

      {pdfText && (
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleParse} disabled={loading || selectedFields.size === 0} className="gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
            {loading ? 'Parsing…' : 'Parse Resume'}
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

      {selectedFields.size === 0 && pdfText && (
        <p className="text-xs text-destructive">Select at least one field to extract.</p>
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
              <Badge variant="secondary" className="text-xs capitalize">{format} output</Badge>
            </div>
            <div className="flex gap-1.5">
              {output && (
                <>
                  <Button size="sm" variant="ghost" onClick={() => copy(output)} className="h-7 gap-1.5 text-xs">
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                  <Button size="sm" variant="ghost"
                    onClick={() => downloadText(output, filename, mime)}
                    className="h-7 gap-1.5 text-xs">
                    <Download className="h-3.5 w-3.5" /> Download
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Preview / Raw tabs (JSON only shows preview card) */}
          {output && (
            <div className="flex gap-1">
              {(['preview', 'raw'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`text-xs px-3 py-1 rounded-md transition-colors capitalize ${tab === t ? 'bg-background border shadow-sm' : 'text-muted-foreground hover:bg-muted/50'}`}>
                  {t === 'preview' ? (format === 'json' ? 'Preview Card' : 'Preview') : 'Raw'}
                </button>
              ))}
            </div>
          )}

          <div className="min-h-[80px]">
            {tab === 'preview' && parsedResume
              ? <ResumeCard data={parsedResume} />
              : tab === 'preview' && format === 'markdown'
                ? <MarkdownOutput content={output} />
                : <pre className="text-xs font-mono whitespace-pre-wrap break-all">{output}</pre>
            }
            {loading && <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse rounded-sm" />}
          </div>
        </div>
      )}
    </div>
  )
}
