'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useClipboard } from '@/hooks/useClipboard'
import type { MicroAppComponentProps } from '@/registry/types'
import { Copy, Check, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'

interface WebhookPayload {
  id: string
  timestamp: string
  payload: Record<string, any>
}

export default function WebhookTrigger({ serverFetch }: MicroAppComponentProps) {
  const [webhookUrl, setWebhookUrl] = useState('')
  const [webhookId, setWebhookId] = useState('')
  const [isPolling, setIsPolling] = useState(false)
  const [payloads, setPayloads] = useState<WebhookPayload[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { copy, copied } = useClipboard()

  async function createWebhook() {
    setError('')
    setLoading(true)

    try {
      const result = await serverFetch!('webhook', {
        action: 'create',
      }) as any

      setWebhookUrl(result.url)
      setWebhookId(result.id)
    } catch (e) {
      setError(`Error: ${(e as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  async function pollWebhook() {
    if (!webhookId) return

    try {
      const result = await serverFetch!('webhook', {
        action: 'poll',
        id: webhookId,
      }) as any

      if (result && result.payload) {
        setPayloads(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            payload: result.payload,
          },
        ])
      }
    } catch (e) {
      // Silently fail on poll - it's expected if no new data
    }
  }

  useEffect(() => {
    if (!isPolling || !webhookId) return

    const interval = setInterval(() => {
      pollWebhook()
    }, 2000)

    return () => clearInterval(interval)
  }, [isPolling, webhookId])

  const testPayloadExamples = [
    { name: 'Order Event', payload: { event: 'order.created', order_id: 12345, total: 99.99 } },
    { name: 'User Event', payload: { event: 'user.signup', user_id: 'user_123', email: 'user@example.com' } },
    { name: 'Payment Event', payload: { event: 'payment.received', amount: 1000, currency: 'USD', status: 'completed' } },
  ]

  return (
    <div className="space-y-4">
      {!webhookUrl ? (
        <div className="space-y-3">
          <div className="rounded-md border bg-blue-50 dark:bg-blue-950 p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-primary mb-2">Create a temporary webhook URL to receive test data</p>
            <p className="text-xs">
              This generates a unique URL where you can send test webhook payloads. All received data will be displayed below.
            </p>
          </div>

          {error && (
            <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            onClick={createWebhook}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Creating...' : 'Create Webhook URL'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-md border bg-green-50 dark:bg-green-950 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-green-800 dark:text-green-200">Webhook Created</span>
            </div>

            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Webhook URL:</label>
                <div className="flex gap-2">
                  <Input
                    value={webhookUrl}
                    readOnly
                    className="font-mono text-xs bg-background"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copy(webhookUrl)}
                    className="shrink-0"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Webhook ID:</label>
                <Input
                  value={webhookId}
                  readOnly
                  className="font-mono text-xs bg-muted"
                />
              </div>
            </div>

            <div className="mt-3 pt-3 border-t space-y-2 text-xs">
              <p className="font-medium text-foreground">How to send test data:</p>
              <div className="bg-background rounded p-2 font-mono text-xs overflow-auto">
                {`curl -X POST ${webhookUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"event":"test","data":"payload"}'`}
              </div>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <Button
              onClick={() => setIsPolling(!isPolling)}
              variant={isPolling ? 'default' : 'outline'}
              className="gap-2 flex-1"
            >
              <RefreshCw className="h-4 w-4" />
              {isPolling ? 'Polling...' : 'Start Polling'}
            </Button>
            {payloads.length > 0 && (
              <Button
                onClick={() => setPayloads([])}
                variant="outline"
                size="sm"
              >
                Clear
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Received Payloads ({payloads.length})
            </label>

            {payloads.length === 0 ? (
              <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
                <p className="text-sm">No payloads received yet</p>
                <p className="text-xs mt-1">Waiting for webhook data...</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden max-h-[500px] overflow-y-auto">
                {payloads.map((payload, i) => (
                  <div key={payload.id} className="border-b last:border-b-0 p-3 hover:bg-muted/50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">#{payloads.length - i}</Badge>
                        <span className="text-xs text-muted-foreground font-mono">
                          {new Date(payload.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copy(JSON.stringify(payload.payload, null, 2))}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <pre className="bg-muted p-2 rounded text-xs font-mono overflow-auto max-h-[200px] whitespace-pre-wrap">
                      {JSON.stringify(payload.payload, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Test with example payloads:</label>
            <div className="space-y-2">
              {testPayloadExamples.map((example, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setPayloads(prev => [
                      ...prev,
                      {
                        id: Date.now().toString(),
                        timestamp: new Date().toISOString(),
                        payload: example.payload,
                      },
                    ])
                  }}
                  className="w-full text-xs justify-start"
                >
                  {example.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
