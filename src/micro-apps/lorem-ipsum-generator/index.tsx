'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlignLeft, Construction } from 'lucide-react'

const PREVIEW = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`

export default function LoremIpsumGenerator() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="rounded-xl border p-4 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <Label className="text-xs mb-1.5 block">Type</Label>
            <Select defaultValue="paragraphs">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="paragraphs">Paragraphs</SelectItem>
                <SelectItem value="sentences">Sentences</SelectItem>
                <SelectItem value="words">Words</SelectItem>
                <SelectItem value="bytes">Bytes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Count</Label>
            <Input type="number" defaultValue="3" min={1} max={100} className="h-9" />
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Variant</Label>
            <Select defaultValue="classic">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Classic lorem</SelectItem>
                <SelectItem value="random">Random latin</SelectItem>
                <SelectItem value="cicero">Cicero</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground pb-2">
              <input type="checkbox" defaultChecked className="rounded accent-primary" />
              Start with "Lorem ipsum"
            </label>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Preview</p>
        <div className="rounded-xl border bg-muted/20 p-4 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
          {PREVIEW}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <AlignLeft className="h-4 w-4" /> Generate
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
