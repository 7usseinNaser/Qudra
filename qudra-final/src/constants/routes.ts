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
  INVITE: '/invite/:id',
} as const;

export type RouteKey = keyof typeof ROUTES;
