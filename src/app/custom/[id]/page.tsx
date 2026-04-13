'use client'

import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { buildPreviewSrcdoc } from '@/lib/preview-builder'
import {
  ChevronLeft, Eye, Code2, Settings, Copy, Check, Trash2,
  Loader2, RefreshCw, Bot, Sparkles, ChevronDown,
  Cpu, Key, Zap, ExternalLink, Save,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

type Provider = 'ollama' | 'anthropic' | 'openai'
type Tab = 'preview' | 'code' | 'edit'

const OLLAMA_MODELS = ['llama3:latest', 'codellama', 'qwen2.5-coder:7b', 'deepseek-coder-v2', 'mistral', 'phi4']
const ANTHROPIC_MODELS = ['claude-sonnet-4-6', 'claude-opus-4-6', 'claude-haiku-4-5-20251001']
const OPENAI_MODELS = ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo']

interface AppData {
  id: string
  title: string
  description: string
  prompt: string
  code: string
  createdAt: string
  isPublic: boolean
}

export default function CustomAppPage() {
  const params  = useParams()
  const router  = useRouter()
  const { resolvedTheme } = useTheme()
  const isDark  = resolvedTheme === 'dark'
  const id      = params.id as string

  const [app, setApp]           = useState<AppData | null>(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('preview')

  // Code display
  const [copied, setCopied] = useState(false)

  // Edit / Regenerate state
  const [editTitle, setEditTitle]     = useState('')
  const [editPrompt, setEditPrompt]   = useState('')
  const [provider, setProvider]       = useState<Provider>('ollama')
  const [modelName, setModelName]     = useState('llama3:latest')
  const [apiKey, setApiKey]           = useState('')
  const [showApiKey, setShowApiKey]   = useState(false)
  const [showModelDrop, setShowModelDrop] = useState(false)

  const [saving, setSaving]           = useState(false)
  const [generating, setGenerating]   = useState(false)
  const [streamedCode, setStreamedCode] = useState('')
  const [genError, setGenError]       = useState('')

  const streamRef   = useRef('')
  const abortRef    = useRef<AbortController | null>(null)

  // Fetch app data
  useEffect(() => {
    fetch(`/api/custom/${id}`)
      .then(r => r.json())
      .then(d => {
        if (!d.ok) { setNotFound(true); return }
        setApp(d.data)
        setEditTitle(d.data.title)
        setEditPrompt(d.data.prompt)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  // Sync API key from sessionStorage when provider changes
  useEffect(() => {
    setApiKey(sessionStorage.getItem(`apikey-${provider}`) || '')
  }, [provider])

  useEffect(() => {
    if (apiKey) sessionStorage.setItem(`apikey-${provider}`, apiKey)
  }, [apiKey, provider])

  useEffect(() => {
    if (provider === 'ollama')    setModelName('llama3:latest')
    if (provider === 'anthropic') setModelName('claude-sonnet-4-6')
    if (provider === 'openai')    setModelName('gpt-4o')
  }, [provider])

  // Build srcdoc from current app code or streamed code
  const srcdoc = useMemo(() => {
    const code = streamedCode || app?.code || ''
    if (!code.trim()) return ''
    return buildPreviewSrcdoc(code, isDark)
  }, [app?.code, streamedCode, isDark])

  const handleCopy = () => {
    const code = streamedCode || app?.code || ''
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    if (!confirm(`Delete "${app?.title}"? This cannot be undone.`)) return
    await fetch(`/api/custom/${id}`, { method: 'DELETE' })
    router.push('/custom')
  }

  const handleSaveTitle = async () => {
    if (!app) return
    setSaving(true)
    await fetch(`/api/custom/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle }),
    })
    setApp(prev => prev ? { ...prev, title: editTitle } : prev)
    setSaving(false)
  }

  const handleRegenerate = useCallback(async () => {
    if (!editPrompt.trim()) return
    setGenError('')
    setStreamedCode('')
    streamRef.current = ''
    setGenerating(true)
    setActiveTab('code')

    const ctrl = new AbortController()
    abortRef.current = ctrl

    try {
      const genRes = await fetch(`/api/custom/${id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: editPrompt, provider, modelName, apiKey }),
        signal: ctrl.signal,
      })

      if (!genRes.ok) {
        const err = await genRes.json().catch(() => ({ error: 'Generation failed' }))
        throw new Error(err.error || `HTTP ${genRes.status}`)
      }

      const reader = genRes.body?.getReader()
      if (!reader) throw new Error('No response stream')

      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        streamRef.current += chunk
        setStreamedCode(prev => prev + chunk)
      }

      // Update local app state with new code
      setApp(prev => prev ? { ...prev, code: streamRef.current, prompt: editPrompt } : prev)
      setActiveTab('preview')

    } catch (e: unknown) {
      if ((e as Error).name === 'AbortError') return
      setGenError((e as Error).message || 'Generation failed.')
    } finally {
      setGenerating(false)
    }
  }, [id, editPrompt, provider, modelName, apiKey])

  const modelList = provider === 'ollama' ? OLLAMA_MODELS : provider === 'anthropic' ? ANTHROPIC_MODELS : OPENAI_MODELS
  const currentCode = streamedCode || app?.code || ''

  // ── Loading / Not Found ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (notFound || !app) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Bot className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h2 className="text-lg font-bold mb-2">App not found</h2>
          <p className="text-sm text-muted-foreground mb-6">This app may have been deleted or doesn't exist.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/custom"><Button variant="outline">My Apps</Button></Link>
            <Link href="/custom/new"><Button>Create New App</Button></Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="px-4 h-16 flex items-center gap-3">
          <Link href="/custom">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground -ml-2">
              <ChevronLeft className="h-4 w-4" /> My Apps
            </Button>
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold text-sm truncate">{app.title}</span>
            <Badge variant="secondary" className="text-[10px] shrink-0">AI Generated</Badge>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Tab bar */}
      <div className="border-b bg-background">
        <div className="flex items-center px-4 gap-0">
          {[
            { id: 'preview' as Tab, label: 'Preview', icon: Eye },
            { id: 'code'    as Tab, label: 'Code',    icon: Code2 },
            { id: 'edit'    as Tab, label: 'Edit & Regenerate', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3.5 text-sm border-b-2 transition-colors shrink-0 ${
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
          {currentCode && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          )}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">

        {/* ── PREVIEW TAB ── */}
        {activeTab === 'preview' && (
          <div className="h-full flex flex-col">
            {srcdoc ? (
              <iframe
                key={srcdoc}
                srcDoc={srcdoc}
                sandbox="allow-scripts"
                className="flex-1 w-full border-0"
                title={app.title}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Eye className="h-8 w-8 text-muted-foreground/30" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No preview available</p>
                <p className="text-xs text-muted-foreground/60 mt-1 mb-4">Generate code first using the Edit tab</p>
                <Button size="sm" onClick={() => setActiveTab('edit')} className="gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Generate App
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ── CODE TAB ── */}
        {activeTab === 'code' && (
          <div className="h-full overflow-auto bg-[#1e1e2e] dark:bg-[#0d0d1a]">
            {currentCode ? (
              <pre className="p-5 text-[11px] font-mono leading-relaxed text-[#cdd6f4] whitespace-pre-wrap break-words">
                {currentCode}
                {generating && (
                  <span className="inline-block w-2 h-4 bg-primary/60 ml-0.5 animate-pulse rounded-sm" />
                )}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <Code2 className="h-10 w-10 text-muted-foreground/20 mb-3" />
                <p className="text-sm text-muted-foreground/60">No code yet — use the Edit tab to generate</p>
              </div>
            )}
          </div>
        )}

        {/* ── EDIT TAB ── */}
        {activeTab === 'edit' && (
          <div className="h-full overflow-y-auto">
            <div className="max-w-2xl mx-auto p-6 space-y-6">

              {/* Title */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">App Title</label>
                <div className="flex gap-2">
                  <Input
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveTitle}
                    disabled={saving || editTitle === app.title}
                    className="shrink-0 gap-1.5"
                  >
                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    Save
                  </Button>
                </div>
              </div>

              <div className="border-t" />

              {/* Model Picker */}
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Model for Regeneration</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { p: 'ollama'    as Provider, icon: Cpu,      label: 'Ollama',    badge: 'Free' },
                    { p: 'anthropic' as Provider, icon: Bot,      label: 'Anthropic', badge: 'Paid' },
                    { p: 'openai'    as Provider, icon: Sparkles, label: 'OpenAI',    badge: 'Paid' },
                  ]).map(({ p, icon: Icon, label, badge }) => (
                    <button
                      key={p}
                      onClick={() => setProvider(p)}
                      className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-center transition-all ${
                        provider === p ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/40'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${provider === p ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`text-xs font-medium ${provider === p ? 'text-primary' : ''}`}>{label}</span>
                      <Badge variant="outline" className="text-[9px] px-1">{badge}</Badge>
                    </button>
                  ))}
                </div>

                {/* Model dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowModelDrop(v => !v)}
                    className="w-full flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm hover:bg-muted/50"
                  >
                    <span className="font-mono text-xs">{modelName}</span>
                    <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${showModelDrop ? 'rotate-180' : ''}`} />
                  </button>
                  {showModelDrop && (
                    <div className="absolute z-10 top-full left-0 right-0 mt-1 rounded-lg border bg-popover shadow-lg overflow-hidden">
                      {modelList.map(m => (
                        <button
                          key={m}
                          onClick={() => { setModelName(m); setShowModelDrop(false) }}
                          className={`w-full text-left px-3 py-2 text-xs font-mono hover:bg-muted ${modelName === m ? 'bg-primary/10 text-primary font-semibold' : ''}`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* API key */}
                {(provider === 'anthropic' || provider === 'openai') && (
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Key className="h-3 w-3" />
                      {provider === 'anthropic' ? 'Anthropic' : 'OpenAI'} API Key
                    </label>
                    <div className="relative">
                      <Input
                        type={showApiKey ? 'text' : 'password'}
                        placeholder={provider === 'anthropic' ? 'sk-ant-...' : 'sk-...'}
                        value={apiKey}
                        onChange={e => setApiKey(e.target.value)}
                        className="font-mono text-xs pr-10"
                      />
                      <button
                        onClick={() => setShowApiKey(v => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t" />

              {/* Prompt */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prompt</label>
                <p className="text-xs text-muted-foreground">Edit the description to change what the app does, then regenerate.</p>
                <Textarea
                  value={editPrompt}
                  onChange={e => setEditPrompt(e.target.value)}
                  rows={8}
                  className="text-sm resize-none font-mono"
                  disabled={generating}
                />
              </div>

              {genError && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2.5 text-xs text-destructive">
                  {genError}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {generating ? (
                  <Button
                    variant="destructive"
                    className="flex-1 gap-2"
                    onClick={() => abortRef.current?.abort()}
                  >
                    <Loader2 className="h-4 w-4 animate-spin" /> Stop
                  </Button>
                ) : (
                  <Button
                    className="flex-1 gap-2"
                    onClick={handleRegenerate}
                    disabled={!editPrompt.trim()}
                  >
                    <Zap className="h-4 w-4" />
                    {currentCode ? 'Regenerate App' : 'Generate App'}
                  </Button>
                )}
                {currentCode && !generating && (
                  <Button
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => setActiveTab('preview')}
                  >
                    <ExternalLink className="h-4 w-4" /> View
                  </Button>
                )}
              </div>

              {currentCode && !generating && (
                <div className="rounded-xl border bg-muted/20 p-4 space-y-1.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">App Info</p>
                  <div className="grid grid-cols-2 gap-y-1 text-xs">
                    <span className="text-muted-foreground">Created</span>
                    <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                    <span className="text-muted-foreground">Code size</span>
                    <span>{(currentCode.length / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
