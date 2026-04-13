'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function fmt(n: number, decimals = 2) {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState('100000')
  const [rate, setRate]           = useState('8.5')
  const [years, setYears]         = useState('5')
  const [currency, setCurrency]   = useState('$')

  const result = useMemo(() => {
    const P = parseFloat(principal)
    const annualRate = parseFloat(rate)
    const n = parseFloat(years) * 12
    if (!P || !annualRate || !n || P <= 0 || annualRate <= 0 || n <= 0) return null

    const r = annualRate / 100 / 12
    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
    const total = emi * n
    const interest = total - P

    // Year-by-year breakdown (first 10 years max)
    const schedule: { year: number; paid: number; balance: number }[] = []
    let balance = P
    for (let y = 1; y <= Math.min(parseFloat(years), 10); y++) {
      let yearPrincipal = 0
      for (let m = 0; m < 12; m++) {
        const intPart = balance * r
        const prinPart = emi - intPart
        yearPrincipal += prinPart
        balance -= prinPart
        if (balance < 0) balance = 0
      }
      schedule.push({ year: y, paid: yearPrincipal, balance: Math.max(balance, 0) })
    }

    return { emi, total, interest, schedule }
  }, [principal, rate, years])

  const pct = result ? (result.interest / result.total) * 100 : 0

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label className="text-xs mb-1.5 block">Loan Amount</Label>
          <div className="flex">
            <select value={currency} onChange={e => setCurrency(e.target.value)}
              className="h-9 border rounded-l-md px-2 text-sm bg-muted/50 border-r-0 text-muted-foreground">
              {['$','€','£','₹','¥'].map(c => <option key={c}>{c}</option>)}
            </select>
            <Input value={principal} onChange={e => setPrincipal(e.target.value)}
              type="number" min={0} placeholder="100000" className="rounded-l-none h-9" />
          </div>
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Annual Interest Rate (%)</Label>
          <Input value={rate} onChange={e => setRate(e.target.value)}
            type="number" min={0} max={100} step={0.1} placeholder="8.5" className="h-9" />
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Loan Term (years)</Label>
          <Input value={years} onChange={e => setYears(e.target.value)}
            type="number" min={1} max={30} placeholder="5" className="h-9" />
        </div>
      </div>

      {result ? (
        <div className="space-y-4">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Monthly EMI',     value: `${currency}${fmt(result.emi)}`,       color: 'text-primary' },
              { label: 'Total Payment',   value: `${currency}${fmt(result.total)}`,     color: '' },
              { label: 'Total Interest',  value: `${currency}${fmt(result.interest)}`,  color: 'text-destructive' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl border bg-muted/20 p-4 text-center">
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Progress bar: principal vs interest */}
          <div className="rounded-xl border p-4 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Principal ({(100 - pct).toFixed(1)}%)</span>
              <span>Interest ({pct.toFixed(1)}%)</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden flex">
              <div className="bg-primary transition-all" style={{ width: `${100 - pct}%` }} />
              <div className="bg-destructive/70 flex-1" />
            </div>
          </div>

          {/* Year-by-year */}
          <div className="rounded-xl border overflow-hidden">
            <div className="px-4 py-2.5 border-b bg-muted/30">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Year-by-Year Breakdown</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th className="px-4 py-2 text-left">Year</th>
                    <th className="px-4 py-2 text-right">Principal Paid</th>
                    <th className="px-4 py-2 text-right">Balance Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map(row => (
                    <tr key={row.year} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-2 font-medium">Year {row.year}</td>
                      <td className="px-4 py-2 text-right font-mono">{currency}{fmt(row.paid)}</td>
                      <td className="px-4 py-2 text-right font-mono">{currency}{fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border bg-muted/20 p-8 text-center text-muted-foreground text-sm">
          Enter loan details above to calculate EMI
        </div>
      )}
    </div>
  )
}
