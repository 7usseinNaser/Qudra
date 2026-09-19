import type { ID } from './common'

export interface MatchRow { capability: string; covered: boolean; coverage: number }
export interface Need { id: ID; label: string; type: 'human' | 'tool'; coverage: number; action: string }
export interface TeamMember { name: string; role: string; isYou: boolean }
export interface LoopStep { label: string }
