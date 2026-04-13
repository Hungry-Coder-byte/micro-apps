'use client'

import { useState } from 'react'
import { PdfDropzone } from '@/components/pdf-dropzone'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LockOpen, Eye, EyeOff, Construction } from 'lucide-react'

export default function PdfRemovePassword() {
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)

  return (
    <div className="space-y-5 max-w-xl mx-auto">
      <PdfDropzone file={file} onFile={setFile} label="Drop a password-protected PDF" />

      <div className="rounded-xl border p-5 space-y-4">
        <div>
          <Label className="text-xs mb-1.5 block">Current password</Label>
          <div className="relative">
            <Input
              type={show ? 'text' : 'password'}
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Enter the PDF password"
              className="h-9 pr-10"
            />
            <button className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground" onClick={() => setShow(v => !v)}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
          <p>• You must know the password to remove it</p>
          <p>• Owner-password restrictions (no-copy, no-print) can sometimes be bypassed</p>
          <p>• All processing happens client-side — your file is never uploaded to a server</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <LockOpen className="h-4 w-4" /> Remove Password
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">Note: This tool will not brute-force or crack PDF passwords.</p>
    </div>
  )
}
