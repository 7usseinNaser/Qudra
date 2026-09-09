export type Role = 'c' | 'u'

export interface UserInfo {
  name: string
  email: string
  avatar: string
  isAuthenticated: boolean
}

export interface RoleContextValue {
  role: Role
  switchRole: (r: Role) => void
  user: UserInfo
  signup: (name: string, email: string) => void
  login: (email: string) => void
}

export const DEFAULT_USER: UserInfo = {
  name: 'أحمد السعيد',
  email: 'ahmed@example.com',
  avatar: 'أ',
  isAuthenticated: false,
}
