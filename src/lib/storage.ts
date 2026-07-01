import type { AppState } from '../types'

const STORAGE_KEY = 'orbit-calendar-state'

export function loadState(): Partial<AppState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Partial<AppState>
  } catch {
    return null
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // quota exceeded — silently fail for MVP
  }
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY)
}
