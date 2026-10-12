/**
 * App Router — تعريف كافة مسارات وواجهات منصة قُدرة (المرحلة الأولى Proof Core ومسار صاحب المشكلة).
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

// Profile, Source Center & Passport
const LinkedInProfilePage = lazy(() => import('../../pages/profile/LinkedInProfilePage').then(m => ({ default: m.LinkedInProfilePage })));
const SourceCenterPage = lazy(() => import('../../pages/profile/sources/SourceCenterPage').then(m => ({ default: m.SourceCenterPage })));
const CapabilityPassportPage = lazy(() => import('../../pages/passport/CapabilityPassportPage').then(m => ({ default: m.CapabilityPassportPage })));

// Interactive Challenge Sandbox & Full Vision Pages
const ChallengeSandboxPage = lazy(() => import('../../pages/challenges/ChallengeSandboxPage').then(m => ({ default: m.ChallengeSandboxPage })));
const RepoDeepInspectorPage = lazy(() => import('../../pages/github/RepoDeepInspectorPage').then(m => ({ default: m.RepoDeepInspectorPage })));
const ProblemMatchReportPage = lazy(() => import('../../pages/problems/ProblemMatchReportPage').then(m => ({ default: m.ProblemMatchReportPage })));

// M18 Company Workspace (Q-0681, Q-0683, Q-0684, Q-0687, Q-0709, Q-0711)
const M18OverviewPage = lazy(() => import('../../pages/company/m18/M18OverviewPage').then(m => ({ default: m.M18OverviewPage })));
const M18DetailsPage = lazy(() => import('../../pages/company/m18/M18DetailsPage').then(m => ({ default: m.M18DetailsPage })));
const M18CreatePage = lazy(() => import('../../pages/company/m18/M18CreatePage').then(m => ({ default: m.M18CreatePage })));
const M18ResultsPage = lazy(() => import('../../pages/company/m18/M18ResultsPage').then(m => ({ default: m.M18ResultsPage })));
const M18EmptyPage = lazy(() => import('../../pages/company/m18/M18EmptyPage').then(m => ({ default: m.M18EmptyPage })));
const M18ErrorPage = lazy(() => import('../../pages/company/m18/M18ErrorPage').then(m => ({ default: m.M18ErrorPage })));

// M09 Next Step Engine (Q-0321, Q-0323, Q-0324, Q-0327, Q-0349, Q-0351)
const M09OverviewPage = lazy(() => import('../../pages/next/m09/M09OverviewPage').then(m => ({ default: m.M09OverviewPage })));
const M09DetailsPage = lazy(() => import('../../pages/next/m09/M09DetailsPage').then(m => ({ default: m.M09DetailsPage })));
const M09CreatePage = lazy(() => import('../../pages/next/m09/M09CreatePage').then(m => ({ default: m.M09CreatePage })));
const M09ResultsPage = lazy(() => import('../../pages/next/m09/M09ResultsPage').then(m => ({ default: m.M09ResultsPage })));
const M09EmptyPage = lazy(() => import('../../pages/next/m09/M09EmptyPage').then(m => ({ default: m.M09EmptyPage })));
const M09ErrorPage = lazy(() => import('../../pages/next/m09/M09ErrorPage').then(m => ({ default: m.M09ErrorPage })));

// M04 Import Center (Q-0121, Q-0123, Q-0124, Q-0127, Q-0149, Q-0151)
const M04OverviewPage = lazy(() => import('../../pages/import/m04/M04OverviewPage').then(m => ({ default: m.M04OverviewPage })));
const M04DetailsPage = lazy(() => import('../../pages/import/m04/M04DetailsPage').then(m => ({ default: m.M04DetailsPage })));
const M04CreatePage = lazy(() => import('../../pages/import/m04/M04CreatePage').then(m => ({ default: m.M04CreatePage })));
const M04ResultsPage = lazy(() => import('../../pages/import/m04/M04ResultsPage').then(m => ({ default: m.M04ResultsPage })));
const M04EmptyPage = lazy(() => import('../../pages/import/m04/M04EmptyPage').then(m => ({ default: m.M04EmptyPage })));
const M04ErrorPage = lazy(() => import('../../pages/import/m04/M04ErrorPage').then(m => ({ default: m.M04ErrorPage })));

// M02 Home Dashboard (Q-0041, Q-0043, Q-0044, Q-0047, Q-0069, Q-0071)
const M02DetailsPage = lazy(() => import('../../pages/home/m02/M02DetailsPage').then(m => ({ default: m.M02DetailsPage })));
const M02CreatePage = lazy(() => import('../../pages/home/m02/M02CreatePage').then(m => ({ default: m.M02CreatePage })));
const M02ResultsPage = lazy(() => import('../../pages/home/m02/M02ResultsPage').then(m => ({ default: m.M02ResultsPage })));
const M02EmptyPage = lazy(() => import('../../pages/home/m02/M02EmptyPage').then(m => ({ default: m.M02EmptyPage })));
const M02ErrorPage = lazy(() => import('../../pages/home/m02/M02ErrorPage').then(m => ({ default: m.M02ErrorPage })));

// M10 Learning Paths & Courses (Q-0361, Q-0363, Q-0364, Q-0367, Q-0389, Q-0391)
const M10OverviewPage = lazy(() => import('../../pages/learning/m10/M10OverviewPage').then(m => ({ default: m.M10OverviewPage })));
const M10DetailsPage = lazy(() => import('../../pages/learning/m10/M10DetailsPage').then(m => ({ default: m.M10DetailsPage })));
const M10CreatePage = lazy(() => import('../../pages/learning/m10/M10CreatePage').then(m => ({ default: m.M10CreatePage })));
const M10ResultsPage = lazy(() => import('../../pages/learning/m10/M10ResultsPage').then(m => ({ default: m.M10ResultsPage })));
const M10EmptyPage = lazy(() => import('../../pages/learning/m10/M10EmptyPage').then(m => ({ default: m.M10EmptyPage })));
const M10ErrorPage = lazy(() => import('../../pages/learning/m10/M10ErrorPage').then(m => ({ default: m.M10ErrorPage })));

// M12 Oral Verification & Assessment (Q-0441, Q-0443, Q-0444, Q-0447, Q-0469, Q-0471)
const M12OverviewPage = lazy(() => import('../../pages/oral/m12/M12OverviewPage').then(m => ({ default: m.M12OverviewPage })));
const M12DetailsPage = lazy(() => import('../../pages/oral/m12/M12DetailsPage').then(m => ({ default: m.M12DetailsPage })));
const M12CreatePage = lazy(() => import('../../pages/oral/m12/M12CreatePage').then(m => ({ default: m.M12CreatePage })));
const M12ResultsPage = lazy(() => import('../../pages/oral/m12/M12ResultsPage').then(m => ({ default: m.M12ResultsPage })));
const M12EmptyPage = lazy(() => import('../../pages/oral/m12/M12EmptyPage').then(m => ({ default: m.M12EmptyPage })));
const M12ErrorPage = lazy(() => import('../../pages/oral/m12/M12ErrorPage').then(m => ({ default: m.M12ErrorPage })));

// M14 GitHub & Code Intelligence (Q-0521, Q-0523, Q-0524, Q-0527, Q-0549, Q-0551)
const M14OverviewPage = lazy(() => import('../../pages/github/m14/M14OverviewPage').then(m => ({ default: m.M14OverviewPage })));
const M14DetailsPage = lazy(() => import('../../pages/github/m14/M14DetailsPage').then(m => ({ default: m.M14DetailsPage })));
const M14CreatePage = lazy(() => import('../../pages/github/m14/M14CreatePage').then(m => ({ default: m.M14CreatePage })));
const M14ResultsPage = lazy(() => import('../../pages/github/m14/M14ResultsPage').then(m => ({ default: m.M14ResultsPage })));
const M14EmptyPage = lazy(() => import('../../pages/github/m14/M14EmptyPage').then(m => ({ default: m.M14EmptyPage })));
const M14ErrorPage = lazy(() => import('../../pages/github/m14/M14ErrorPage').then(m => ({ default: m.M14ErrorPage })));

// M22 Verification & Trust Matrix (Q-0841, Q-0843, Q-0844, Q-0847, Q-0869, Q-0871)
const M22OverviewPage = lazy(() => import('../../pages/trust/m22/M22OverviewPage').then(m => ({ default: m.M22OverviewPage })));
const M22DetailsPage = lazy(() => import('../../pages/trust/m22/M22DetailsPage').then(m => ({ default: m.M22DetailsPage })));
const M22CreatePage = lazy(() => import('../../pages/trust/m22/M22CreatePage').then(m => ({ default: m.M22CreatePage })));
const M22ResultsPage = lazy(() => import('../../pages/trust/m22/M22ResultsPage').then(m => ({ default: m.M22ResultsPage })));
const M22EmptyPage = lazy(() => import('../../pages/trust/m22/M22EmptyPage').then(m => ({ default: m.M22EmptyPage })));
const M22ErrorPage = lazy(() => import('../../pages/trust/m22/M22ErrorPage').then(m => ({ default: m.M22ErrorPage })));

// M19 Candidates Pipeline (Q-0721, Q-0723, Q-0724, Q-0727, Q-0749, Q-0751)
const M19OverviewPage = lazy(() => import('../../pages/pipeline/m19/M19OverviewPage').then(m => ({ default: m.M19OverviewPage })));
const M19DetailsPage = lazy(() => import('../../pages/pipeline/m19/M19DetailsPage').then(m => ({ default: m.M19DetailsPage })));
const M19CreatePage = lazy(() => import('../../pages/pipeline/m19/M19CreatePage').then(m => ({ default: m.M19CreatePage })));
const M19ResultsPage = lazy(() => import('../../pages/pipeline/m19/M19ResultsPage').then(m => ({ default: m.M19ResultsPage })));
const M19EmptyPage = lazy(() => import('../../pages/pipeline/m19/M19EmptyPage').then(m => ({ default: m.M19EmptyPage })));
const M19ErrorPage = lazy(() => import('../../pages/pipeline/m19/M19ErrorPage').then(m => ({ default: m.M19ErrorPage })));

// M23 Community & Exchange (Q-0881, Q-0883, Q-0884, Q-0887, Q-0909, Q-0911)
const M23OverviewPage = lazy(() => import('../../pages/community/m23/M23OverviewPage').then(m => ({ default: m.M23OverviewPage })));
const M23DetailsPage = lazy(() => import('../../pages/community/m23/M23DetailsPage').then(m => ({ default: m.M23DetailsPage })));
const M23CreatePage = lazy(() => import('../../pages/community/m23/M23CreatePage').then(m => ({ default: m.M23CreatePage })));
const M23ResultsPage = lazy(() => import('../../pages/community/m23/M23ResultsPage').then(m => ({ default: m.M23ResultsPage })));
const M23EmptyPage = lazy(() => import('../../pages/community/m23/M23EmptyPage').then(m => ({ default: m.M23EmptyPage })));
const M23ErrorPage = lazy(() => import('../../pages/community/m23/M23ErrorPage').then(m => ({ default: m.M23ErrorPage })));

// M26 Settings & Billing (Q-1001, Q-1003, Q-1004, Q-1007, Q-1029, Q-1031)
const M26OverviewPage = lazy(() => import('../../pages/settings/m26/M26OverviewPage').then(m => ({ default: m.M26OverviewPage })));
const M26DetailsPage = lazy(() => import('../../pages/settings/m26/M26DetailsPage').then(m => ({ default: m.M26DetailsPage })));
const M26CreatePage = lazy(() => import('../../pages/settings/m26/M26CreatePage').then(m => ({ default: m.M26CreatePage })));
const M26ResultsPage = lazy(() => import('../../pages/settings/m26/M26ResultsPage').then(m => ({ default: m.M26ResultsPage })));
const M26EmptyPage = lazy(() => import('../../pages/settings/m26/M26EmptyPage').then(m => ({ default: m.M26EmptyPage })));
const M26ErrorPage = lazy(() => import('../../pages/settings/m26/M26ErrorPage').then(m => ({ default: m.M26ErrorPage })));

// M11 Practice Challenges (Q-0401, Q-0403, Q-0404, Q-0407, Q-0429, Q-0431)
const M11OverviewPage = lazy(() => import('../../pages/challenges/m11/PracticeChallengesOverviewPage').then(m => ({ default: m.PracticeChallengesOverviewPage })));
const M11DetailsPage = lazy(() => import('../../pages/challenges/m11/PracticeChallengeDetailPage').then(m => ({ default: m.PracticeChallengeDetailPage })));
const M11AttemptPage = lazy(() => import('../../pages/challenges/m11/PracticeChallengeAttemptPage').then(m => ({ default: m.PracticeChallengeAttemptPage })));
const M11ResultPage = lazy(() => import('../../pages/challenges/m11/PracticeChallengeResultPage').then(m => ({ default: m.PracticeChallengeResultPage })));
const M11EmptyPage = lazy(() => import('../../pages/challenges/m11/PracticeChallengesEmptyPage').then(m => ({ default: m.PracticeChallengesEmptyPage })));
const M11ErrorPage = lazy(() => import('../../pages/challenges/m11/PracticeChallengesErrorPage').then(m => ({ default: m.PracticeChallengesErrorPage })));

// M13 Projects Portfolio (Q-0481, Q-0483, Q-0484, Q-0487, Q-0509, Q-0511)
const M13OverviewPage = lazy(() => import('../../pages/projects/m13/ProjectsOverviewPage').then(m => ({ default: m.ProjectsOverviewPage })));
const M13DetailsPage = lazy(() => import('../../pages/projects/m13/ProjectDetailPage').then(m => ({ default: m.ProjectDetailPage })));
const M13CreatePage = lazy(() => import('../../pages/projects/m13/ProjectCreatePage').then(m => ({ default: m.ProjectCreatePage })));
const M13ResultPage = lazy(() => import('../../pages/projects/m13/ProjectResultPage').then(m => ({ default: m.ProjectResultPage })));
const M13EmptyPage = lazy(() => import('../../pages/projects/m13/ProjectsEmptyPage').then(m => ({ default: m.ProjectsEmptyPage })));
const M13ErrorPage = lazy(() => import('../../pages/projects/m13/ProjectsErrorPage').then(m => ({ default: m.ProjectsErrorPage })));

// M24 AI Assistant & Explain (Q-0921, Q-0923, Q-0924, Q-0927, Q-0949, Q-0951)
const M24OverviewPage = lazy(() => import('../../pages/assistant/m24/AssistantOverviewPage').then(m => ({ default: m.AssistantOverviewPage })));
const M24DetailsPage = lazy(() => import('../../pages/assistant/m24/AssistantDetailPage').then(m => ({ default: m.AssistantDetailPage })));
const M24CreatePage = lazy(() => import('../../pages/assistant/m24/AssistantCreatePage').then(m => ({ default: m.AssistantCreatePage })));
const M24ResultPage = lazy(() => import('../../pages/assistant/m24/AssistantResultPage').then(m => ({ default: m.AssistantResultPage })));
const M24DisputePage = lazy(() => import('../../pages/assistant/m24/AssistantDisputePage').then(m => ({ default: m.AssistantDisputePage })));
const M24EmptyPage = lazy(() => import('../../pages/assistant/m24/AssistantEmptyPage').then(m => ({ default: m.AssistantEmptyPage })));
const M24ErrorPage = lazy(() => import('../../pages/assistant/m24/AssistantErrorPage').then(m => ({ default: m.AssistantErrorPage })));

// Problem Owner Flow
const ProblemInputPage = lazy(() => import('../../pages/problem/ProblemInputPage').then(m => ({ default: m.ProblemInputPage })));
const CapabilitiesPage = lazy(() => import('../../pages/capabilities/CapabilitiesPage').then(m => ({ default: m.CapabilitiesPage })));

// M15 Problem Input & Analysis (Q-0561, Q-0563, Q-0564, Q-0567, Q-0589, Q-0591)
const M15OverviewPage = lazy(() => import('../../pages/problem/m15/M15OverviewPage').then(m => ({ default: m.M15OverviewPage })));
const M15DetailsPage = lazy(() => import('../../pages/problem/m15/M15DetailsPage').then(m => ({ default: m.M15DetailsPage })));
const M15CreatePage = lazy(() => import('../../pages/problem/m15/M15CreatePage').then(m => ({ default: m.M15CreatePage })));
const M15ResultsPage = lazy(() => import('../../pages/problem/m15/M15ResultsPage').then(m => ({ default: m.M15ResultsPage })));
const M15EmptyPage = lazy(() => import('../../pages/problem/m15/M15EmptyPage').then(m => ({ default: m.M15EmptyPage })));
const M15ErrorPage = lazy(() => import('../../pages/problem/m15/M15ErrorPage').then(m => ({ default: m.M15ErrorPage })));

// M16 Explainable Matching (Q-0601, Q-0603, Q-0604, Q-0607, Q-0629, Q-0631)
const M16OverviewPage = lazy(() => import('../../pages/matching/m16/M16OverviewPage').then(m => ({ default: m.M16OverviewPage })));
const M16DetailsPage = lazy(() => import('../../pages/matching/m16/M16DetailsPage').then(m => ({ default: m.M16DetailsPage })));
const M16CreatePage = lazy(() => import('../../pages/matching/m16/M16CreatePage').then(m => ({ default: m.M16CreatePage })));
const M16ResultsPage = lazy(() => import('../../pages/matching/m16/M16ResultsPage').then(m => ({ default: m.M16ResultsPage })));
const M16EmptyPage = lazy(() => import('../../pages/matching/m16/M16EmptyPage').then(m => ({ default: m.M16EmptyPage })));
const M16ErrorPage = lazy(() => import('../../pages/matching/m16/M16ErrorPage').then(m => ({ default: m.M16ErrorPage })));

// M25 Privacy, Consent & Data Control (Q-0961, Q-0963, Q-0964, Q-0967, Q-0989, Q-0991)
const M25OverviewPage = lazy(() => import('../../pages/privacy/m25/M25OverviewPage').then(m => ({ default: m.M25OverviewPage })));
const M25DetailsPage = lazy(() => import('../../pages/privacy/m25/M25DetailsPage').then(m => ({ default: m.M25DetailsPage })));
const M25CreatePage = lazy(() => import('../../pages/privacy/m25/M25CreatePage').then(m => ({ default: m.M25CreatePage })));
const M25ResultsPage = lazy(() => import('../../pages/privacy/m25/M25ResultsPage').then(m => ({ default: m.M25ResultsPage })));
const M25EmptyPage = lazy(() => import('../../pages/privacy/m25/M25EmptyPage').then(m => ({ default: m.M25EmptyPage })));
const M25ErrorPage = lazy(() => import('../../pages/privacy/m25/M25ErrorPage').then(m => ({ default: m.M25ErrorPage })));

// M17 Opportunities Hub (Q-0641, Q-0643, Q-0644, Q-0647, Q-0669, Q-0671)
const M17OverviewPage = lazy(() => import('../../pages/opportunities/m17/M17OverviewPage').then(m => ({ default: m.M17OverviewPage })));
const M17DetailsPage = lazy(() => import('../../pages/opportunities/m17/M17DetailsPage').then(m => ({ default: m.M17DetailsPage })));
const M17CreatePage = lazy(() => import('../../pages/opportunities/m17/M17CreatePage').then(m => ({ default: m.M17CreatePage })));
const M17ResultsPage = lazy(() => import('../../pages/opportunities/m17/M17ResultsPage').then(m => ({ default: m.M17ResultsPage })));
const M17EmptyPage = lazy(() => import('../../pages/opportunities/m17/M17EmptyPage').then(m => ({ default: m.M17EmptyPage })));
const M17ErrorPage = lazy(() => import('../../pages/opportunities/m17/M17ErrorPage').then(m => ({ default: m.M17ErrorPage })));

// M20 Team Composer (Q-0761, Q-0763, Q-0764, Q-0767, Q-0789, Q-0791)
const M20OverviewPage = lazy(() => import('../../pages/teams/m20/M20OverviewPage').then(m => ({ default: m.M20OverviewPage })));
const M20DetailsPage = lazy(() => import('../../pages/teams/m20/M20DetailsPage').then(m => ({ default: m.M20DetailsPage })));
const M20CreatePage = lazy(() => import('../../pages/teams/m20/M20CreatePage').then(m => ({ default: m.M20CreatePage })));
const M20ResultsPage = lazy(() => import('../../pages/teams/m20/M20ResultsPage').then(m => ({ default: m.M20ResultsPage })));
const M20EmptyPage = lazy(() => import('../../pages/teams/m20/M20EmptyPage').then(m => ({ default: m.M20EmptyPage })));
const M20ErrorPage = lazy(() => import('../../pages/teams/m20/M20ErrorPage').then(m => ({ default: m.M20ErrorPage })));

// M21 Project Workspace & Outcomes (Q-0801, Q-0803, Q-0804, Q-0807, Q-0829, Q-0831)
const M21OverviewPage = lazy(() => import('../../pages/workspace/m21/M21OverviewPage').then(m => ({ default: m.M21OverviewPage })));
const M21DetailsPage = lazy(() => import('../../pages/workspace/m21/M21DetailsPage').then(m => ({ default: m.M21DetailsPage })));
const M21CreatePage = lazy(() => import('../../pages/workspace/m21/M21CreatePage').then(m => ({ default: m.M21CreatePage })));
const M21ResultsPage = lazy(() => import('../../pages/workspace/m21/M21ResultsPage').then(m => ({ default: m.M21ResultsPage })));
const M21EmptyPage = lazy(() => import('../../pages/workspace/m21/M21EmptyPage').then(m => ({ default: m.M21EmptyPage })));
const M21ErrorPage = lazy(() => import('../../pages/workspace/m21/M21ErrorPage').then(m => ({ default: m.M21ErrorPage })));
const SimulationPage = lazy(() => import('../../pages/simulation/SimulationPage').then(m => ({ default: m.SimulationPage })));
const EvaluationPage = lazy(() => import('../../pages/evaluation/EvaluationPage').then(m => ({ default: m.EvaluationPage })));
const SkillDnaPage = lazy(() => import('../../pages/dna/SkillDnaPage').then(m => ({ default: m.SkillDnaPage })));
const ResultPage = lazy(() => import('../../pages/result/ResultPage').then(m => ({ default: m.ResultPage })));
const CandidatesPage = lazy(() => import('../../pages/candidates/CandidatesPage').then(m => ({ default: m.CandidatesPage })));
const CandidateDetailPage = lazy(() => import('../../pages/candidates/CandidateDetailPage').then(m => ({ default: m.CandidateDetailPage })));
const ComparePage = lazy(() => import('../../pages/compare/ComparePage').then(m => ({ default: m.ComparePage })));
const ReRankingPage = lazy(() => import('../../pages/candidates/ReRankingPage').then(m => ({ default: m.ReRankingPage })));

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

      // Profile, Source Center & Capability Passport
      { path: '/profile/edit', element: <Suspense fallback={<RouteFallback />}><LinkedInProfilePage /></Suspense> },
      { path: '/profile/sources', element: <Suspense fallback={<RouteFallback />}><SourceCenterPage /></Suspense> },
      { path: '/profile/passport', element: <Suspense fallback={<RouteFallback />}><CapabilityPassportPage /></Suspense> },
      { path: '/passport', element: <Suspense fallback={<RouteFallback />}><CapabilityPassportPage /></Suspense> },
      { path: ROUTES.PROFILE, element: <Suspense fallback={<RouteFallback />}><ProfilePage /></Suspense> },
      { path: '/profile/evidence', element: <Suspense fallback={<RouteFallback />}><ProfilePage /></Suspense> },
      { path: '/profile/evidence/:id', element: <Suspense fallback={<RouteFallback />}><ProfilePage /></Suspense> },
      { path: '/profile/timeline', element: <Suspense fallback={<RouteFallback />}><ProfilePage /></Suspense> },
      { path: '/profile/gaps', element: <Suspense fallback={<RouteFallback />}><ProfilePage /></Suspense> },
      { path: '/profile/opportunities', element: <Suspense fallback={<RouteFallback />}><ProfilePage /></Suspense> },

      // Interactive Challenges Sandbox & Full Vision Pages
      { path: ROUTES.CHALLENGES, element: <Suspense fallback={<RouteFallback />}><ChallengeSandboxPage /></Suspense> },
      { path: ROUTES.CHALLENGE_SANDBOX, element: <Suspense fallback={<RouteFallback />}><ChallengeSandboxPage /></Suspense> },
      { path: '/challenges/sandbox', element: <Suspense fallback={<RouteFallback />}><ChallengeSandboxPage /></Suspense> },
      { path: ROUTES.REPO_DEEP_INSPECT, element: <Suspense fallback={<RouteFallback />}><RepoDeepInspectorPage /></Suspense> },
      { path: '/profile/sources/github/inspect', element: <Suspense fallback={<RouteFallback />}><RepoDeepInspectorPage /></Suspense> },
      { path: '/evidence/github/inspector', element: <Suspense fallback={<RouteFallback />}><RepoDeepInspectorPage /></Suspense> },
      { path: ROUTES.PROBLEM_MATCH_REPORT, element: <Suspense fallback={<RouteFallback />}><ProblemMatchReportPage /></Suspense> },
      { path: '/problems/match', element: <Suspense fallback={<RouteFallback />}><ProblemMatchReportPage /></Suspense> },
      { path: '/problems/match-report', element: <Suspense fallback={<RouteFallback />}><ProblemMatchReportPage /></Suspense> },

      // M18 Company Workspace (Q-0681, Q-0683, Q-0684, Q-0687, Q-0709, Q-0711)
      { path: ROUTES.M18_OVERVIEW, element: <Suspense fallback={<RouteFallback />}><M18OverviewPage /></Suspense> },
      { path: ROUTES.M18_DETAILS, element: <Suspense fallback={<RouteFallback />}><M18DetailsPage /></Suspense> },
      { path: ROUTES.M18_CREATE, element: <Suspense fallback={<RouteFallback />}><M18CreatePage /></Suspense> },
      { path: ROUTES.M18_RESULTS, element: <Suspense fallback={<RouteFallback />}><M18ResultsPage /></Suspense> },
      { path: ROUTES.M18_EMPTY, element: <Suspense fallback={<RouteFallback />}><M18EmptyPage /></Suspense> },
      { path: ROUTES.M18_ERROR, element: <Suspense fallback={<RouteFallback />}><M18ErrorPage /></Suspense> },

      // M09 Next Step Engine (Q-0321, Q-0323, Q-0324, Q-0327, Q-0349, Q-0351)
      { path: ROUTES.M09_OVERVIEW, element: <Suspense fallback={<RouteFallback />}><M09OverviewPage /></Suspense> },
      { path: ROUTES.M09_DETAILS, element: <Suspense fallback={<RouteFallback />}><M09DetailsPage /></Suspense> },
      { path: ROUTES.M09_CREATE, element: <Suspense fallback={<RouteFallback />}><M09CreatePage /></Suspense> },
      { path: ROUTES.M09_RESULTS, element: <Suspense fallback={<RouteFallback />}><M09ResultsPage /></Suspense> },
      { path: ROUTES.M09_EMPTY, element: <Suspense fallback={<RouteFallback />}><M09EmptyPage /></Suspense> },
      { path: ROUTES.M09_ERROR, element: <Suspense fallback={<RouteFallback />}><M09ErrorPage /></Suspense> },

      // M04 Import Center (Q-0121, Q-0123, Q-0124, Q-0127, Q-0149, Q-0151)
      { path: ROUTES.M04_OVERVIEW, element: <Suspense fallback={<RouteFallback />}><M04OverviewPage /></Suspense> },
      { path: ROUTES.M04_DETAILS, element: <Suspense fallback={<RouteFallback />}><M04DetailsPage /></Suspense> },
      { path: ROUTES.M04_CREATE, element: <Suspense fallback={<RouteFallback />}><M04CreatePage /></Suspense> },
      { path: ROUTES.M04_RESULTS, element: <Suspense fallback={<RouteFallback />}><M04ResultsPage /></Suspense> },
      { path: ROUTES.M04_EMPTY, element: <Suspense fallback={<RouteFallback />}><M04EmptyPage /></Suspense> },
      { path: ROUTES.M04_ERROR, element: <Suspense fallback={<RouteFallback />}><M04ErrorPage /></Suspense> },

      // M02 Home Dashboard (Q-0043, Q-0044, Q-0047, Q-0069, Q-0071) - Q-0041 is HomePage
      { path: ROUTES.M02_DETAILS, element: <Suspense fallback={<RouteFallback />}><M02DetailsPage /></Suspense> },
      { path: ROUTES.M02_CREATE, element: <Suspense fallback={<RouteFallback />}><M02CreatePage /></Suspense> },
      { path: ROUTES.M02_RESULTS, element: <Suspense fallback={<RouteFallback />}><M02ResultsPage /></Suspense> },
      { path: ROUTES.M02_EMPTY, element: <Suspense fallback={<RouteFallback />}><M02EmptyPage /></Suspense> },
      { path: ROUTES.M02_ERROR, element: <Suspense fallback={<RouteFallback />}><M02ErrorPage /></Suspense> },

      // M10 Learning Paths & Courses (Q-0361, Q-0363, Q-0364, Q-0367, Q-0389, Q-0391)
      { path: ROUTES.M10_OVERVIEW, element: <Suspense fallback={<RouteFallback />}><M10OverviewPage /></Suspense> },
      { path: ROUTES.M10_DETAILS, element: <Suspense fallback={<RouteFallback />}><M10DetailsPage /></Suspense> },
      { path: ROUTES.M10_CREATE, element: <Suspense fallback={<RouteFallback />}><M10CreatePage /></Suspense> },
      { path: ROUTES.M10_RESULTS, element: <Suspense fallback={<RouteFallback />}><M10ResultsPage /></Suspense> },
      { path: ROUTES.M10_EMPTY, element: <Suspense fallback={<RouteFallback />}><M10EmptyPage /></Suspense> },
      { path: ROUTES.M10_ERROR, element: <Suspense fallback={<RouteFallback />}><M10ErrorPage /></Suspense> },

      // M12 Oral Verification & Assessment (Q-0441, Q-0443, Q-0444, Q-0447, Q-0469, Q-0471)
      { path: ROUTES.M12_OVERVIEW, element: <Suspense fallback={<RouteFallback />}><M12OverviewPage /></Suspense> },
      { path: ROUTES.M12_DETAILS, element: <Suspense fallback={<RouteFallback />}><M12DetailsPage /></Suspense> },
      { path: ROUTES.M12_CREATE, element: <Suspense fallback={<RouteFallback />}><M12CreatePage /></Suspense> },
      { path: ROUTES.M12_RESULTS, element: <Suspense fallback={<RouteFallback />}><M12ResultsPage /></Suspense> },
      { path: ROUTES.M12_EMPTY, element: <Suspense fallback={<RouteFallback />}><M12EmptyPage /></Suspense> },
      { path: ROUTES.M12_ERROR, element: <Suspense fallback={<RouteFallback />}><M12ErrorPage /></Suspense> },

      // M14 GitHub & Code Intelligence (Q-0521, Q-0523, Q-0524, Q-0527, Q-0549, Q-0551)
      { path: ROUTES.M14_OVERVIEW, element: <Suspense fallback={<RouteFallback />}><M14OverviewPage /></Suspense> },
      { path: ROUTES.M14_DETAILS, element: <Suspense fallback={<RouteFallback />}><M14DetailsPage /></Suspense> },
      { path: ROUTES.M14_CREATE, element: <Suspense fallback={<RouteFallback />}><M14CreatePage /></Suspense> },
      { path: ROUTES.M14_RESULTS, element: <Suspense fallback={<RouteFallback />}><M14ResultsPage /></Suspense> },
      { path: ROUTES.M14_EMPTY, element: <Suspense fallback={<RouteFallback />}><M14EmptyPage /></Suspense> },
      { path: ROUTES.M14_ERROR, element: <Suspense fallback={<RouteFallback />}><M14ErrorPage /></Suspense> },

      // M22 Verification & Trust Matrix (Q-0841, Q-0843, Q-0844, Q-0847, Q-0869, Q-0871)
      { path: ROUTES.M22_OVERVIEW, element: <Suspense fallback={<RouteFallback />}><M22OverviewPage /></Suspense> },
      { path: ROUTES.M22_DETAILS, element: <Suspense fallback={<RouteFallback />}><M22DetailsPage /></Suspense> },
      { path: ROUTES.M22_CREATE, element: <Suspense fallback={<RouteFallback />}><M22CreatePage /></Suspense> },
      { path: ROUTES.M22_RESULTS, element: <Suspense fallback={<RouteFallback />}><M22ResultsPage /></Suspense> },
      { path: ROUTES.M22_EMPTY, element: <Suspense fallback={<RouteFallback />}><M22EmptyPage /></Suspense> },
      { path: ROUTES.M22_ERROR, element: <Suspense fallback={<RouteFallback />}><M22ErrorPage /></Suspense> },

      // M11 Practice Challenges (Q-0401, Q-0403, Q-0404, Q-0407, Q-0429, Q-0431)
      { path: ROUTES.M11_OVERVIEW, element: <Suspense fallback={<RouteFallback />}><M11OverviewPage /></Suspense> },
      { path: ROUTES.M11_DETAILS, element: <Suspense fallback={<RouteFallback />}><M11DetailsPage /></Suspense> },
      { path: ROUTES.M11_ATTEMPT, element: <Suspense fallback={<RouteFallback />}><M11AttemptPage /></Suspense> },
      { path: ROUTES.M11_RESULT, element: <Suspense fallback={<RouteFallback />}><M11ResultPage /></Suspense> },
      { path: ROUTES.M11_EMPTY, element: <Suspense fallback={<RouteFallback />}><M11EmptyPage /></Suspense> },
      { path: ROUTES.M11_ERROR, element: <Suspense fallback={<RouteFallback />}><M11ErrorPage /></Suspense> },

      // M13 Projects Portfolio (Q-0481, Q-0483, Q-0484, Q-0487, Q-0509, Q-0511)
      { path: ROUTES.M13_OVERVIEW, element: <Suspense fallback={<RouteFallback />}><M13OverviewPage /></Suspense> },
      { path: ROUTES.M13_DETAILS, element: <Suspense fallback={<RouteFallback />}><M13DetailsPage /></Suspense> },
      { path: ROUTES.M13_CREATE, element: <Suspense fallback={<RouteFallback />}><M13CreatePage /></Suspense> },
      { path: ROUTES.M13_RESULT, element: <Suspense fallback={<RouteFallback />}><M13ResultPage /></Suspense> },
      { path: ROUTES.M13_EMPTY, element: <Suspense fallback={<RouteFallback />}><M13EmptyPage /></Suspense> },
      { path: ROUTES.M13_ERROR, element: <Suspense fallback={<RouteFallback />}><M13ErrorPage /></Suspense> },

      // M24 AI Assistant & Explain (Q-0921, Q-0923, Q-0924, Q-0927, Q-0949, Q-0951)
      { path: ROUTES.M24_OVERVIEW, element: <Suspense fallback={<RouteFallback />}><M24OverviewPage /></Suspense> },
      { path: ROUTES.M24_DETAILS, element: <Suspense fallback={<RouteFallback />}><M24DetailsPage /></Suspense> },
      { path: ROUTES.M24_CREATE, element: <Suspense fallback={<RouteFallback />}><M24CreatePage /></Suspense> },
      { path: ROUTES.M24_RESULT, element: <Suspense fallback={<RouteFallback />}><M24ResultPage /></Suspense> },
      { path: ROUTES.M24_DISPUTE, element: <Suspense fallback={<RouteFallback />}><M24DisputePage /></Suspense> },
      { path: ROUTES.M24_EMPTY, element: <Suspense fallback={<RouteFallback />}><M24EmptyPage /></Suspense> },
      { path: ROUTES.M24_ERROR, element: <Suspense fallback={<RouteFallback />}><M24ErrorPage /></Suspense> },

      // M19 Candidates Pipeline (Q-0721, Q-0723, Q-0724, Q-0727, Q-0749, Q-0751)
      { path: ROUTES.M19_OVERVIEW, element: <Suspense fallback={<RouteFallback />}><M19OverviewPage /></Suspense> },
      { path: ROUTES.M19_DETAILS, element: <Suspense fallback={<RouteFallback />}><M19DetailsPage /></Suspense> },
      { path: ROUTES.M19_CREATE, element: <Suspense fallback={<RouteFallback />}><M19CreatePage /></Suspense> },
      { path: ROUTES.M19_RESULTS, element: <Suspense fallback={<RouteFallback />}><M19ResultsPage /></Suspense> },
      { path: ROUTES.M19_EMPTY, element: <Suspense fallback={<RouteFallback />}><M19EmptyPage /></Suspense> },
      { path: ROUTES.M19_ERROR, element: <Suspense fallback={<RouteFallback />}><M19ErrorPage /></Suspense> },

      // M23 Community & Exchange (Q-0881, Q-0883, Q-0884, Q-0887, Q-0909, Q-0911)
      { path: ROUTES.M23_OVERVIEW, element: <Suspense fallback={<RouteFallback />}><M23OverviewPage /></Suspense> },
      { path: ROUTES.M23_DETAILS, element: <Suspense fallback={<RouteFallback />}><M23DetailsPage /></Suspense> },
      { path: ROUTES.M23_CREATE, element: <Suspense fallback={<RouteFallback />}><M23CreatePage /></Suspense> },
      { path: ROUTES.M23_RESULTS, element: <Suspense fallback={<RouteFallback />}><M23ResultsPage /></Suspense> },
      { path: ROUTES.M23_EMPTY, element: <Suspense fallback={<RouteFallback />}><M23EmptyPage /></Suspense> },
      { path: ROUTES.M23_ERROR, element: <Suspense fallback={<RouteFallback />}><M23ErrorPage /></Suspense> },

      // M26 Settings & Billing (Q-1001, Q-1003, Q-1004, Q-1007, Q-1029, Q-1031)
      { path: ROUTES.M26_OVERVIEW, element: <Suspense fallback={<RouteFallback />}><M26OverviewPage /></Suspense> },
      { path: ROUTES.M26_DETAILS, element: <Suspense fallback={<RouteFallback />}><M26DetailsPage /></Suspense> },
      { path: ROUTES.M26_CREATE, element: <Suspense fallback={<RouteFallback />}><M26CreatePage /></Suspense> },
      { path: ROUTES.M26_RESULTS, element: <Suspense fallback={<RouteFallback />}><M26ResultsPage /></Suspense> },
      { path: ROUTES.M26_EMPTY, element: <Suspense fallback={<RouteFallback />}><M26EmptyPage /></Suspense> },
      { path: ROUTES.M26_ERROR, element: <Suspense fallback={<RouteFallback />}><M26ErrorPage /></Suspense> },

      // M15 Problem Input & Analysis (Q-0561, Q-0563, Q-0564, Q-0567, Q-0589, Q-0591)
      { path: ROUTES.M15_OVERVIEW, element: <Suspense fallback={<RouteFallback />}><M15OverviewPage /></Suspense> },
      { path: ROUTES.M15_DETAILS, element: <Suspense fallback={<RouteFallback />}><M15DetailsPage /></Suspense> },
      { path: ROUTES.M15_CREATE, element: <Suspense fallback={<RouteFallback />}><M15CreatePage /></Suspense> },
      { path: ROUTES.M15_RESULTS, element: <Suspense fallback={<RouteFallback />}><M15ResultsPage /></Suspense> },
      { path: ROUTES.M15_EMPTY, element: <Suspense fallback={<RouteFallback />}><M15EmptyPage /></Suspense> },
      { path: ROUTES.M15_ERROR, element: <Suspense fallback={<RouteFallback />}><M15ErrorPage /></Suspense> },

      // M16 Explainable Matching (Q-0601, Q-0603, Q-0604, Q-0607, Q-0629, Q-0631)
      { path: ROUTES.M16_OVERVIEW, element: <Suspense fallback={<RouteFallback />}><M16OverviewPage /></Suspense> },
      { path: ROUTES.M16_DETAILS, element: <Suspense fallback={<RouteFallback />}><M16DetailsPage /></Suspense> },
      { path: ROUTES.M16_CREATE, element: <Suspense fallback={<RouteFallback />}><M16CreatePage /></Suspense> },
      { path: ROUTES.M16_RESULTS, element: <Suspense fallback={<RouteFallback />}><M16ResultsPage /></Suspense> },
      { path: ROUTES.M16_EMPTY, element: <Suspense fallback={<RouteFallback />}><M16EmptyPage /></Suspense> },
      { path: ROUTES.M16_ERROR, element: <Suspense fallback={<RouteFallback />}><M16ErrorPage /></Suspense> },

      // M25 Privacy, Consent & Data Control (Q-0961, Q-0963, Q-0964, Q-0967, Q-0989, Q-0991)
      { path: ROUTES.M25_OVERVIEW, element: <Suspense fallback={<RouteFallback />}><M25OverviewPage /></Suspense> },
      { path: ROUTES.M25_DETAILS, element: <Suspense fallback={<RouteFallback />}><M25DetailsPage /></Suspense> },
      { path: ROUTES.M25_CREATE, element: <Suspense fallback={<RouteFallback />}><M25CreatePage /></Suspense> },
      { path: ROUTES.M25_RESULTS, element: <Suspense fallback={<RouteFallback />}><M25ResultsPage /></Suspense> },
      { path: ROUTES.M25_EMPTY, element: <Suspense fallback={<RouteFallback />}><M25EmptyPage /></Suspense> },
      { path: ROUTES.M25_ERROR, element: <Suspense fallback={<RouteFallback />}><M25ErrorPage /></Suspense> },

      // M17 Opportunities Hub (Q-0641, Q-0643, Q-0644, Q-0647, Q-0669, Q-0671)
      { path: ROUTES.M17_OVERVIEW, element: <Suspense fallback={<RouteFallback />}><M17OverviewPage /></Suspense> },
      { path: ROUTES.M17_DETAILS, element: <Suspense fallback={<RouteFallback />}><M17DetailsPage /></Suspense> },
      { path: ROUTES.M17_CREATE, element: <Suspense fallback={<RouteFallback />}><M17CreatePage /></Suspense> },
      { path: ROUTES.M17_RESULTS, element: <Suspense fallback={<RouteFallback />}><M17ResultsPage /></Suspense> },
      { path: ROUTES.M17_EMPTY, element: <Suspense fallback={<RouteFallback />}><M17EmptyPage /></Suspense> },
      { path: ROUTES.M17_ERROR, element: <Suspense fallback={<RouteFallback />}><M17ErrorPage /></Suspense> },

      // M20 Team Composer (Q-0761, Q-0763, Q-0764, Q-0767, Q-0789, Q-0791)
      { path: ROUTES.M20_OVERVIEW, element: <Suspense fallback={<RouteFallback />}><M20OverviewPage /></Suspense> },
      { path: ROUTES.M20_DETAILS, element: <Suspense fallback={<RouteFallback />}><M20DetailsPage /></Suspense> },
      { path: ROUTES.M20_CREATE, element: <Suspense fallback={<RouteFallback />}><M20CreatePage /></Suspense> },
      { path: ROUTES.M20_RESULTS, element: <Suspense fallback={<RouteFallback />}><M20ResultsPage /></Suspense> },
      { path: ROUTES.M20_EMPTY, element: <Suspense fallback={<RouteFallback />}><M20EmptyPage /></Suspense> },
      { path: ROUTES.M20_ERROR, element: <Suspense fallback={<RouteFallback />}><M20ErrorPage /></Suspense> },

      // M21 Project Workspace & Outcomes (Q-0801, Q-0803, Q-0804, Q-0807, Q-0829, Q-0831)
      { path: ROUTES.M21_OVERVIEW, element: <Suspense fallback={<RouteFallback />}><M21OverviewPage /></Suspense> },
      { path: ROUTES.M21_DETAILS, element: <Suspense fallback={<RouteFallback />}><M21DetailsPage /></Suspense> },
      { path: ROUTES.M21_CREATE, element: <Suspense fallback={<RouteFallback />}><M21CreatePage /></Suspense> },
      { path: ROUTES.M21_RESULTS, element: <Suspense fallback={<RouteFallback />}><M21ResultsPage /></Suspense> },
      { path: ROUTES.M21_EMPTY, element: <Suspense fallback={<RouteFallback />}><M21EmptyPage /></Suspense> },
      { path: ROUTES.M21_ERROR, element: <Suspense fallback={<RouteFallback />}><M21ErrorPage /></Suspense> },
    ],
  },

  // مسار الـ Fallback
  { path: '*', element: <LandingPage /> },
]);
