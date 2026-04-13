'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useClipboard } from '@/hooks/useClipboard'
import { Copy, Check, Sparkles } from 'lucide-react'

const LANGUAGES = [
  { value: 'babel', label: 'JavaScript / JSX' },
  { value: 'typescript', label: 'TypeScript / TSX' },
  { value: 'css', label: 'CSS' },
  { value: 'html', label: 'HTML' },
  { value: 'json', label: 'JSON' },
]

export default function CodeBeautifier() {
  const [lang, setLang] = useState('babel')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { copy, copied } = useClipboard()

  async function format() {
    if (!input.trim()) return
    setError('')
    setLoading(true)
    try {
      if (lang === 'json') {
        const parsed = JSON.parse(input)
        setOutput(JSON.stringify(parsed, null, 2))
        return
      }
      const prettier = await import('prettier/standalone')
      const plugins: unknown[] = []

      if (lang === 'babel' || lang === 'typescript') {
        const [babelPlugin, estreePlugin] = await Promise.all([
          import('prettier/plugins/babel'),
          import('prettier/plugins/estree'),
        ])
        plugins.push(babelPlugin, estreePlugin)
        if (lang === 'typescript') {
          const tsPlugin = await import('prettier/plugins/typescript')
          plugins.push(tsPlugin)
        }
      } else if (lang === 'css') {
        const cssPlugin = await import('prettier/plugins/postcss')
        plugins.push(cssPlugin)
      } else if (lang === 'html') {
        const htmlPlugin = await import('prettier/plugins/html')
        plugins.push(htmlPlugin)
      }

      const result = await prettier.format(input, {
        parser: lang,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        plugins: plugins as any,
        printWidth: 80,
        tabWidth: 2,
        semi: true,
        singleQuote: true,
        trailingComma: 'es5',
      })
      setOutput(result)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="w-56">
          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map(l => (
                <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={format} disabled={!input || loading} className="gap-2">
          <Sparkles className="h-4 w-4" />
          {loading ? 'Formatting...' : 'Format Code'}
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive font-mono">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Input Code</label>
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Paste your ${LANGUAGES.find(l => l.value === lang)?.label} code here...`}
            className="font-mono text-sm min-h-[400px]"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Formatted Output</label>
            {output && (
              <Button size="sm" variant="ghost" onClick={() => copy(output)} className="gap-2">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy
              </Button>
            )}
          </div>
          <Textarea
            value={output}
            readOnly
            className="font-mono text-sm min-h-[400px] bg-muted"
            placeholder="Formatted code will appear here..."
          />
        </div>
      </div>
    </div>
  )
}
