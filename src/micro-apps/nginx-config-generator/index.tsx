'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Server, Construction, Copy } from 'lucide-react'

const PREVIEW = `server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;

    # Redirect HTTP → HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name example.com www.example.com;

    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    root /var/www/example.com/public;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/javascript application/json;
}`

export default function NginxConfigGenerator() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="rounded-xl border p-4 space-y-3">
        <p className="text-xs font-medium">Server options</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Domain name',   val: 'example.com' },
            { label: 'Root path',     val: '/var/www/example.com/public' },
            { label: 'Upstream port', val: '3000' },
            { label: 'SSL cert path', val: '/etc/letsencrypt/live/...' },
          ].map(({ label, val }) => (
            <div key={label} className="space-y-1">
              <Label className="text-xs">{label}</Label>
              <Input defaultValue={val} disabled className="h-8 text-xs font-mono opacity-60 cursor-not-allowed" />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 pt-1">
          {['HTTPS redirect', 'HTTP/2', 'Gzip compression', 'Static file cache', 'Reverse proxy', 'Rate limiting'].map(opt => (
            <label key={opt} className="flex items-center gap-2 text-xs text-muted-foreground cursor-not-allowed">
              <input type="checkbox" disabled defaultChecked={['HTTPS redirect','HTTP/2','Gzip compression','Static file cache'].includes(opt)}
                className="rounded accent-primary" />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium">Generated nginx.conf</span>
          </div>
          <button disabled className="opacity-40 cursor-not-allowed">
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
        <pre className="p-4 text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre">{PREVIEW}</pre>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60"><Server className="h-4 w-4" /> Generate Config</Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
