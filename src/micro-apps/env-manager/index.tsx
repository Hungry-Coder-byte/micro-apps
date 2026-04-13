'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useClipboard } from '@/hooks/useClipboard'
import { Copy, Check, Plus, Trash2, Eye, EyeOff } from 'lucide-react'

interface EnvVar {
  key: string
  value: string
  visible: boolean
}

export default function EnvManager() {
  const [envText, setEnvText] = useState('')
  const [variables, setVariables] = useState<EnvVar[]>([])
  const [error, setError] = useState('')
  const { copy, copied } = useClipboard()

  function parse() {
    setError('')
    setVariables([])

    if (!envText.trim()) {
      setError('Please paste .env content')
      return
    }

    try {
      const lines = envText.split('\n')
      const vars: EnvVar[] = []

      lines.forEach(line => {
        line = line.trim()
        if (!line || line.startsWith('#')) return

        const match = line.match(/^([^=]+)=(.*)$/)
        if (match) {
          const [, key, value] = match
          vars.push({
            key: key.trim(),
            value: value.trim(),
            visible: false,
          })
        }
      })

      setVariables(vars)
    } catch (e) {
      setError(`Parse error: ${(e as Error).message}`)
    }
  }

  function updateVar(index: number, key: 'key' | 'value', val: string) {
    setVariables(prev =>
      prev.map((v, i) => (i === index ? { ...v, [key]: val } : v))
    )
  }

  function toggleVisible(index: number) {
    setVariables(prev =>
      prev.map((v, i) => (i === index ? { ...v, visible: !v.visible } : v))
    )
  }

  function removeVar(index: number) {
    setVariables(prev => prev.filter((_, i) => i !== index))
  }

  function addVar() {
    setVariables(prev => [...prev, { key: '', value: '', visible: false }])
  }

  function exportEnv() {
    const text = variables
      .filter(v => v.key)
      .map(v => `${v.key}=${v.value}`)
      .join('\n')
    copy(text)
  }

  function downloadEnv() {
    const text = variables
      .filter(v => v.key)
      .map(v => `${v.key}=${v.value}`)
      .join('\n')

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '.env'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <Textarea
        value={envText}
        onChange={e => setEnvText(e.target.value)}
        placeholder={'DATABASE_URL=postgresql://user:pass@localhost/db\nAPI_KEY=sk_test_abc123\nDEBUG=true'}
        className="font-mono text-sm min-h-[120px]"
      />

      <Button onClick={parse} className="w-full">
        Parse .env
      </Button>

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {variables.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium">Environment Variables</span>
              <Badge variant="outline">{variables.filter(v => v.key).length}</Badge>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={exportEnv}
                className="gap-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy All
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={downloadEnv}
              >
                Download
              </Button>
            </div>
          </div>

          <div className="rounded-md border bg-muted/30 max-h-[500px] overflow-y-auto">
            <div className="divide-y">
              {variables.map((variable, i) => (
                <div key={i} className="flex gap-2 items-center p-2 hover:bg-muted/50 transition-colors">
                  <Input
                    placeholder="KEY"
                    value={variable.key}
                    onChange={e => updateVar(i, 'key', e.target.value)}
                    className="flex-1 font-mono text-sm h-8"
                  />
                  <div className="flex items-center flex-1 relative">
                    <Input
                      type={variable.visible ? 'text' : 'password'}
                      placeholder="value"
                      value={variable.value}
                      onChange={e => updateVar(i, 'value', e.target.value)}
                      className="flex-1 font-mono text-sm h-8"
                    />
                    <button
                      onClick={() => toggleVisible(i)}
                      className="absolute right-2 text-muted-foreground hover:text-foreground"
                    >
                      {variable.visible ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => copy(variable.value)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeVar(i)}
                    className="text-destructive hover:bg-destructive/10 p-1 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={addVar}
            className="w-full gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Variable
          </Button>
        </div>
      )}

      {variables.length === 0 && !error && (
        <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
          <p>Paste .env file content to get started</p>
        </div>
      )}
    </div>
  )
}
