'use client'

import { useState, useMemo } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useClipboard } from '@/hooks/useClipboard'
import { Copy, Check, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'

function safeBase64Decode(str: string): string {
  try {
    // Add padding if needed
    const padded = str + '=='.slice((str.length + 3) % 4 === 0 ? 0 : (str.length + 3) % 4 === 1 ? 1 : (str.length + 3) % 4 === 2 ? 2 : 0)
    // Replace URL-safe characters
    const b64 = padded.replace(/-/g, '+').replace(/_/g, '/')
    return decodeURIComponent(atob(b64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''))
  } catch {
    return str
  }
}

export default function JwtDecoder() {
  const [token, setToken] = useState('')
  const { copy, copied } = useClipboard()

  const decoded = useMemo(() => {
    if (!token.trim()) return null
    const parts = token.trim().split('.')
    if (parts.length !== 3) return { error: 'Invalid JWT format — expected 3 parts separated by dots' }
    try {
      const header = JSON.parse(safeBase64Decode(parts[0]))
      const payload = JSON.parse(safeBase64Decode(parts[1]))
      const signature = parts[2]
      const now = Math.floor(Date.now() / 1000)
      const isExpired = payload.exp ? payload.exp < now : false
      const expiresIn = payload.exp ? payload.exp - now : null
      return { header, payload, signature, isExpired, expiresIn }
    } catch (e) {
      return { error: (e as Error).message }
    }
  }, [token])

  function formatDate(ts: number) {
    return new Date(ts * 1000).toLocaleString()
  }

  function formatDuration(secs: number) {
    if (secs < 0) return `Expired ${Math.abs(secs)}s ago`
    const d = Math.floor(secs / 86400)
    const h = Math.floor((secs % 86400) / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    return [d && `${d}d`, h && `${h}h`, m && `${m}m`, s && `${s}s`].filter(Boolean).join(' ')
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">JWT Token</label>
        <Textarea
          value={token}
          onChange={e => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
          className="font-mono text-sm min-h-[100px]"
        />
      </div>

      {decoded?.error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
          {decoded.error}
        </div>
      )}

      {decoded && !decoded.error && (
        <div className="space-y-4">
          {/* Status */}
          {decoded.expiresIn !== null && (
            <div className={`flex items-center gap-2 rounded-md border p-3 text-sm ${decoded.isExpired ? 'border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300' : 'border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300'}`}>
              {decoded.isExpired ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
              <span className="font-medium">{decoded.isExpired ? 'Token Expired' : 'Token Valid'}</span>
              <Clock className="h-3.5 w-3.5 ml-2" />
              <span>{formatDuration(decoded.expiresIn!)}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-rose-500 text-white border-0">Header</Badge>
                <button onClick={() => copy(JSON.stringify(decoded.header, null, 2))} className="text-muted-foreground hover:text-foreground">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <pre className="rounded-md border bg-muted p-3 text-sm font-mono overflow-auto whitespace-pre-wrap">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>

            {/* Payload */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-violet-500 text-white border-0">Payload</Badge>
                <button onClick={() => copy(JSON.stringify(decoded.payload, null, 2))} className="text-muted-foreground hover:text-foreground">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <pre className="rounded-md border bg-muted p-3 text-sm font-mono overflow-auto whitespace-pre-wrap">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
            </div>

            {/* Signature */}
            <div className="space-y-2">
              <Badge className="bg-cyan-500 text-white border-0">Signature</Badge>
              <div className="rounded-md border bg-muted p-3 text-sm font-mono break-all">
                {decoded.signature}
              </div>
            </div>
          </div>

          {/* Claims summary */}
          {decoded.payload && (
            <div className="rounded-md border overflow-hidden">
              <div className="bg-muted px-3 py-2 text-sm font-semibold">Known Claims</div>
              <table className="w-full text-sm">
                <tbody>
                  {decoded.payload.iss && <tr className="border-t"><td className="px-3 py-2 text-muted-foreground">iss (Issuer)</td><td className="px-3 py-2 font-mono">{String(decoded.payload.iss)}</td></tr>}
                  {decoded.payload.sub && <tr className="border-t"><td className="px-3 py-2 text-muted-foreground">sub (Subject)</td><td className="px-3 py-2 font-mono">{String(decoded.payload.sub)}</td></tr>}
                  {decoded.payload.aud && <tr className="border-t"><td className="px-3 py-2 text-muted-foreground">aud (Audience)</td><td className="px-3 py-2 font-mono">{String(decoded.payload.aud)}</td></tr>}
                  {decoded.payload.iat && <tr className="border-t"><td className="px-3 py-2 text-muted-foreground">iat (Issued At)</td><td className="px-3 py-2">{formatDate(decoded.payload.iat)}</td></tr>}
                  {decoded.payload.exp && <tr className="border-t"><td className="px-3 py-2 text-muted-foreground">exp (Expires)</td><td className={`px-3 py-2 ${decoded.isExpired ? 'text-destructive' : ''}`}>{formatDate(decoded.payload.exp)}</td></tr>}
                  {decoded.payload.nbf && <tr className="border-t"><td className="px-3 py-2 text-muted-foreground">nbf (Not Before)</td><td className="px-3 py-2">{formatDate(decoded.payload.nbf)}</td></tr>}
                  {decoded.payload.jti && <tr className="border-t"><td className="px-3 py-2 text-muted-foreground">jti (JWT ID)</td><td className="px-3 py-2 font-mono">{String(decoded.payload.jti)}</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
