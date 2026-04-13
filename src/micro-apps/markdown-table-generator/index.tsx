'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table2, Construction, Copy, Plus } from 'lucide-react'

const HEADERS = ['Name', 'Type', 'Default', 'Description']
const ROWS = [
  ['size',     '`string`',  '`"md"`',    'Controls the component size: `sm`, `md`, `lg`'],
  ['variant',  '`string`',  '`"solid"`', 'Visual style: `solid`, `outline`, `ghost`'],
  ['disabled', '`boolean`', '`false`',   'Disables interaction when true'],
  ['onClick',  '`function`','—',          'Callback fired on click events'],
]

const OUTPUT = `| Name | Type | Default | Description |
|------|------|---------|-------------|
| size | \`string\` | \`"md"\` | Controls the component size: \`sm\`, \`md\`, \`lg\` |
| variant | \`string\` | \`"solid"\` | Visual style: \`solid\`, \`outline\`, \`ghost\` |
| disabled | \`boolean\` | \`false\` | Disables interaction when true |
| onClick | \`function\` | — | Callback fired on click events |`

export default function MarkdownTableGenerator() {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Label className="text-xs shrink-0">Columns</Label>
          <Input defaultValue="4" disabled className="w-16 h-8 text-xs font-mono opacity-60" />
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs shrink-0">Rows</Label>
          <Input defaultValue="4" disabled className="w-16 h-8 text-xs font-mono opacity-60" />
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs shrink-0">Alignment</Label>
          <Select defaultValue="left">
            <SelectTrigger className="w-24 h-8 text-xs opacity-60" disabled><SelectValue /></SelectTrigger>
            <SelectContent>
              {['Left','Center','Right','Mixed'].map(a => <SelectItem key={a} value={a.toLowerCase()}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button size="sm" variant="outline" disabled className="h-8 gap-1 text-xs opacity-60 ml-auto">
          <Plus className="h-3.5 w-3.5" /> Add Row
        </Button>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Table editor</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/30 border-b">
              <tr>
                {HEADERS.map(h => (
                  <th key={h} className="px-3 py-2 text-left">
                    <Input defaultValue={h} disabled className="h-6 text-xs font-medium opacity-60 border-0 bg-transparent p-0 focus-visible:ring-0" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {ROWS.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-1.5">
                      <Input defaultValue={cell} disabled className="h-6 text-xs opacity-60 border-0 bg-transparent p-0 focus-visible:ring-0 font-mono" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table2 className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium">Markdown output</span>
          </div>
          <button disabled className="opacity-40 cursor-not-allowed"><Copy className="h-3.5 w-3.5 text-muted-foreground" /></button>
        </div>
        <pre className="p-4 text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre">{OUTPUT}</pre>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60"><Table2 className="h-4 w-4" /> Generate Table</Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
