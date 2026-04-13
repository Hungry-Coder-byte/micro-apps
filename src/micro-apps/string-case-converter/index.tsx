'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Type, Construction, Copy } from 'lucide-react'

const CASES = [
  { label: 'camelCase',       example: 'myVariableName' },
  { label: 'PascalCase',      example: 'MyVariableName' },
  { label: 'snake_case',      example: 'my_variable_name' },
  { label: 'SCREAMING_SNAKE', example: 'MY_VARIABLE_NAME' },
  { label: 'kebab-case',      example: 'my-variable-name' },
  { label: 'COBOL-CASE',      example: 'MY-VARIABLE-NAME' },
  { label: 'dot.case',        example: 'my.variable.name' },
  { label: 'Title Case',      example: 'My Variable Name' },
  { label: 'Sentence case',   example: 'My variable name' },
  { label: 'lowercase',       example: 'my variable name' },
  { label: 'UPPERCASE',       example: 'MY VARIABLE NAME' },
  { label: 'Sponge case',     example: 'mY vArIaBlE nAmE' },
]

export default function StringCaseConverter() {
  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div>
        <Label className="text-xs mb-1.5 block">Input text</Label>
        <Input defaultValue="my variable name" className="font-mono h-10" placeholder="Enter text to convert…" />
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-2.5 border-b bg-muted/30">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">All conversions</p>
        </div>
        <div className="divide-y">
          {CASES.map(({ label, example }) => (
            <div key={label} className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/10 transition-colors">
              <span className="text-xs text-muted-foreground w-36 shrink-0">{label}</span>
              <span className="text-xs font-mono flex-1">{example}</span>
              <button className="ml-2 opacity-40 cursor-not-allowed" disabled>
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <Type className="h-4 w-4" /> Convert All
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
