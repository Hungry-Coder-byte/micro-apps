'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'

interface CalcSection {
  title: string
  inputs: { label: string; value: string; setter: (v: string) => void }[]
  result: string
  formula?: string
}

export default function PercentageCalculator() {
  const [pctOf_pct, setPctOf_pct] = useState('25')
  const [pctOf_num, setPctOf_num] = useState('200')

  const [isWhat_num, setIsWhat_num] = useState('50')
  const [isWhat_of, setIsWhat_of] = useState('200')

  const [change_from, setChange_from] = useState('100')
  const [change_to, setChange_to] = useState('150')

  const [inc_num, setInc_num] = useState('200')
  const [inc_pct, setInc_pct] = useState('15')

  const sections: CalcSection[] = [
    {
      title: 'What is X% of Y?',
      inputs: [
        { label: 'Percentage (%)', value: pctOf_pct, setter: setPctOf_pct },
        { label: 'Number (Y)', value: pctOf_num, setter: setPctOf_num },
      ],
      result: useMemo(() => {
        const p = parseFloat(pctOf_pct), n = parseFloat(pctOf_num)
        if (isNaN(p) || isNaN(n)) return '—'
        return `${(p / 100 * n).toLocaleString(undefined, { maximumFractionDigits: 6 })}`
      }, [pctOf_pct, pctOf_num]),
      formula: `${pctOf_pct}% × ${pctOf_num} = result`,
    },
    {
      title: 'X is what % of Y?',
      inputs: [
        { label: 'Number (X)', value: isWhat_num, setter: setIsWhat_num },
        { label: 'Total (Y)', value: isWhat_of, setter: setIsWhat_of },
      ],
      result: useMemo(() => {
        const x = parseFloat(isWhat_num), y = parseFloat(isWhat_of)
        if (isNaN(x) || isNaN(y) || y === 0) return '—'
        return `${(x / y * 100).toFixed(4)}%`
      }, [isWhat_num, isWhat_of]),
      formula: `(${isWhat_num} ÷ ${isWhat_of}) × 100 = result`,
    },
    {
      title: '% Change from X to Y',
      inputs: [
        { label: 'Original (X)', value: change_from, setter: setChange_from },
        { label: 'New Value (Y)', value: change_to, setter: setChange_to },
      ],
      result: useMemo(() => {
        const from = parseFloat(change_from), to = parseFloat(change_to)
        if (isNaN(from) || isNaN(to) || from === 0) return '—'
        const pct = ((to - from) / Math.abs(from)) * 100
        return `${pct >= 0 ? '+' : ''}${pct.toFixed(4)}% ${pct >= 0 ? '(increase)' : '(decrease)'}`
      }, [change_from, change_to]),
      formula: `((${change_to} - ${change_from}) ÷ |${change_from}|) × 100`,
    },
    {
      title: 'Increase / Decrease by %',
      inputs: [
        { label: 'Base Number', value: inc_num, setter: setInc_num },
        { label: 'Percentage (%)', value: inc_pct, setter: setInc_pct },
      ],
      result: useMemo(() => {
        const num = parseFloat(inc_num), pct = parseFloat(inc_pct)
        if (isNaN(num) || isNaN(pct)) return '—'
        const increased = num * (1 + pct / 100)
        const decreased = num * (1 - pct / 100)
        return `+${pct}%: ${increased.toFixed(4)} | -${pct}%: ${decreased.toFixed(4)}`
      }, [inc_num, inc_pct]),
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sections.map(section => (
        <div key={section.title} className="rounded-lg border p-4 space-y-3">
          <h3 className="font-semibold">{section.title}</h3>
          {section.inputs.map(inp => (
            <div key={inp.label} className="space-y-1">
              <label className="text-xs text-muted-foreground">{inp.label}</label>
              <Input
                type="number"
                value={inp.value}
                onChange={e => inp.setter(e.target.value)}
                className="font-mono"
              />
            </div>
          ))}
          <div className="rounded-md bg-primary text-primary-foreground p-3 text-center">
            <p className="text-sm opacity-80 mb-1">Result</p>
            <p className="text-xl font-bold font-mono">{section.result}</p>
          </div>
          {section.formula && (
            <p className="text-xs text-muted-foreground font-mono">{section.formula}</p>
          )}
        </div>
      ))}
    </div>
  )
}
