export const ROUTES = {
  // Landing & Auth
  LANDING: '/',
  SIGNUP: '/signup',
  LOGIN: '/login',
  VERIFY_EMAIL: '/verify-email',

  // Onboarding & Identity
  ROLE_SELECT: '/onboarding/role',
  ONBOARDING_IDENTITY: '/onboarding/identity',
  ONBOARDING_INTENT: '/onboarding/intent',

  // Main & Discovery
  HOME: '/home',
  DISCOVER: '/discover',
  DISCOVER_PEOPLE: '/discover/people',
  PUBLIC_PROFILE: '/u/:username',

  // GitHub Evidence Loop
  PROFILE_COMPLETION: '/profile/completion',
  GITHUB_CONNECT: '/profile/sources/github',
  GITHUB_SELECT: '/profile/sources/github/select',
  GITHUB_SCANNING: '/profile/sources/github/scanning',
  GITHUB_RESULTS: '/profile/sources/github/results',
  GITHUB_REPO_DETAIL: '/profile/sources/github/repo/:id',

  // Master Profile (Proof Core)
  MASTER_PROFILE: '/profile/master',
  MASTER_SKILL_DETAIL: '/profile/master/:skill',
  MASTER_DNA: '/profile/master/dna',
  MASTER_TIMELINE: '/profile/master/timeline',
  MASTER_WHY_LEVEL: '/profile/master/:skill/why',

  // Problem Owner & Flow
  PROBLEM: '/problem',
  PROBLEM_CREATION: '/problem/new',
  PROBLEM_ANALYSIS: '/problem/analysis',
  PROBLEM_CANDIDATES: '/problem/candidates',
  REQUIREMENT_ANALYSIS: '/problem/requirements',
  CAPABILITIES: '/capabilities',
  SIMULATION: '/simulation',
  EVALUATION: '/evaluation',
  SKILL_DNA: '/skill-dna',
  RESULT: '/result',
  MATCHING: '/matching',
  COMPARE: '/compare',
  CANDIDATES: '/candidates',
  CANDIDATE_DETAIL: '/candidates/:id',
  RE_RANKING: '/re-ranking',
  PROFILE: '/profile',
  EVIDENCE_DETAIL: '/evidence/:id',
  INVITE: '/invite/:id',

  // Company Flow
  COMPANY_HOME: '/company',
  COMPANY_CANDIDATES: '/company/candidates',
  COMPANY_COMPARE: '/company/compare',
  COMPANY_CHALLENGE_NEW: '/company/challenges/new',
  COMPANY_INVITE: '/company/invite/:id',
  FIND_TALENT: '/company/find-talent',
  JOB_DEFINITION: '/company/jobs/new',
  TEAM_BUILDER: '/company/team-builder',

  // Gaps & Growth
  GAPS: '/gaps',
  GROWTH_PLAN: '/gaps/growth-plan',

  // Resources
  RESOURCES: '/resources',

  // Opportunities
  OPPORTUNITIES: '/opportunities',
  OPPORTUNITY_SEARCH: '/opportunities/search',

  // Organization
  ORG_DASHBOARD: '/organization',
  ORG_PROFILE: '/organization/profile',
  ORG_MEMBERS: '/organization/members',
  ORG_ROLES: '/organization/roles',
  ORG_VERIFICATION: '/organization/verification',

  // Network & Messaging
  CONNECTIONS: '/network/connections',
  CONNECTION_REQUESTS: '/network/requests',
  MESSAGES: '/network/messages',
  CONVERSATION: '/network/messages/:id',
  CREATE_GROUP: '/network/groups/new',

  // Settings
  SETTINGS: '/settings',
  PRIVACY: '/settings/privacy',
  NOTIFICATIONS: '/settings/notifications',
  CONNECTED_ACCOUNTS: '/settings/accounts',
  COMM_SETTINGS: '/settings/communications',

  // Challenges & Admin
  CHALLENGES: '/challenges',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_AI_QUEUE: '/admin/ai-queue',
  ADMIN_EVIDENCE: '/admin/evidence',
  ADMIN_VERIFICATION: '/admin/verification',
} as const;

export type RouteKey = keyof typeof ROUTES;
