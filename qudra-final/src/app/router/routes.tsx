/**
 * App Router — تعريف كافة مسارات وواجهات منصة قُدرة (Q01–Q84).
 */

import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { LandingPage } from '../../pages/landing/LandingPage';
import { MainLayout } from '../../components/layout/MainLayout';
import { RouteFallback } from '../../components/layout/RouteFallback';

// Auth & Onboarding Entry
const SignUpPage = lazy(() => import('../../pages/auth/SignUpPage').then(m => ({ default: m.SignUpPage })));
const LoginPage = lazy(() => import('../../pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const EmailVerificationPage = lazy(() => import('../../pages/auth/EmailVerificationPage').then(m => ({ default: m.EmailVerificationPage })));
const RoleSelectPage = lazy(() => import('../../pages/onboarding/RoleSelectPage').then(m => ({ default: m.RoleSelectPage })));
const BasicIdentityPage = lazy(() => import('../../pages/onboarding/BasicIdentityPage').then(m => ({ default: m.BasicIdentityPage })));
const FirstIntentPage = lazy(() => import('../../pages/onboarding/FirstIntentPage').then(m => ({ default: m.FirstIntentPage })));
const InvitePage = lazy(() => import('../../pages/invite/InvitePage').then(m => ({ default: m.InvitePage })));

// Core Hub & Discovery
const HomePage = lazy(() => import('../../pages/home/HomePage').then(m => ({ default: m.HomePage })));
const DiscoverPage = lazy(() => import('../../pages/discover/DiscoverPage').then(m => ({ default: m.DiscoverPage })));
const PeopleDirectoryPage = lazy(() => import('../../pages/discover/PeopleDirectoryPage').then(m => ({ default: m.PeopleDirectoryPage })));
const PublicProfilePage = lazy(() => import('../../pages/discover/PublicProfilePage').then(m => ({ default: m.PublicProfilePage })));

// GitHub Evidence Loop
const ProfileCompletionPage = lazy(() => import('../../pages/profile/ProfileCompletionPage').then(m => ({ default: m.ProfileCompletionPage })));
const GitHubConnectPage = lazy(() => import('../../pages/profile/sources/GitHubConnectPage').then(m => ({ default: m.GitHubConnectPage })));
const RepoSelectPage = lazy(() => import('../../pages/profile/sources/RepoSelectPage').then(m => ({ default: m.RepoSelectPage })));
const GitHubScanPage = lazy(() => import('../../pages/profile/sources/GitHubScanPage').then(m => ({ default: m.GitHubScanPage })));
const GitHubResultsPage = lazy(() => import('../../pages/profile/sources/GitHubResultsPage').then(m => ({ default: m.GitHubResultsPage })));
const RepoDetailPage = lazy(() => import('../../pages/profile/sources/RepoDetailPage').then(m => ({ default: m.RepoDetailPage })));

// Master Profile Core
const MasterProfilePage = lazy(() => import('../../pages/profile/master/MasterProfilePage').then(m => ({ default: m.MasterProfilePage })));
const CapabilityDetailPage = lazy(() => import('../../pages/profile/master/CapabilityDetailPage').then(m => ({ default: m.CapabilityDetailPage })));
const MasterDnaPage = lazy(() => import('../../pages/profile/master/MasterDnaPage').then(m => ({ default: m.MasterDnaPage })));
const MasterTimelinePage = lazy(() => import('../../pages/profile/master/MasterTimelinePage').then(m => ({ default: m.MasterTimelinePage })));
const WhyThisLevelPage = lazy(() => import('../../pages/profile/master/WhyThisLevelPage').then(m => ({ default: m.WhyThisLevelPage })));

// Problem Owner Flow
const ProblemInputPage = lazy(() => import('../../pages/problem/ProblemInputPage').then(m => ({ default: m.ProblemInputPage })));
const CapabilitiesPage = lazy(() => import('../../pages/capabilities/CapabilitiesPage').then(m => ({ default: m.CapabilitiesPage })));
const SimulationPage = lazy(() => import('../../pages/simulation/SimulationPage').then(m => ({ default: m.SimulationPage })));
const EvaluationPage = lazy(() => import('../../pages/evaluation/EvaluationPage').then(m => ({ default: m.EvaluationPage })));
const SkillDnaPage = lazy(() => import('../../pages/dna/SkillDnaPage').then(m => ({ default: m.SkillDnaPage })));
const ResultPage = lazy(() => import('../../pages/result/ResultPage').then(m => ({ default: m.ResultPage })));
const CandidatesPage = lazy(() => import('../../pages/candidates/CandidatesPage').then(m => ({ default: m.CandidatesPage })));
const CandidateDetailPage = lazy(() => import('../../pages/candidates/CandidateDetailPage').then(m => ({ default: m.CandidateDetailPage })));
const ComparePage = lazy(() => import('../../pages/compare/ComparePage').then(m => ({ default: m.ComparePage })));
const ReRankingPage = lazy(() => import('../../pages/candidates/ReRankingPage').then(m => ({ default: m.ReRankingPage })));

// Company Flow
const CompanyHomePage = lazy(() => import('../../pages/company/CompanyHomePage').then(m => ({ default: m.CompanyHomePage })));
const FindTalentPage = lazy(() => import('../../pages/company/FindTalentPage').then(m => ({ default: m.FindTalentPage })));
const ProblemCreationPage = lazy(() => import('../../pages/company/ProblemCreationPage').then(m => ({ default: m.ProblemCreationPage })));
const ProblemAnalysisPage = lazy(() => import('../../pages/company/ProblemAnalysisPage').then(m => ({ default: m.ProblemAnalysisPage })));
const RequirementAnalysisPage = lazy(() => import('../../pages/company/RequirementAnalysisPage').then(m => ({ default: m.RequirementAnalysisPage })));
const ProblemCandidateResultsPage = lazy(() => import('../../pages/company/ProblemCandidateResultsPage').then(m => ({ default: m.ProblemCandidateResultsPage })));
const CandidateComparisonPage = lazy(() => import('../../pages/company/CandidateComparisonPage').then(m => ({ default: m.CandidateComparisonPage })));
const CandidateDetailCompanyPage = lazy(() => import('../../pages/company/CandidateDetailCompanyPage').then(m => ({ default: m.CandidateDetailCompanyPage })));
const CandidateResultsPage = lazy(() => import('../../pages/company/CandidateResultsPage').then(m => ({ default: m.CandidateResultsPage })));
const CompanyChallengePage = lazy(() => import('../../pages/company/CompanyChallengePage').then(m => ({ default: m.CompanyChallengePage })));
const InviteCandidatePage = lazy(() => import('../../pages/company/InviteCandidatePage').then(m => ({ default: m.InviteCandidatePage })));
const JobDefinitionPage = lazy(() => import('../../pages/company/JobDefinitionPage').then(m => ({ default: m.JobDefinitionPage })));
const TeamBuilderPage = lazy(() => import('../../pages/company/TeamBuilderPage').then(m => ({ default: m.TeamBuilderPage })));

// Challenges
const ChallengeLibraryPage = lazy(() => import('../../pages/challenges/ChallengeLibraryPage').then(m => ({ default: m.ChallengeLibraryPage })));
const ChallengeDetailPage = lazy(() => import('../../pages/challenges/ChallengeDetailPage').then(m => ({ default: m.ChallengeDetailPage })));
const ChallengeWorkspacePage = lazy(() => import('../../pages/challenges/ChallengeWorkspacePage').then(m => ({ default: m.ChallengeWorkspacePage })));
const ChallengeResultPage = lazy(() => import('../../pages/challenges/ChallengeResultPage').then(m => ({ default: m.ChallengeResultPage })));

// Gaps & Growth
const GapsPage = lazy(() => import('../../pages/gaps/GapsPage').then(m => ({ default: m.GapsPage })));
const GapDetailPage = lazy(() => import('../../pages/gaps/GapDetailPage').then(m => ({ default: m.GapDetailPage })));
const GrowthPlanPage = lazy(() => import('../../pages/gaps/GrowthPlanPage').then(m => ({ default: m.GrowthPlanPage })));

// Opportunities
const OpportunitiesPage = lazy(() => import('../../pages/opportunities/OpportunitiesPage').then(m => ({ default: m.OpportunitiesPage })));
const OpportunitySearchPage = lazy(() => import('../../pages/opportunities/OpportunitySearchPage').then(m => ({ default: m.OpportunitySearchPage })));
const OpportunityDetailPage = lazy(() => import('../../pages/opportunities/OpportunityDetailPage').then(m => ({ default: m.OpportunityDetailPage })));
const ApplicationPage = lazy(() => import('../../pages/opportunities/ApplicationPage').then(m => ({ default: m.ApplicationPage })));
const MatchExplanationPage = lazy(() => import('../../pages/opportunities/MatchExplanationPage').then(m => ({ default: m.MatchExplanationPage })));

// Resources
const ResourceDiscoveryPage = lazy(() => import('../../pages/resources/ResourceDiscoveryPage').then(m => ({ default: m.ResourceDiscoveryPage })));
const ResourceDetailPage = lazy(() => import('../../pages/resources/ResourceDetailPage').then(m => ({ default: m.ResourceDetailPage })));

// Evidence Detail
const EvidenceDetailPage = lazy(() => import('../../pages/evidence/EvidenceDetailPage').then(m => ({ default: m.EvidenceDetailPage })));

// Settings
const SettingsPage = lazy(() => import('../../pages/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));
const NotificationsPage = lazy(() => import('../../pages/settings/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const PrivacyPage = lazy(() => import('../../pages/settings/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const ConnectedAccountsPage = lazy(() => import('../../pages/settings/ConnectedAccountsPage').then(m => ({ default: m.ConnectedAccountsPage })));

// Network / Messages
const MessagesInboxPage = lazy(() => import('../../pages/network/MessagesInboxPage').then(m => ({ default: m.MessagesInboxPage })));
const ConversationPage = lazy(() => import('../../pages/network/ConversationPage').then(m => ({ default: m.ConversationPage })));
const ConnectionsPage = lazy(() => import('../../pages/network/ConnectionsPage').then(m => ({ default: m.ConnectionsPage })));
const ConnectionRequestsPage = lazy(() => import('../../pages/network/ConnectionRequestsPage').then(m => ({ default: m.ConnectionRequestsPage })));
const CreateGroupPage = lazy(() => import('../../pages/network/CreateGroupPage').then(m => ({ default: m.CreateGroupPage })));
const GroupConversationPage = lazy(() => import('../../pages/network/GroupConversationPage').then(m => ({ default: m.GroupConversationPage })));
const CommunicationSettingsPage = lazy(() => import('../../pages/network/CommunicationSettingsPage').then(m => ({ default: m.CommunicationSettingsPage })));

// Organization
const OrganizationDashboardPage = lazy(() => import('../../pages/organization/OrganizationDashboardPage').then(m => ({ default: m.OrganizationDashboardPage })));
const OrganizationMembersPage = lazy(() => import('../../pages/organization/OrganizationMembersPage').then(m => ({ default: m.OrganizationMembersPage })));
const OrganizationProfilePage = lazy(() => import('../../pages/organization/OrganizationProfilePage').then(m => ({ default: m.OrganizationProfilePage })));
const OrganizationRolesPage = lazy(() => import('../../pages/organization/OrganizationRolesPage').then(m => ({ default: m.OrganizationRolesPage })));
const OrganizationVerificationPage = lazy(() => import('../../pages/organization/OrganizationVerificationPage').then(m => ({ default: m.OrganizationVerificationPage })));

// Admin
const AdminDashboardPage = lazy(() => import('../../pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const VerificationQueuePage = lazy(() => import('../../pages/admin/VerificationQueuePage').then(m => ({ default: m.VerificationQueuePage })));
const EvidenceReviewPage = lazy(() => import('../../pages/admin/EvidenceReviewPage').then(m => ({ default: m.EvidenceReviewPage })));
const AiAnalysisQueuePage = lazy(() => import('../../pages/admin/AiAnalysisQueuePage').then(m => ({ default: m.AiAnalysisQueuePage })));

// System States
const SystemStatesPage = lazy(() => import('../../pages/system/SystemStatesPage').then(m => ({ default: m.SystemStatesPage })));

// Analyzing
const AnalyzingPage = lazy(() => import('../../pages/analyzing/AnalyzingPage').then(m => ({ default: m.AnalyzingPage })));

// Legacy Talent Profile
const ProfilePage = lazy(() => import('../../pages/profile/ProfilePage').then(m => ({ default: m.ProfilePage })));

export const router = createBrowserRouter([
  // 1. البوابات المستقلة (Onboarding & Auth)
  { path: ROUTES.LANDING, element: <LandingPage /> },
  { path: ROUTES.SIGNUP, element: <Suspense fallback={<RouteFallback />}><SignUpPage /></Suspense> },
  { path: ROUTES.LOGIN, element: <Suspense fallback={<RouteFallback />}><LoginPage /></Suspense> },
  { path: ROUTES.VERIFY_EMAIL, element: <Suspense fallback={<RouteFallback />}><EmailVerificationPage /></Suspense> },
  { path: ROUTES.ROLE_SELECT, element: <Suspense fallback={<RouteFallback />}><RoleSelectPage /></Suspense> },
  { path: ROUTES.ONBOARDING_IDENTITY, element: <Suspense fallback={<RouteFallback />}><BasicIdentityPage /></Suspense> },
  { path: ROUTES.ONBOARDING_INTENT, element: <Suspense fallback={<RouteFallback />}><FirstIntentPage /></Suspense> },
  { path: ROUTES.INVITE, element: <Suspense fallback={<RouteFallback />}><InvitePage /></Suspense> },

  // 2. الواجهات الداخلية ضمن MainLayout
  {
    element: <MainLayout />,
    children: [
      // Core & Discovery
      { path: ROUTES.HOME, element: <Suspense fallback={<RouteFallback />}><HomePage /></Suspense> },
      { path: ROUTES.DISCOVER, element: <Suspense fallback={<RouteFallback />}><DiscoverPage /></Suspense> },
      { path: ROUTES.DISCOVER_PEOPLE, element: <Suspense fallback={<RouteFallback />}><PeopleDirectoryPage /></Suspense> },
      { path: ROUTES.PUBLIC_PROFILE, element: <Suspense fallback={<RouteFallback />}><PublicProfilePage /></Suspense> },

      // GitHub Evidence Loop
      { path: ROUTES.PROFILE_COMPLETION, element: <Suspense fallback={<RouteFallback />}><ProfileCompletionPage /></Suspense> },
      { path: ROUTES.GITHUB_CONNECT, element: <Suspense fallback={<RouteFallback />}><GitHubConnectPage /></Suspense> },
      { path: ROUTES.GITHUB_SELECT, element: <Suspense fallback={<RouteFallback />}><RepoSelectPage /></Suspense> },
      { path: ROUTES.GITHUB_SCANNING, element: <Suspense fallback={<RouteFallback />}><GitHubScanPage /></Suspense> },
      { path: ROUTES.GITHUB_RESULTS, element: <Suspense fallback={<RouteFallback />}><GitHubResultsPage /></Suspense> },
      { path: ROUTES.GITHUB_REPO_DETAIL, element: <Suspense fallback={<RouteFallback />}><RepoDetailPage /></Suspense> },

      // Master Profile (Proof Core)
      { path: ROUTES.MASTER_PROFILE, element: <Suspense fallback={<RouteFallback />}><MasterProfilePage /></Suspense> },
      { path: ROUTES.MASTER_SKILL_DETAIL, element: <Suspense fallback={<RouteFallback />}><CapabilityDetailPage /></Suspense> },
      { path: ROUTES.MASTER_DNA, element: <Suspense fallback={<RouteFallback />}><MasterDnaPage /></Suspense> },
      { path: ROUTES.MASTER_TIMELINE, element: <Suspense fallback={<RouteFallback />}><MasterTimelinePage /></Suspense> },
      { path: ROUTES.MASTER_WHY_LEVEL, element: <Suspense fallback={<RouteFallback />}><WhyThisLevelPage /></Suspense> },

      // مسار صاحب المشكلة
      { path: ROUTES.PROBLEM, element: <Suspense fallback={<RouteFallback />}><ProblemInputPage /></Suspense> },
      { path: ROUTES.CAPABILITIES, element: <Suspense fallback={<RouteFallback />}><CapabilitiesPage /></Suspense> },
      { path: ROUTES.SIMULATION, element: <Suspense fallback={<RouteFallback />}><SimulationPage /></Suspense> },
      { path: ROUTES.EVALUATION, element: <Suspense fallback={<RouteFallback />}><EvaluationPage /></Suspense> },
      { path: ROUTES.SKILL_DNA, element: <Suspense fallback={<RouteFallback />}><SkillDnaPage /></Suspense> },
      { path: ROUTES.RESULT, element: <Suspense fallback={<RouteFallback />}><ResultPage /></Suspense> },
      { path: ROUTES.CANDIDATES, element: <Suspense fallback={<RouteFallback />}><CandidatesPage /></Suspense> },
      { path: ROUTES.CANDIDATE_DETAIL, element: <Suspense fallback={<RouteFallback />}><CandidateDetailPage /></Suspense> },
      { path: ROUTES.COMPARE, element: <Suspense fallback={<RouteFallback />}><ComparePage /></Suspense> },
      { path: ROUTES.RE_RANKING, element: <Suspense fallback={<RouteFallback />}><ReRankingPage /></Suspense> },

      // Company Flow
      { path: ROUTES.COMPANY_HOME, element: <Suspense fallback={<RouteFallback />}><CompanyHomePage /></Suspense> },
      { path: ROUTES.FIND_TALENT, element: <Suspense fallback={<RouteFallback />}><FindTalentPage /></Suspense> },
      { path: ROUTES.PROBLEM_CREATION, element: <Suspense fallback={<RouteFallback />}><ProblemCreationPage /></Suspense> },
      { path: ROUTES.PROBLEM_ANALYSIS, element: <Suspense fallback={<RouteFallback />}><ProblemAnalysisPage /></Suspense> },
      { path: ROUTES.REQUIREMENT_ANALYSIS, element: <Suspense fallback={<RouteFallback />}><RequirementAnalysisPage /></Suspense> },
      { path: ROUTES.PROBLEM_CANDIDATES, element: <Suspense fallback={<RouteFallback />}><ProblemCandidateResultsPage /></Suspense> },
      { path: ROUTES.COMPANY_CANDIDATES, element: <Suspense fallback={<RouteFallback />}><CandidateResultsPage /></Suspense> },
      { path: ROUTES.COMPANY_COMPARE, element: <Suspense fallback={<RouteFallback />}><CandidateComparisonPage /></Suspense> },
      { path: '/company/candidates/:id', element: <Suspense fallback={<RouteFallback />}><CandidateDetailCompanyPage /></Suspense> },
      { path: ROUTES.COMPANY_INVITE, element: <Suspense fallback={<RouteFallback />}><InviteCandidatePage /></Suspense> },
      { path: ROUTES.COMPANY_CHALLENGE_NEW, element: <Suspense fallback={<RouteFallback />}><CompanyChallengePage /></Suspense> },
      { path: ROUTES.JOB_DEFINITION, element: <Suspense fallback={<RouteFallback />}><JobDefinitionPage /></Suspense> },
      { path: ROUTES.TEAM_BUILDER, element: <Suspense fallback={<RouteFallback />}><TeamBuilderPage /></Suspense> },

      // Challenges
      { path: ROUTES.CHALLENGES, element: <Suspense fallback={<RouteFallback />}><ChallengeLibraryPage /></Suspense> },
      { path: '/challenges/:id', element: <Suspense fallback={<RouteFallback />}><ChallengeDetailPage /></Suspense> },
      { path: '/challenges/:id/workspace', element: <Suspense fallback={<RouteFallback />}><ChallengeWorkspacePage /></Suspense> },
      { path: '/challenges/:id/result', element: <Suspense fallback={<RouteFallback />}><ChallengeResultPage /></Suspense> },

      // Gaps & Growth
      { path: ROUTES.GAPS, element: <Suspense fallback={<RouteFallback />}><GapsPage /></Suspense> },
      { path: '/gaps/:id', element: <Suspense fallback={<RouteFallback />}><GapDetailPage /></Suspense> },
      { path: ROUTES.GROWTH_PLAN, element: <Suspense fallback={<RouteFallback />}><GrowthPlanPage /></Suspense> },

      // Opportunities
      { path: ROUTES.OPPORTUNITIES, element: <Suspense fallback={<RouteFallback />}><OpportunitiesPage /></Suspense> },
      { path: ROUTES.OPPORTUNITY_SEARCH, element: <Suspense fallback={<RouteFallback />}><OpportunitySearchPage /></Suspense> },
      { path: '/opportunities/:id', element: <Suspense fallback={<RouteFallback />}><OpportunityDetailPage /></Suspense> },
      { path: '/opportunities/:id/apply', element: <Suspense fallback={<RouteFallback />}><ApplicationPage /></Suspense> },
      { path: '/opportunities/:id/match', element: <Suspense fallback={<RouteFallback />}><MatchExplanationPage /></Suspense> },

      // Resources
      { path: ROUTES.RESOURCES, element: <Suspense fallback={<RouteFallback />}><ResourceDiscoveryPage /></Suspense> },
      { path: '/resources/:id', element: <Suspense fallback={<RouteFallback />}><ResourceDetailPage /></Suspense> },

      // Evidence Detail
      { path: ROUTES.EVIDENCE_DETAIL, element: <Suspense fallback={<RouteFallback />}><EvidenceDetailPage /></Suspense> },

      // Settings
      { path: ROUTES.SETTINGS, element: <Suspense fallback={<RouteFallback />}><SettingsPage /></Suspense> },
      { path: ROUTES.NOTIFICATIONS, element: <Suspense fallback={<RouteFallback />}><NotificationsPage /></Suspense> },
      { path: ROUTES.PRIVACY, element: <Suspense fallback={<RouteFallback />}><PrivacyPage /></Suspense> },
      { path: ROUTES.CONNECTED_ACCOUNTS, element: <Suspense fallback={<RouteFallback />}><ConnectedAccountsPage /></Suspense> },

      // Network / Messages
      { path: ROUTES.MESSAGES, element: <Suspense fallback={<RouteFallback />}><MessagesInboxPage /></Suspense> },
      { path: ROUTES.CONVERSATION, element: <Suspense fallback={<RouteFallback />}><ConversationPage /></Suspense> },
      { path: '/messages/group/:id', element: <Suspense fallback={<RouteFallback />}><GroupConversationPage /></Suspense> },
      { path: ROUTES.CONNECTIONS, element: <Suspense fallback={<RouteFallback />}><ConnectionsPage /></Suspense> },
      { path: ROUTES.CONNECTION_REQUESTS, element: <Suspense fallback={<RouteFallback />}><ConnectionRequestsPage /></Suspense> },
      { path: ROUTES.CREATE_GROUP, element: <Suspense fallback={<RouteFallback />}><CreateGroupPage /></Suspense> },
      { path: ROUTES.COMM_SETTINGS, element: <Suspense fallback={<RouteFallback />}><CommunicationSettingsPage /></Suspense> },

      // Organization
      { path: ROUTES.ORG_DASHBOARD, element: <Suspense fallback={<RouteFallback />}><OrganizationDashboardPage /></Suspense> },
      { path: ROUTES.ORG_MEMBERS, element: <Suspense fallback={<RouteFallback />}><OrganizationMembersPage /></Suspense> },
      { path: ROUTES.ORG_PROFILE, element: <Suspense fallback={<RouteFallback />}><OrganizationProfilePage /></Suspense> },
      { path: ROUTES.ORG_ROLES, element: <Suspense fallback={<RouteFallback />}><OrganizationRolesPage /></Suspense> },
      { path: ROUTES.ORG_VERIFICATION, element: <Suspense fallback={<RouteFallback />}><OrganizationVerificationPage /></Suspense> },

      // Admin
      { path: ROUTES.ADMIN_DASHBOARD, element: <Suspense fallback={<RouteFallback />}><AdminDashboardPage /></Suspense> },
      { path: ROUTES.ADMIN_VERIFICATION, element: <Suspense fallback={<RouteFallback />}><VerificationQueuePage /></Suspense> },
      { path: ROUTES.ADMIN_EVIDENCE, element: <Suspense fallback={<RouteFallback />}><EvidenceReviewPage /></Suspense> },
      { path: ROUTES.ADMIN_AI_QUEUE, element: <Suspense fallback={<RouteFallback />}><AiAnalysisQueuePage /></Suspense> },

      // System & Analyzing
      { path: '/system', element: <Suspense fallback={<RouteFallback />}><SystemStatesPage /></Suspense> },
      { path: '/analyzing', element: <Suspense fallback={<RouteFallback />}><AnalyzingPage /></Suspense> },

      // Legacy Profile
      { path: ROUTES.PROFILE, element: <Suspense fallback={<RouteFallback />}><ProfilePage /></Suspense> },
      { path: '/profile/sources', element: <Suspense fallback={<RouteFallback />}><ProfilePage /></Suspense> },
      { path: '/profile/evidence', element: <Suspense fallback={<RouteFallback />}><ProfilePage /></Suspense> },
      { path: '/profile/evidence/:id', element: <Suspense fallback={<RouteFallback />}><ProfilePage /></Suspense> },
      { path: '/profile/timeline', element: <Suspense fallback={<RouteFallback />}><ProfilePage /></Suspense> },
      { path: '/profile/gaps', element: <Suspense fallback={<RouteFallback />}><ProfilePage /></Suspense> },
      { path: '/profile/opportunities', element: <Suspense fallback={<RouteFallback />}><ProfilePage /></Suspense> },
      { path: '/profile/passport', element: <Suspense fallback={<RouteFallback />}><ProfilePage /></Suspense> },
    ],
  },

  // مسار الـ Fallback
  { path: '*', element: <LandingPage /> },
]);
