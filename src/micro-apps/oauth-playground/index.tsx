'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { KeyRound, Construction, Copy } from 'lucide-react'

const FLOWS = ['Authorization Code', 'Client Credentials', 'Implicit (deprecated)', 'Device Code', 'PKCE']

const SAMPLE_TOKEN_RESPONSE = `{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "8xLOxBtZp8",
  "scope": "read write"
}`

export default function OAuthPlayground() {
  const [flow, setFlow] = useState('Authorization Code')

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="space-y-1">
        <Label className="text-xs">OAuth Flow</Label>
        <Select value={flow} onValueChange={setFlow}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FLOWS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border p-4 space-y-3">
        <p className="text-xs font-medium">Provider configuration</p>
        {[
          { label: 'Authorization URL', placeholder: 'https://provider.com/oauth/authorize' },
          { label: 'Token URL',         placeholder: 'https://provider.com/oauth/token' },
          { label: 'Client ID',         placeholder: 'your-client-id' },
          { label: 'Client Secret',     placeholder: 'your-client-secret' },
          { label: 'Redirect URI',      placeholder: 'https://yourapp.com/callback' },
          { label: 'Scope',             placeholder: 'openid profile email' },
        ].map(({ label, placeholder }) => (
          <div key={label} className="grid grid-cols-3 gap-2 items-center">
            <Label className="text-xs text-muted-foreground">{label}</Label>
            <Input disabled placeholder={placeholder} className="col-span-2 h-8 text-xs font-mono opacity-60 cursor-not-allowed" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center justify-between">
          <span className="text-xs font-medium">Token response preview</span>
          <Button size="sm" variant="ghost" className="h-6 px-2 text-xs gap-1 opacity-60" disabled>
            <Copy className="h-3 w-3" /> Copy
          </Button>
        </div>
        <pre className="p-4 text-xs font-mono text-muted-foreground overflow-x-auto">{SAMPLE_TOKEN_RESPONSE}</pre>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <KeyRound className="h-4 w-4" /> Start Flow
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
