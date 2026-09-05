/**
 * ProblemContext — سياق المشكلة المشترك عبر تدفق صاحب المشكلة.
 *
 * يخزن نص المشكلة المدخل، التصنيف، والقدرات الخمس المستخرجة منها
 * لمشاركتها بسلاسة بين ProblemInputPage و CapabilitiesPage وما يليها.
 *
 * راجع PROJECT_MAP.md → src/contexts/ProblemContext.tsx للتفاصيل الكاملة.
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export interface CapabilityItem {
  id: string
  name: string
  priority: 'أساسية' | 'مساندة'
  reason: string
  iconKey: 'layout' | 'phone' | 'server' | 'db' | 'bulb'
}

export const DEFAULT_CAPABILITIES: CapabilityItem[] = [
  {
    id: 'c1',
    name: 'UI/UX',
    priority: 'أساسية',
    reason: 'يساعد الطلاب على إيجاد موادهم بسهولة',
    iconKey: 'layout',
  },
  {
    id: 'c2',
    name: 'Mobile Development',
    priority: 'أساسية',
    reason: 'أريد بناء تطبيق',
    iconKey: 'phone',
  },
  {
    id: 'c3',
    name: 'Backend',
    priority: 'أساسية',
    reason: 'مواعيد ومواد تحتاج مصدر بيانات موحّد',
    iconKey: 'server',
  },
  {
    id: 'c4',
    name: 'Database',
    priority: 'مساندة',
    reason: 'تخزين المواد والجداول والتغييرات',
    iconKey: 'db',
  },
  {
    id: 'c5',
    name: 'Product Thinking',
    priority: 'مساندة',
    reason: 'تحديد ما يُبنى أولًا ضمن نطاق محدود',
    iconKey: 'bulb',
  },
]

export const DEFAULT_PROBLEM_TEXT = 'أريد بناء تطبيق يساعد طلاب الجامعة على إيجاد موادهم ومواعيدهم بسهولة.'

interface ProblemContextValue {
  problemText: string
  setProblemText: (text: string) => void
  summary: string
  category: string
  capabilities: CapabilityItem[]
  simulationAnswers: string[]
  setSimulationAnswers: (answers: string[]) => void
}

const ProblemContext = createContext<ProblemContextValue | undefined>(undefined)

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

  return (
    <ProblemContext.Provider
      value={{
        problemText,
        setProblemText,
        summary,
        category,
        capabilities,
        simulationAnswers,
        setSimulationAnswers,
      }}
    >
      {children}
    </ProblemContext.Provider>
  )
}

export function useProblem(): ProblemContextValue {
  const ctx = useContext(ProblemContext)
  if (!ctx) {
    throw new Error('useProblem must be used within ProblemProvider')
  }
  return ctx
}
