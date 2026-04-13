'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import Papa from 'papaparse'
import { Upload, AlertCircle } from 'lucide-react'

interface ColumnInfo {
  name: string
  type: 'string' | 'number' | 'boolean' | 'mixed'
  nullCount: number
  uniqueCount: number
  min?: number
  max?: number
  avg?: number
}

interface AnalysisResult {
  rowCount: number
  columnCount: number
  columns: ColumnInfo[]
  data: string[][]
  error?: string
}

export default function CsvAnalyzer() {
  const [csvText, setCsvText] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')

  function analyzeCsv() {
    setError('')
    setResult(null)

    if (!csvText.trim()) {
      setError('Please paste or upload CSV data')
      return
    }

    try {
      Papa.parse(csvText, {
        header: false,
        skipEmptyLines: true,
        complete: (results: any) => {
          if (!results.data || results.data.length === 0) {
            setError('No data found in CSV')
            return
          }

          const data = results.data as string[][]
          const headers = data[0]
          const rows = data.slice(1)

          const columns: ColumnInfo[] = headers.map((header, colIndex) => {
            const values = rows.map(row => row[colIndex] || '')
            const nonEmpty = values.filter(v => v !== '' && v !== null)
            const nullCount = values.length - nonEmpty.length

            let type: 'string' | 'number' | 'boolean' | 'mixed' = 'string'
            const types = new Set<string>()

            nonEmpty.forEach(val => {
              if (val === 'true' || val === 'false') types.add('boolean')
              else if (!isNaN(Number(val)) && val !== '') types.add('number')
              else types.add('string')
            })

            if (types.size === 1) {
              type = Array.from(types)[0] as any
            } else if (types.size > 1) {
              type = 'mixed'
            }

            let min, max, avg
            if (type === 'number' || (type === 'mixed' && types.has('number'))) {
              const nums = nonEmpty
                .map(v => Number(v))
                .filter(v => !isNaN(v))
              if (nums.length > 0) {
                min = Math.min(...nums)
                max = Math.max(...nums)
                avg = (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2)
              }
            }

            return {
              name: header,
              type,
              nullCount,
              uniqueCount: new Set(nonEmpty).size,
              min,
              max,
              avg: avg ? parseFloat(avg) : undefined,
            }
          })

          setResult({
            rowCount: rows.length,
            columnCount: headers.length,
            columns,
            data: data.slice(0, 101),
          })
        },
        error: (error: any) => {
          setError(`Parse error: ${error.message}`)
        },
      })
    } catch (e) {
      setError(`Error: ${(e as Error).message}`)
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = event => {
        const text = event.target?.result as string
        setCsvText(text)
        e.target.value = ''
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium block mb-2">CSV Data</label>
          <Textarea
            value={csvText}
            onChange={e => setCsvText(e.target.value)}
            placeholder="name,age,email
John,30,john@example.com
Jane,28,jane@example.com"
            className="font-mono text-sm min-h-[200px]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="csv-file" className="text-sm font-medium">
            Or upload
          </label>
          <input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('csv-file')?.click()}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload CSV
          </Button>
        </div>
      </div>

      <Button onClick={analyzeCsv} className="w-full">
        Analyze CSV
      </Button>

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive flex gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-md border bg-muted p-3">
              <div className="text-xs text-muted-foreground">Rows</div>
              <div className="text-2xl font-bold">{result.rowCount.toLocaleString()}</div>
            </div>
            <div className="rounded-md border bg-muted p-3">
              <div className="text-xs text-muted-foreground">Columns</div>
              <div className="text-2xl font-bold">{result.columnCount}</div>
            </div>
            <div className="rounded-md border bg-muted p-3">
              <div className="text-xs text-muted-foreground">Cells</div>
              <div className="text-2xl font-bold">{(result.rowCount * result.columnCount).toLocaleString()}</div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Column Information</label>
            <div className="rounded-md border overflow-hidden max-h-[300px] overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Column</th>
                    <th className="px-3 py-2 text-left font-medium">Type</th>
                    <th className="px-3 py-2 text-right font-medium">Unique</th>
                    <th className="px-3 py-2 text-right font-medium">Nulls</th>
                    <th className="px-3 py-2 text-right font-medium">Min/Max/Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {result.columns.map((col, i) => (
                    <tr key={i} className="border-t hover:bg-muted/50">
                      <td className="px-3 py-2 font-mono">{col.name}</td>
                      <td className="px-3 py-2">
                        <Badge variant="outline" className="text-xs">{col.type}</Badge>
                      </td>
                      <td className="px-3 py-2 text-right">{col.uniqueCount}</td>
                      <td className="px-3 py-2 text-right">{col.nullCount}</td>
                      <td className="px-3 py-2 text-right text-xs font-mono">
                        {col.min !== undefined && `${col.min}/${col.max}/${col.avg}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Data Preview (first 100 rows)</label>
            <div className="rounded-md border overflow-hidden max-h-[400px] overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    {result.columns.map((col, i) => (
                      <th key={i} className="px-3 py-2 text-left font-medium border-r last:border-r-0">
                        {col.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.data.slice(1).map((row, i) => (
                    <tr key={i} className="border-t hover:bg-muted/50">
                      {row.map((cell, j) => (
                        <td key={j} className="px-3 py-2 border-r last:border-r-0 font-mono">
                          {cell || '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!result && !error && (
        <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
          <p>Paste or upload CSV data to analyze</p>
        </div>
      )}
    </div>
  )
}
