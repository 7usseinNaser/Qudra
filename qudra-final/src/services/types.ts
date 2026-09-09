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
