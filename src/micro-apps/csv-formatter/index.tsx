'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table2, Construction, Copy, Download } from 'lucide-react'

const SAMPLE_CSV = `id,name,email,role,joined
1,Alice Martin,alice@example.com,admin,2023-01-15
2,Bob Chen,bob@example.com,editor,2023-03-22
3,Carol Smith,carol@example.com,viewer,2023-06-08
4,David Kim,david@example.com,editor,2024-01-02`

const ROWS = [
  { id: '1', name: 'Alice Martin',  email: 'alice@example.com',  role: 'admin',  joined: '2023-01-15' },
  { id: '2', name: 'Bob Chen',      email: 'bob@example.com',    role: 'editor', joined: '2023-03-22' },
  { id: '3', name: 'Carol Smith',   email: 'carol@example.com',  role: 'viewer', joined: '2023-06-08' },
  { id: '4', name: 'David Kim',     email: 'david@example.com',  role: 'editor', joined: '2024-01-02' },
]

export default function CsvFormatter() {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="space-y-2">
        <Label className="text-xs">Paste CSV</Label>
        <textarea rows={5} defaultValue={SAMPLE_CSV} disabled
          className="w-full rounded-lg border bg-muted/30 p-3 text-xs font-mono resize-none opacity-60 cursor-not-allowed" />
      </div>

      <div className="rounded-xl border p-4 space-y-3 opacity-70">
        <p className="text-xs font-medium">Options</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Delimiter</Label>
            <Select defaultValue="comma">
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['Comma (,)', 'Tab (\\t)', 'Semicolon (;)', 'Pipe (|)'].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Quote char</Label>
            <Select defaultValue="double">
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['Double (\")', "Single (')", 'None'].map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Header row</Label>
            <Select defaultValue="yes">
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Export as</Label>
            <Select defaultValue="csv">
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['CSV', 'TSV', 'JSON', 'Markdown table'].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center justify-between">
          <span className="text-xs font-medium">Preview — 4 rows · 5 columns</span>
          <div className="flex gap-1">
            <button disabled className="opacity-40 cursor-not-allowed p-1"><Copy className="h-3.5 w-3.5 text-muted-foreground" /></button>
            <button disabled className="opacity-40 cursor-not-allowed p-1"><Download className="h-3.5 w-3.5 text-muted-foreground" /></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/30">
              <tr>
                {['id', 'name', 'email', 'role', 'joined'].map(h => (
                  <th key={h} className="px-4 py-2 text-left font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {ROWS.map(r => (
                <tr key={r.id} className="hover:bg-muted/10">
                  <td className="px-4 py-2 font-mono">{r.id}</td>
                  <td className="px-4 py-2">{r.name}</td>
                  <td className="px-4 py-2 text-muted-foreground">{r.email}</td>
                  <td className="px-4 py-2"><Badge variant="outline" className="text-[10px] px-1.5 py-0">{r.role}</Badge></td>
                  <td className="px-4 py-2 font-mono text-muted-foreground">{r.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60"><Table2 className="h-4 w-4" /> Format & Export</Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
