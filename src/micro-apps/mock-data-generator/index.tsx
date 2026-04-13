'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dices, Construction, Plus, Copy, Trash2 } from 'lucide-react'

const FIELD_TYPES = ['Full Name','First Name','Last Name','Email','Phone','Username','Password',
  'UUID','Date','Date of Birth','Age','Address','City','Country','ZIP Code',
  'Company','Job Title','URL','IP Address','Credit Card','IBAN','Color (hex)',
  'Boolean','Integer','Float','Sentence','Paragraph','Lorem Ipsum']

const SAMPLE_FIELDS = [
  { name: 'id',         type: 'UUID' },
  { name: 'name',       type: 'Full Name' },
  { name: 'email',      type: 'Email' },
  { name: 'role',       type: 'Job Title' },
  { name: 'joined',     type: 'Date' },
]

const SAMPLE_DATA = [
  { id: 'a1b2c3d4-...', name: 'Alice Martin',   email: 'alice.martin@mail.com',   role: 'Product Manager',   joined: '2023-03-14' },
  { id: 'e5f6g7h8-...', name: 'Bob Chen',        email: 'bob.chen@corp.io',        role: 'Software Engineer', joined: '2022-11-08' },
  { id: 'i9j0k1l2-...', name: 'Carol Williams',  email: 'c.williams@webdev.net',   role: 'UX Designer',       joined: '2024-01-22' },
]

export default function MockDataGenerator() {
  const [count] = useState('10')
  const [format] = useState('JSON')

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="rounded-xl border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium">Fields</p>
          <Button size="sm" variant="outline" disabled className="h-7 gap-1 text-xs opacity-60">
            <Plus className="h-3.5 w-3.5" /> Add Field
          </Button>
        </div>
        <div className="space-y-2">
          {SAMPLE_FIELDS.map((f, i) => (
            <div key={i} className="grid grid-cols-5 gap-2 items-center">
              <Input defaultValue={f.name} disabled className="col-span-2 h-8 text-xs font-mono opacity-60" />
              <Select defaultValue={f.type}>
                <SelectTrigger className="col-span-2 h-8 text-xs opacity-60" disabled>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              <button disabled className="opacity-30 cursor-not-allowed justify-self-center">
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Label className="text-xs shrink-0">Rows</Label>
          <Input defaultValue={count} disabled className="w-20 h-8 text-xs font-mono opacity-60" />
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs shrink-0">Format</Label>
          <Select defaultValue={format}>
            <SelectTrigger className="w-28 h-8 text-xs opacity-60" disabled><SelectValue /></SelectTrigger>
            <SelectContent>
              {['JSON','CSV','SQL INSERT','TypeScript'].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center justify-between">
          <span className="text-xs font-medium">Preview — 3 of 10 rows</span>
          <button disabled className="opacity-40 cursor-not-allowed">
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/30">
              <tr>{['id','name','email','role','joined'].map(h => (
                <th key={h} className="px-4 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y">
              {SAMPLE_DATA.map((r, i) => (
                <tr key={i}>
                  <td className="px-4 py-2 font-mono text-muted-foreground">{r.id}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{r.name}</td>
                  <td className="px-4 py-2 text-muted-foreground">{r.email}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{r.role}</td>
                  <td className="px-4 py-2 font-mono">{r.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60"><Dices className="h-4 w-4" /> Generate Data</Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
