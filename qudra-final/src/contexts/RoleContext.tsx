import { createContext, useCallback, useState, type ReactNode } from 'react'
import { DEFAULT_USER, type Role, type UserInfo, type RoleContextValue } from './role-context-types'

export const RoleContext = createContext<RoleContextValue | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('c')
  const [user, setUser] = useState<UserInfo>(DEFAULT_USER)

  const switchRole = useCallback((r: Role) => {
    setRole(r)
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

  return (
    <RoleContext.Provider value={{ role, switchRole, user, signup, login }}>
      {children}
    </RoleContext.Provider>
  )
}
