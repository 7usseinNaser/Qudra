import type { CapabilityItem } from './problem-context-constants'

export interface ProblemContextValue {
  problemText: string
  setProblemText: (text: string) => void
  summary: string
  category: string
  capabilities: CapabilityItem[]
  simulationAnswers: string[]
  setSimulationAnswers: (answers: string[]) => void
}
