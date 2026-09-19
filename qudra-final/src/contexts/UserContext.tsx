import { useState, useCallback, type ReactNode } from 'react'
import {
  type UserProfile,
  type UserRole,
  UserContext,
} from './user-context-types'

const DEFAULT_USER: UserProfile = {
  name: 'حسين ناصر',
  email: 'hussein@qudra.io',
  avatar: 'ح',
  isAuthenticated: false,
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER)
  const [role, setRoleState] = useState<UserRole>('c')

  const setRole = useCallback((newRole: UserRole) => {
    setRoleState(newRole)
  }, [])

  const switchRole = useCallback((targetRole?: UserRole) => {
    setRoleState((prev) => (targetRole ? targetRole : prev === 'c' ? 'u' : 'c'))
  }, [])

  const signup = useCallback((name: string, email: string) => {
    const trimmed = name.trim()
    const av = trimmed.charAt(0) || 'أ'
    setUser({
      name: trimmed || 'مستخدم جديد',
      email: email.trim(),
      avatar: av,
      isAuthenticated: true,
    })
  }, [])

  const login = useCallback((email: string) => {
    setUser((prev) => ({
      ...prev,
      email: email.trim(),
      isAuthenticated: true,
    }))
  }, [])

  const logout = useCallback(() => {
    setUser(DEFAULT_USER)
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        role,
        setRole,
        switchRole,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
