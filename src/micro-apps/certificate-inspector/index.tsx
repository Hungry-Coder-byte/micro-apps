'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { FileKey, Construction, CheckCircle2 } from 'lucide-react'

const SAMPLE_PEM = `-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQEL
BQAwTzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5
...
-----END CERTIFICATE-----`

const FIELDS = [
  ['Subject',          'CN=example.com, O=Example Inc, C=US'],
  ['Issuer',           "CN=Let's Encrypt Authority X3, O=Let's Encrypt, C=US"],
  ['Serial number',    '03:BC:81:4D:C9:42:5C:28:3A:2B:5D:44:1B:A1:7C:8A'],
  ['Not before',       '2024-03-01 00:00:00 UTC'],
  ['Not after',        '2024-06-01 23:59:59 UTC (expires in 52 days)'],
  ['Key algorithm',    'RSA 2048-bit'],
  ['Signature algo',   'SHA-256 with RSA'],
  ['SANs',             'example.com, www.example.com, api.example.com'],
  ['Key usage',        'Digital Signature, Key Encipherment'],
  ['Extended KU',      'TLS Web Server Authentication, TLS Web Client Authentication'],
  ['OCSP URL',         'http://ocsp.int-x3.letsencrypt.org'],
  ['CRL URL',          'http://crl.int-x3.letsencrypt.org/cert.crl'],
]

export default function CertificateInspector() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <Label className="text-xs mb-1.5 block">Paste PEM certificate or public key</Label>
        <textarea rows={6} defaultValue={SAMPLE_PEM} disabled
          className="w-full rounded-lg border bg-muted/30 p-3 text-xs font-mono resize-none opacity-60 cursor-not-allowed" />
      </div>

      <div className="flex items-center gap-2 px-1 opacity-70">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <span className="text-xs font-medium text-green-600 dark:text-green-400">Valid X.509 certificate detected</span>
        <Badge variant="outline" className="text-[10px] px-1.5 ml-auto">DER encoded</Badge>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Certificate details</div>
        <div className="divide-y">
          {FIELDS.map(([k, v]) => (
            <div key={k} className="px-4 py-2.5 grid grid-cols-3 gap-2 text-xs">
              <span className="text-muted-foreground shrink-0">{k}</span>
              <span className="col-span-2 font-mono break-all">{v}</span>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60"><FileKey className="h-4 w-4" /> Inspect Certificate</Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
