'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'

export default function AgeCalculator() {
  const [birthdate, setBirthdate] = useState('1990-01-15')

  const result = useMemo(() => {
    if (!birthdate) return null
    const birth = new Date(birthdate)
    if (isNaN(birth.getTime())) return null
    const now = new Date()
    if (birth > now) return { error: 'Birthdate cannot be in the future' }

    let years = now.getFullYear() - birth.getFullYear()
    let months = now.getMonth() - birth.getMonth()
    let days = now.getDate() - birth.getDate()

    if (days < 0) {
      months--
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
      days += prevMonth.getDate()
    }
    if (months < 0) {
      years--
      months += 12
    }

    const totalDays = Math.floor((now.getTime() - birth.getTime()) / 86400000)
    const totalHours = totalDays * 24
    const totalMinutes = totalHours * 60
    const totalWeeks = Math.floor(totalDays / 7)

    // Next birthday
    const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate())
    if (nextBirthday <= now) nextBirthday.setFullYear(now.getFullYear() + 1)
    const daysToNext = Math.ceil((nextBirthday.getTime() - now.getTime()) / 86400000)

    return { years, months, days, totalDays, totalHours, totalMinutes, totalWeeks, daysToNext, nextBirthdayDate: nextBirthday }
  }, [birthdate])

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="space-y-2">
        <label className="text-sm font-medium">Date of Birth</label>
        <Input
          type="date"
          value={birthdate}
          onChange={e => setBirthdate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
        />
      </div>

      {result?.error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
          {result.error}
        </div>
      )}

      {result && !result.error && (
        <div className="space-y-4">
          {/* Primary age display */}
          <div className="rounded-xl border bg-primary text-primary-foreground p-6 text-center">
            <p className="text-sm opacity-80 mb-2">Your Age</p>
            <div className="flex justify-center gap-6">
              <div>
                <p className="text-4xl font-bold">{result.years}</p>
                <p className="text-sm opacity-80">Years</p>
              </div>
              <div className="text-3xl opacity-40 self-center">:</div>
              <div>
                <p className="text-4xl font-bold">{result.months}</p>
                <p className="text-sm opacity-80">Months</p>
              </div>
              <div className="text-3xl opacity-40 self-center">:</div>
              <div>
                <p className="text-4xl font-bold">{result.days}</p>
                <p className="text-sm opacity-80">Days</p>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Days', value: result.totalDays?.toLocaleString() ?? '' },
              { label: 'Total Weeks', value: result.totalWeeks?.toLocaleString() ?? '' },
              { label: 'Total Hours', value: result.totalHours?.toLocaleString() ?? '' },
              { label: 'Total Minutes', value: result.totalMinutes?.toLocaleString() ?? '' },
            ].map(s => (
              <div key={s.label} className="rounded-lg border bg-muted/30 p-3 text-center">
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Next birthday */}
          <div className="rounded-md border bg-muted/30 p-4 flex items-center gap-3">
            <div className="text-3xl">🎂</div>
            <div>
              <p className="font-semibold">Next Birthday</p>
              <p className="text-sm text-muted-foreground">
                {result.nextBirthdayDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                {' '}— in {result.daysToNext} day{result.daysToNext !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
