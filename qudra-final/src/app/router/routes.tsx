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
