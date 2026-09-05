/**
 * MainLayout — الإطار الرئيسي لصفحات التطبيق الداخلية.
 *
 * يوفّر الشريط العلوي الموحّد (TopBar) مع منطقة المحتوى الرئيسي (Outlet).
 */

import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'

export function MainLayout() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--page)' }} dir="rtl">
      <TopBar />
      <main id="mainC" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  )
}
