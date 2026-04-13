'use client'

import { useState } from 'react'
import { PdfDropzone } from '@/components/pdf-dropzone'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { AlignCenter, Construction } from 'lucide-react'

const VARS = ['{page}', '{total}', '{date}', '{filename}']

export default function PdfAddHeaderFooter() {
  const [file, setFile] = useState<File | null>(null)
  const [headerLeft, setHeaderLeft] = useState('')
  const [headerCenter, setHeaderCenter] = useState('')
  const [headerRight, setHeaderRight] = useState('{date}')
  const [footerLeft, setFooterLeft] = useState('{filename}')
  const [footerCenter, setFooterCenter] = useState('Page {page} of {total}')
  const [footerRight, setFooterRight] = useState('')

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <PdfDropzone file={file} onFile={setFile} />

      <div className="rounded-xl border p-5 space-y-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          Available variables: {VARS.map(v => <code key={v} className="bg-muted px-1.5 py-0.5 rounded">{v}</code>)}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium">Header</h3>
          <div className="grid grid-cols-3 gap-2">
            {[['Left', headerLeft, setHeaderLeft], ['Center', headerCenter, setHeaderCenter], ['Right', headerRight, setHeaderRight]].map(([label, val, set]) => (
              <div key={label as string}>
                <Label className="text-xs mb-1 block">{label as string}</Label>
                <Input value={val as string} onChange={e => (set as (v: string) => void)(e.target.value)} placeholder={`Header ${label}`} className="h-8 text-xs" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium">Footer</h3>
          <div className="grid grid-cols-3 gap-2">
            {[['Left', footerLeft, setFooterLeft], ['Center', footerCenter, setFooterCenter], ['Right', footerRight, setFooterRight]].map(([label, val, set]) => (
              <div key={label as string}>
                <Label className="text-xs mb-1 block">{label as string}</Label>
                <Input value={val as string} onChange={e => (set as (v: string) => void)(e.target.value)} placeholder={`Footer ${label}`} className="h-8 text-xs" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs mb-1.5 block">Font size</Label>
            <Select defaultValue="9">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="8">8pt</SelectItem>
                <SelectItem value="9">9pt</SelectItem>
                <SelectItem value="10">10pt</SelectItem>
                <SelectItem value="12">12pt</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Skip first page</Label>
            <Select defaultValue="no">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="yes">Yes (cover page)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <AlignCenter className="h-4 w-4" /> Apply Header & Footer
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
