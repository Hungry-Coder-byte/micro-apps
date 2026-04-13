'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { buildPreviewSrcdoc } from '@/lib/preview-builder'
import {
  Sparkles, Bot, ChevronLeft, Copy, Check,
  Loader2, ExternalLink, Grid3X3, RefreshCw,
  ChevronDown, Eye, Code2, Key, Cpu, Zap,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

type Provider = 'ollama' | 'anthropic' | 'openai'

const OLLAMA_MODELS = ['llama3:latest', 'codellama', 'qwen2.5-coder:7b', 'deepseek-coder-v2', 'mistral', 'phi4']
const ANTHROPIC_MODELS = ['claude-sonnet-4-6', 'claude-opus-4-6', 'claude-haiku-4-5-20251001']
const OPENAI_MODELS = ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo']

const TEMPLATES = [
  { emoji: '🧮', label: 'Calculator', prompt: 'A scientific calculator with history. Show a grid of buttons for digits, operators (+−×÷), parentheses, square root, and percent. Display the current expression and result at the top. Keep a history of last 5 calculations shown below.' },
  { emoji: '🎨', label: 'Color Palette', prompt: 'A color palette generator. Show 5 harmonious colors derived from a randomly generated base color. Display each color as a large swatch with its HEX, RGB and HSL values. Add a "Copy HEX" button per swatch, a "Generate New Palette" button, and support locking individual colors.' },
  { emoji: '📊', label: 'BMI Calculator', prompt: 'A BMI (Body Mass Index) calculator. Let users enter weight (kg or lbs) and height (cm or ft/in). Calculate BMI and show the result with a color-coded category label (Underweight / Normal / Overweight / Obese). Add a visual scale bar showing where their BMI falls.' },
  { emoji: '⏱️', label: 'Pomodoro Timer', prompt: 'A Pomodoro productivity timer. Show a circular countdown with 25-minute work sessions and 5-minute breaks. Add Start/Pause/Reset buttons, a session counter, and a short motivational message. Play a sound notification (using the Web Audio API) when a session ends.' },
  { emoji: '📝', label: 'Note Taking App', prompt: 'A minimal sticky-note app. Let users create, edit, and delete notes. Each note has a title and body. Store notes in localStorage. Show all notes in a masonry-style grid with different soft background colors per note. Add a search bar to filter notes.' },
  { emoji: '🔐', label: 'Password Generator', prompt: 'A strong password generator. Let users configure: length (8–64), include uppercase, lowercase, numbers, and symbols. Show the generated password in a large mono font with a copy button. Add a visual strength meter (Weak / Fair / Strong / Very Strong) and regenerate button.' },
  { emoji: '💱', label: 'Unit Converter', prompt: 'A unit converter for length, weight, temperature and speed. Show a dropdown to select the category, two input fields with unit selectors, and instantly update the converted value as the user types. Include the 5 most common units per category.' },
  { emoji: '🎲', label: 'Dice Roller', prompt: 'A dice roller app. Support rolling 1–6 dice of types d4, d6, d8, d10, d12, d20. Show animated dice faces (using CSS or emoji) when rolling. Display the individual results and the total sum. Keep a log of the last 10 rolls.' },
]

const PROVIDER_INFO: Record<Provider, { label: string; badge: string; badgeClass: string; icon: React.ComponentType<{ className?: string }>; description: string }> = {
  ollama:    { label: 'Ollama',    badge: 'Free · Local',  badgeClass: 'bg-green-100 text-green-700 border-green-200',  icon: Cpu,      description: 'Runs locally on your machine. No API key needed. Private & fast.' },
  anthropic: { label: 'Anthropic', badge: 'Paid · Cloud', badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',     icon: Bot,      description: 'Claude — best quality code generation. Requires an Anthropic API key.' },
  openai:    { label: 'OpenAI',    badge: 'Paid · Cloud', badgeClass: 'bg-purple-100 text-purple-700 border-purple-200', icon: Sparkles, description: 'GPT-4o — excellent for creative apps. Requires an OpenAI API key.' },
}

export default function CreateCustomAppPage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  // Form state
  const [title, setTitle]       = useState('')
  const [prompt, setPrompt]     = useState('')
  const [provider, setProvider] = useState<Provider>('ollama')
  const [modelName, setModelName] = useState('llama3:latest')
  const [apiKey, setApiKey]     = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [showModelDropdown, setShowModelDropdown] = useState(false)

  // Generation state
  const [generating, setGenerating] = useState(false)
  const [streamedCode, setStreamedCode] = useState('')
  const [previewSrc, setPreviewSrc]   = useState('')
  const [appId, setAppId]             = useState<string | null>(null)
  const [error, setError]             = useState('')
  const [done, setDone]               = useState(false)
  const [copied, setCopied]           = useState(false)

  // UI state
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code')

  // Refs for streaming
  const streamRef   = useRef('')
  const previewTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const abortRef    = useRef<AbortController | null>(null)

  // Persist API keys per provider in sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem(`apikey-${provider}`) || ''
    setApiKey(saved)
  }, [provider])

  useEffect(() => {
    if (apiKey) sessionStorage.setItem(`apikey-${provider}`, apiKey)
  }, [apiKey, provider])

  // Set default model when provider changes
  useEffect(() => {
    if (provider === 'ollama')    setModelName('llama3:latest')
    if (provider === 'anthropic') setModelName('claude-sonnet-4-6')
    if (provider === 'openai')    setModelName('gpt-4o')
  }, [provider])

  // Stop ongoing generation
  const stopGeneration = useCallback(() => {
    abortRef.current?.abort()
    if (previewTimer.current) clearInterval(previewTimer.current)
    setGenerating(false)
  }, [])

  const handleGenerate = useCallback(async () => {
    if (!title.trim() || !prompt.trim()) {
      setError('Please fill in the app title and description.')
      return
    }

    // Reset state
    setError('')
    setDone(false)
    setStreamedCode('')
    setPreviewSrc('')
    streamRef.current = ''
    setActiveTab('code')
    setGenerating(true)

    const ctrl = new AbortController()
    abortRef.current = ctrl

    try {
      // 1. Create the app record in DB
      const createRes = await fetch('/api/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, prompt, description: prompt.substring(0, 200) }),
        signal: ctrl.signal,
      })
      const createData = await createRes.json()
      if (!createData.ok) throw new Error(createData.error || 'Failed to create app')

      const id = createData.data.id
      setAppId(id)

      // 2. Stream generation
      const genRes = await fetch(`/api/custom/${id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, provider, modelName, apiKey }),
        signal: ctrl.signal,
      })

      if (!genRes.ok) {
        const errData = await genRes.json().catch(() => ({ error: 'Generation failed' }))
        throw new Error(errData.error || `HTTP ${genRes.status}`)
      }

      // 3. Start throttled preview refresh (every 600ms)
      previewTimer.current = setInterval(() => {
        if (streamRef.current.trim().length > 200) {
          setPreviewSrc(buildPreviewSrcdoc(streamRef.current, isDark))
        }
      }, 600)

      // 4. Read the stream
      const reader = genRes.body?.getReader()
      if (!reader) throw new Error('No response stream')

      const decoder = new TextDecoder()
      while (true) {
        const { done: streamDone, value } = await reader.read()
        if (streamDone) break
        const chunk = decoder.decode(value, { stream: true })
        streamRef.current += chunk
        setStreamedCode(prev => prev + chunk)
      }

      // 5. Done — final preview render
      if (previewTimer.current) clearInterval(previewTimer.current)
      const finalCode = streamRef.current
      setPreviewSrc(buildPreviewSrcdoc(finalCode, isDark))
      setActiveTab('preview')
      setDone(true)

    } catch (e: unknown) {
      if ((e as Error).name === 'AbortError') return
      setError((e as Error).message || 'Generation failed. Please try again.')
    } finally {
      if (previewTimer.current) clearInterval(previewTimer.current)
      setGenerating(false)
    }
  }, [title, prompt, provider, modelName, apiKey, isDark])

  const handleCopy = () => {
    navigator.clipboard.writeText(streamedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const modelList = provider === 'ollama' ? OLLAMA_MODELS : provider === 'anthropic' ? ANTHROPIC_MODELS : OPENAI_MODELS

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Grid3X3 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="hidden sm:inline">MicroApps</span>
          </Link>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">AI App Generator</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/custom">
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                <ChevronLeft className="h-4 w-4" /> My Apps
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT PANEL: Settings ── */}
        <div className="w-full max-w-sm xl:max-w-md border-r bg-muted/10 flex flex-col overflow-y-auto">
          <div className="p-5 space-y-6 flex-1">

            {/* Section: Model Picker */}
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Model</h2>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(PROVIDER_INFO) as Provider[]).map(p => {
                  const info = PROVIDER_INFO[p]
                  const Icon = info.icon
                  const active = provider === p
                  return (
                    <button
                      key={p}
                      onClick={() => setProvider(p)}
                      className={`relative flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-center transition-all duration-200 ${
                        active
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border hover:border-muted-foreground/40 hover:bg-muted/40'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`text-xs font-medium ${active ? 'text-primary' : 'text-foreground'}`}>
                        {info.label}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-medium ${info.badgeClass}`}>
                        {info.badge}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Provider description */}
              <p className="text-xs text-muted-foreground px-0.5">
                {PROVIDER_INFO[provider].description}
              </p>

              {/* Model selector */}
              <div className="relative">
                <button
                  onClick={() => setShowModelDropdown(v => !v)}
                  className="w-full flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
                >
                  <span className="font-mono text-xs">{modelName}</span>
                  <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showModelDropdown && (
                  <div className="absolute z-10 top-full left-0 right-0 mt-1 rounded-lg border bg-popover shadow-lg overflow-hidden">
                    {modelList.map(m => (
                      <button
                        key={m}
                        onClick={() => { setModelName(m); setShowModelDropdown(false) }}
                        className={`w-full text-left px-3 py-2 text-xs font-mono hover:bg-muted transition-colors ${modelName === m ? 'bg-primary/10 text-primary font-semibold' : ''}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* API Key (for paid providers) */}
              {(provider === 'anthropic' || provider === 'openai') && (
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Key className="h-3 w-3" />
                    {provider === 'anthropic' ? 'Anthropic' : 'OpenAI'} API Key
                  </label>
                  <div className="relative">
                    <Input
                      type={showApiKey ? 'text' : 'password'}
                      placeholder={`Enter your ${provider === 'anthropic' ? 'sk-ant-...' : 'sk-...'} key`}
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                      className="font-mono text-xs pr-10"
                    />
                    <button
                      onClick={() => setShowApiKey(v => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Stored in session only, never sent to our servers.</p>
                </div>
              )}
            </div>

            <div className="border-t" />

            {/* Section: App Details */}
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">App Details</h2>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Title</label>
                <Input
                  placeholder="e.g., Loan Calculator"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  disabled={generating}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="border-t" />

            {/* Section: Quick Templates */}
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick Templates</h2>
              <div className="flex flex-wrap gap-2">
                {TEMPLATES.map(t => (
                  <button
                    key={t.label}
                    onClick={() => {
                      setTitle(t.label)
                      setPrompt(t.prompt)
                    }}
                    disabled={generating}
                    className="flex items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs hover:bg-muted/60 hover:border-primary/40 transition-colors disabled:opacity-50"
                  >
                    <span>{t.emoji}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t" />

            {/* Section: Prompt */}
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Describe Your App</h2>
              <Textarea
                placeholder="Describe what your app should do, what inputs it accepts, what it outputs, and how it should look. The more detail you provide, the better the result…"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                disabled={generating}
                rows={7}
                className="text-sm resize-none"
              />
              <p className="text-[10px] text-muted-foreground">
                {prompt.length} chars · Tip: describe interactions, not just the visual layout.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2.5 text-xs text-destructive">
                {error}
              </div>
            )}
          </div>

          {/* Sticky bottom actions */}
          <div className="sticky bottom-0 p-4 border-t bg-background/80 backdrop-blur-sm space-y-2">
            {generating ? (
              <Button onClick={stopGeneration} variant="destructive" className="w-full gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Stop Generation
              </Button>
            ) : done && appId ? (
              <div className="space-y-2">
                <Link href={`/custom/${appId}`} className="block">
                  <Button className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" /> Open My App
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => {
                    setDone(false)
                    setStreamedCode('')
                    setPreviewSrc('')
                    setAppId(null)
                    setTitle('')
                    setPrompt('')
                  }}
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Generate Another
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleGenerate}
                disabled={!title.trim() || !prompt.trim()}
                className="w-full gap-2"
                size="lg"
              >
                <Zap className="h-4 w-4" /> Generate App
              </Button>
            )}
            {done && (
              <p className="text-center text-xs text-green-600 font-medium flex items-center justify-center gap-1">
                <Check className="h-3.5 w-3.5" /> App saved to My Apps
              </p>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL: Output ── */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Tab bar */}
          <div className="border-b bg-background flex items-center px-4 gap-0">
            {[
              { id: 'code' as const,    label: 'Code',    icon: Code2 },
              { id: 'preview' as const, label: 'Preview', icon: Eye },
            ].map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3.5 text-sm border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary font-medium'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              )
            })}
            <div className="flex-1" />
            {streamedCode && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-hidden relative">
            {/* Code tab */}
            <div className={`absolute inset-0 overflow-auto ${activeTab === 'code' ? '' : 'hidden'}`}>
              {streamedCode ? (
                <pre className="p-5 text-[11px] font-mono leading-relaxed text-foreground whitespace-pre-wrap break-words">
                  {streamedCode}
                  {generating && (
                    <span className="inline-block w-2 h-4 bg-primary/60 ml-0.5 animate-pulse rounded-sm" />
                  )}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  {generating ? (
                    <div className="space-y-4">
                      <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Generating with {PROVIDER_INFO[provider].label}…</p>
                        <p className="text-xs text-muted-foreground mt-1">Using model <span className="font-mono">{modelName}</span></p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
                        <Code2 className="h-8 w-8 text-muted-foreground/40" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Generated code will appear here</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">Fill in the form and click Generate App</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Preview tab */}
            <div className={`absolute inset-0 ${activeTab === 'preview' ? '' : 'hidden'}`}>
              {previewSrc ? (
                <iframe
                  srcDoc={previewSrc}
                  sandbox="allow-scripts"
                  className="w-full h-full border-0"
                  title="App Preview"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  {generating ? (
                    <div className="space-y-4">
                      <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Building preview…</p>
                        <p className="text-xs text-muted-foreground mt-1">Preview updates while code streams</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
                        <Eye className="h-8 w-8 text-muted-foreground/40" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Live preview will appear here</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">Preview renders automatically when generation completes</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
