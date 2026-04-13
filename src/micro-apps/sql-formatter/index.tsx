'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Database, Construction } from 'lucide-react'

const SAMPLE = `SELECT u.id,u.name,u.email,COUNT(o.id) as order_count,SUM(o.total) as total_spent FROM users u LEFT JOIN orders o ON u.id=o.user_id WHERE u.created_at>='2024-01-01' AND u.status='active' GROUP BY u.id,u.name,u.email HAVING COUNT(o.id)>0 ORDER BY total_spent DESC LIMIT 50;`

export default function SqlFormatter() {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-xs mb-1.5 block">Dialect</Label>
          <Select defaultValue="standard">
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard SQL</SelectItem>
              <SelectItem value="mysql">MySQL</SelectItem>
              <SelectItem value="postgres">PostgreSQL</SelectItem>
              <SelectItem value="mssql">SQL Server</SelectItem>
              <SelectItem value="sqlite">SQLite</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Keyword case</Label>
          <Select defaultValue="upper">
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="upper">UPPERCASE</SelectItem>
              <SelectItem value="lower">lowercase</SelectItem>
              <SelectItem value="preserve">Preserve</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Indent</Label>
          <Select defaultValue="2">
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 spaces</SelectItem>
              <SelectItem value="4">4 spaces</SelectItem>
              <SelectItem value="tab">Tab</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">SQL Input</p>
          <textarea defaultValue={SAMPLE} rows={16}
            className="w-full rounded-lg border bg-muted/30 p-3 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Paste SQL query here…" />
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Formatted SQL</p>
          <div className="w-full h-[calc(16*1.5rem+24px)] rounded-lg border bg-muted/20 p-3 text-xs font-mono text-muted-foreground flex items-center justify-center">
            Formatted query will appear here
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <Database className="h-4 w-4" /> Format SQL
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
