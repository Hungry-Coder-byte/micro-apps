'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useClipboard } from '@/hooks/useClipboard'
import { Copy, Check, ArrowRight } from 'lucide-react'

export default function Base64() {
  const [encodeInput, setEncodeInput] = useState('')
  const [encodeOutput, setEncodeOutput] = useState('')
  const [decodeInput, setDecodeInput] = useState('')
  const [decodeOutput, setDecodeOutput] = useState('')
  const [decodeError, setDecodeError] = useState('')
  const { copy, copied } = useClipboard()

  function encode() {
    try {
      setEncodeOutput(btoa(unescape(encodeURIComponent(encodeInput))))
    } catch {
      setEncodeOutput('Error: Could not encode text')
    }
  }

  function decode() {
    setDecodeError('')
    try {
      setDecodeOutput(decodeURIComponent(escape(atob(decodeInput.trim()))))
    } catch {
      setDecodeError('Invalid Base64 string')
      setDecodeOutput('')
    }
  }

  return (
    <Tabs defaultValue="encode">
      <TabsList>
        <TabsTrigger value="encode">Encode (Text → Base64)</TabsTrigger>
        <TabsTrigger value="decode">Decode (Base64 → Text)</TabsTrigger>
      </TabsList>

      <TabsContent value="encode" className="space-y-4 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Plain Text</label>
            <Textarea
              value={encodeInput}
              onChange={e => { setEncodeInput(e.target.value) }}
              placeholder="Enter text to encode..."
              className="min-h-[300px] font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Base64 Output</label>
              {encodeOutput && (
                <Button size="sm" variant="ghost" onClick={() => copy(encodeOutput)}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              )}
            </div>
            <Textarea
              value={encodeOutput}
              readOnly
              placeholder="Base64 output will appear here..."
              className="min-h-[300px] font-mono text-sm bg-muted"
            />
          </div>
        </div>
        <Button onClick={encode} className="gap-2">
          <ArrowRight className="h-4 w-4" />
          Encode to Base64
        </Button>
      </TabsContent>

      <TabsContent value="decode" className="space-y-4 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Base64 Input</label>
            <Textarea
              value={decodeInput}
              onChange={e => { setDecodeInput(e.target.value) }}
              placeholder="Paste Base64 string here..."
              className="min-h-[300px] font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Decoded Output</label>
              {decodeOutput && (
                <Button size="sm" variant="ghost" onClick={() => copy(decodeOutput)}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              )}
            </div>
            {decodeError && (
              <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">{decodeError}</div>
            )}
            <Textarea
              value={decodeOutput}
              readOnly
              placeholder="Decoded text will appear here..."
              className="min-h-[300px] font-mono text-sm bg-muted"
            />
          </div>
        </div>
        <Button onClick={decode} className="gap-2">
          <ArrowRight className="h-4 w-4" />
          Decode from Base64
        </Button>
      </TabsContent>
    </Tabs>
  )
}
