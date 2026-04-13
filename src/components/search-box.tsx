'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { getClientRegistry } from '@/registry/registry'
import { categoryMeta } from '@/registry/categories'
import { useDebounce } from '@/hooks/useDebounce'
import { useAiSearch } from '@/hooks/useAiSearch'
import { Input } from '@/components/ui/input'
import { Search, ArrowRight, Loader2, Brain } from 'lucide-react'
import Fuse from 'fuse.js'
import * as LucideIcons from 'lucide-react'
import type { AppManifest } from '@/registry/types'

const appRegistry = getClientRegistry()

const fuse = new Fuse(appRegistry, {
  keys: ['title', 'description', 'tags', 'slug'],
  threshold: 0.3,
})

function SearchResultRow({ app, onSelect, isAi }: { app: AppManifest; onSelect: () => void; isAi?: boolean }) {
  const IconComp = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[app.icon] ?? LucideIcons.Wrench
  const meta = categoryMeta[app.category as keyof typeof categoryMeta]
  return (
    <Link href={`/apps/${app.slug}`} onClick={onSelect}>
      <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/60 transition-colors cursor-pointer group">
        <div className={`h-7 w-7 rounded-lg ${meta?.color ?? 'bg-muted'} flex items-center justify-center text-white shrink-0`}>
          <IconComp className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium">{app.title}</p>
            {isAi && (
              <span className="text-[10px] font-medium px-1 py-0.5 rounded bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400">AI</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">{app.description}</p>
        </div>
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </div>
    </Link>
  )
}

interface SearchBoxProps {
  placeholder?: string
  className?: string
  /** Width of the dropdown panel (default: 420px) */
  dropdownWidth?: string
  /** Offset to nudge the dropdown left so it's better centred on narrow inputs */
  dropdownOffset?: string
  inputClassName?: string
}

export function SearchBox({
  placeholder = 'Search tools or describe your problem…',
  className = '',
  dropdownWidth = 'w-[420px]',
  dropdownOffset = '-left-8',
  inputClassName = '',
}: SearchBoxProps) {
  const [search, setSearch] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const debouncedSearch = useDebounce(search, 200)
  const { aiResults, aiLoading, isAiQuery } = useAiSearch(search)

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const searchResults = useMemo(() => {
    if (!debouncedSearch.trim()) return []
    return fuse.search(debouncedSearch).map(r => r.item).slice(0, 5)
  }, [debouncedSearch])

  const fuseSlugSet = new Set(searchResults.map(a => a.slug))
  const uniqueAiResults = aiResults.filter(a => !fuseSlugSet.has(a.slug))

  const showDropdown =
    dropdownOpen &&
    search.trim().length > 0 &&
    (searchResults.length > 0 || aiLoading || uniqueAiResults.length > 0)

  function close() {
    setSearch('')
    setDropdownOpen(false)
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        placeholder={placeholder}
        value={search}
        onChange={e => { setSearch(e.target.value); setDropdownOpen(true) }}
        onFocus={() => setDropdownOpen(true)}
        className={`pl-9 pr-9 h-9 bg-muted/50 ${inputClassName}`}
      />
      {aiLoading && (
        <Loader2 className="absolute right-3 top-2.5 h-4 w-4 text-violet-500 animate-spin pointer-events-none" />
      )}

      {showDropdown && (
        <div className={`absolute top-full mt-1.5 ${dropdownWidth} ${dropdownOffset} bg-background border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2`}>

          {/* Keyword results */}
          {searchResults.length > 0 && (
            <div>
              <div className="px-3 pt-2.5 pb-1 flex items-center gap-1.5">
                <Search className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quick matches</span>
              </div>
              {searchResults.map(app => (
                <SearchResultRow key={app.slug} app={app} onSelect={close} />
              ))}
            </div>
          )}

          {/* Divider */}
          {searchResults.length > 0 && isAiQuery && <div className="border-t" />}

          {/* AI results */}
          {isAiQuery && (
            <div>
              <div className="px-3 pt-2.5 pb-1 flex items-center gap-1.5">
                <Brain className="h-3 w-3 text-violet-500" />
                <span className="text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wide">AI suggestions</span>
                {aiLoading && <Loader2 className="h-3 w-3 text-violet-400 animate-spin ml-auto" />}
              </div>

              {/* Skeleton */}
              {aiLoading && uniqueAiResults.length === 0 && (
                <div className="px-3 py-3 space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="h-7 w-7 rounded-lg bg-muted shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-muted rounded w-2/3" />
                        <div className="h-2.5 bg-muted rounded w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!aiLoading && uniqueAiResults.length === 0 && searchResults.length === 0 && (
                <p className="px-3 py-3 text-xs text-muted-foreground">No matching tools found. Try rephrasing.</p>
              )}

              {uniqueAiResults.map(app => (
                <SearchResultRow key={app.slug} app={app} onSelect={close} isAi />
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="border-t px-3 py-2 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {isAiQuery ? 'Describe your problem for AI-powered suggestions' : 'Type 3+ words for AI-powered search'}
            </p>
            <Link
              href={`/apps?search=${encodeURIComponent(search)}`}
              onClick={() => setDropdownOpen(false)}
              className="text-xs text-primary hover:underline"
            >
              See all →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
