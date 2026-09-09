import { useContext } from 'react'
import { ProblemContext } from './ProblemContext'
import type { ProblemContextValue } from './problem-context-value'

export function useProblem(): ProblemContextValue {
  const ctx = useContext(ProblemContext)
  if (!ctx) {
    throw new Error('useProblem must be used within ProblemProvider')
  }
  return ctx
}
