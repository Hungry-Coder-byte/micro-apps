'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShieldAlert, Construction, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

const HEADERS = [
  { name: 'Strict-Transport-Security', status: 'pass',    grade: 'A', value: 'max-age=31536000; includeSubDomains; preload',  note: 'HSTS enabled with preload' },
  { name: 'Content-Security-Policy',   status: 'pass',    grade: 'A', value: "default-src 'self'; script-src 'self'",         note: 'CSP configured' },
  { name: 'X-Frame-Options',           status: 'pass',    grade: 'A', value: 'DENY',                                          note: 'Clickjacking protection' },
  { name: 'X-Content-Type-Options',    status: 'pass',    grade: 'A', value: 'nosniff',                                       note: 'MIME sniffing disabled' },
  { name: 'Referrer-Policy',           status: 'warn',    grade: 'B', value: 'no-referrer-when-downgrade',                    note: 'Consider strict-origin-when-cross-origin' },
  { name: 'Permissions-Policy',        status: 'missing', grade: 'F', value: '—',                                             note: 'Header missing' },
  { name: 'X-XSS-Protection',          status: 'warn',    grade: 'C', value: '1; mode=block',                                 note: 'Deprecated — use CSP instead' },
  { name: 'Cross-Origin-Opener-Policy',status: 'missing', grade: 'F', value: '—',                                             note: 'Header missing' },
]

const STATUS_ICON = {
  pass:    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />,
  warn:    <AlertCircle  className="h-3.5 w-3.5 text-yellow-500" />,
  missing: <XCircle      className="h-3.5 w-3.5 text-red-500" />,
}

const GRADE_COLOR: Record<string, string> = {
  A: 'text-green-600 border-green-400/40',
  B: 'text-blue-600 border-blue-400/40',
  C: 'text-yellow-600 border-yellow-400/40',
  F: 'text-red-600 border-red-400/40',
}

export default function SecurityHeadersAnalyzer() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <Label className="text-xs mb-1.5 block">Website URL</Label>
        <div className="flex gap-2">
          <Input defaultValue="https://example.com" className="h-9 font-mono flex-1" />
          <Button disabled className="h-9 gap-2 opacity-60">
            <ShieldAlert className="h-4 w-4" /> Analyze
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 opacity-70">
        {[
          { label: 'Overall score', value: 'B+',   color: 'text-blue-500' },
          { label: 'Passed',        value: '4',     color: 'text-green-500' },
          { label: 'Warnings',      value: '2',     color: 'text-yellow-500' },
          { label: 'Missing',       value: '2',     color: 'text-red-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border p-3 text-center">
            <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
            <p className={`text-2xl font-bold font-mono ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Security header results</div>
        <div className="divide-y">
          {HEADERS.map(({ name, status, grade, value, note }) => (
            <div key={name} className="px-4 py-3 text-xs">
              <div className="flex items-center gap-2 mb-1">
                {STATUS_ICON[status as keyof typeof STATUS_ICON]}
                <code className="font-mono font-medium">{name}</code>
                <Badge variant="outline" className={`ml-auto text-[10px] px-1.5 py-0 ${GRADE_COLOR[grade]}`}>{grade}</Badge>
              </div>
              <p className="text-muted-foreground text-[11px] font-mono pl-5 break-all">{value}</p>
              <p className="text-muted-foreground/70 text-[10px] pl-5 mt-0.5">{note}</p>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
        <Construction className="h-3.5 w-3.5" /> Coming soon
      </Badge>
    </div>
  )
}
