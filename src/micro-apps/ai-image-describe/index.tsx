'use client'

import { useState, useRef } from 'react'
import { useOllama } from '@/hooks/useOllama'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useClipboard } from '@/hooks/useClipboard'
import { ImageIcon, Square, Copy, Check, RotateCcw, Upload, X } from 'lucide-react'
import { MarkdownOutput } from '@/components/markdown-output'

const VISION_MODELS = ['llava:latest']

const PROMPTS = [
  { value: 'describe',  label: 'General Description',     text: 'Describe this image in detail.' },
  { value: 'technical', label: 'Technical Analysis',       text: 'Analyze this image technically. Describe the components, layout, colors, and technical aspects.' },
  { value: 'ui2code',   label: 'UI Screenshot → Code Hints', text: 'This is a UI screenshot. Describe the UI components, layout structure, and suggest how to implement it with HTML/CSS/React. Be specific about component names and layout approach.' },
  { value: 'alttext',   label: 'Generate Alt Text',        text: 'Generate a concise, accessible alt text for this image suitable for screen readers.' },
  { value: 'diagram',   label: 'Explain Diagram',          text: 'Explain what this diagram or chart shows. Describe what it represents, key elements, and any patterns or insights visible.' },
]

export default function AiImageDescribe() {
  const [image, setImage] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [promptType, setPromptType] = useState('describe')
  const model = 'llava:latest'
  const { output, loading, error, run, stop, reset } = useOllama({ model })
  const { copy, copied } = useClipboard()
  const fileRef = useRef<HTMLInputElement>(null)

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const result = ev.target?.result as string
      setPreview(result)
      // Strip data URL prefix — Ollama expects raw base64
      setImage(result.split(',')[1])
    }
    reader.readAsDataURL(file)
  }

  function clearImage() {
    setImage(null)
    setPreview(null)
    reset()
    if (fileRef.current) fileRef.current.value = ''
  }

  function handleRun() {
    if (!image) return
    const prompt = PROMPTS.find(p => p.value === promptType)!.text
    run(prompt, [image])
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">

      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-40">
          <Label className="text-xs mb-1.5 block">Model (Vision)</Label>
          <Select value={model} disabled>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              {VISION_MODELS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 min-w-40">
          <Label className="text-xs mb-1.5 block">Analysis Type</Label>
          <Select value={promptType} onValueChange={setPromptType}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PROMPTS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Drop zone */}
      {!preview ? (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full border-2 border-dashed rounded-xl p-10 flex flex-col items-center gap-3 text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
        >
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
            <Upload className="h-6 w-6" />
          </div>
          <div className="text-center">
            <p className="font-medium text-sm">Click to upload image</p>
            <p className="text-xs mt-1">PNG, JPG, GIF, WebP supported</p>
          </div>
        </button>
      ) : (
        <div className="relative rounded-xl overflow-hidden border">
          <img src={preview} alt="Uploaded" className="w-full max-h-72 object-contain bg-checkerboard" />
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/90 border flex items-center justify-center hover:bg-destructive hover:text-white hover:border-destructive transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />

      <div className="flex gap-2">
        <Button onClick={handleRun} disabled={loading || !image} className="gap-2">
          <ImageIcon className="h-4 w-4" />
          {loading ? 'Analyzing…' : 'Analyze Image'}
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

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
      )}

      {(output || loading) && (
        <div className="rounded-xl border bg-muted/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{PROMPTS.find(p => p.value === promptType)?.label}</span>
              <Badge variant="outline" className="text-xs">llava</Badge>
            </div>
            {output && (
              <Button size="sm" variant="ghost" onClick={() => copy(output)} className="h-7 gap-1.5 text-xs">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
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
