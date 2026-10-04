import { 
  User, 
  Capability, 
  Evidence, 
  CandidateMatch, 
  GitHubRepo, 
  MasterProfileData,
  LearningResource,
  GapDetail,
  Opportunity,
  Challenge,
  GrowthPlan
} from './types';
import { 
  INITIAL_MOCK_USER, 
  INITIAL_CAPABILITIES, 
  INITIAL_EVIDENCES, 
  INITIAL_GITHUB_REPOS, 
  INITIAL_CANDIDATE_MATCHES, 
  INITIAL_MASTER_PROFILE,
  INITIAL_RESOURCES,
  INITIAL_GAPS,
  INITIAL_OPPORTUNITIES,
  INITIAL_CHALLENGES,
  INITIAL_GROWTH_PLAN
} from './mock-data';

const STORAGE_KEYS = {
  USER: 'qudra_user',
  CAPABILITIES: 'qudra_capabilities',
  EVIDENCES: 'qudra_evidences',
  GITHUB_REPOS: 'qudra_github_repos',
  CANDIDATE_MATCHES: 'qudra_candidate_matches',
  MASTER_PROFILE: 'qudra_master_profile',
  IS_GITHUB_CONNECTED: 'qudra_gh_connected',
  RESOURCES: 'qudra_resources',
  GAPS: 'qudra_gaps',
  OPPORTUNITIES: 'qudra_opportunities',
  CHALLENGES: 'qudra_challenges',
  GROWTH_PLAN: 'qudra_growth_plan'
};

function loadItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

function saveItem<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save to localStorage key ${key}`, e);
  }
}

export const QudraStore = {
  // User
  getUser(): User {
    return loadItem<User>(STORAGE_KEYS.USER, INITIAL_MOCK_USER);
  },
  setUser(user: User): void {
    saveItem(STORAGE_KEYS.USER, user);
  },
  updateUser(updates: Partial<User>): User {
    const current = this.getUser();
    const updated = { ...current, ...updates };
    this.setUser(updated);
    return updated;
  },

  // Capabilities
  getCapabilities(): Capability[] {
    return loadItem<Capability[]>(STORAGE_KEYS.CAPABILITIES, INITIAL_CAPABILITIES);
  },
  setCapabilities(caps: Capability[]): void {
    saveItem(STORAGE_KEYS.CAPABILITIES, caps);
  },
  addCapability(cap: Capability): void {
    const list = this.getCapabilities();
    const exists = list.some(c => c.id === cap.id);
    if (!exists) {
      this.setCapabilities([cap, ...list]);
    }
  },

  // Evidences
  getEvidences(): Evidence[] {
    return loadItem<Evidence[]>(STORAGE_KEYS.EVIDENCES, INITIAL_EVIDENCES);
  },
  setEvidences(evs: Evidence[]): void {
    saveItem(STORAGE_KEYS.EVIDENCES, evs);
  },
  addEvidence(ev: Evidence): void {
    const list = this.getEvidences();
    this.setEvidences([ev, ...list]);
  },

  // GitHub Repos
  getGitHubRepos(): GitHubRepo[] {
    return loadItem<GitHubRepo[]>(STORAGE_KEYS.GITHUB_REPOS, INITIAL_GITHUB_REPOS);
  },
  setGitHubRepos(repos: GitHubRepo[]): void {
    saveItem(STORAGE_KEYS.GITHUB_REPOS, repos);
  },
  isGitHubConnected(): boolean {
    return loadItem<boolean>(STORAGE_KEYS.IS_GITHUB_CONNECTED, true);
  },
  setGitHubConnected(connected: boolean): void {
    saveItem(STORAGE_KEYS.IS_GITHUB_CONNECTED, connected);
  },

  // Candidate Matches
  getCandidateMatches(): CandidateMatch[] {
    return loadItem<CandidateMatch[]>(STORAGE_KEYS.CANDIDATE_MATCHES, INITIAL_CANDIDATE_MATCHES);
  },
  setCandidateMatches(matches: CandidateMatch[]): void {
    saveItem(STORAGE_KEYS.CANDIDATE_MATCHES, matches);
  },

  // Master Profile
  getMasterProfile(): MasterProfileData {
    const profile = loadItem<MasterProfileData>(STORAGE_KEYS.MASTER_PROFILE, INITIAL_MASTER_PROFILE);
    // Keep user and capabilities synced
    profile.user = this.getUser();
    profile.capabilities = this.getCapabilities();
    profile.evidences = this.getEvidences();
    return profile;
  },
  setMasterProfile(data: MasterProfileData): void {
    saveItem(STORAGE_KEYS.MASTER_PROFILE, data);
  },

  // Resources
  getResources(): LearningResource[] {
    return loadItem<LearningResource[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
  },
  setResources(resources: LearningResource[]): void {
    saveItem(STORAGE_KEYS.RESOURCES, resources);
  },

  // Gaps
  getGaps(): GapDetail[] {
    return loadItem<GapDetail[]>(STORAGE_KEYS.GAPS, INITIAL_GAPS);
  },
  setGaps(gaps: GapDetail[]): void {
    saveItem(STORAGE_KEYS.GAPS, gaps);
  },

  // Opportunities
  getOpportunities(): Opportunity[] {
    return loadItem<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
  },
  setOpportunities(opportunities: Opportunity[]): void {
    saveItem(STORAGE_KEYS.OPPORTUNITIES, opportunities);
  },

  // Challenges
  getChallenges(): Challenge[] {
    return loadItem<Challenge[]>(STORAGE_KEYS.CHALLENGES, INITIAL_CHALLENGES);
  },
  setChallenges(challenges: Challenge[]): void {
    saveItem(STORAGE_KEYS.CHALLENGES, challenges);
  },

  // Growth Plan
  getGrowthPlan(): GrowthPlan {
    return loadItem<GrowthPlan>(STORAGE_KEYS.GROWTH_PLAN, INITIAL_GROWTH_PLAN);
  },
  setGrowthPlan(plan: GrowthPlan): void {
    saveItem(STORAGE_KEYS.GROWTH_PLAN, plan);
  },

  // Reset to default
  resetAll(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.CAPABILITIES);
    localStorage.removeItem(STORAGE_KEYS.EVIDENCES);
    localStorage.removeItem(STORAGE_KEYS.GITHUB_REPOS);
    localStorage.removeItem(STORAGE_KEYS.CANDIDATE_MATCHES);
    localStorage.removeItem(STORAGE_KEYS.MASTER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.IS_GITHUB_CONNECTED);
    localStorage.removeItem(STORAGE_KEYS.RESOURCES);
    localStorage.removeItem(STORAGE_KEYS.GAPS);
    localStorage.removeItem(STORAGE_KEYS.OPPORTUNITIES);
    localStorage.removeItem(STORAGE_KEYS.CHALLENGES);
    localStorage.removeItem(STORAGE_KEYS.GROWTH_PLAN);
  }
};
