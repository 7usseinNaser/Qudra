import type { ReactNode } from 'react'
import { ThemeProvider } from '../../contexts/ThemeContext'
import { RoleProvider } from '../../contexts/RoleContext'
import { ProblemProvider } from '../../contexts/ProblemContext'
import { AuthProvider } from '../../contexts/AuthContext'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RoleProvider>
          <ProblemProvider>
            {children}
          </ProblemProvider>
        </RoleProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
