/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '../services/types'
import { AuthService } from '../services/auth.service'
import { getToken, clearToken } from '../services/api/client'
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
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => getToken())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    if (!token) {
      setLoading(false)
      setUser(null)
      return
    }
    AuthService.getCurrentUser().then((u) => {
      if (active) {
        setUser(u)
        setLoading(false)
      }
    }).catch(() => {
      if (active) {
        setUser(null)
        setLoading(false)
      }
    })

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
