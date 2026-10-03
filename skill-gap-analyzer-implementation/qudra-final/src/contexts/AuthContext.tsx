/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '../services/types'
import { AuthService } from '../services/auth.service'
import { QudraStore } from '../services/store'

export interface AuthContextValue {
  user: User | null
  token: string | null
  loading: boolean
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  loading: false,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => QudraStore.getUser())
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('qudra_auth_token'))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Sync with remote FastAPI backend if user token exists
    let active = true
    AuthService.getCurrentUser().then((u) => {
      if (active) setUser(u)
    }).catch(() => {})

    return () => {
      active = false
    }
  }, [])

  const handleSignOut = async () => {
    setLoading(true)
    await AuthService.logout()
    localStorage.removeItem('qudra_auth_token')
    setToken(null)
    setUser(QudraStore.getUser())
    setLoading(false)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export { useAuth } from './useAuth'
