/**
 * MainLayout — الإطار الرئيسي لصفحات التطبيق الداخلية.
 *
 * يوفّر الشريط العلوي الموحّد (TopBar) مع منطقة المحتوى الرئيسي (Outlet).
 */

import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import styles from './MainLayout.module.css'

export function MainLayout() {
  return (
    <div className={styles.layout} dir="rtl">
      <TopBar />
      <main id="mainC" className={styles.main} tabIndex={-1}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
