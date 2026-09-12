import { useContext } from 'react'
import { ProblemContext, type ProblemContextValue } from './problem-context-types'

export function useProblem(): ProblemContextValue {
  const ctx = useContext(ProblemContext)
  if (!ctx) {
    throw new Error('useProblem must be used within ProblemProvider')
  }
  return ctx
}
