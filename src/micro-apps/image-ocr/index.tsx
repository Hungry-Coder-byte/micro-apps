'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useClipboard } from '@/hooks/useClipboard'
import { Copy, Check, Upload, ScanText } from 'lucide-react'

export default function ImageOcr() {
  const [image, setImage] = useState<string | null>(null)
  const [imageName, setImageName] = useState('')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const { copy, copied } = useClipboard()

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageName(file.name)
    setText('')
    setError('')
    const reader = new FileReader()
    reader.onload = evt => setImage(evt.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function extractText() {
    if (!image) return
    setLoading(true)
    setError('')
    setProgress(0)
    try {
      const Tesseract = await import('tesseract.js')
      const result = await Tesseract.recognize(image, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100))
          }
        },
      })
      setText(result.data.text)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
      setProgress(100)
    }
  }

  return (
    <div className="space-y-4">
      <div
        className="rounded-lg border-2 border-dashed p-8 text-center cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => fileRef.current?.click()}
      >
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Click to upload an image</p>
        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, BMP, TIFF supported</p>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>

      {image && (
        <div className="space-y-4">
          <div className="rounded-md border bg-muted/30 p-4 flex justify-center">
            <img src={image} alt={imageName} className="max-h-64 max-w-full object-contain rounded" />
          </div>

          <Button onClick={extractText} disabled={loading} className="gap-2">
            <ScanText className="h-4 w-4" />
            {loading ? `Extracting... ${progress}%` : 'Extract Text (OCR)'}
          </Button>

          {loading && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Processing image...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}

      {text && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Extracted Text ({text.trim().split(/\s+/).length} words)</label>
            <Button size="sm" variant="ghost" onClick={() => copy(text)} className="gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              Copy
            </Button>
          </div>
          <pre className="rounded-md border bg-muted p-4 text-sm whitespace-pre-wrap min-h-[200px] font-mono overflow-auto">
            {text}
          </pre>
        </div>
      )}
    </div>
  )
}
