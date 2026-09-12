import { createContext } from 'react'

export type UserRole = 'c' | 'u'

export interface UserProfile {
  name: string
  email: string
  avatar: string
  isAuthenticated: boolean
}

export interface UserContextValue {
  user: UserProfile
  role: UserRole
  setRole: (role: UserRole) => void
  switchRole: (role?: UserRole) => void
  signup: (name: string, email: string) => void
  login: (email: string) => void
  logout: () => void
}

export const UserContext = createContext<UserContextValue | undefined>(undefined)
