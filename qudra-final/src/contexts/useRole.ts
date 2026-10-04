import { useContext } from 'react'
import { RoleContext, type RoleContextValue } from './role-context-types'

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole must be used within RoleProvider')
  return ctx
}
