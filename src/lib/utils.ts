import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSessionId(): string {
  if (typeof window === 'undefined') return 'server'
  let id = localStorage.getItem('_session_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('_session_id', id)
  }
  return id
}
