'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, ArrowUpDown } from 'lucide-react'

interface Filter {
  id: string
  field: string
  operator: string
  value: string
}

export default function DataFilter() {
  const [jsonText, setJsonText] = useState('')
  const [filters, setFilters] = useState<Filter[]>([])
  const [sortField, setSortField] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [result, setResult] = useState<any[]>([])
  const [error, setError] = useState('')
  const [fields, setFields] = useState<string[]>([])

  function parseJson() {
    setError('')
    setResult([])
    setFields([])

    if (!jsonText.trim()) {
      setError('Please paste JSON array')
      return
    }

    try {
      const data = JSON.parse(jsonText)
      if (!Array.isArray(data)) {
        setError('JSON must be an array')
        return
      }

      if (data.length === 0) {
        setError('Array is empty')
        return
      }

      // Extract fields from first object
      const fieldNames = Object.keys(data[0]).filter(k => typeof data[0][k] !== 'object')
      setFields(fieldNames)
      applyFilters(data, fieldNames)
    } catch (e) {
      setError(`JSON parse error: ${(e as Error).message}`)
    }
  }

  function applyFilters(data: any[], fieldNames: string[]) {
    let filtered = [...data]

    // Apply filters
    filters.forEach(f => {
      if (!f.field || !f.value) return

      filtered = filtered.filter(item => {
        const fieldValue = String(item[f.field] || '')
        const compareValue = String(f.value)

        switch (f.operator) {
          case '=':
            return fieldValue === compareValue
          case '!=':
            return fieldValue !== compareValue
          case 'contains':
            return fieldValue.toLowerCase().includes(compareValue.toLowerCase())
          case 'not contains':
            return !fieldValue.toLowerCase().includes(compareValue.toLowerCase())
          case '>':
            return Number(fieldValue) > Number(compareValue)
          case '<':
            return Number(fieldValue) < Number(compareValue)
          case '>=':
            return Number(fieldValue) >= Number(compareValue)
          case '<=':
            return Number(fieldValue) <= Number(compareValue)
          case 'starts with':
            return fieldValue.toLowerCase().startsWith(compareValue.toLowerCase())
          case 'ends with':
            return fieldValue.toLowerCase().endsWith(compareValue.toLowerCase())
          default:
            return true
        }
      })
    })

    // Apply sorting
    if (sortField) {
      filtered.sort((a, b) => {
        const aVal = a[sortField]
        const bVal = b[sortField]
        let comparison = 0

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          comparison = aVal - bVal
        } else {
          comparison = String(aVal).localeCompare(String(bVal))
        }

        return sortOrder === 'asc' ? comparison : -comparison
      })
    }

    setResult(filtered)
  }

  function applyFiltersToCurrentData() {
    if (!jsonText.trim()) return
    try {
      const data = JSON.parse(jsonText)
      applyFilters(data, fields)
    } catch {
      // Already handled in parseJson
    }
  }

  function addFilter() {
    setFilters([...filters, { id: crypto.randomUUID(), field: '', operator: '=', value: '' }])
  }

  function removeFilter(id: string) {
    const updated = filters.filter(f => f.id !== id)
    setFilters(updated)
    setTimeout(applyFiltersToCurrentData, 0)
  }

  function updateFilter(id: string, key: keyof Filter, value: string) {
    const updated = filters.map(f => (f.id === id ? { ...f, [key]: value } : f))
    setFilters(updated)
    setTimeout(applyFiltersToCurrentData, 0)
  }

  const operators = ['=', '!=', '>', '<', '>=', '<=', 'contains', 'not contains', 'starts with', 'ends with']

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">JSON Array</label>
        <Textarea
          value={jsonText}
          onChange={e => setJsonText(e.target.value)}
          placeholder={'[{"name":"John","age":30},{"name":"Jane","age":28}]'}
          className="font-mono text-sm min-h-[150px]"
        />
      </div>

      <Button onClick={parseJson} className="w-full">
        Load Data
      </Button>

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {fields.length > 0 && (
        <div className="space-y-4 rounded-md border bg-muted/30 p-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Filters</label>
            <div className="space-y-2">
              {filters.map(f => (
                <div key={f.id} className="flex gap-2 items-end">
                  <Select value={f.field} onValueChange={v => updateFilter(f.id, 'field', v)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Field" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map(field => (
                        <SelectItem key={field} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={f.operator} onValueChange={v => updateFilter(f.id, 'operator', v)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map(op => (
                        <SelectItem key={op} value={op}>
                          {op}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Value"
                    value={f.value}
                    onChange={e => updateFilter(f.id, 'value', e.target.value)}
                    className="flex-1"
                  />

                  <button
                    onClick={() => removeFilter(f.id)}
                    className="text-destructive hover:bg-destructive/10 p-2 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <Button size="sm" variant="outline" onClick={addFilter} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Filter
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Sort</label>
            <div className="flex gap-2 items-end">
              <Select value={sortField} onValueChange={setSortField}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select field to sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {fields.map(field => (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={v => setSortOrder(v as 'asc' | 'desc')}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {result.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Results: {result.length} of {JSON.parse(jsonText || '[]').length} rows
            </label>
            {filters.length > 0 && (
              <Badge variant="secondary">{filters.length} filter{filters.length !== 1 ? 's' : ''} applied</Badge>
            )}
          </div>
          <div className="rounded-md border overflow-hidden max-h-[500px] overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted sticky top-0">
                <tr>
                  {fields.map(field => (
                    <th key={field} className="px-3 py-2 text-left font-medium border-r last:border-r-0">
                      {field}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.map((row, i) => (
                  <tr key={i} className="border-t hover:bg-muted/50">
                    {fields.map(field => (
                      <td key={field} className="px-3 py-2 border-r last:border-r-0 font-mono">
                        {String(row[field] ?? '').substring(0, 50)}
                      </td>
                    ))}
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
