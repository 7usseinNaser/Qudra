import { createContext } from 'react'
import type { ProblemContextValue } from './problem-context-value'

export const ProblemContext = createContext<ProblemContextValue | undefined>(undefined)
