import React from 'react'
import { registry } from './registry'
import type { MicroAppComponentProps } from './types'

const cache = new Map<string, React.LazyExoticComponent<React.ComponentType<MicroAppComponentProps>>>()

export function loadApp(slug: string): React.LazyExoticComponent<React.ComponentType<MicroAppComponentProps>> {
  if (cache.has(slug)) return cache.get(slug)!
  const entry = registry.find(a => a.slug === slug)
  if (!entry) throw new Error(`No app registered for slug: ${slug}`)
  const LazyApp = React.lazy(entry.load)
  cache.set(slug, LazyApp)
  return LazyApp
}
