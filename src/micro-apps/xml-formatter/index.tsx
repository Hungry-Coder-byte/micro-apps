'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileCode2, Construction } from 'lucide-react'

const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?><bookstore><book category="cooking"><title lang="en">Everyday Italian</title><author>Giada De Laurentiis</author><year>2005</year><price>30.00</price></book><book category="children"><title lang="en">Harry Potter</title><author>J K. Rowling</author><year>2005</year><price>29.99</price></book></bookstore>`

export default function XmlFormatter() {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs mb-1.5 block">Indent size</Label>
          <Select defaultValue="2">
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 spaces</SelectItem>
              <SelectItem value="4">4 spaces</SelectItem>
              <SelectItem value="tab">Tab</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Mode</Label>
          <Select defaultValue="format">
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="format">Format / Beautify</SelectItem>
              <SelectItem value="minify">Minify</SelectItem>
              <SelectItem value="validate">Validate only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">XML Input</p>
          <textarea defaultValue={SAMPLE} rows={16}
            className="w-full rounded-lg border bg-muted/30 p-3 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Paste XML here…" />
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Formatted Output</p>
          <div className="w-full h-[calc(16*1.5rem+24px)] rounded-lg border bg-muted/20 p-3 text-xs font-mono text-muted-foreground flex items-center justify-center">
            Formatted XML will appear here
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <FileCode2 className="h-4 w-4" /> Format XML
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
