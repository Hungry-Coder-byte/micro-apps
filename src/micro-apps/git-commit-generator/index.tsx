'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GitCommitHorizontal, Construction, Copy } from 'lucide-react'

const TYPES = [
  { value: 'feat',     label: 'feat     — new feature' },
  { value: 'fix',      label: 'fix      — bug fix' },
  { value: 'docs',     label: 'docs     — documentation' },
  { value: 'style',    label: 'style    — formatting' },
  { value: 'refactor', label: 'refactor — code restructure' },
  { value: 'perf',     label: 'perf     — performance' },
  { value: 'test',     label: 'test     — tests' },
  { value: 'build',    label: 'build    — build system' },
  { value: 'ci',       label: 'ci       — CI/CD changes' },
  { value: 'chore',    label: 'chore    — maintenance' },
  { value: 'revert',   label: 'revert   — revert commit' },
]

const EXAMPLES = [
  { msg: 'feat(auth): add OAuth2 login with Google and GitHub',                       breaking: false },
  { msg: 'fix(api): handle null response from user profile endpoint',                 breaking: false },
  { msg: 'refactor(db): migrate from Mongoose to Prisma ORM\n\nBREAKING CHANGE: schema format has changed', breaking: true },
  { msg: 'docs(readme): update installation steps and add docker-compose example',    breaking: false },
  { msg: 'perf(images): lazy-load below-fold images with IntersectionObserver',       breaking: false },
]

export default function GitCommitGenerator() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="rounded-xl border p-4 space-y-3">
        <p className="text-xs font-medium">Commit details</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Type</Label>
            <Select defaultValue="feat">
              <SelectTrigger className="h-8 text-xs font-mono opacity-60" disabled><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map(t => <SelectItem key={t.value} value={t.value}><code className="text-xs">{t.label}</code></SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Scope (optional)</Label>
            <Input defaultValue="auth" disabled placeholder="e.g. api, auth, ui" className="h-8 text-xs font-mono opacity-60" />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Short description</Label>
          <Input defaultValue="add OAuth2 login with Google and GitHub" disabled className="h-8 text-xs opacity-60" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Body (optional)</Label>
          <textarea rows={3} disabled placeholder="Longer explanation of the change…"
            className="w-full rounded-lg border bg-muted/30 p-2.5 text-xs font-mono resize-none opacity-60 cursor-not-allowed" />
        </div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-not-allowed">
          <input type="checkbox" disabled className="rounded accent-primary" />
          Breaking change (adds BREAKING CHANGE footer)
        </label>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCommitHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium">Generated commit message</span>
          </div>
          <button disabled className="opacity-40 cursor-not-allowed"><Copy className="h-3.5 w-3.5 text-muted-foreground" /></button>
        </div>
        <pre className="p-4 text-sm font-mono text-primary">feat(auth): add OAuth2 login with Google and GitHub</pre>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Conventional commit examples</div>
        <div className="divide-y">
          {EXAMPLES.map(({ msg, breaking }, i) => (
            <div key={i} className="px-4 py-2.5 flex items-start gap-3 text-xs">
              <pre className="font-mono text-muted-foreground flex-1 whitespace-pre-wrap break-all">{msg}</pre>
              {breaking && <Badge variant="outline" className="text-[10px] px-1.5 text-red-600 border-red-400/40 shrink-0">breaking</Badge>}
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60"><GitCommitHorizontal className="h-4 w-4" /> Generate Message</Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
