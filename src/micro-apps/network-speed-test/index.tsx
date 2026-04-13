'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Upload, Activity, Square, RotateCcw, Loader2, Wifi } from 'lucide-react'

// ─── constants ────────────────────────────────────────────────────────────────

// Cloudflare's public speed test endpoints (CORS-enabled, same ones used by speed.cloudflare.com)
const CF = 'https://speed.cloudflare.com'
const TEST_MS    = 8_000       // 8 s measurement window per direction
const DL_BYTES   = 25_000_000  // 25 MB per download stream
const DL_STREAMS = 4           // parallel download connections
const UL_BYTES   = 1_000_000   // 1 MB per upload chunk
const UL_STREAMS = 3           // parallel upload connections

type Phase = 'idle' | 'ping' | 'download' | 'upload' | 'done'

interface HistoryEntry { time: string; ping: number; download: number; upload: number }

// Lazily initialised upload blob — created once on the client side.
// Content-Type MUST be text/plain: it is one of the CORS "simple" content types,
// so the browser sends the POST without a preflight OPTIONS request.
// Combined with mode:'no-cors' below, the data travels over the network
// even though the response is opaque (we don't need to read it).
let _ulBlob: Blob | null = null
function getUploadBlob(): Blob {
  if (!_ulBlob) {
    const buf = new Uint8Array(UL_BYTES)
    for (let i = 0; i < UL_BYTES; i++) buf[i] = (i * 7 + 13) % 251
    _ulBlob = new Blob([buf], { type: 'text/plain' })
  }
  return _ulBlob
}

// ─── measurement functions ────────────────────────────────────────────────────

/** Latency: 10 round-trips to CF, trim 20% outliers from each end, return mean ms */
async function measurePing(): Promise<number> {
  const rtts: number[] = []
  for (let i = 0; i < 10; i++) {
    const t0 = performance.now()
    try {
      await fetch(`${CF}/__down?bytes=0&r=${i}`, { cache: 'no-store' })
      rtts.push(performance.now() - t0)
    } catch { /* skip individual failures */ }
    if (i < 9) await new Promise(r => setTimeout(r, 100))
  }
  if (rtts.length < 3) throw new Error('Cannot reach Cloudflare — check your internet connection')
  rtts.sort((a, b) => a - b)
  const trim = Math.max(1, Math.floor(rtts.length * 0.2))
  const mid = rtts.slice(trim, rtts.length - trim)
  return Math.round(mid.reduce((a, b) => a + b, 0) / mid.length)
}

/** Download: N parallel streams from Cloudflare for TEST_MS ms, report live Mbps every 500 ms */
async function measureDownload(
  onProgress: (mbps: number) => void,
  signal: AbortSignal,
): Promise<number> {
  let totalBytes = 0
  const startTime = performance.now()
  let lastBytes = 0
  let lastTime = startTime

  const tick = setInterval(() => {
    const now = performance.now()
    const dt = (now - lastTime) / 1000
    if (dt > 0 && totalBytes > lastBytes) {
      onProgress(Math.round(((totalBytes - lastBytes) * 8) / (dt * 1e6) * 10) / 10)
      lastBytes = totalBytes
      lastTime = now
    }
  }, 500)

  await Promise.all(
    Array.from({ length: DL_STREAMS }, async () => {
      while (!signal.aborted && performance.now() - startTime < TEST_MS) {
        try {
          const res = await fetch(`${CF}/__down?bytes=${DL_BYTES}&r=${Math.random()}`, {
            cache: 'no-store', signal,
          })
          if (!res.body) break
          const reader = res.body.getReader()
          while (!signal.aborted) {
            const { done, value } = await reader.read()
            if (done) break
            totalBytes += value.length
          }
        } catch {
          if (signal.aborted) return
          await new Promise(r => setTimeout(r, 300))
        }
      }
    })
  )

  clearInterval(tick)
  const elapsed = (performance.now() - startTime) / 1000
  return elapsed > 0 ? Math.round((totalBytes * 8) / (elapsed * 1e6) * 10) / 10 : 0
}

