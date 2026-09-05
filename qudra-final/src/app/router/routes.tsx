/**
 * App Router — تعريف كافة مسارات وواجهات منصة قُدرة الـ 22.
 *
 * يشمل:
 * 1. بوابة الدخول المشتركة:
 *    - LandingPage (/)
 *    - SignUpPage (/signup)
 *    - LoginPage (/login)
 *    - RoleSelectPage (/onboarding/role)
 *    - InvitePage (/invite/:id)
 * 2. المسارات الداخلية ضمن MainLayout (المزوّد بـ TopBar الموحّد وتبديل الدور):
 *    - مسار صاحب المشكلة (6 خطوات أساسية + امتدادات الفريق والمقارنة والترتيب):
 *      /problem, /capabilities, /simulation, /evaluation, /skill-dna, /result,
 *      /candidates, /candidates/:id, /compare, /re-ranking
 *    - مسار صاحب القدرة (ملفي والتبويبات السبعة):
 *      /profile, /profile/sources, /profile/evidence, /profile/evidence/:id,
 *      /profile/timeline, /profile/gaps, /profile/opportunities, /profile/passport
 */

import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { LandingPage } from '../../pages/landing/LandingPage'
import { MainLayout } from '../../components/layout/MainLayout'

// Auth & Entry
const SignUpPage = lazy(() => import('../../pages/auth/SignUpPage').then(m => ({ default: m.SignUpPage })))
const LoginPage = lazy(() => import('../../pages/auth/LoginPage').then(m => ({ default: m.LoginPage })))
const RoleSelectPage = lazy(() => import('../../pages/onboarding/RoleSelectPage').then(m => ({ default: m.RoleSelectPage })))
const InvitePage = lazy(() => import('../../pages/invite/InvitePage').then(m => ({ default: m.InvitePage })))

// Problem Owner Flow
const ProblemInputPage = lazy(() => import('../../pages/problem/ProblemInputPage').then(m => ({ default: m.ProblemInputPage })))
const CapabilitiesPage = lazy(() => import('../../pages/capabilities/CapabilitiesPage').then(m => ({ default: m.CapabilitiesPage })))
const SimulationPage = lazy(() => import('../../pages/simulation/SimulationPage').then(m => ({ default: m.SimulationPage })))
const EvaluationPage = lazy(() => import('../../pages/evaluation/EvaluationPage').then(m => ({ default: m.EvaluationPage })))
const SkillDnaPage = lazy(() => import('../../pages/dna/SkillDnaPage').then(m => ({ default: m.SkillDnaPage })))
const ResultPage = lazy(() => import('../../pages/result/ResultPage').then(m => ({ default: m.ResultPage })))
const CandidatesPage = lazy(() => import('../../pages/candidates/CandidatesPage').then(m => ({ default: m.CandidatesPage })))
const CandidateDetailPage = lazy(() => import('../../pages/candidates/CandidateDetailPage').then(m => ({ default: m.CandidateDetailPage })))
const ComparePage = lazy(() => import('../../pages/compare/ComparePage').then(m => ({ default: m.ComparePage })))
const ReRankingPage = lazy(() => import('../../pages/candidates/ReRankingPage').then(m => ({ default: m.ReRankingPage })))

// Talent / Profile Flow
const ProfilePage = lazy(() => import('../../pages/profile/ProfilePage').then(m => ({ default: m.ProfilePage })))

function RouteFallback() {
  return (
    <div className="wrap" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
      <span className="sk-line" style={{ display: 'inline-block', height: 14, width: '40%' }} />
      <p className="note" style={{ marginTop: '1rem' }}>جارٍ التحميل…</p>
    </div>
  )
}

export const router = createBrowserRouter([
  // البوابة العامة المستقلة
  { path: ROUTES.LANDING, element: <LandingPage /> },
  { path: ROUTES.SIGNUP, element: <Suspense fallback={<RouteFallback />}><SignUpPage /></Suspense> },
  { path: ROUTES.LOGIN, element: <Suspense fallback={<RouteFallback />}><LoginPage /></Suspense> },
  { path: ROUTES.ROLE_SELECT, element: <Suspense fallback={<RouteFallback />}><RoleSelectPage /></Suspense> },
  { path: '/invite/:id', element: <Suspense fallback={<RouteFallback />}><InvitePage /></Suspense> },

  // الواجهات الداخلية ذات الشريط العلوي الموحّد وتبديل الدور
  {
    element: <MainLayout />,
    children: [
      // 1. مسار صاحب المشكلة
      { path: ROUTES.PROBLEM, element: <Suspense fallback={<RouteFallback />}><ProblemInputPage /></Suspense> },
      { path: ROUTES.CAPABILITIES, element: <Suspense fallback={<RouteFallback />}><CapabilitiesPage /></Suspense> },
      { path: ROUTES.SIMULATION, element: <Suspense fallback={<RouteFallback />}><SimulationPage /></Suspense> },
      { path: ROUTES.EVALUATION, element: <Suspense fallback={<RouteFallback />}><EvaluationPage /></Suspense> },
      { path: ROUTES.SKILL_DNA, element: <Suspense fallback={<RouteFallback />}><SkillDnaPage /></Suspense> },
      { path: ROUTES.RESULT, element: <Suspense fallback={<RouteFallback />}><ResultPage /></Suspense> },
      { path: ROUTES.CANDIDATES, element: <Suspense fallback={<RouteFallback />}><CandidatesPage /></Suspense> },
      { path: '/candidates/:id', element: <Suspense fallback={<RouteFallback />}><CandidateDetailPage /></Suspense> },
      { path: ROUTES.COMPARE, element: <Suspense fallback={<RouteFallback />}><ComparePage /></Suspense> },
      { path: ROUTES.RE_RANKING, element: <Suspense fallback={<RouteFallback />}><ReRankingPage /></Suspense> },

      // 2. مسار صاحب القدرة (ملفي وكافة تبويباته)
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

  // إعادة توجيه المسارات غير المعروفة للرئيسية
  { path: '*', element: <LandingPage /> },
])
