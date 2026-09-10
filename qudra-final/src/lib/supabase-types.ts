export interface DatabaseProfile {
  id: string
  user_id: string
  full_name: string | null
  avatar_url: string | null
  headline: string | null
  job_title: string | null
  field: string | null
  current_goal: string | null
  normalized_title: string | null
  created_at: string
  updated_at: string
}

export interface DatabaseCapability {
  id: string
  name: string
  category: string | null
  description: string | null
  created_at: string
}

export interface DatabaseUserCapability {
  id: string
  user_id: string
  capability_id: string
  level: string
  strength: number
  confidence: number
  evidence_count: number
  gap: number | null
  created_at: string
  updated_at: string
  capability: DatabaseCapability
}

export type EvidenceType = 'PROJECT' | 'ORAL' | 'PRACTICAL' | 'CERTIFICATE' | 'EXPERIENCE' | 'EDUCATION' | 'ACHIEVEMENT'
export type VerificationStatus = 'CLAIMED' | 'SUPPORTED' | 'VERIFIED' | 'COMPANY_CONFIRMED'

export interface DatabaseEvidence {
  id: string
  user_id: string
  capability_id: string | null
  type: EvidenceType
  source: string
  source_url: string | null
  title: string
  description: string | null
  strength: number
  score: number
  quality: number
  verification_status: VerificationStatus
  confidence: number
  evidence_metadata: Record<string, unknown> | null
  created_at: string
  expires_at: string | null
  capability: DatabaseCapability | null
}

export interface DatabaseProblem {
  id: string
  user_id: string
  title: string
  description: string
  domain: string | null
  project_type: string | null
  status: 'DRAFT' | 'ANALYZING' | 'ANALYZED' | 'FAILED'
  created_at: string
  updated_at: string
}

export interface DatabaseProblemAnalysis {
  id: string
  problem_id: string
  project_type: string | null
  domain: string | null
  problem_summary: string | null
  solution_direction: string | null
  target_users: string[] | null
  technical_requirements: string[] | null
  potential_features: string[] | null
  constraints: string[] | null
  created_at: string
}

export interface DatabaseProblemCapability {
  id: string
  problem_id: string
  capability_id: string
  importance: number
  required_level: string
  reason: string | null
  capability: DatabaseCapability
}

export interface DatabaseChallenge {
  id: string
  capability_id: string
  title: string
  description: string
  difficulty: string
  time_limit_minutes: number | null
  evaluation_criteria: Record<string, unknown> | null
  starter_content: string | null
  created_at: string
}

export interface DatabaseChallengeSubmission {
  id: string
  challenge_id: string
  user_id: string
  submission_text: string | null
  code: string | null
  repository_url: string | null
  test_score: number | null
  ai_score: number | null
  final_score: number | null
  feedback: string | null
  status: 'SUBMITTED' | 'EVALUATING' | 'COMPLETED' | 'FAILED'
  created_at: string
  evaluated_at: string | null
}

export interface DatabaseGrowthRecommendation {
  id: string
  user_id: string
  capability_id: string | null
  gap_level: 'CRITICAL' | 'MODERATE' | 'OPTIONAL'
  current_state: string
  target_state: string
  recommended_action: string
  impact: number
  created_at: string
  capability: DatabaseCapability | null
}
