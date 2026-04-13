'use client'

import { useState } from 'react'
import { PdfDropzone } from '@/components/pdf-dropzone'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Lock, Eye, EyeOff, Construction } from 'lucide-react'

export default function PdfAddPassword() {
  const [file, setFile] = useState<File | null>(null)
  const [userPass, setUserPass] = useState('')
  const [ownerPass, setOwnerPass] = useState('')
  const [showPass, setShowPass] = useState(false)

  return (
    <div className="space-y-5 max-w-xl mx-auto">
      <PdfDropzone file={file} onFile={setFile} label="Drop a PDF to password-protect" />

      <div className="rounded-xl border p-5 space-y-4">
        <div>
          <Label className="text-xs mb-1.5 block">User password (required to open)</Label>
          <div className="relative">
            <Input
              type={showPass ? 'text' : 'password'}
              value={userPass} onChange={e => setUserPass(e.target.value)}
              placeholder="Enter password"
              className="h-9 pr-10"
            />
            <button className="absolute right-3 top-2 text-muted-foreground hover:text-foreground" onClick={() => setShowPass(v => !v)}>
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Owner password (optional — for full access)</Label>
          <Input type={showPass ? 'text' : 'password'} value={ownerPass} onChange={e => setOwnerPass(e.target.value)} placeholder="Leave blank to use same password" className="h-9" />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {['Restrict editing', 'Restrict copying', 'Restrict printing', 'Restrict annotations'].map(opt => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-muted-foreground text-xs">{opt}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
          All processing happens locally in your browser — your file is never uploaded to any server.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <Lock className="h-4 w-4" /> Protect PDF
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Encryption library — coming soon
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">PDF encryption requires a dedicated library (pdf-lib encryption support is in progress for v2).</p>
    </div>
  )
}
