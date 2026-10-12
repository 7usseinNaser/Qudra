/**
 * QUDRA — TypeScript Type Definitions
 * Matched with FastAPI backend schemas and Phase 1 Proof Core specs.
 */

export type UserRole = 'talent' | 'problem_owner' | 'both';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  headline?: string;
  bio?: string;
  isEmailVerified: boolean;
  isOnboarded: boolean;
  createdAt: string;
}

export type EvidenceType = 
  | 'GITHUB_REPO' 
  | 'PROJECT' 
  | 'CHALLENGE' 
  | 'ORAL_ASSESSMENT' 
  | 'FILE_UPLOAD';

export type EvidenceStatus = 'VERIFIED' | 'PENDING' | 'CLAIMED' | 'REJECTED';

export interface Evidence {
  id: string;
  userId: string;
  capabilityId: string;
  type: EvidenceType;
  title: string;
  description?: string;
  strength: number; // 0 - 100
  qualityScore: number; // 0 - 100
  status: EvidenceStatus;
  url?: string;
  projectId?: string;
  repoDetails?: {
    repoName: string;
    commitsCount: number;
    prsCount: number;
    linesOfCode: number;
    primaryLanguage: string;
    lastCommitDate?: string;
  };
  verifiedAt?: string;
  createdAt: string;
}

export type CapabilityLevel = 'NOVICE' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface Capability {
  id: string;
  name: string;
  category: string;
  description?: string;
  level: CapabilityLevel;
  strength: number; // 0 - 100
  confidence: number; // 0 - 100
  evidenceCount: number;
  evidences?: Evidence[];
  isVerified: boolean;
  lastUpdated: string;
  status?: string;
}

export interface CapabilityGap {
  capabilityId: string;
  name: string;
  currentStrength: number;
  requiredStrength: number;
  gapReason: string;
  suggestedAction: string;
}

export interface CandidateMatch {
  id: string;
  userId: string;
  name: string;
  username: string;
  avatarUrl?: string;
  roleTitle: string;
  rank: number;
  matchScore: number; // 0 - 100
  status: 'READY' | 'NEAR' | 'FAR';
  verifiedCapabilities: string[];
  claimedCapabilities: string[];
  missingCapabilities: string[];
  explanation: {
    provenCount: number;
    gapCount: number;
    summary: string;
    strengths: string[];
    risks: string[];
  };
}

export interface GitHubRepo {
  id: string;
  name: string;
  fullName: string;
  description: string;
  primaryLanguage: string;
  starsCount: number;
  forksCount: number;
  updatedAt: string;
  isPrivate: boolean;
  isSelected?: boolean;
  isScanned?: boolean;
  detectedCapabilities?: {
    name: string;
    category: string;
    confidence: number;
    matchedFiles: number;
  }[];
}

export interface MasterProfileDNA {
  dimension: string;
  score: number; // 0 - 100
  description: string;
  strengthType: 'core' | 'supporting' | 'emerging';
}

export interface MasterTimelineItem {
  id: string;
  date: string;
  title: string;
  description: string;
  evidenceType: EvidenceType;
  impactScore: number;
  capabilityNames: string[];
}

export interface MasterProfileData {
  user: User;
  trustScore: number; // 0 - 100
  verifiedRatio: number; // 0 - 1
  capabilities: Capability[];
  evidences: Evidence[];
  dna: MasterProfileDNA[];
  timeline: MasterTimelineItem[];
}

export type ResourceType = 'course' | 'documentation' | 'video' | 'interactive' | 'book';
export type ResourcePrice = 'free' | 'paid';
export type ResourceDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface LearningResource {
  id: string;
  title: string;
  provider: string;
  type: ResourceType;
  price: ResourcePrice;
  difficulty: ResourceDifficulty;
  duration: string;
  description?: string;
  format?: string;
  language?: string;
  certificate?: boolean;
  rating?: number;
  url?: string;
  whyRecommended?: string;
  gapSkill?: string;
  relatedGapId?: string;
  relevanceScore?: number;
}

export type GapSeverity = 'critical' | 'moderate' | 'optional';

export interface GapResource {
  title: string;
  provider: string;
  type: string;
  duration: string;
}

export interface GapChallenge {
  title: string;
  difficulty: string;
  expectedTime: string;
}

export interface GapProject {
  title: string;
  description: string;
}

export interface GapDetail {
  id: string;
  skill: string;
  capabilityName?: string;
  category: string;
  severity: GapSeverity;
  currentStrength: number;
  requiredStrength: number;
  targetStrength?: number;
  gapDelta: number;
  whyItMatters: string;
  opportunityCount: number;
  timeToBridge: string;
  suggestedAction: string;
  impact?: string;
  estimatedPath?: string;
  currentEvidence?: string[];
  evidenceMissing?: string[];
  resources?: GapResource[];
  challenge?: GapChallenge;
  project?: GapProject;
  recommendedAction?: string;
  status?: string;
  description?: string;
  gapType?: string;
}

