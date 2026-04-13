'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Terminal, Construction } from 'lucide-react'

const PERMS = ['Read (r)', 'Write (w)', 'Execute (x)']
const WHO   = ['Owner', 'Group', 'Others']

const defaultChecked: Record<string, boolean> = {
  'Owner-Read (r)': true, 'Owner-Write (w)': true, 'Owner-Execute (x)': false,
  'Group-Read (r)': true,  'Group-Write (w)': false, 'Group-Execute (x)': false,
  'Others-Read (r)': true, 'Others-Write (w)': false, 'Others-Execute (x)': false,
}

export default function ChmodCalculator() {
  const [octal, setOctal] = useState('644')

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-2.5 border-b bg-muted/30 grid grid-cols-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <span></span>
          {PERMS.map(p => <span key={p} className="text-center">{p}</span>)}
        </div>
        {WHO.map(who => (
          <div key={who} className="px-4 py-3 border-b last:border-0 grid grid-cols-4 items-center">
            <span className="text-sm font-medium">{who}</span>
            {PERMS.map(perm => (
              <div key={perm} className="flex justify-center">
                <input
                  type="checkbox"
                  defaultChecked={defaultChecked[`${who}-${perm}`]}
                  className="h-4 w-4 rounded accent-primary cursor-not-allowed opacity-60"
                  disabled
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label className="text-xs mb-1.5 block">Octal</Label>
          <Input value={octal} onChange={e => setOctal(e.target.value)} maxLength={3}
            className="font-mono text-lg text-center h-11" placeholder="644" />
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Symbolic</Label>
          <div className="h-11 border rounded-md flex items-center justify-center font-mono text-sm bg-muted/20 text-muted-foreground">
            -rw-r--r--
          </div>
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Binary</Label>
          <div className="h-11 border rounded-md flex items-center justify-center font-mono text-sm bg-muted/20 text-muted-foreground">
            110 100 100
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-muted/20 p-3 font-mono text-sm">
        <span className="text-muted-foreground">$ </span>chmod {octal} filename
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <Terminal className="h-4 w-4" /> Calculate
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
