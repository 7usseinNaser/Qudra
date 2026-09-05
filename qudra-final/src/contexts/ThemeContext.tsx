import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
type Theme = 'light' | 'dark'
interface ThemeContextValue { theme: Theme; toggleTheme: () => void }
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
const STORAGE_KEY = 'qudra-theme'
function getInitialTheme(): Theme {
  try { const s = localStorage.getItem(STORAGE_KEY); if (s === 'light' || s === 'dark') return s } catch {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); try { localStorage.setItem(STORAGE_KEY, theme) } catch {} }, [theme])
  const toggleTheme = useCallback(() => setTheme(p => p === 'dark' ? 'light' : 'dark'), [])
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext); if (!ctx) throw new Error('useTheme must be used within ThemeProvider'); return ctx
}
