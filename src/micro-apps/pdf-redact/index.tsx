'use client'

import { useState } from 'react'
import { PdfDropzone } from '@/components/pdf-dropzone'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { EyeOff, Plus, X, Construction } from 'lucide-react'

export default function PdfRedact() {
  const [file, setFile] = useState<File | null>(null)
  const [terms, setTerms] = useState<string[]>([''])

  function addTerm() { setTerms(prev => [...prev, '']) }
  function updateTerm(i: number, v: string) { setTerms(prev => prev.map((t, j) => j === i ? v : t)) }
  function removeTerm(i: number) { setTerms(prev => prev.filter((_, j) => j !== i)) }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <PdfDropzone file={file} onFile={setFile} label="Drop a PDF to redact sensitive content" />

      <div className="rounded-xl border p-5 space-y-4">
        <h3 className="text-sm font-medium">Redaction Rules</h3>

        <div className="space-y-2">
          <Label className="text-xs block">Text patterns to blackout</Label>
          {terms.map((t, i) => (
            <div key={i} className="flex gap-2">
              <Input value={t} onChange={e => updateTerm(i, e.target.value)} placeholder="e.g. John Doe, SSN, 555-****" className="h-9" />
              {terms.length > 1 && (
                <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => removeTerm(i)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addTerm} className="gap-1.5 text-xs h-8">
            <Plus className="h-3.5 w-3.5" /> Add pattern
          </Button>
        </div>

        <div className="space-y-2 text-sm">
          <Label className="text-xs block">Auto-detect and redact</Label>
          <div className="grid grid-cols-2 gap-2">
            {['Email addresses', 'Phone numbers', 'Credit card numbers', 'Social Security Numbers', 'IP addresses', 'Dates'].map(opt => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-muted-foreground text-xs">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground">
          Redacted areas will be permanently replaced with black rectangles. This cannot be undone.
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <EyeOff className="h-4 w-4" /> Apply Redactions
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
