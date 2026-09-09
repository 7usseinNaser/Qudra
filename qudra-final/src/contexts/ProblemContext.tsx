import { useState, useCallback, type ReactNode } from 'react'
import { DEFAULT_CAPABILITIES, DEFAULT_PROBLEM_TEXT, type CapabilityItem } from './problem-context-constants'
import type { ProblemContextValue } from './problem-context-value'
import { ProblemContext } from './problem-context-object'

export function ProblemProvider({ children }: { children: ReactNode }) {
  const [problemText, setProblemTextState] = useState<string>(DEFAULT_PROBLEM_TEXT)
  const [summary] = useState<string>('صعوبة الطلاب في إدارة معلوماتهم الجامعية — المواد والمواعيد في مكان واحد.')
  const [category] = useState<string>('تعليم')
  const [capabilities] = useState<CapabilityItem[]>(DEFAULT_CAPABILITIES)
  const [simulationAnswers, setSimulationAnswersState] = useState<string[]>([])

  const setProblemText = useCallback((text: string) => {
    setProblemTextState(text)
  }, [])

  const setSimulationAnswers = useCallback((answers: string[]) => {
    setSimulationAnswersState(answers)
  }, [])

  const value: ProblemContextValue = {
    problemText,
    setProblemText,
    summary,
    category,
    capabilities,
    simulationAnswers,
    setSimulationAnswers,
  }

  return <ProblemContext.Provider value={value}>{children}</ProblemContext.Provider>
}
