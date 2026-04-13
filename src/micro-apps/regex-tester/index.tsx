'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

interface Match {
  match: string
  index: number
  groups: (string | undefined)[]
  namedGroups: Record<string, string> | null
}

export default function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testStr, setTestStr] = useState('Hello World! Hello Regex!')
  const [error, setError] = useState('')

  const { matches, highlighted } = useMemo(() => {
    if (!pattern) return { matches: [], highlighted: testStr }
    setError('')
    try {
      const re = new RegExp(pattern, flags)
      const found: Match[] = []
      let m: RegExpExecArray | null
      let safeFlags = flags.includes('g') ? flags : flags + 'g'
      const reG = new RegExp(pattern, safeFlags)
      while ((m = reG.exec(testStr)) !== null) {
        found.push({
          match: m[0],
          index: m.index,
          groups: m.slice(1),
          namedGroups: m.groups ? { ...m.groups } : null,
        })
        if (!flags.includes('g')) break
        if (m[0].length === 0) reG.lastIndex++
      }

      // Build highlighted HTML
      let result = ''
      let last = 0
      const colors = ['bg-yellow-200 dark:bg-yellow-800', 'bg-green-200 dark:bg-green-800', 'bg-blue-200 dark:bg-blue-800']
      found.forEach((f, i) => {
        result += escapeHtml(testStr.slice(last, f.index))
        result += `<mark class="${colors[i % colors.length]} rounded px-0.5">${escapeHtml(f.match)}</mark>`
        last = f.index + f.match.length
      })
      result += escapeHtml(testStr.slice(last))

      return { matches: found, highlighted: result }
    } catch (e) {
      setError((e as Error).message)
      return { matches: [], highlighted: escapeHtml(testStr) }
    }
  }, [pattern, flags, testStr])

  function escapeHtml(s: string) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  const flagOptions = ['g', 'i', 'm', 's', 'u']

  function toggleFlag(f: string) {
    setFlags(prev => prev.includes(f) ? prev.replace(f, '') : prev + f)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium block mb-1">Pattern</label>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground font-mono text-lg">/</span>
            <Input
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              placeholder="[A-Z][a-z]+"
              className="font-mono"
            />
            <span className="text-muted-foreground font-mono text-lg">/{flags}</span>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Flags</label>
          <div className="flex gap-1">
            {flagOptions.map(f => (
              <button
                key={f}
                onClick={() => toggleFlag(f)}
                className={`px-2 py-1 text-sm font-mono rounded border transition-colors ${flags.includes(f) ? 'bg-primary text-primary-foreground border-primary' : 'border-input hover:bg-muted'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive font-mono">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Test String</label>
          <Badge variant="outline">{matches.length} match{matches.length !== 1 ? 'es' : ''}</Badge>
        </div>
        <Textarea
          value={testStr}
          onChange={e => setTestStr(e.target.value)}
          placeholder="Enter test string..."
          className="font-mono text-sm min-h-[120px]"
        />
      </div>

      {testStr && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Highlighted Matches</label>
          <div
            className="rounded-md border bg-muted/50 p-3 font-mono text-sm whitespace-pre-wrap min-h-[60px]"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </div>
      )}

      {matches.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Match Details</label>
          <div className="overflow-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-3 py-2">#</th>
                  <th className="text-left px-3 py-2">Match</th>
                  <th className="text-left px-3 py-2">Index</th>
                  <th className="text-left px-3 py-2">Groups</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                    <td className="px-3 py-2 font-mono font-semibold text-primary">{m.match || '(empty)'}</td>
                    <td className="px-3 py-2 text-muted-foreground">{m.index}</td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {m.namedGroups && Object.keys(m.namedGroups).length > 0 ? (
                        Object.entries(m.namedGroups).map(([k, v]) => (
                          <span key={k} className="mr-2 bg-muted rounded px-1">{k}: {v}</span>
                        ))
                      ) : m.groups.length > 0 ? (
                        m.groups.map((g, j) => (
                          <span key={j} className="mr-2 bg-muted rounded px-1">${j + 1}: {g ?? 'undefined'}</span>
                        ))
                      ) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
