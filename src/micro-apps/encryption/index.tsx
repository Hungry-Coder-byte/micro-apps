'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useClipboard } from '@/hooks/useClipboard'
import { Copy, Check, Eye, EyeOff } from 'lucide-react'

export default function Encryption() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt')
  const [text, setText] = useState('')
  const [passphrase, setPassphrase] = useState('')
  const [output, setOutput] = useState('')
  const [iv, setIv] = useState('')
  const [error, setError] = useState('')
  const [showPassphrase, setShowPassphrase] = useState(false)
  const { copy, copied } = useClipboard()

  async function deriveKey(passphrase: string): Promise<CryptoKey> {
    const encoder = new TextEncoder()
    const data = encoder.encode(passphrase)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    return crypto.subtle.importKey('raw', hashBuffer, 'AES-GCM', false, ['encrypt', 'decrypt'])
  }

  async function encryptText() {
    setError('')
    setOutput('')
    setIv('')

    if (!text.trim() || !passphrase.trim()) {
      setError('Please enter both text and passphrase')
      return
    }

    try {
      const key = await deriveKey(passphrase)
      const iv = crypto.getRandomValues(new Uint8Array(12))
      const encoder = new TextEncoder()
      const data = encoder.encode(text)

      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      )

      const encryptedArray = new Uint8Array(encrypted)
      const combined = new Uint8Array(iv.length + encryptedArray.length)
      combined.set(iv)
      combined.set(encryptedArray, iv.length)

      const base64 = btoa(String.fromCharCode(...combined))
      setOutput(base64)
      setIv(btoa(String.fromCharCode(...iv)))
    } catch (e) {
      setError(`Encryption error: ${(e as Error).message}`)
    }
  }

  async function decryptText() {
    setError('')
    setOutput('')

    if (!text.trim() || !passphrase.trim()) {
      setError('Please enter both encrypted text and passphrase')
      return
    }

    try {
      const key = await deriveKey(passphrase)
      const combined = new Uint8Array(atob(text).split('').map(c => c.charCodeAt(0)))
      const iv = combined.slice(0, 12)
      const encrypted = combined.slice(12)

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      )

      const decoder = new TextDecoder()
      setOutput(decoder.decode(decrypted))
    } catch (e) {
      setError(`Decryption error: ${(e as Error).message}`)
    }
  }

  return (
    <div className="space-y-4">
      <Tabs value={mode} onValueChange={v => setMode(v as 'encrypt' | 'decrypt')}>
        <TabsList className="w-full">
          <TabsTrigger value="encrypt" className="flex-1">
            Encrypt
          </TabsTrigger>
          <TabsTrigger value="decrypt" className="flex-1">
            Decrypt
          </TabsTrigger>
        </TabsList>

        <TabsContent value="encrypt" className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Text to Encrypt</label>
            <Textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Enter text to encrypt..."
              className="font-mono text-sm min-h-[150px]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Passphrase</label>
            <div className="flex gap-2">
              <Input
                type={showPassphrase ? 'text' : 'password'}
                value={passphrase}
                onChange={e => setPassphrase(e.target.value)}
                placeholder="Enter a strong passphrase..."
                className="font-mono text-sm"
              />
              <button
                onClick={() => setShowPassphrase(!showPassphrase)}
                className="text-muted-foreground hover:text-foreground px-2"
              >
                {showPassphrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button onClick={encryptText} className="w-full">
            Encrypt Text
          </Button>

          {output && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Encrypted Output</label>
                <Button size="sm" variant="ghost" onClick={() => copy(output)}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  Copy
                </Button>
              </div>
              <Textarea
                value={output}
                readOnly
                className="font-mono text-xs min-h-[100px] bg-muted"
              />
              {iv && (
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">IV (Initialization Vector)</label>
                  <div className="bg-muted p-2 rounded-md font-mono text-xs break-all">
                    {iv}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="rounded-md border bg-blue-50 dark:bg-blue-950 p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-primary mb-1">Security Info:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Uses AES-256-GCM encryption</li>
              <li>Passphrase is hashed with SHA-256</li>
              <li>Random IV generated for each encryption</li>
              <li>Output is base64 encoded</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="decrypt" className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Encrypted Text</label>
            <Textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste the encrypted text..."
              className="font-mono text-sm min-h-[150px]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Passphrase</label>
            <div className="flex gap-2">
              <Input
                type={showPassphrase ? 'text' : 'password'}
                value={passphrase}
                onChange={e => setPassphrase(e.target.value)}
                placeholder="Enter the passphrase..."
                className="font-mono text-sm"
              />
              <button
                onClick={() => setShowPassphrase(!showPassphrase)}
                className="text-muted-foreground hover:text-foreground px-2"
              >
                {showPassphrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button onClick={decryptText} className="w-full">
            Decrypt Text
          </Button>

          {output && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Decrypted Output</label>
                <Button size="sm" variant="ghost" onClick={() => copy(output)}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  Copy
                </Button>
              </div>
              <Textarea
                value={output}
                readOnly
                className="font-mono text-sm min-h-[100px] bg-muted"
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
