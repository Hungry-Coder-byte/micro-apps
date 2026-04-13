'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useClipboard } from '@/hooks/useClipboard'
import { Copy, Check, RefreshCw } from 'lucide-react'
import * as jose from 'jose'

export default function JwtGenerator() {
  const [mode, setMode] = useState<'generate' | 'validate'>('generate')
  const [payload, setPayload] = useState('{"sub":"user123","name":"John"}')
  const [secret, setSecret] = useState('your-secret-key-min-32-chars-long')
  const [algorithm, setAlgorithm] = useState<'HS256' | 'HS512'>('HS256')
  const [jwt, setJwt] = useState('')
  const [validationResult, setValidationResult] = useState<any>(null)
  const [error, setError] = useState('')
  const { copy, copied } = useClipboard()

  async function generate() {
    setError('')
    setJwt('')

    if (!payload.trim() || !secret.trim()) {
      setError('Please enter payload and secret')
      return
    }

    try {
      const parsed = JSON.parse(payload)
      const encoder = new TextEncoder()
      const secretBytes = encoder.encode(secret)

      const token = await new jose.SignJWT(parsed)
        .setProtectedHeader({ alg: algorithm })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secretBytes)

      setJwt(token)
    } catch (e) {
      setError(`Error: ${(e as Error).message}`)
    }
  }

  async function validate() {
    setError('')
    setValidationResult(null)

    if (!jwt.trim() || !secret.trim()) {
      setError('Please enter JWT and secret')
      return
    }

    try {
      const encoder = new TextEncoder()
      const secretBytes = encoder.encode(secret)

      const verified = await jose.jwtVerify(jwt.trim(), secretBytes)
      setValidationResult({
        valid: true,
        payload: verified.payload,
      })
    } catch (e) {
      setError(`Validation failed: ${(e as Error).message}`)
      try {
        // Try to decode without verification
        const parts = jwt.trim().split('.')
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]))
          setValidationResult({
            valid: false,
            payload,
            warning: 'Signature invalid or expired, but payload decoded',
          })
        }
      } catch {
        // Already set error above
      }
    }
  }

  const examples = [
    { label: 'Basic user claim', payload: '{"sub":"user123","name":"John Doe"}' },
    { label: 'With email', payload: '{"sub":"user1","email":"john@example.com","admin":false}' },
    { label: 'Complex payload', payload: '{"sub":"1234567890","name":"John Doe","iat":1516239022,"roles":["user","admin"]}' },
  ]

  return (
    <div className="space-y-4">
      <Tabs value={mode} onValueChange={v => setMode(v as 'generate' | 'validate')}>
        <TabsList className="w-full">
          <TabsTrigger value="generate" className="flex-1">
            Generate
          </TabsTrigger>
          <TabsTrigger value="validate" className="flex-1">
            Validate
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Payload (JSON)</label>
            <Textarea
              value={payload}
              onChange={e => setPayload(e.target.value)}
              placeholder='{"sub":"user123","name":"John"}'
              className="font-mono text-sm min-h-[150px]"
            />
            <div className="flex gap-1 flex-wrap">
              {examples.map((ex, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant="outline"
                  onClick={() => setPayload(ex.payload)}
                  className="text-xs"
                >
                  {ex.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Algorithm</label>
              <Select value={algorithm} onValueChange={v => setAlgorithm(v as 'HS256' | 'HS512')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HS256">HS256 (HMAC SHA-256)</SelectItem>
                  <SelectItem value="HS512">HS512 (HMAC SHA-512)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Secret Key</label>
              <Input
                value={secret}
                onChange={e => setSecret(e.target.value)}
                placeholder="your-secret-key-min-32-chars"
                type="password"
                className="font-mono text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button onClick={generate} className="w-full gap-2">
            <RefreshCw className="h-4 w-4" />
            Generate JWT
          </Button>

          {jwt && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Generated Token</label>
                <Button size="sm" variant="ghost" onClick={() => copy(jwt)}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  Copy
                </Button>
              </div>
              <Textarea
                value={jwt}
                readOnly
                className="font-mono text-xs min-h-[100px] bg-muted break-all"
              />
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Header: {jwt.split('.')[0]}</div>
                <div>Payload: {jwt.split('.')[1]}</div>
                <div>Signature: {jwt.split('.')[2]}</div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="validate" className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">JWT Token</label>
            <Textarea
              value={jwt}
              onChange={e => setJwt(e.target.value)}
              placeholder="Paste JWT token..."
              className="font-mono text-xs min-h-[100px]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Secret Key</label>
            <Input
              value={secret}
              onChange={e => setSecret(e.target.value)}
              placeholder="your-secret-key"
              type="password"
              className="font-mono text-sm"
            />
          </div>

          {error && (
            <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button onClick={validate} className="w-full">
            Validate Token
          </Button>

          {validationResult && (
            <div className="space-y-2">
              <div className={`rounded-md border p-3 ${validationResult.valid ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'}`}>
                <div className={validationResult.valid ? 'text-green-800 dark:text-green-200' : 'text-yellow-800 dark:text-yellow-200'}>
                  {validationResult.valid ? '✓ Token is valid' : '⚠ Token is invalid but payload decoded'}
                </div>
                {validationResult.warning && (
                  <div className="text-xs mt-1 opacity-75">{validationResult.warning}</div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Payload</label>
                <Textarea
                  value={JSON.stringify(validationResult.payload, null, 2)}
                  readOnly
                  className="font-mono text-xs min-h-[200px] bg-muted"
                />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="rounded-md border bg-blue-50 dark:bg-blue-950 p-3 text-xs text-muted-foreground space-y-1">
        <p className="font-semibold text-primary">JWT Info:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>Format: Header.Payload.Signature</li>
          <li>Expires in 24 hours by default</li>
          <li>Use minimum 32 characters for secret</li>
          <li>HS256 is more common, HS512 is more secure</li>
        </ul>
      </div>
    </div>
  )
}
