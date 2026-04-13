'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Package, Construction } from 'lucide-react'

const META = [
  ['Package',      'react'],
  ['Latest',       '18.3.1'],
  ['License',      'MIT'],
  ['Author',       'React Team (Meta)'],
  ['Repository',   'github.com/facebook/react'],
  ['Homepage',     'https://react.dev'],
  ['Published',    '2024-04-26'],
  ['Downloads',    '48,210,034 / week'],
  ['Bundle size',  '6.9 kB (min+gzip)'],
  ['Deprecated',   'No'],
  ['Types',        '@types/react'],
  ['Node required','≥ 0.10.0'],
]

const VERSIONS = [
  { ver: '18.3.1', date: '2024-04-26', tag: 'latest' },
  { ver: '18.3.0', date: '2024-04-22', tag: '' },
  { ver: '18.2.0', date: '2022-06-14', tag: '' },
  { ver: '18.1.0', date: '2022-04-26', tag: '' },
  { ver: '17.0.2', date: '2021-03-22', tag: 'legacy' },
]

const DEPS = ['loose-envify']
const PEER = ['react-dom']

export default function NpmPackageInfo() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex gap-2">
        <div className="flex-1">
          <Label className="text-xs mb-1.5 block">Package name</Label>
          <Input defaultValue="react" placeholder="e.g. lodash, axios, react" className="h-9 font-mono" />
        </div>
        <div className="self-end">
          <Button disabled className="h-9 gap-2 opacity-60"><Package className="h-4 w-4" /> Look Up</Button>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center gap-2">
          <Package className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold font-mono">react</span>
          <Badge className="text-[10px] px-1.5 py-0 ml-1">18.3.1</Badge>
        </div>
        <div className="divide-y">
          {META.map(([k, v]) => (
            <div key={k} className="px-4 py-2.5 grid grid-cols-3 gap-2 text-xs">
              <span className="text-muted-foreground">{k}</span>
              <span className="col-span-2 font-mono break-all">{v}</span>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 border-t grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-muted-foreground text-[10px] mb-1.5 font-medium">Dependencies</p>
            <div className="flex flex-wrap gap-1">{DEPS.map(d => <Badge key={d} variant="outline" className="text-[10px] font-mono">{d}</Badge>)}</div>
          </div>
          <div>
            <p className="text-muted-foreground text-[10px] mb-1.5 font-medium">Peer dependencies</p>
            <div className="flex flex-wrap gap-1">{PEER.map(d => <Badge key={d} variant="outline" className="text-[10px] font-mono">{d}</Badge>)}</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Recent versions</div>
        <div className="divide-y">
          {VERSIONS.map(({ ver, date, tag }) => (
            <div key={ver} className="px-4 py-2.5 flex items-center gap-3 text-xs font-mono">
              <span className="font-semibold">{ver}</span>
              {tag && <Badge variant="outline" className="text-[10px] px-1.5 py-0">{tag}</Badge>}
              <span className="text-muted-foreground ml-auto">{date}</span>
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
