import type { EvidenceSource, EvidenceWeight, ID, VerificationLevel } from './common'

export interface Evidence {
  id: ID; source: EvidenceSource; title: string; path?: string; type: string
  skill: string; date: string; weight: EvidenceWeight; strong: boolean
  level: VerificationLevel; skills?: string[]; outcome?: string; fresh?: boolean
}

export interface EvidenceTableRow {
  source: EvidenceSource; title: string; skill: string; date: string
  level: VerificationLevel; weight: EvidenceWeight; fresh?: boolean
}

export interface EvidenceSignal { label: string; value: number }

export interface EvidenceSourceItem {
  id: ID; type: EvidenceSource; name: string; linked: boolean
  count: number; evidenceOutput: number; statusText?: string
}

export interface EvidenceImpact { totalDelta: number; skillDeltas: Array<{ skill: string; delta: number }> }
