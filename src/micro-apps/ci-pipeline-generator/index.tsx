'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GitBranch, Construction, Copy } from 'lucide-react'

const PREVIEW = `name: CI / CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --coverage

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
      - uses: vercel/action@v1
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}`

export default function CiPipelineGenerator() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="rounded-xl border p-4 space-y-3">
        <p className="text-xs font-medium">Pipeline options</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Platform</Label>
            <Select defaultValue="github">
              <SelectTrigger className="h-8 text-xs opacity-60" disabled><SelectValue /></SelectTrigger>
              <SelectContent>
                {['GitHub Actions','GitLab CI','Bitbucket Pipelines','CircleCI','Jenkins'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Language / Runtime</Label>
            <Select defaultValue="node">
              <SelectTrigger className="h-8 text-xs opacity-60" disabled><SelectValue /></SelectTrigger>
              <SelectContent>
                {['Node.js','Python','Go','Java','Rust','Ruby','PHP'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Deploy target</Label>
            <Select defaultValue="vercel">
              <SelectTrigger className="h-8 text-xs opacity-60" disabled><SelectValue /></SelectTrigger>
              <SelectContent>
                {['Vercel','AWS','GCP','Azure','Docker Hub','None'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Trigger branch</Label>
            <Select defaultValue="main">
              <SelectTrigger className="h-8 text-xs opacity-60" disabled><SelectValue /></SelectTrigger>
              <SelectContent>
                {['main','master','develop','All branches'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 pt-1">
          {['Lint','Unit tests','Code coverage','Build','Docker build','Deploy'].map(s => (
            <label key={s} className="flex items-center gap-2 text-xs text-muted-foreground cursor-not-allowed">
              <input type="checkbox" disabled defaultChecked={['Lint','Unit tests','Build','Deploy'].includes(s)} className="rounded accent-primary" />
              {s}
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium">.github/workflows/ci.yml</span>
          </div>
          <button disabled className="opacity-40 cursor-not-allowed"><Copy className="h-3.5 w-3.5 text-muted-foreground" /></button>
        </div>
        <pre className="p-4 text-xs font-mono text-muted-foreground overflow-x-auto">{PREVIEW}</pre>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60"><GitBranch className="h-4 w-4" /> Generate Pipeline</Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
