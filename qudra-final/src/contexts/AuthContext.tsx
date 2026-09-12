/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '../services/types'
import { AuthService } from '../services/auth.service'
import { QudraStore } from '../services/store'
import { getToken, clearToken } from '../services/api/client'

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
  const [token, setToken] = useState<string | null>(() => getToken())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    if (!token) {
      return
    }
    AuthService.getCurrentUser().then((u) => {
      if (active) setUser(u)
    }).catch(() => {})

    return () => {
      active = false
    }
  }, [token])

  const handleSignOut = async () => {
    setLoading(true)
    await AuthService.logout()
    clearToken()
    setToken(null)
    QudraStore.resetAll()
    setUser(null)
    setLoading(false)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export { useAuth } from './useAuth'
