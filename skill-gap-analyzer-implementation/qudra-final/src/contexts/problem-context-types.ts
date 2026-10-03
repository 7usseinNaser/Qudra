import { createContext } from 'react'

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

export interface ProblemContextValue {
  problemText: string
  setProblemText: (text: string) => void
  summary: string
  setSummary: (summary: string) => void
  category: string
  setCategory: (cat: string) => void
  capabilities: CapabilityItem[]
  setCapabilities: (caps: CapabilityItem[]) => void
  simulationAnswers: string[]
  setSimulationAnswers: (answers: string[]) => void
  isAnalyzing: boolean
  setIsAnalyzing: (analyzing: boolean) => void
}

export const ProblemContext = createContext<ProblemContextValue | undefined>(undefined)
