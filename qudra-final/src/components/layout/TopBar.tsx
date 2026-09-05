/**
 * TopBar — الشريط العلوي الموحّد للمنصة.
 *
 * مطابق 100% لـ prototype.html (.topbar):
 * 1. شعار قُدرة واسم المنصة (ينقل إلى البداية حسب الدور).
 * 2. تبديل الدور السريع: "مشكلتي" (role='c') ↔ "ملفي" (role='u').
 * 3. بيانات المستخدم (الاسم، الرمز الرمزي).
 * 4. زر تبديل الوضع الداكن/الفاتح.
 * 5. شريط الخطوات (Stepper) أثناء التواجد في مسار حل المشكلة (6 خطوات).
 * 6. شريط التبويبات (Subnav) أثناء التواجد في الملف الشخصي وأدلة القدرات (7 تبويبات).
 */

import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { useRole, type Role } from '../../contexts/RoleContext'
import { useTheme } from '../../contexts/ThemeContext'
import styles from './TopBar.module.css'

const STEPS = [
  { path: ROUTES.PROBLEM, label: 'المشكلة' },
  { path: ROUTES.CAPABILITIES, label: 'القدرات' },
  { path: ROUTES.SIMULATION, label: 'المحاكاة' },
  { path: ROUTES.EVALUATION, label: 'التقييم' },
  { path: ROUTES.SKILL_DNA, label: 'Skill DNA' },
  { path: ROUTES.RESULT, label: 'النتيجة' },
]

const SUBNAV_TABS = [
  { id: 'u0', path: '/profile/sources', label: 'مصادري' },
  { id: 'u1', path: '/profile', label: 'ملفي' },
  { id: 'u3', path: '/profile/evidence', label: 'أدلتي' },
  { id: 'u6', path: '/profile/timeline', label: 'تطوّري' },
  { id: 'u2', path: '/profile/gaps', label: 'فجوتي' },
  { id: 'u4', path: '/profile/opportunities', label: 'الفرص' },
  { id: 'u5', path: '/profile/passport', label: 'بطاقة الإثبات' },
]

export function TopBar() {
  const { role, switchRole, user } = useRole()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const pathname = location.pathname

  // هل نحن في مسار صاحب المشكلة؟
  const currentStepIndex = STEPS.findIndex((s) => s.path === pathname)

  // هل نحن في مسار صاحب القدرة (الملف)؟
  const isProfileFlow = pathname.startsWith('/profile')

  const handleRoleChange = (newRole: Role) => {
    switchRole(newRole)
    if (newRole === 'c') {
      navigate(ROUTES.PROBLEM)
    } else {
      navigate(ROUTES.PROFILE)
    }
  }

  const handleBrandClick = () => {
    if (role === 'c') {
      navigate(ROUTES.PROBLEM)
    } else {
      navigate(ROUTES.PROFILE)
    }
  }

  return (
    <div className={styles.topbar} dir="rtl">
      <div className={`wrap ${styles.in}`}>
        <button
          className={styles.brand}
          onClick={handleBrandClick}
          title={role === 'c' ? 'مسار المشكلة' : 'ملفك الشخصي'}
        >
          <img
            src={theme === 'dark' ? '/assets/qudra-mark-dark.svg' : '/assets/qudra-mark.svg'}
            alt=""
            style={{ width: 26, height: 26 }}
            aria-hidden="true"
          />
          <span className={styles.nm}>قُدرة</span>
        </button>

        <div className={styles.whoami}>
          <span className={styles.navName} id="navName">
            {user.name || 'حسابك'}
          </span>
          <span className={styles.av} id="navAvatar">
            {user.avatar || 'أ'}
          </span>

          <button
            className={styles.themebtn}
            id="themeToggleBtn"
            onClick={toggleTheme}
            aria-label="تبديل الوضع الداكن"
            title="الوضع الداكن"
          >
            {theme === 'dark' ? (
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
              </svg>
            )}
          </button>

          <div className={styles.roles} role="tablist" aria-label="تبديل الدور">
            <button
              role="tab"
              id="rC"
              aria-selected={role === 'c'}
              onClick={() => handleRoleChange('c')}
              title="مسار حلّ مشكلة"
            >
              مشكلتي
            </button>
            <button
              role="tab"
              id="rU"
              aria-selected={role === 'u'}
              onClick={() => handleRoleChange('u')}
              title="ملفك وأدلتك"
            >
              ملفي
            </button>
          </div>
        </div>
      </div>

      {/* شريط خطوات مسار المشكلة (Stepper) */}
      {role === 'c' && currentStepIndex !== -1 && (
        <div className={styles.stepper} id="stepper">
          <div className="wrap">
            <nav className={styles.stepNav} id="stepNav" aria-label="خطوات المطابقة">
              {STEPS.map((s, idx) => {
                const isCurrent = idx === currentStepIndex
                const isDone = idx < currentStepIndex
                return (
                  <button
                    key={s.path}
                    className={`${styles.stepBtn} ${isDone ? styles.done : ''}`}
                    aria-current={isCurrent ? 'step' : undefined}
                    onClick={() => navigate(s.path)}
                  >
                    <span className={styles.n}>{idx + 1}</span>
                    <span>{s.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* شريط تبويبات الملف الشخصي (Subnav) */}
      {role === 'u' && isProfileFlow && (
        <div className={styles.subnav} id="subnav">
          <div className={`wrap ${styles.subnavInner}`}>
            {SUBNAV_TABS.map((tab) => {
              const isCurrent =
                pathname === tab.path ||
                (tab.path === '/profile' && pathname === '/profile/')
              return (
                <button
                  key={tab.id}
                  className={styles.subnavBtn}
                  aria-current={isCurrent ? 'page' : undefined}
                  onClick={() => navigate(tab.path)}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
