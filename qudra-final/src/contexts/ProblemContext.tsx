import { useState, useCallback, type ReactNode } from 'react'
import {
  type CapabilityItem,
  DEFAULT_CAPABILITIES,
  DEFAULT_PROBLEM_TEXT,
  ProblemContext,
} from './problem-context-types'

export function ProblemProvider({ children }: { children: ReactNode }) {
  const [problemText, setProblemTextState] = useState<string>(DEFAULT_PROBLEM_TEXT)
  const [summary, setSummaryState] = useState<string>(DEFAULT_PROBLEM_TEXT)
  const [category, setCategoryState] = useState<string>('تعليم')
  const [capabilities, setCapabilitiesState] = useState<CapabilityItem[]>(DEFAULT_CAPABILITIES)
  const [simulationAnswers, setSimulationAnswersState] = useState<string[]>(['', '', ''])
  const [isAnalyzing, setIsAnalyzingState] = useState<boolean>(false)

  const setProblemText = useCallback((text: string) => {
    setProblemTextState(text)
  }, [])

  const setSummary = useCallback((sum: string) => {
    setSummaryState(sum)
  }, [])

  const setCategory = useCallback((cat: string) => {
    setCategoryState(cat)
  }, [])

  const setCapabilities = useCallback((caps: CapabilityItem[]) => {
    setCapabilitiesState(caps)
  }, [])

  const setSimulationAnswers = useCallback((answers: string[]) => {
    setSimulationAnswersState(answers)
  }, [])

  const setIsAnalyzing = useCallback((analyzing: boolean) => {
    setIsAnalyzingState(analyzing)
  }, [])

  return (
    <ProblemContext.Provider
      value={{
        problemText,
        setProblemText,
        summary,
        setSummary,
        category,
        setCategory,
        capabilities,
        setCapabilities,
        simulationAnswers,
        setSimulationAnswers,
        isAnalyzing,
        setIsAnalyzing,
      }}
    >
      {children}
    </ProblemContext.Provider>
  )
}
