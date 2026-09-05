/**
 * UserContext — سياق المستخدم والمصادقة وتبديل الدور.
 *
 * يدير:
 * 1. بيانات الحساب (الاسم، البريد، الصورة/الحرف الرمزي، وحالة تسجيل الدخول).
 * 2. الدور الفعلي المختار: 'c' (صاحب مشكلة) أو 'u' (صاحب قدرة / موهبة).
 * 3. دوال المصادقة (signup, login, logout, switchRole).
 *
 * منقول ومطابق لمنطق prototype.html (window.signup, window.pickRole, window.switchRole).
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type UserRole = 'c' | 'u' // 'c' = Problem Owner (مشكلتي), 'u' = Capability Owner (ملفي)

export interface UserProfile {
  name: string
  email: string
  avatar: string
  isAuthenticated: boolean
}

interface UserContextValue {
  user: UserProfile
  role: UserRole
  setRole: (role: UserRole) => void
  switchRole: (role?: UserRole) => void
  signup: (name: string, email: string) => void
  login: (email: string) => void
  logout: () => void
}

const DEFAULT_USER: UserProfile = {
  name: 'حسين ناصر',
  email: 'hussein@qudra.io',
  avatar: 'ح',
  isAuthenticated: false,
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

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
    setUser((prev) => ({
      ...prev,
      isAuthenticated: false,
    }))
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

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext)
  if (!ctx) {
    throw new Error('useUser must be used within UserProvider')
  }
  return ctx
}
