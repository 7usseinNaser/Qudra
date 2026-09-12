/**
 * BottomNav — شريط التنقل السفلي للهواتف والشاشات الصغيرة (≤56rem).
 *
 * يحل الخلل الحرج بغياب التنقل السفلي على الموبايل:
 * - يتغير محتواه تلقائياً حسب الدور (صاحب مشكلة 'c' أو صاحب قدرة 'u').
 * - يوفر أهداف لمس مريحة (≥44px) ومؤشرات مرئية واضحة للتبويب النشط.
 * - يدعم مناطق الأمان في الهواتف الحديثة (safe-area-inset-bottom).
 */

import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useRole } from '../../contexts/useRole'
import styles from './BottomNav.module.css'

interface NavItem {
  id: string
  label: string
  path: string
  icon: (active: boolean) => JSX.Element
}

export function BottomNav() {
  const { role } = useRole()
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname

  // عناصر مسار صاحب المشكلة
  const problemNavItems: NavItem[] = [
    {
      id: 'problem',
      label: 'المشكلة',
      path: ROUTES.PROBLEM,
      icon: (active) => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? 2.2 : 1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      ),
    },
    {
      id: 'capabilities',
      label: 'القدرات',
      path: ROUTES.CAPABILITIES,
      icon: (active) => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? 2.2 : 1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
      ),
    },
    {
      id: 'simulation',
      label: 'المحاكاة',
      path: ROUTES.SIMULATION,
      icon: (active) => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? 2.2 : 1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      ),
    },
    {
      id: 'result',
      label: 'النتيجة',
      path: ROUTES.RESULT,
      icon: (active) => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? 2.2 : 1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v20" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      id: 'candidates',
      label: 'المرشحون',
      path: ROUTES.CANDIDATES,
      icon: (active) => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? 2.2 : 1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ]

  // عناصر مسار صاحب القدرة
  const profileNavItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'ملفي',
      path: '/profile',
      icon: (active) => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? 2.2 : 1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      id: 'sources',
      label: 'مصادري',
      path: '/profile/sources',
      icon: (active) => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? 2.2 : 1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
    },
    {
      id: 'evidence',
      label: 'أدلتي',
      path: '/profile/evidence',
      icon: (active) => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? 2.2 : 1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
    {
      id: 'timeline',
      label: 'تطوّري',
      path: '/profile/timeline',
      icon: (active) => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? 2.2 : 1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      ),
    },
    {
      id: 'passport',
      label: 'الجواز',
      path: '/profile/passport',
      icon: (active) => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? 2.2 : 1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="7" y1="8" x2="17" y2="8" />
          <line x1="7" y1="12" x2="13" y2="12" />
        </svg>
      ),
    },
  ]

  const items = role === 'c' ? problemNavItems : profileNavItems

  return (
    <nav className={styles.bottomNav} aria-label="التنقل الرئيسي للهاتف" dir="rtl">
      <div className={styles.navInner}>
        {items.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.path === '/profile' && pathname === '/profile/')
          return (
            <button
              key={item.id}
              className={`${styles.navBtn} ${isActive ? styles.active : ''}`}
              onClick={() => navigate(item.path)}
              aria-current={isActive ? 'page' : undefined}
              id={`bottomNav-${item.id}`}
            >
              <span className={styles.iconWrap}>
                {item.icon(isActive)}
                {isActive && <span className={styles.activeDot} />}
              </span>
              <span className={styles.label}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
