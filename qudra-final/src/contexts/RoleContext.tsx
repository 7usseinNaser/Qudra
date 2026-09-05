import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
export type Role = 'company' | 'talent'
interface RoleContextValue { role: Role; switchRole: (r: Role) => void }
const RoleContext = createContext<RoleContextValue | undefined>(undefined)
export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('company')
  const switchRole = useCallback((r: Role) => setRole(r), [])
  return <RoleContext.Provider value={{ role, switchRole }}>{children}</RoleContext.Provider>
}
export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext); if (!ctx) throw new Error('useRole must be used within RoleProvider'); return ctx
}
