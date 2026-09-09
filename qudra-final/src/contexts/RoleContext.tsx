import { useCallback, useState, type ReactNode } from 'react'
import { DEFAULT_USER, type Role, type UserInfo, type RoleContextValue } from './role-context-types'
import { RoleContext } from './role-context-object'

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

  const value: RoleContextValue = { role, switchRole, user, signup, login }

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}
