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
  PROFILE_EDIT: '/profile/edit',
  PASSPORT: '/profile/passport',
  SOURCES: '/profile/sources',
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

  // M09 Next Step Engine
  M09_OVERVIEW: '/next/overview',
  M09_DETAILS: '/next/details',
  M09_CREATE: '/next/create',
  M09_RESULTS: '/next/results',
  M09_EMPTY: '/next/empty',
  M09_ERROR: '/next/error',

  // M04 Import Center
  M04_OVERVIEW: '/import/overview',
  M04_DETAILS: '/import/details',
  M04_CREATE: '/import/create',
  M04_RESULTS: '/import/results',
  M04_EMPTY: '/import/empty',
  M04_ERROR: '/import/error',

  // M02 Home Dashboard
  M02_OVERVIEW: '/home',
  M02_DETAILS: '/home/details',
  M02_CREATE: '/home/customize',
  M02_RESULTS: '/home/summary',
  M02_EMPTY: '/home/empty',
  M02_ERROR: '/home/error',

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

  // M18 Company Workspace
  M18_OVERVIEW: '/company/overview',
  M18_DETAILS: '/company/details',
  M18_CREATE: '/company/create',
  M18_RESULTS: '/company/results',
  M18_EMPTY: '/company/empty',
  M18_ERROR: '/company/error',

  // M19 Candidates Pipeline
  M19_OVERVIEW: '/pipeline/overview',
  M19_DETAILS: '/pipeline/details',
  M19_CREATE: '/pipeline/create',
  M19_RESULTS: '/pipeline/results',
  M19_EMPTY: '/pipeline/empty',
  M19_ERROR: '/pipeline/error',

  // M17 Opportunities Hub
  M17_OVERVIEW: '/opportunities/m17',
  M17_DETAILS: '/opportunities/m17/:id',
  M17_CREATE: '/opportunities/m17/create',
  M17_RESULTS: '/opportunities/m17/results',
  M17_EMPTY: '/opportunities/m17/empty',
  M17_ERROR: '/opportunities/m17/error',

  // M20 Team Composer
  M20_OVERVIEW: '/teams/m20',
  M20_DETAILS: '/teams/m20/:id',
  M20_CREATE: '/teams/m20/create',
  M20_RESULTS: '/teams/m20/results',
  M20_EMPTY: '/teams/m20/empty',
  M20_ERROR: '/teams/m20/error',

  // M21 Project Workspace & Outcomes
  M21_OVERVIEW: '/workspace/m21',
  M21_DETAILS: '/workspace/m21/:id',
  M21_CREATE: '/workspace/m21/create',
  M21_RESULTS: '/workspace/m21/results',
  M21_EMPTY: '/workspace/m21/empty',
  M21_ERROR: '/workspace/m21/error',

  // M23 Community & Exchange
  M23_OVERVIEW: '/community/overview',
  M23_DETAILS: '/community/details',
  M23_CREATE: '/community/create',
  M23_RESULTS: '/community/results',
  M23_EMPTY: '/community/empty',
  M23_ERROR: '/community/error',

  // M26 Settings & Billing
  M26_OVERVIEW: '/settings/overview',
  M26_DETAILS: '/settings/details',
  M26_CREATE: '/settings/create',
  M26_RESULTS: '/settings/results',
  M26_EMPTY: '/settings/empty',
  M26_ERROR: '/settings/error',

  // M10 Learning Paths & Courses
  M10_OVERVIEW: '/learn/overview',
  M10_DETAILS: '/learn/details',
  M10_CREATE: '/learn/create',
  M10_RESULTS: '/learn/results',
  M10_EMPTY: '/learn/empty',
  M10_ERROR: '/learn/error',

  // M12 Oral Verification & Assessment
  M12_OVERVIEW: '/oral/overview',
  M12_DETAILS: '/oral/details',
  M12_CREATE: '/oral/create',
  M12_RESULTS: '/oral/results',
  M12_EMPTY: '/oral/empty',
  M12_ERROR: '/oral/error',

  // M14 GitHub & Code Intelligence
  M14_OVERVIEW: '/code-intel/overview',
  M14_DETAILS: '/code-intel/details/:id',
  M14_CREATE: '/code-intel/create',
  M14_RESULTS: '/code-intel/results',
  M14_EMPTY: '/code-intel/empty',
  M14_ERROR: '/code-intel/error',

  // M22 Verification & Trust Matrix
  M22_OVERVIEW: '/trust/overview',
  M22_DETAILS: '/trust/details/:id',
  M22_CREATE: '/trust/create',
  M22_RESULTS: '/trust/results',
  M22_EMPTY: '/trust/empty',
  M22_ERROR: '/trust/error',

  // Challenges & Admin
  CHALLENGES: '/challenges',
  CHALLENGE_SANDBOX: '/challenges/:id/sandbox',
  REPO_DEEP_INSPECT: '/github/inspect/:repoId',
  PROBLEM_MATCH_REPORT: '/problems/:id/match',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_AI_QUEUE: '/admin/ai-queue',
  ADMIN_EVIDENCE: '/admin/evidence',
  ADMIN_VERIFICATION: '/admin/verification',

  // M11 Practice Challenges
  M11_OVERVIEW: '/challenges/practice',
  M11_DETAILS: '/challenges/practice/:id',
  M11_ATTEMPT: '/challenges/practice/:id/attempt',
  M11_RESULT: '/challenges/practice/:id/result',
  M11_EMPTY: '/challenges/practice/empty',
  M11_ERROR: '/challenges/practice/error',

  // M13 Projects Portfolio
  M13_OVERVIEW: '/projects/portfolio',
  M13_DETAILS: '/projects/portfolio/:id',
  M13_CREATE: '/projects/portfolio/new',
  M13_RESULT: '/projects/portfolio/:id/result',
  M13_EMPTY: '/projects/portfolio/empty',
  M13_ERROR: '/projects/portfolio/error',

  // M24 AI Assistant & Explain
  M24_OVERVIEW: '/assistant',
  M24_DETAILS: '/assistant/:id',
  M24_CREATE: '/assistant/new',
  M24_RESULT: '/assistant/result',
  M24_DISPUTE: '/assistant/dispute',
  M24_EMPTY: '/assistant/empty',
  M24_ERROR: '/assistant/error',

  // M15 Problem Input & Analysis
  M15_OVERVIEW: '/problem/m15',
  M15_DETAILS: '/problem/analysis/:id',
  M15_CREATE: '/problem/create',
  M15_RESULTS: '/problem/results/:id',
  M15_EMPTY: '/problem/empty',
  M15_ERROR: '/problem/error',

  // M16 Explainable Matching
  M16_OVERVIEW: '/matching/m16',
  M16_DETAILS: '/matching/:problemId/details/:id',
  M16_CREATE: '/matching/:problemId/create',
  M16_RESULTS: '/matching/:problemId/results/:id',
  M16_EMPTY: '/matching/empty',
  M16_ERROR: '/matching/error',

  // M25 Privacy, Consent & Data Control
  M25_OVERVIEW: '/privacy/m25',
  M25_DETAILS: '/privacy/details/:id',
  M25_CREATE: '/privacy/grant',
  M25_RESULTS: '/privacy/results',
  M25_EMPTY: '/privacy/empty',
  M25_ERROR: '/privacy/error',
} as const;

export type RouteKey = keyof typeof ROUTES;