/** Upload: N parallel POST streams to Cloudflare for TEST_MS ms, report live Mbps every 500 ms */
async function measureUpload(
  onProgress: (mbps: number) => void,
  signal: AbortSignal,
): Promise<number> {
  let totalBytes = 0
  const startTime = performance.now()
  let lastBytes = 0
  let lastTime = startTime

  const tick = setInterval(() => {
    const now = performance.now()
    const dt = (now - lastTime) / 1000
    if (dt > 0 && totalBytes > lastBytes) {
      onProgress(Math.round(((totalBytes - lastBytes) * 8) / (dt * 1e6) * 10) / 10)
      lastBytes = totalBytes
      lastTime = now
    }
  }, 500)

  await Promise.all(
    Array.from({ length: UL_STREAMS }, async () => {
      while (!signal.aborted && performance.now() - startTime < TEST_MS) {
        try {
          // mode:'no-cors' + text/plain body = no CORS preflight, data is sent over the
          // real network, response is opaque (we don't need to read it to measure upload speed)
          await fetch(`${CF}/__up?r=${Math.random()}`, {
            method: 'POST',
            body: getUploadBlob(),
            cache: 'no-store',
            signal,
            mode: 'no-cors',
          })
          totalBytes += UL_BYTES
        } catch {
          if (signal.aborted) return
          await new Promise(r => setTimeout(r, 300))
        }
      }
    })
  )

  clearInterval(tick)
  const elapsed = (performance.now() - startTime) / 1000
  return elapsed > 0 ? Math.round((totalBytes * 8) / (elapsed * 1e6) * 10) / 10 : 0
}

// ─── SpeedGauge ───────────────────────────────────────────────────────────────

