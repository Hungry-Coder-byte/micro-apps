'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShieldCheck, Construction, Copy } from 'lucide-react'

const EXAMPLES = [
  {
    name: 'React 18 (CDN)',
    url: 'https://unpkg.com/react@18/umd/react.production.min.js',
    algo: 'sha384',
    hash: 'sha384-ENjdO4Dr2bkBIFxQpeoE2FRSXxkMFLmUBBJ7sMYdGQCMT7sHFJPFaVMpGS8TnXp',
    tag: '<script src="https://unpkg.com/react@18/umd/react.production.min.js"\n        integrity="sha384-ENjdO4Dr2bkBIFxQpeoE2FRSXxkMFLmUBBJ7sMYdGQCMT7sHFJPFaVMpGS8TnXp"\n        crossorigin="anonymous"></script>',
  },
  {
    name: 'Bootstrap CSS (CDN)',
    url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    algo: 'sha384',
    hash: 'sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN',
    tag: '<link rel="stylesheet"\n      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"\n      integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"\n      crossorigin="anonymous">',
  },
]

export default function SriGenerator() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="space-y-3">
        <div>
          <Label className="text-xs mb-1.5 block">Resource URL or paste file content</Label>
          <Input defaultValue="https://unpkg.com/react@18/umd/react.production.min.js"
            disabled className="h-9 font-mono text-xs opacity-60 cursor-not-allowed" />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Label className="text-xs shrink-0">Algorithm</Label>
            <div className="flex gap-1 p-0.5 bg-muted rounded-md">
              {['SHA-256', 'SHA-384', 'SHA-512'].map((a, i) => (
                <button key={a} disabled
                  className={`text-xs px-2.5 py-1 rounded transition-colors cursor-not-allowed ${i === 1 ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Generated SRI hash</div>
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-2">
            <code className="text-xs font-mono text-primary break-all flex-1">{EXAMPLES[0].hash}</code>
            <button disabled className="opacity-40 cursor-not-allowed shrink-0 mt-0.5">
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground mb-1.5">Ready-to-use HTML tag</p>
            <pre className="text-xs font-mono text-muted-foreground bg-muted/30 rounded-lg p-3 overflow-x-auto whitespace-pre">{EXAMPLES[0].tag}</pre>
          </div>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Common CDN resources with SRI</div>
        {EXAMPLES.map(({ name, url, algo, hash }) => (
          <div key={name} className="px-4 py-3 border-b last:border-0 text-xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{name}</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">{algo}</Badge>
            </div>
            <p className="text-muted-foreground text-[10px] font-mono mb-1">{url}</p>
            <code className="text-[10px] font-mono text-muted-foreground break-all">{hash}</code>
          </div>
        ))}
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60"><ShieldCheck className="h-4 w-4" /> Generate SRI Hash</Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
