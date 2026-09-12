import type { CapabilityPriority, ID, TagVariant } from './common'

export interface RequiredCapability {
  id: ID; name: string; priority: CapabilityPriority; reason: string
  iconKey: 'layout' | 'phone' | 'server' | 'db' | 'bulb'
}

export interface DnaCapability {
  id: ID; name: string; score: number; verified: boolean
  source?: string; inferred?: boolean; belowThreshold?: boolean
}

export interface CoverageCapability { name: string; mine: number; team: number; uncovered: number }
export interface CompareCapability { name: string }
export interface ProfileCapability { name: string; score: number; verified: boolean; variant: TagVariant; evidenceCount?: number }
