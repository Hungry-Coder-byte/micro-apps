'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useClipboard } from '@/hooks/useClipboard'
import { Copy, Check, Download, ArrowRight } from 'lucide-react'

export default function JsonCsv() {
  const [json2csvInput, setJson2csvInput] = useState('[{"name":"Alice","age":30,"city":"NYC"},{"name":"Bob","age":25,"city":"LA"}]')
  const [json2csvOutput, setJson2csvOutput] = useState('')
  const [csv2jsonInput, setCsv2jsonInput] = useState('name,age,city\nAlice,30,NYC\nBob,25,LA')
  const [csv2jsonOutput, setCsv2jsonOutput] = useState('')
  const [error, setError] = useState('')
  const { copy, copied } = useClipboard()

  async function convertJsonToCsv() {
    setError('')
    try {
      const Papa = (await import('papaparse')).default
      const data = JSON.parse(json2csvInput)
      if (!Array.isArray(data)) throw new Error('Input must be a JSON array')
      const csv = Papa.unparse(data)
      setJson2csvOutput(csv)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  async function convertCsvToJson() {
    setError('')
    try {
      const Papa = (await import('papaparse')).default
      const result = Papa.parse(csv2jsonInput, { header: true, skipEmptyLines: true, dynamicTyping: true })
      if (result.errors.length > 0) {
        setError(result.errors[0].message)
        return
      }
      setCsv2jsonOutput(JSON.stringify(result.data, null, 2))
    } catch (e) {
      setError((e as Error).message)
    }
  }

  function download(content: string, filename: string, mime: string) {
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}

      <Tabs defaultValue="json2csv">
        <TabsList>
          <TabsTrigger value="json2csv">JSON → CSV</TabsTrigger>
          <TabsTrigger value="csv2json">CSV → JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="json2csv" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">JSON Array Input</label>
              <Textarea
                value={json2csvInput}
                onChange={e => setJson2csvInput(e.target.value)}
                className="font-mono text-sm min-h-[300px]"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">CSV Output</label>
                <div className="flex gap-2">
                  {json2csvOutput && (
                    <>
                      <Button size="sm" variant="ghost" onClick={() => copy(json2csvOutput)}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copy
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => download(json2csvOutput, 'data.csv', 'text/csv')}>
                        <Download className="h-4 w-4" /> Download
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <Textarea value={json2csvOutput} readOnly className="font-mono text-sm min-h-[300px] bg-muted" />
            </div>
          </div>
          <Button onClick={convertJsonToCsv} className="gap-2">
            <ArrowRight className="h-4 w-4" /> Convert to CSV
          </Button>
        </TabsContent>

        <TabsContent value="csv2json" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">CSV Input</label>
              <Textarea
                value={csv2jsonInput}
                onChange={e => setCsv2jsonInput(e.target.value)}
                className="font-mono text-sm min-h-[300px]"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">JSON Output</label>
                <div className="flex gap-2">
                  {csv2jsonOutput && (
                    <>
                      <Button size="sm" variant="ghost" onClick={() => copy(csv2jsonOutput)}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copy
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => download(csv2jsonOutput, 'data.json', 'application/json')}>
                        <Download className="h-4 w-4" /> Download
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <Textarea value={csv2jsonOutput} readOnly className="font-mono text-sm min-h-[300px] bg-muted" />
            </div>
          </div>
          <Button onClick={convertCsvToJson} className="gap-2">
            <ArrowRight className="h-4 w-4" /> Convert to JSON
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
