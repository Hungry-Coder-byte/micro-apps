import { useLocalStorage } from './useLocalStorage'

export function useRecentApps() {
  const [recent, setRecent] = useLocalStorage<string[]>('recent_apps', [])

  const addRecent = (slug: string) => {
    setRecent(prev => {
      const filtered = prev.filter(s => s !== slug)
      return [slug, ...filtered].slice(0, 6)
    })
  }

  return { recent, addRecent }
}
