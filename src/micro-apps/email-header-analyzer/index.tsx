'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Mail, Construction, CheckCircle2, AlertCircle } from 'lucide-react'

const SAMPLE_HEADERS = `Delivered-To: user@example.com
Received: from mail.sender.com (mail.sender.com [203.0.113.45])
        by mx.example.com with ESMTPS id abc123
        for <user@example.com>; Mon, 10 Apr 2024 08:30:12 -0700
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed; d=sender.com; s=mail;
From: Alice <alice@sender.com>
To: user@example.com
Subject: Hello from Alice
Date: Mon, 10 Apr 2024 08:30:10 -0700
Message-ID: <abc123@mail.sender.com>`

const PARSED = [
  { field: 'From',        value: 'alice@sender.com' },
  { field: 'To',          value: 'user@example.com' },
  { field: 'Date',        value: 'Mon, 10 Apr 2024 08:30:10 -0700' },
  { field: 'Message-ID',  value: '<abc123@mail.sender.com>' },
  { field: 'Return-Path', value: '<alice@sender.com>' },
  { field: 'X-Mailer',    value: 'Apple Mail' },
]

const AUTH = [
  { name: 'SPF',   status: 'pass',    detail: 'mail.sender.com is authorized' },
  { name: 'DKIM',  status: 'pass',    detail: 'Signature valid (d=sender.com)' },
  { name: 'DMARC', status: 'pass',    detail: 'Policy: reject; aligned' },
  { name: 'ARC',   status: 'none',    detail: 'No ARC seal found' },
]

export default function EmailHeaderAnalyzer() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <Label className="text-xs mb-1.5 block">Paste raw email headers</Label>
        <textarea rows={6} defaultValue={SAMPLE_HEADERS} disabled
          className="w-full rounded-lg border bg-muted/30 p-3 text-xs font-mono resize-none opacity-60 cursor-not-allowed" />
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Authentication results</div>
        <div className="divide-y">
          {AUTH.map(({ name, status, detail }) => (
            <div key={name} className="px-4 py-2.5 flex items-center gap-3 text-xs">
              <span className="font-mono w-14 font-medium">{name}</span>
              <span className="flex items-center gap-1.5">
                {status === 'pass'
                  ? <><CheckCircle2 className="h-3.5 w-3.5 text-green-500" /><span className="text-green-600 dark:text-green-400">pass</span></>
                  : <><AlertCircle className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-muted-foreground">{status}</span></>}
              </span>
              <span className="text-muted-foreground ml-auto text-[11px]">{detail}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Parsed fields</div>
        <div className="divide-y">
          {PARSED.map(({ field, value }) => (
            <div key={field} className="px-4 py-2.5 grid grid-cols-3 gap-2 text-xs">
              <span className="text-muted-foreground font-medium">{field}</span>
              <code className="col-span-2 font-mono break-all text-muted-foreground">{value}</code>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <Mail className="h-4 w-4" /> Analyze Headers
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
