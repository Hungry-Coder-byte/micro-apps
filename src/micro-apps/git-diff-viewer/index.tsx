'use client'

import { useState, useMemo } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { diffLines } from 'diff'
import { ArrowRight } from 'lucide-react'

export default function GitDiffViewer() {
  const [original, setOriginal] = useState('')
  const [modified, setModified] = useState('')
  const [showUnchanged, setShowUnchanged] = useState(false)

  const diff = useMemo(() => {
    return diffLines(original, modified)
  }, [original, modified])

  const stats = useMemo(() => {
    let added = 0
    let removed = 0
    diff.forEach(part => {
      if (part.added) added += part.count || 0
      if (part.removed) removed += part.count || 0
    })
    return { added, removed }
  }, [diff])

  const filteredDiff = showUnchanged ? diff : diff.filter(p => p.added || p.removed || p.value === '\n')

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Original</label>
          <Textarea
            value={original}
            onChange={e => setOriginal(e.target.value)}
            placeholder="Paste original text..."
            className="font-mono text-sm min-h-[200px]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Modified</label>
          <Textarea
            value={modified}
            onChange={e => setModified(e.target.value)}
            placeholder="Paste modified text..."
            className="font-mono text-sm min-h-[200px]"
          />
        </div>
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1">
            <span className="text-green-600">+{stats.added}</span> added
          </Badge>
          <Badge variant="outline" className="gap-1">
            <span className="text-red-600">-{stats.removed}</span> removed
          </Badge>
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer ml-auto">
          <input
            type="checkbox"
            checked={showUnchanged}
            onChange={e => setShowUnchanged(e.target.checked)}
          />
          Show unchanged lines
        </label>
      </div>

      {(original || modified) && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Diff Output</label>
          <div className="rounded-md border bg-muted/30 overflow-hidden max-h-[600px] overflow-y-auto">
            <div className="font-mono text-sm">
              {filteredDiff.map((part, i) => (
                <div
                  key={i}
                  className={`whitespace-pre-wrap break-words px-3 py-1 ${
                    part.added
                      ? 'bg-green-500/15 text-green-700 dark:text-green-400'
                      : part.removed
                      ? 'bg-red-500/15 text-red-700 dark:text-red-400'
                      : 'text-foreground'
                  }`}
                >
                  <span className="select-none text-muted-foreground mr-2">
                    {part.added ? '+' : part.removed ? '-' : ' '}
                  </span>
                  {part.value}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!original && !modified && (
        <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
          <p>Paste text in both fields to see the diff</p>
        </div>
      )}

      <div className="rounded-md border bg-blue-50 dark:bg-blue-950 p-3 text-xs text-muted-foreground space-y-1">
        <p className="font-semibold text-primary">Diff Syntax:</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex gap-2 items-start">
            <span className="text-green-600 font-mono">+</span>
            <span>Lines added in modified</span>
          </div>
          <div className="flex gap-2 items-start">
            <span className="text-red-600 font-mono">-</span>
            <span>Lines removed in modified</span>
          </div>
        </div>
      </div>
    </div>
  )
}
