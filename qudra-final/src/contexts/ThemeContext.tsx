import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { THEME_STORAGE_KEY, type Theme, type ThemeContextValue } from './theme-context-types'
import { ThemeContext } from './theme-context-object'

function getInitialTheme(): Theme {
  try {
    const s = localStorage.getItem(THEME_STORAGE_KEY)
    if (s === 'light' || s === 'dark') return s
  } catch { /* ignore storage error */ }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem(THEME_STORAGE_KEY, theme) } catch { /* ignore storage error */ }
  }, [theme])

  const toggleTheme = useCallback(() => setTheme(p => p === 'dark' ? 'light' : 'dark'), [])

  const value: ThemeContextValue = { theme, toggleTheme }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
