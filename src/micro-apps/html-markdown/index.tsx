'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useClipboard } from '@/hooks/useClipboard'
import { Copy, Check, Eye, Code2 } from 'lucide-react'

export default function HtmlMarkdown() {
  const [mode, setMode] = useState<'md2html' | 'html2md'>('md2html')
  const [input, setInput] = useState(`# Hello World

This is **bold** and *italic* text.

- Item 1
- Item 2
- Item 3

[Link](https://example.com)

> A blockquote

\`\`\`js
console.log('Hello')
\`\`\`
`)
  const [output, setOutput] = useState('')
  const [preview, setPreview] = useState(false)
  const { copy, copied } = useClipboard()

  useEffect(() => {
    convert()
  }, [input, mode])

  async function convert() {
    if (!input.trim()) { setOutput(''); return }
    try {
      if (mode === 'md2html') {
        const { marked } = await import('marked')
        const result = await marked(input)
        setOutput(result)
      } else {
        const TurndownService = (await import('turndown')).default
        const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' })
        setOutput(td.turndown(input))
      }
    } catch (e) {
      setOutput(`Error: ${(e as Error).message}`)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex gap-2">
          <Button
            variant={mode === 'md2html' ? 'default' : 'outline'}
            onClick={() => { setMode('md2html'); setInput('') }}
            size="sm"
          >
            Markdown → HTML
          </Button>
          <Button
            variant={mode === 'html2md' ? 'default' : 'outline'}
            onClick={() => { setMode('html2md'); setInput('') }}
            size="sm"
          >
            HTML → Markdown
          </Button>
        </div>
        {mode === 'md2html' && (
          <Button variant="outline" size="sm" onClick={() => setPreview(!preview)} className="gap-2">
            {preview ? <Code2 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {preview ? 'Show HTML' : 'Preview'}
          </Button>
        )}
        {output && (
          <Button size="sm" variant="ghost" onClick={() => copy(output)} className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            Copy Output
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{mode === 'md2html' ? 'Markdown Input' : 'HTML Input'}</label>
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={mode === 'md2html' ? '# Heading\n\n**bold** text' : '<h1>Heading</h1><p><strong>bold</strong></p>'}
            className="font-mono text-sm min-h-[400px]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">{mode === 'md2html' ? (preview ? 'Preview' : 'HTML Output') : 'Markdown Output'}</label>
          {mode === 'md2html' && preview ? (
            <div
              className="rounded-md border bg-background p-4 min-h-[400px] prose dark:prose-invert max-w-none overflow-auto"
              dangerouslySetInnerHTML={{ __html: output }}
            />
          ) : (
            <Textarea
              value={output}
              readOnly
              className="font-mono text-sm min-h-[400px] bg-muted"
            />
          )}
        </div>
      </div>
    </div>
  )
}
