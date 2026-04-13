'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useClipboard } from '@/hooks/useClipboard'
import { Copy, Check, RefreshCw, Eye, EyeOff } from 'lucide-react'
import zxcvbn from 'zxcvbn'

export default function PasswordStrength() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { copy, copied } = useClipboard()

  const analysis = useMemo(() => {
    if (!password) return null
    return zxcvbn(password)
  }, [password])

  function generateStrongPassword() {
    const length = 16
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(result)
  }

  const scoreLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Very Strong']
  const scoreColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500']

  const timeEstimates = {
    0: 'Less than a second',
    1: '3 seconds',
    2: '3 minutes',
    3: '3 hours',
    4: '3 days',
    5: '3 weeks',
    6: '3 months',
    7: '3 years',
    8: 'Centuries',
  }

  function getTimeEstimate(score: number): string {
    if (score >= 8) return 'Centuries'
    if (score >= 7) return '3 years'
    if (score >= 6) return '3 months'
    if (score >= 5) return '3 weeks'
    if (score >= 4) return '3 days'
    if (score >= 3) return '3 hours'
    if (score >= 2) return '3 minutes'
    if (score >= 1) return '3 seconds'
    return 'Less than a second'
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <div className="flex gap-2">
          <Input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter a password to test..."
            className="font-mono text-sm"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted-foreground hover:text-foreground px-3 py-2"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {password && analysis && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Strength</label>
              <span className="text-sm font-semibold">{scoreLabels[analysis.score]}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all ${scoreColors[analysis.score]}`}
                style={{ width: `${((analysis.score + 1) / 5) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-md border bg-muted p-2">
              <div className="text-xs text-muted-foreground">Guesses</div>
              <div className="font-mono font-bold">{analysis.guesses.toLocaleString()}</div>
            </div>
            <div className="rounded-md border bg-muted p-2">
              <div className="text-xs text-muted-foreground">Crack Time (100/h)</div>
              <div className="font-mono font-bold text-sm">{getTimeEstimate(analysis.score)}</div>
            </div>
          </div>

          {analysis.feedback && (
            <div className="rounded-md border bg-blue-50 dark:bg-blue-950 p-3 space-y-1">
              {analysis.feedback.warning && (
                <div className="text-sm text-blue-900 dark:text-blue-100">
                  <div className="font-semibold">Warning: {analysis.feedback.warning}</div>
                </div>
              )}
              {analysis.feedback.suggestions.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-blue-900 dark:text-blue-100">Suggestions:</div>
                  <ul className="list-disc list-inside text-xs text-blue-900 dark:text-blue-100 space-y-0.5">
                    {analysis.feedback.suggestions.map((suggestion, i) => (
                      <li key={i}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {analysis.sequence.length > 0 && (
            <div className="rounded-md border bg-muted p-3 space-y-1">
              <div className="text-xs font-semibold">Detected Patterns:</div>
              <div className="space-y-1">
                {analysis.sequence.map((seq: any, i: number) => (
                  <div key={i} className="text-xs font-mono bg-background rounded p-1">
                    <span className="text-muted-foreground">{seq.pattern}:</span> {password.substring(seq.i, seq.j)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={generateStrongPassword}
          className="flex-1 gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Generate Strong Password
        </Button>
        {password && (
          <Button
            variant="outline"
            onClick={() => copy(password)}
            className="gap-2"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            Copy
          </Button>
        )}
      </div>

      {!password && (
        <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
          <p>Enter a password to analyze its strength</p>
        </div>
      )}

      <div className="rounded-md border bg-blue-50 dark:bg-blue-950 p-3 space-y-2 text-xs text-muted-foreground">
        <p className="font-semibold text-primary">Password Tips:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>Use 12+ characters for good security</li>
          <li>Mix uppercase, lowercase, numbers, and symbols</li>
          <li>Avoid common words, names, or patterns</li>
          <li>Use unique passwords for important accounts</li>
          <li>Consider using a password manager</li>
        </ul>
      </div>
    </div>
  )
}
