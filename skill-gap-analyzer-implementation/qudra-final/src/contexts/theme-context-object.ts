import { createContext } from 'react'
import type { ThemeContextValue } from './theme-context-types'

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
