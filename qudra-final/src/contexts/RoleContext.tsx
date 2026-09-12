import { useCallback, useState, type ReactNode } from 'react'
import {
  type Role,
  type UserInfo,
  RoleContext,
} from './role-context-types'

const DEFAULT_USER: UserInfo = {
  name: 'أحمد السعيد',
  email: 'ahmed@example.com',
  avatar: 'أ',
  isAuthenticated: false,
}

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