export type OpportunityType = 
  | 'project' 
  | 'challenge' 
  | 'fulltime' 
  | 'consulting' 
  | 'job' 
  | 'freelance' 
  | 'internship' 
  | 'scholarship' 
  | 'grant' 
  | 'hackathon' 
  | 'company_challenge';

export type OpportunityLocation = 'remote' | 'onsite' | 'on-site' | 'hybrid';

export interface StructuredRequirement {
  skill: string;
  importance: 'critical' | 'preferred' | string;
  level: string;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  orgName?: string;
  isVerifiedOrg?: boolean;
  type: OpportunityType;
  location: OpportunityLocation;
  field?: string;
  city?: string;
  experience?: string;
  compensation?: string;
  duration?: string;
  postedDate?: string;
  deadline?: string;
  description?: string;
  requirements?: string[];
  structuredRequirements?: StructuredRequirement[];
  whyMatch?: string[];
  matchedEvidence?: string[];
  gaps?: string[];
  matchScore: number;
  matchReason?: string;
  requiredCapabilities?: string[];
  requiredSkills?: string[];
  url?: string;
  relatedGapId?: string;
  whyYouMatch?: string[];
}

export type ChallengeDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type ChallengeType = 'coding' | 'design' | 'system_design' | 'debugging';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  skill: string;
  difficulty: ChallengeDifficulty;
  type: ChallengeType;
  duration: string;
  expectedTime?: string;
  evidenceOutcome?: string;
  evidenceValue?: number;
  source?: string;
  requirements: string[];
  evaluationCriteria: string[];
  instructions?: string;
  initialCode?: string;
}

export interface GrowthMilestoneResource {
  title: string;
  provider: string;
}

export interface GrowthMilestone {
  id: string;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  resources: GrowthMilestoneResource[];
  practiceType: string;
  evidenceGoal: string;
}

export interface GrowthPlan {
  goal: string;
  currentState: string;
  gapIds: string[];
  milestones: GrowthMilestone[];
}

export type TeamRole = 'lead' | 'backend' | 'frontend' | 'fullstack' | 'devops' | 'designer' | 'pm' | 'qa' | 'ai_ml' | 'data';
export type TeamMemberStatus = 'invited' | 'active' | 'completed' | 'left';

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  username: string;
  avatarUrl?: string;
  role: TeamRole;
  capabilities: string[];
  verifiedCapabilities: string[];
  claimedCapabilities: string[];
  matchScore: number;
  status: TeamMemberStatus;
  joinedAt?: string;
  contributionScore?: number;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  opportunityId?: string;
  problemId?: string;
  members: TeamMember[];
  requiredCapabilities: string[];
  createdAt: string;
  updatedAt: string;
  status: 'forming' | 'active' | 'completed' | 'archived';
  harmonyScore: number;
  coveragePercentage: number;
}

export type WorkspaceColumn = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';

export interface WorkspaceTask {
  id: string;
  title: string;
  description: string;
  column: WorkspaceColumn;
  assigneeId?: string;
  assigneeName?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  deliverableId?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

export interface Deliverable {
  id: string;
  taskId: string;
  title: string;
  description: string;
  type: 'code' | 'document' | 'design' | 'test' | 'deployment' | 'demo';
  url?: string;
  fileUrl?: string;
  submittedBy: string;
  submittedAt: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'claimed_evidence';
  evidenceId?: string;
  reviewerId?: string;
  reviewerNotes?: string;
}

export interface ProjectWorkspace {
  id: string;
  name: string;
  description: string;
  teamId: string;
  opportunityId?: string;
  columns: WorkspaceColumn[];
  tasks: WorkspaceTask[];
  deliverables: Deliverable[];
  createdAt: string;
  updatedAt: string;
  kanbanView: boolean;
}

export type InterviewStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type InterviewResult = 'PASS' | 'FAIL';

export interface Interview {
  id: string;
  title: string;
  gapAddressed: string;
  capability: string;
  expertId: string;
  scheduledAt: string;
  durationMinutes: number;
  status: InterviewStatus;
  method: string;
  questions: string[];
  evidence?: string[];
  notes?: string;
  result?: InterviewResult;
  score?: number;
  progress?: number;
  sourceUrl?: string;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  level: 'مبتدئ' | 'متوسط' | 'متقدم';
  durationHours: number;
  price: number;
  language: string;
  gapAddressed: string;
  description: string;
  evidence: string[];
  progress: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  enrolledAt: string | null;
  sourceUrl: string;
}

