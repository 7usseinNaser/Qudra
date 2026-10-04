import type { ID } from './common'

export interface SimulationTask { id: ID; skill: string; question: string; hint: string; score?: number }
export interface EvaluationCriterion { label: string; score: number }
export interface EvaluationPoint { text: string; type: 'strength' | 'weakness' }
export interface TaskBreakdownItem { question: string; answerExcerpt: string; score: number }
export interface WritingSignal { label: string; met: boolean }
export interface AnalysisStage { label: string }
