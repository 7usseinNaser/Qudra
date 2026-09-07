import type { ID } from './common'

export type ProfileTab = 'sources' | 'profile' | 'evidence' | 'timeline' | 'gaps' | 'opportunities' | 'passport'

export interface PrivacyToggle { key: string; label: string; enabled: boolean }
export interface Opportunity { id: ID; title: string; score: number; status: 'ready' | 'near' | 'needs'; reason: string; requiredSkills?: string[] }
export interface TimelinePoint { month: string; score: number; evidence?: string }
export interface TimelineSeries { name: string; color: string; points: TimelinePoint[] }
export interface ProfileStats { totalEvidence: number; verifiedEvidence: number; capabilitiesCount: number; sourcesCount: number; pendingCount: number }
export interface FileStrength { score: number; documentation: number; diversity: number; freshness: number; coverage: number }
export interface QuickWin { label: string; delta: number }
export interface RoleReadiness { role: string; score: number }
export interface SkillGap { have: string[]; need: string[]; readiness: number; gapCount: number }
export interface RoadmapStep { label: string; done: boolean }
export interface PassportStats { views: number; companies: number; invitations: number }
