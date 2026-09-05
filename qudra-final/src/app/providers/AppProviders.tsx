import type { ReactNode } from 'react'
import { ThemeProvider } from '../../contexts/ThemeContext'
import { RoleProvider } from '../../contexts/RoleContext'
export function AppProviders({ children }: { children: ReactNode }) {
  return <ThemeProvider><RoleProvider>{children}</RoleProvider></ThemeProvider>
}
