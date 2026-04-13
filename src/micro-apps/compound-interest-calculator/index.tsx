'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const FREQUENCIES = [
  { label: 'Annually',    n: 1 },
  { label: 'Semi-annually', n: 2 },
  { label: 'Quarterly',   n: 4 },
  { label: 'Monthly',     n: 12 },
  { label: 'Daily',       n: 365 },
]

export default function CompoundInterestCalculator() {
  const [principal,   setPrincipal]   = useState('10000')
  const [rate,        setRate]        = useState('8')
  const [years,       setYears]       = useState('10')
  const [frequency,   setFrequency]   = useState(12)
  const [contribution, setContribution] = useState('0')
  const [currency,    setCurrency]    = useState('$')

  const result = useMemo(() => {
    const P = parseFloat(principal)
    const r = parseFloat(rate) / 100
    const t = parseFloat(years)
    const n = frequency
    const pmt = parseFloat(contribution) || 0
    if (!P || !r || !t || P <= 0 || r <= 0 || t <= 0) return null

    // A = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
    const base = Math.pow(1 + r / n, n * t)
    const future = P * base + (pmt > 0 ? pmt * ((base - 1) / (r / n)) : 0)
    const totalContributions = P + pmt * n * t
    const earned = future - totalContributions

    // Yearly breakdown
    const rows: { year: number; value: number; contributed: number; interest: number }[] = []
    for (let y = 1; y <= Math.min(t, 20); y++) {
      const b = Math.pow(1 + r / n, n * y)
      const v = P * b + (pmt > 0 ? pmt * ((b - 1) / (r / n)) : 0)
      const contrib = P + pmt * n * y
      rows.push({ year: y, value: v, contributed: contrib, interest: v - contrib })
    }

    return { future, totalContributions, earned, rows, multiplier: future / P }
  }, [principal, rate, years, frequency, contribution])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <Label className="text-xs mb-1.5 block">Initial Investment</Label>
          <div className="flex">
            <select value={currency} onChange={e => setCurrency(e.target.value)}
              className="h-9 border rounded-l-md px-2 text-sm bg-muted/50 border-r-0">
              {['$','€','£','₹'].map(c => <option key={c}>{c}</option>)}
            </select>
            <Input value={principal} onChange={e => setPrincipal(e.target.value)}
              type="number" min={0} placeholder="10000" className="rounded-l-none h-9" />
          </div>
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Annual Rate (%)</Label>
          <Input value={rate} onChange={e => setRate(e.target.value)}
            type="number" min={0} max={100} step={0.1} placeholder="8" className="h-9" />
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Duration (years)</Label>
          <Input value={years} onChange={e => setYears(e.target.value)}
            type="number" min={1} max={50} placeholder="10" className="h-9" />
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Compounding</Label>
          <select value={frequency} onChange={e => setFrequency(Number(e.target.value))}
            className="h-9 w-full border rounded-md px-3 text-sm bg-background">
            {FREQUENCIES.map(f => <option key={f.n} value={f.n}>{f.label}</option>)}
          </select>
        </div>
        <div className="col-span-2 sm:col-span-2">
          <Label className="text-xs mb-1.5 block">Regular Contribution (per period, optional)</Label>
          <div className="flex">
            <span className="h-9 border rounded-l-md px-3 flex items-center text-sm bg-muted/50 text-muted-foreground border-r-0">{currency}</span>
            <Input value={contribution} onChange={e => setContribution(e.target.value)}
              type="number" min={0} placeholder="0" className="rounded-l-none h-9" />
          </div>
        </div>
      </div>

      {result ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Future Value',   value: `${currency}${fmt(result.future)}`,            color: 'text-primary' },
              { label: 'Total Invested', value: `${currency}${fmt(result.totalContributions)}`, color: '' },
              { label: 'Interest Earned', value: `${currency}${fmt(result.earned)}`,            color: 'text-green-600 dark:text-green-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl border bg-muted/20 p-4 text-center">
                <p className={`text-lg font-bold ${color}`}>{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border p-4 text-center">
            <p className="text-3xl font-bold text-primary">{result.multiplier.toFixed(2)}×</p>
            <p className="text-xs text-muted-foreground mt-1">Money multiplier over {years} years</p>
          </div>

          {/* Growth table */}
          <div className="rounded-xl border overflow-hidden">
            <div className="px-4 py-2.5 border-b bg-muted/30">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Year-by-Year Growth</p>
            </div>
            <div className="overflow-x-auto max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background border-b">
                  <tr className="text-xs text-muted-foreground">
                    <th className="px-4 py-2 text-left">Year</th>
                    <th className="px-4 py-2 text-right">Value</th>
                    <th className="px-4 py-2 text-right">Interest Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map(r => (
                    <tr key={r.year} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-2 font-medium">Year {r.year}</td>
                      <td className="px-4 py-2 text-right font-mono">{currency}{fmt(r.value)}</td>
                      <td className="px-4 py-2 text-right font-mono text-green-600 dark:text-green-400">+{currency}{fmt(r.interest)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border bg-muted/20 p-8 text-center text-muted-foreground text-sm">
          Enter values above to calculate compound interest
        </div>
      )}
    </div>
  )
}
