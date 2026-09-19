/**
 * Central API Client Types — QUDRA
 * Definitions for HTTP methods, options, responses, and standard backend payloads.
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
  skipAuth?: boolean;
}

export interface ApiSuccessResponse<T> {
  data: T;
  status: number;
}

export interface ApiErrorPayload {
  detail?: string | Array<{ loc?: (string | number)[]; msg: string; type?: string }>;
  message?: string;
  code?: string;
}

// Backend Auth Payload
export interface TokenResponse {
  access_token: string;
  token_type: string;
}

// Backend User Payload
export interface RemoteUser {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

// Backend Capability Payload
export interface RemoteCapability {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  created_at: string;
}

// Backend User Capability with Score (Dana's multi-factor scoring feature)
export interface RemoteUserCapability {
  id: string;
  capability_id: string;
  capability_name: string;
  capability_category: string | null;
  strength: number;
  evidence_strength: number;
  evidence_count: number;
  breakdown: Record<string, number>;
  updated_at: string;
}

// Backend Full Capability Profile
export interface RemoteFullCapabilityProfile {
  user_id: string;
  full_name: string | null;
  email: string;
  capabilities: Array<{
    capability_id: string;
    capability_name: string;
    capability_category: string | null;
    evidence_strength: number;
    evidence_count: number;
    breakdown: Record<string, number>;
    updated_at: string;
  }>;
}

// Backend Project Payload
export interface RemoteProject {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
  technologies: string[];
  contribution: string[];
  created_at: string;
  updated_at: string;
}

// Backend Evidence Payload
export interface RemoteEvidence {
  id: string;
  user_id: string;
  capability_id: string;
  type: 'GITHUB_REPO' | 'PRACTICAL' | 'PROJECT' | 'ORAL' | 'ASSESSMENT';
  project_id: string | null;
  title: string;
  description: string | null;
  strength: number;
  created_at: string;
}

// Backend Problem Payload
export interface RemoteRequiredCapability {
  capability_id: string;
  name: string;
  category: string | null;
  importance: number | string;
  required_level: string | number;
  reason: string | null;
}

export interface RemoteProblem {
  id: string;
  user_id: string;
  title: string;
  description: string;
  domain: string | null;
  project_type: string | null;
  status: 'OPEN' | 'IN_ANALYSIS' | 'ANALYZED' | 'MATCHING' | 'RESOLVED';
  created_at: string;
  updated_at: string;
  required_capabilities: RemoteRequiredCapability[];
}

export interface RemoteProblemAnalysis {
  problem_id: string;
  project_type: string | null;
  domain: string | null;
  problem_summary: string | null;
  solution_direction: string | null;
  target_users: string[];
  technical_requirements: string[];
  potential_features: string[];
  constraints: string[];
  required_capabilities: RemoteRequiredCapability[];
  created_at: string;
}