function SpeedGauge({
  label, value, unit, icon: Icon, color, active, hasResult,
}: {
  label: string
  value: number | null
  unit: string
  icon: React.ElementType
  color: string
  active: boolean
  hasResult: boolean
}) {
  return (
    <div className={`rounded-xl border p-4 flex flex-col items-center gap-3 text-center transition-all duration-300 ${active ? 'border-primary/50 bg-primary/5 shadow-sm' : ''}`}>
      <Icon className={`h-5 w-5 ${hasResult || active ? color : 'text-muted-foreground/30'}`} />
      <div className="flex flex-col items-center min-h-[3.25rem] justify-center">
        {active && value === null ? (
          <Loader2 className={`h-7 w-7 animate-spin ${color}`} />
        ) : (
          <>
            <span className={`text-3xl font-bold font-mono leading-none ${hasResult || (active && value !== null) ? color : 'text-muted-foreground/25'}`}>
              {value ?? '--'}
            </span>
            <span className="text-xs text-muted-foreground mt-1">{unit}</span>
          </>
        )}
      </div>
      <p className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">{label}</p>
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

const PHASE_LABEL: Record<Phase, string> = {
  idle:     '',
  ping:     'Measuring latency…',
  download: 'Measuring download speed…',
  upload:   'Measuring upload speed…',
  done:     'Test complete',
}

// Each phase animates the progress bar toward a target over its expected duration
const PHASE_CONFIG: Record<string, { base: number; range: number; duration: number }> = {
  ping:     { base: 0,   range: 8,  duration: 1500 },
  download: { base: 8,   range: 46, duration: TEST_MS },
  upload:   { base: 54,  range: 46, duration: TEST_MS },
}

export default function NetworkSpeedTest() {
  const [phase, setPhase]       = useState<Phase>('idle')
  const [pingMs, setPingMs]     = useState<number | null>(null)
  const [dlMbps, setDlMbps]     = useState<number | null>(null)
  const [ulMbps, setUlMbps]     = useState<number | null>(null)
  const [liveDl, setLiveDl]     = useState<number | null>(null)
  const [liveUl, setLiveUl]     = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [history, setHistory]   = useState<HistoryEntry[]>([])
  const [error, setError]       = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Smoothly animate the progress bar within each phase
  useEffect(() => {
    const cfg = PHASE_CONFIG[phase]
    if (!cfg) return
    const start = Date.now()
    const id = setInterval(() => {
      const t = (Date.now() - start) / cfg.duration
      // ease-out, cap at 90% so the bar doesn't reach the end before the phase finishes
      setProgress(cfg.base + Math.min(t * 0.9, 0.9) * cfg.range)
    }, 150)
    return () => clearInterval(id)
  }, [phase])

  const reset = useCallback(() => {
    setPingMs(null); setDlMbps(null); setUlMbps(null)
    setLiveDl(null); setLiveUl(null)
    setError(null); setPhase('idle'); setProgress(0)
  }, [])

  const stop = useCallback(() => {
    abortRef.current?.abort()
    setPhase('idle'); setProgress(0)
  }, [])

  const startTest = useCallback(async () => {
    reset()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    const { signal } = ctrl

    try {
      // ── 1. Ping ──────────────────────────────────────────────────────────
      setPhase('ping')
      const ping = await measurePing()
      if (signal.aborted) return
      setPingMs(ping)

      // ── 2. Download ──────────────────────────────────────────────────────
      setPhase('download')
      const download = await measureDownload(v => setLiveDl(v), signal)
      if (signal.aborted) return
      setDlMbps(download)
      setLiveDl(null)

      // ── 3. Upload ────────────────────────────────────────────────────────
      setPhase('upload')
      const upload = await measureUpload(v => setLiveUl(v), signal)
      if (signal.aborted) return
      setUlMbps(upload)
      setLiveUl(null)

      // ── Done ─────────────────────────────────────────────────────────────
      setPhase('done')
      setProgress(100)
      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
      setHistory(prev => [{ time, ping, download, upload }, ...prev.slice(0, 9)])
    } catch (e: unknown) {
      const msg = (e as Error).message
      if (!signal.aborted && msg !== 'aborted') {
        setError(msg || 'Speed test failed. Please try again.')
        setPhase('idle')
        setProgress(0)
      }
    }
  }, [reset])

  const isRunning = phase === 'ping' || phase === 'download' || phase === 'upload'
  const isDone    = phase === 'done'

  const displayDl = phase === 'download' ? liveDl : dlMbps
  const displayUl = phase === 'upload'   ? liveUl : ulMbps

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* ── Gauges ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        <SpeedGauge
          label="Ping"     value={pingMs}    unit="ms"   icon={Activity} color="text-amber-500"
          active={phase === 'ping'}     hasResult={pingMs !== null}
        />
        <SpeedGauge
          label="Download" value={displayDl} unit="Mbps" icon={Download} color="text-blue-500"
          active={phase === 'download'} hasResult={dlMbps !== null}
        />
        <SpeedGauge
          label="Upload"   value={displayUl} unit="Mbps" icon={Upload}   color="text-green-500"
          active={phase === 'upload'}   hasResult={ulMbps !== null}
        />
      </div>

      {/* ── Progress bar ────────────────────────────────────────────────── */}
      {(isRunning || isDone) && (
        <div className="space-y-1.5">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${isDone ? 'bg-green-500' : 'bg-primary'}`}
              style={{ width: `${isDone ? 100 : progress}%` }}
            />
          </div>
          <p className="text-center text-xs text-muted-foreground">{PHASE_LABEL[phase]}</p>
        </div>
      )}

      {/* ── Error ───────────────────────────────────────────────────────── */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive text-center">
          {error}
        </div>
      )}

      {/* ── Controls ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {isRunning ? (
          <Button variant="destructive" onClick={stop} className="gap-2">
            <Square className="h-4 w-4" /> Stop
          </Button>
        ) : (
          <Button onClick={startTest} className="gap-2">
            <Wifi className="h-4 w-4" />
            {isDone ? 'Run Again' : 'Start Speed Test'}
          </Button>
        )}
        {(isDone || (phase === 'idle' && (pingMs !== null || !!error))) && (
          <Button variant="outline" size="sm" onClick={reset} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
        )}
      </div>

      {/* ── Session history ─────────────────────────────────────────────── */}
      {history.length > 0 && (
        <div className="rounded-xl border overflow-hidden">
          <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Session history</div>
          <div className="divide-y">
            {history.map((h, i) => (
              <div key={i} className="px-4 py-2.5 grid grid-cols-4 gap-2 text-xs font-mono">
                <span className="text-muted-foreground">{h.time}</span>
                <span className="text-blue-500">↓ {h.download} Mbps</span>
                <span className="text-green-500">↑ {h.upload} Mbps</span>
                <span className="text-amber-500">{h.ping} ms</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-[10px] text-muted-foreground/50">
        Measured via Cloudflare&apos;s global network · {DL_STREAMS} parallel streams · {TEST_MS / 1000}s per direction
      </p>
    </div>
  )
}
