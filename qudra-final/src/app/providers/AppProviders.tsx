import type { ReactNode } from 'react'
import { ThemeProvider } from '../../contexts/ThemeContext'
import { RoleProvider } from '../../contexts/RoleContext'
import { ProblemProvider } from '../../contexts/ProblemContext'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <RoleProvider>
        <ProblemProvider>
          {children}
        </ProblemProvider>
      </RoleProvider>
    </ThemeProvider>
  )
}
