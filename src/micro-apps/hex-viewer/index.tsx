'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { BinaryIcon, Construction, Upload } from 'lucide-react'

// Sample hex dump for "Hello, World!\n"
const HEX_ROWS = [
  { offset: '00000000', hex: '48 65 6C 6C 6F 2C 20 57  6F 72 6C 64 21 0A 00 00', ascii: 'Hello, World!...' },
  { offset: '00000010', hex: 'FF D8 FF E0 00 10 4A 46  49 46 00 01 01 00 00 01', ascii: '......JFIF......' },
  { offset: '00000020', hex: '00 01 00 00 FF DB 00 43  00 08 06 06 07 06 05 08', ascii: '.......C........' },
  { offset: '00000030', hex: '07 07 07 09 09 08 0A 0C  14 0D 0C 0B 0B 0C 19 12', ascii: '................' },
  { offset: '00000040', hex: '13 0F 14 1D 1A 1F 1E 1D  1A 1C 1C 20 24 2E 27 20', ascii: '........... $.\' ' },
  { offset: '00000050', hex: '22 2C 23 1C 1C 28 37 29  1C 30 2E 31 34 36 36 36', ascii: '",#..(7).0.1466' },
]

export default function HexViewer() {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="rounded-xl border-2 border-dashed border-muted p-10 text-center opacity-60 cursor-not-allowed">
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm font-medium">Drop any file to view its hex dump</p>
        <p className="text-xs text-muted-foreground mt-1">Or paste text / hex string below</p>
      </div>

      <div className="space-y-2 opacity-70">
        <Label className="text-xs">Or paste text / hex string</Label>
        <textarea rows={2} defaultValue="Hello, World!" disabled
          className="w-full rounded-lg border bg-muted/30 p-3 text-sm font-mono resize-none opacity-60 cursor-not-allowed" />
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center justify-between">
          <span className="text-xs font-medium">Hex dump</span>
          <span className="text-[10px] text-muted-foreground">Offset · 16 bytes/row · ASCII</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <tbody>
              {HEX_ROWS.map(({ offset, hex, ascii }) => (
                <tr key={offset} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-1.5 text-muted-foreground/60 select-none whitespace-nowrap">{offset}</td>
                  <td className="px-4 py-1.5 text-primary whitespace-nowrap">{hex}</td>
                  <td className="px-4 py-1.5 text-muted-foreground whitespace-nowrap">{ascii}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60"><BinaryIcon className="h-4 w-4" /> View Hex</Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
