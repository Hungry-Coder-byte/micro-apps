'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface LogEntry {
  level: string
  timestamp: string
  message: string
  raw: string
}

export default function LogParser() {
  const [logText, setLogText] = useState('')
  const [entries, setEntries] = useState<LogEntry[]>([])
  const [levelFilter, setLevelFilter] = useState('all')
  const [error, setError] = useState('')

  function parse() {
    setError('')
    setEntries([])

    if (!logText.trim()) {
      setError('Please paste log content')
      return
    }

    const lines = logText.split('\n')
    const parsed: LogEntry[] = []

    lines.forEach(line => {
      if (!line.trim()) return

      let entry: LogEntry | null = null

      // JSON log format
      if (line.trim().startsWith('{')) {
        try {
          const json = JSON.parse(line)
          entry = {
            level: json.level || json.severity || 'INFO',
            timestamp: json.timestamp || json.time || json.date || '',
            message: json.message || json.msg || json.text || '',
            raw: line,
          }
        } catch {
          // Continue to next format
        }
      }

      // Nginx format
      if (!entry && line.includes('[') && line.includes(']')) {
        const match = line.match(/(\d{1,2}\/\w+\/\d{4}:\d{2}:\d{2}:\d{2}) .*?"(GET|POST|PUT|DELETE|PATCH)" (\d{3})/)
        if (match) {
          entry = {
            level: match[3].startsWith('5') ? 'ERROR' : match[3].startsWith('4') ? 'WARN' : 'INFO',
            timestamp: match[1],
            message: line,
            raw: line,
          }
        }
      }

      // Syslog format
      if (!entry && line.match(/^[A-Z][a-z]{2}\s+\d{1,2}/)) {
        const match = line.match(/^(\w+\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}).*?(\w+)\[/)
        if (match) {
          entry = {
            level: line.includes('error') ? 'ERROR' : line.includes('warn') ? 'WARN' : 'INFO',
            timestamp: match[1],
            message: line,
            raw: line,
          }
        }
      }

      // Generic format with log levels
      if (!entry) {
        const levelMatch = line.match(/\b(DEBUG|INFO|WARN|WARNING|ERROR|CRITICAL|FATAL)\b/i)
        if (levelMatch) {
          entry = {
            level: levelMatch[1].toUpperCase(),
            timestamp: '',
            message: line,
            raw: line,
          }
        } else {
          entry = {
            level: 'INFO',
            timestamp: '',
            message: line,
            raw: line,
          }
        }
      }

      if (entry) {
        parsed.push(entry)
      }
    })

    if (parsed.length === 0) {
      setError('Could not parse any log entries')
      return
    }

    setEntries(parsed)
  }

  const filteredEntries = levelFilter === 'all'
    ? entries
    : entries.filter(e => e.level === levelFilter)

  const stats = {
    total: entries.length,
    errors: entries.filter(e => e.level === 'ERROR').length,
    warnings: entries.filter(e => e.level === 'WARN' || e.level === 'WARNING').length,
    info: entries.filter(e => e.level === 'INFO').length,
    debug: entries.filter(e => e.level === 'DEBUG').length,
  }

  const levels = Array.from(new Set(entries.map(e => e.level))).sort()

  const levelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
      case 'CRITICAL':
      case 'FATAL':
        return 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200'
      case 'WARN':
      case 'WARNING':
        return 'bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200'
      case 'DEBUG':
        return 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200'
      default:
        return 'bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-200'
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Log Content</label>
        <Textarea
          value={logText}
          onChange={e => setLogText(e.target.value)}
          placeholder="Paste log file content here..."
          className="font-mono text-xs min-h-[150px]"
        />
      </div>

      <Button onClick={parse} className="w-full">
        Parse Logs
      </Button>

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {entries.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <div className="rounded-md border bg-muted p-2">
              <div className="text-xs text-muted-foreground">Total</div>
              <div className="text-lg font-bold">{stats.total}</div>
            </div>
            <div className="rounded-md border bg-red-50 dark:bg-red-950 p-2">
              <div className="text-xs text-muted-foreground">Errors</div>
              <div className="text-lg font-bold text-red-600 dark:text-red-400">{stats.errors}</div>
            </div>
            <div className="rounded-md border bg-yellow-50 dark:bg-yellow-950 p-2">
              <div className="text-xs text-muted-foreground">Warnings</div>
              <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{stats.warnings}</div>
            </div>
            <div className="rounded-md border bg-blue-50 dark:bg-blue-950 p-2">
              <div className="text-xs text-muted-foreground">Debug</div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.debug}</div>
            </div>
            <div className="rounded-md border bg-muted p-2">
              <div className="text-xs text-muted-foreground">Info</div>
              <div className="text-lg font-bold">{stats.info}</div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Filter by Level</label>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {levels.map(level => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {filteredEntries.length} log{filteredEntries.length !== 1 ? 's' : ''}
            </label>
            <div className="rounded-md border overflow-hidden max-h-[600px] overflow-y-auto">
              <div className="divide-y bg-muted/30">
                {filteredEntries.map((entry, i) => (
                  <div key={i} className="p-3 hover:bg-muted/50 transition-colors space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <Badge className={levelColor(entry.level)}>
                        {entry.level}
                      </Badge>
                      {entry.timestamp && (
                        <span className="text-xs text-muted-foreground font-mono">
                          {entry.timestamp}
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-xs break-all text-muted-foreground">
                      {entry.message || entry.raw}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!entries.length && !error && (
        <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
          <p>Supports: JSON logs, Nginx, Syslog, and generic formats</p>
        </div>
      )}
    </div>
  )
}
