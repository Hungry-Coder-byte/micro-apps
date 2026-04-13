'use client'

import { useState, useRef } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useClipboard } from '@/hooks/useClipboard'
import { Copy, Check, Upload } from 'lucide-react'

export default function Base64Image() {
  const [imageBase64, setImageBase64] = useState('')
  const [imageName, setImageName] = useState('')
  const [imageMime, setImageMime] = useState('')
  const [decodeInput, setDecodeInput] = useState('')
  const [decodeError, setDecodeError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const { copy, copied } = useClipboard()

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageName(file.name)
    setImageMime(file.type)
    const reader = new FileReader()
    reader.onload = evt => {
      const result = evt.target?.result as string
      setImageBase64(result)
    }
    reader.readAsDataURL(file)
  }

  function getDataUrl() {
    if (!decodeInput.trim()) return ''
    const s = decodeInput.trim()
    if (s.startsWith('data:')) return s
    return `data:image/png;base64,${s}`
  }

  function validateDecode() {
    setDecodeError('')
    const url = getDataUrl()
    if (!url) return
    const img = new Image()
    img.onerror = () => setDecodeError('Invalid Base64 image data')
    img.src = url
  }

  return (
    <Tabs defaultValue="img2b64">
      <TabsList>
        <TabsTrigger value="img2b64">Image → Base64</TabsTrigger>
        <TabsTrigger value="b642img">Base64 → Image</TabsTrigger>
      </TabsList>

      <TabsContent value="img2b64" className="space-y-4 mt-4">
        <div
          className="rounded-lg border-2 border-dashed p-8 text-center cursor-pointer hover:bg-muted/30 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
          <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF, WebP, SVG</p>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>

        {imageBase64 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{imageName} ({imageMime})</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => copy(imageBase64.split(',')[1] || imageBase64)}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  Copy Base64
                </Button>
                <Button size="sm" variant="outline" onClick={() => copy(imageBase64)}>
                  Copy Data URL
                </Button>
              </div>
            </div>
            <div className="flex justify-center rounded-md border bg-muted/30 p-4">
              <img src={imageBase64} alt={imageName} className="max-h-64 max-w-full object-contain rounded" />
            </div>
            <Textarea
              value={imageBase64.split(',')[1] || imageBase64}
              readOnly
              className="font-mono text-xs min-h-[100px] bg-muted"
            />
          </div>
        )}
      </TabsContent>

      <TabsContent value="b642img" className="space-y-4 mt-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Base64 String or Data URL</label>
          <Textarea
            value={decodeInput}
            onChange={e => { setDecodeInput(e.target.value); setDecodeError('') }}
            onBlur={validateDecode}
            placeholder="Paste Base64 encoded image or data:image/png;base64,... URL"
            className="font-mono text-xs min-h-[120px]"
          />
        </div>

        {decodeError && (
          <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">{decodeError}</div>
        )}

        {decodeInput && !decodeError && (
          <div className="flex justify-center rounded-md border bg-muted/30 p-4">
            <img
              src={getDataUrl()}
              alt="Decoded image"
              className="max-h-96 max-w-full object-contain rounded"
              onError={() => setDecodeError('Invalid Base64 image data')}
            />
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
