import { useContext } from 'react'
import { ThemeContext } from './theme-context-object'
import type { ThemeContextValue } from './theme-context-types'

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
