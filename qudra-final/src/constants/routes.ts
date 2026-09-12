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

  // Problem Owner Legacy / Flow Routes
  PROBLEM: '/problem',
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

  // Company / Problem Owner
  COMPANY_HOME: '/company',
  FIND_TALENT: '/company/find-talent',
  PROBLEM_CREATION: '/company/problem/new',
  PROBLEM_ANALYSIS: '/company/problem/:id/analysis',
  REQUIREMENT_ANALYSIS: '/company/problem/:id/requirements',
  PROBLEM_CANDIDATES: '/company/problem/:id/candidates',
  COMPANY_CANDIDATES: '/company/candidates',
  COMPANY_COMPARE: '/company/compare',
  COMPANY_INVITE: '/company/invite',
  COMPANY_CHALLENGE_NEW: '/company/challenge/new',
  JOB_DEFINITION: '/company/job-definition',
  TEAM_BUILDER: '/company/team-builder',

  // Challenges
  CHALLENGES: '/challenges',

  // Gaps & Growth
  GAPS: '/gaps',
  GROWTH_PLAN: '/gaps/growth-plan',

  // Opportunities
  OPPORTUNITIES: '/opportunities',
  OPPORTUNITY_SEARCH: '/opportunities/search',

  // Resources
  RESOURCES: '/resources',

  // Settings
  SETTINGS: '/settings',
  NOTIFICATIONS: '/settings/notifications',
  PRIVACY: '/settings/privacy',
  CONNECTED_ACCOUNTS: '/settings/connected-accounts',

  // Network / Messages
  MESSAGES: '/messages',
  CONVERSATION: '/messages/:id',
  CONNECTIONS: '/network/connections',
  CONNECTION_REQUESTS: '/network/requests',
  CREATE_GROUP: '/network/create-group',
  COMM_SETTINGS: '/network/settings',

  // Organization
  ORG_DASHBOARD: '/organization',
  ORG_MEMBERS: '/organization/members',
  ORG_PROFILE: '/organization/profile',
  ORG_ROLES: '/organization/roles',
  ORG_VERIFICATION: '/organization/verification',

  // Admin
  ADMIN_DASHBOARD: '/admin',
  ADMIN_VERIFICATION: '/admin/verification',
  ADMIN_EVIDENCE: '/admin/evidence',
  ADMIN_AI_QUEUE: '/admin/ai-queue',
} as const;

export type RouteKey = keyof typeof ROUTES;
