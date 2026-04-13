'use client'

import { useMemo } from 'react'
import { marked } from 'marked'

marked.setOptions({ breaks: true, gfm: true })

interface MarkdownOutputProps {
  content: string
  className?: string
  /** Use monospace font (for code-heavy outputs like README, error fixes) */
  mono?: boolean
}

export function MarkdownOutput({ content, className = '', mono = false }: MarkdownOutputProps) {
  const html = useMemo(() => {
    if (!content) return ''
    try {
      return marked.parse(content) as string
    } catch {
      return content
    }
  }, [content])

  return (
    <div
      className={[
        'prose prose-sm dark:prose-invert max-w-none',
        'text-foreground',
        'prose-headings:text-foreground prose-headings:font-semibold prose-headings:tracking-tight',
        'prose-h1:text-xl prose-h2:text-base prose-h3:text-sm',
        'prose-p:text-foreground prose-p:my-1 prose-p:leading-relaxed',
        'prose-li:text-foreground prose-ul:my-1 prose-ol:my-1 prose-li:my-0',
        'prose-strong:text-foreground prose-strong:font-semibold',
        'prose-em:text-foreground',
        'prose-code:before:content-none prose-code:after:content-none',
        'prose-code:bg-muted prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-xs prose-code:text-foreground',
        'prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg prose-pre:text-xs',
        'prose-blockquote:border-l-2 prose-blockquote:border-border prose-blockquote:text-muted-foreground',
        'prose-hr:border-border',
        'prose-a:text-primary prose-a:underline',
        'prose-table:text-foreground prose-th:text-foreground prose-td:text-foreground',
        mono ? 'font-mono text-xs' : 'text-sm',
        className,
      ].join(' ')}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
