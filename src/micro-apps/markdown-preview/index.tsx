'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Construction } from 'lucide-react'

const SAMPLE = `# Welcome to Markdown Preview

## Features

- **Bold text** and *italic text*
- ~~Strikethrough~~ and \`inline code\`
- [Links](https://example.com)

## Code Block

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`
}
\`\`\`

## Table

| Name  | Role      | Team    |
|-------|-----------|---------|
| Alice | Developer | Frontend|
| Bob   | Designer  | UX      |

> Blockquote: Great tools make developers happy.

---

1. Ordered item one
2. Ordered item two
3. Ordered item three`

export default function MarkdownPreviewApp() {
  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <Badge variant="outline">Split view</Badge>
        <span>·</span>
        <span>Type markdown on the left, see rendered HTML on the right</span>
      </div>

      <div className="grid grid-cols-2 gap-4 h-[520px]">
        <div className="space-y-1.5 flex flex-col">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Markdown Editor</p>
          <textarea defaultValue={SAMPLE}
            className="flex-1 rounded-lg border bg-muted/30 p-3 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Start writing markdown…" />
        </div>
        <div className="space-y-1.5 flex flex-col">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Preview</p>
          <div className="flex-1 rounded-lg border bg-background p-4 overflow-auto">
            <div className="prose prose-sm max-w-none text-muted-foreground text-xs">
              <h1 className="text-base font-bold mb-2">Welcome to Markdown Preview</h1>
              <h2 className="text-sm font-semibold mb-1 mt-3">Features</h2>
              <ul className="text-xs space-y-0.5 mb-3">
                <li><strong>Bold text</strong> and <em>italic text</em></li>
                <li><s>Strikethrough</s> and <code className="bg-muted px-1 rounded text-[10px]">inline code</code></li>
                <li><a href="#" className="text-primary underline">Links</a></li>
              </ul>
              <p className="text-[10px] text-muted-foreground/60 mt-4 italic">(Live preview — functionality coming soon)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <FileText className="h-4 w-4" /> Live Preview
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
