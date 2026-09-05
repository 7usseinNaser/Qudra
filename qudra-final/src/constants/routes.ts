export const ROUTES = {
  LANDING: '/', SIGNUP: '/signup', LOGIN: '/login',
  ROLE_SELECT: '/onboarding/role', PROBLEM: '/problem',
  CAPABILITIES: '/capabilities', SIMULATION: '/simulation',
  EVALUATION: '/evaluation', SKILL_DNA: '/skill-dna',
  MATCHING: '/matching', COMPARE: '/compare',
  CANDIDATES: '/candidates', CANDIDATE_DETAIL: '/candidates/:id',
  RE_RANKING: '/re-ranking', PROFILE: '/profile',
} as const
export type RouteKey = keyof typeof ROUTES
