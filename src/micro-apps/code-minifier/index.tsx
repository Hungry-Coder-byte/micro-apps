'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useClipboard } from '@/hooks/useClipboard'
import { Copy, Check, ArrowRight } from 'lucide-react'

export default function CodeMinifier() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [minified, setMinified] = useState('')
  const [originalSize, setOriginalSize] = useState(0)
  const [minifiedSize, setMinifiedSize] = useState(0)
  const { copy, copied } = useClipboard()

  function minify() {
    if (!code.trim()) return

    let result = code

    if (language === 'javascript') {
      // Remove comments
      result = result
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*/g, '')

      // Remove unnecessary whitespace
      result = result
        .replace(/\s+/g, ' ')
        .replace(/\s*([{}();,:])\s*/g, '$1')
        .trim()
    } else if (language === 'css') {
      // Remove CSS comments
      result = result.replace(/\/\*[\s\S]*?\*\//g, '')

      // Remove whitespace around CSS syntax
      result = result
        .replace(/\s+/g, ' ')
        .replace(/\s*([{}:;,>+~])\s*/g, '$1')
        .trim()
    } else if (language === 'html') {
      // Remove HTML comments
      result = result.replace(/<!--[\s\S]*?-->/g, '')

      // Remove unnecessary whitespace (preserve single spaces in content)
      result = result
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .trim()
    }

    setMinified(result)
    setOriginalSize(code.length)
    setMinifiedSize(result.length)
  }

  const reduction = originalSize > 0 ? ((1 - minifiedSize / originalSize) * 100).toFixed(1) : 0

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end">
        <div className="space-y-1">
          <label className="text-sm font-medium">Language</label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={minify} className="gap-2">
          <ArrowRight className="h-4 w-4" />
          Minify
        </Button>
      </div>

      <Tabs defaultValue="input">
        <TabsList>
          <TabsTrigger value="input">Input Code</TabsTrigger>
          <TabsTrigger value="output">Minified Output</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Paste your {language === 'javascript' ? 'JavaScript' : language === 'css' ? 'CSS' : 'HTML'} code
            </label>
            <Textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder={
                language === 'javascript'
                  ? 'function hello() {\n  console.log("Hello");\n}'
                  : language === 'css'
                  ? 'body { color: red; }'
                  : '<div class="container">\n  <p>Hello</p>\n</div>'
              }
              className="font-mono text-sm min-h-[300px]"
            />
            {code && (
              <div className="text-xs text-muted-foreground">
                Size: {code.length.toLocaleString()} bytes
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="output" className="mt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Minified Code</label>
              {minified && (
                <Button size="sm" variant="ghost" onClick={() => copy(minified)}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              )}
            </div>
            {minified ? (
              <>
                <Textarea
                  value={minified}
                  readOnly
                  className="font-mono text-sm min-h-[300px] bg-muted"
                />
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="rounded-md border bg-muted p-2">
                    <div className="text-xs text-muted-foreground">Original</div>
                    <div className="font-mono font-bold">{originalSize.toLocaleString()} B</div>
                  </div>
                  <div className="rounded-md border bg-muted p-2">
                    <div className="text-xs text-muted-foreground">Minified</div>
                    <div className="font-mono font-bold">{minifiedSize.toLocaleString()} B</div>
                  </div>
                  <div className="rounded-md border bg-green-500/10 p-2">
                    <div className="text-xs text-muted-foreground">Reduction</div>
                    <div className="font-mono font-bold text-green-600 dark:text-green-400">{reduction}%</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
                Minified code will appear here
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
