import type { ID, ReadinessStatus } from './common'

export interface ProvenSkill { name: string; evidenceCount: number }
export interface ClaimedSkill { name: string }

export interface Candidate {
  id: ID; rank: number; name: string; role: string; avatar: string
  score: number; status: ReadinessStatus
  proven: ProvenSkill[]; claimed: ClaimedSkill[]; gaps: string[]
  meta?: string; turned?: boolean; previousScore?: number; previousRank?: number
}

export interface FinalRanking { id: ID; rank: number; name: string; score: number; status: ReadinessStatus; delta: string }
export interface ComparePerson { id: ID; name: string; scores: number[] }
export interface MatchReason { skill: string; max: number; before: number; after: number; isGap: boolean; note: string; postNote?: string }
export interface EvidencePathStep { label: string; done: boolean }
