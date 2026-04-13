'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { MicroAppComponentProps } from '@/registry/types'
import { ArrowLeftRight, RefreshCw } from 'lucide-react'

const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'MXN',
  'BRL', 'KRW', 'SGD', 'HKD', 'NOK', 'SEK', 'DKK', 'NZD', 'ZAR', 'RUB',
  'TRY', 'AED', 'SAR', 'PLN', 'THB', 'IDR', 'HUF', 'CZK', 'ILS', 'CLP',
  'PHP', 'PKR', 'BDT', 'EGP', 'VND', 'NGN', 'UAH', 'RON', 'MYR', 'ARS',
]

interface ConversionResult {
  from: string
  to: string
  rate: number
  result: number
  amount: number
  lastUpdated?: string
}

export default function CurrencyConverter({ serverFetch }: MicroAppComponentProps) {
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('EUR')
  const [amount, setAmount] = useState('100')
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function convert() {
    setError('')
    setLoading(true)
    try {
      const data = await serverFetch!('currency', { from, to, amount }) as ConversionResult
      setResult(data)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  function swap() {
    setFrom(to)
    setTo(from)
    setResult(null)
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="text-lg font-mono"
            min="0"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">From</label>
            <Select value={from} onValueChange={setFrom}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" size="icon" onClick={swap} className="mt-6 shrink-0">
            <ArrowLeftRight className="h-4 w-4" />
          </Button>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">To</label>
            <Select value={to} onValueChange={setTo}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={convert} disabled={loading || !amount} className="w-full gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Converting...' : 'Convert'}
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-xl border bg-muted/30 p-6 text-center space-y-2">
          <p className="text-muted-foreground text-sm">
            {result.amount} {result.from} =
          </p>
          <p className="text-4xl font-bold text-primary">
            {result.result.toFixed(2)} {result.to}
          </p>
          <p className="text-sm text-muted-foreground">
            1 {result.from} = {result.rate.toFixed(6)} {result.to}
          </p>
          {result.lastUpdated && (
            <p className="text-xs text-muted-foreground">
              Rate updated: {result.lastUpdated}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
