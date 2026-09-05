/**
 * RoleContext — إدارة الدور وحساب المستخدم.
 *
 * يدعم:
 * - 'c' (أو 'company'): صاحب مشكلة («مشكلتي»).
 * - 'u' (أو 'talent'): صاحب قدرة («ملفي»).
 * - بيانات المستخدم (الاسم، البريد، الرمز الرمزي).
 *
 * مطابق لمنطق prototype.html:
 * window.switchRole('c' | 'u')
 * window.pickRole('c' | 'u')
 */

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

export type Role = 'c' | 'u'

export interface UserInfo {
  name: string
  email: string
  avatar: string
  isAuthenticated: boolean
}

interface RoleContextValue {
  role: Role
  switchRole: (r: Role) => void
  user: UserInfo
  signup: (name: string, email: string) => void
  login: (email: string) => void
}

const DEFAULT_USER: UserInfo = {
  name: 'أحمد السعيد',
  email: 'ahmed@example.com',
  avatar: 'أ',
  isAuthenticated: false,
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined)

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

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole must be used within RoleProvider')
  return ctx
}
