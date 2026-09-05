import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { LandingPage } from '../../pages/landing/LandingPage'
const ProblemInputPage = lazy(() => import('../../pages/problem/ProblemInputPage').then(m => ({ default: m.ProblemInputPage })))
function RouteFallback() {
  return <div className="wrap" style={{ padding: '4rem 1rem', textAlign: 'center' }}><span className="sk-line" style={{ display: 'inline-block', height: 14, width: '40%' }} /><p className="note" style={{ marginTop: '1rem' }}>جارٍ التحميل…</p></div>
}
export const router = createBrowserRouter([
  { path: ROUTES.LANDING, element: <LandingPage /> },
  { path: ROUTES.PROBLEM, element: <Suspense fallback={<RouteFallback />}><ProblemInputPage /></Suspense> },
  { path: '*', element: <LandingPage /> },
])
