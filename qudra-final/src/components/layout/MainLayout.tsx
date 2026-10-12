import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { CmdPalette } from '../overlays'
import { ErrorBoundary } from '../patterns/ErrorBoundary'
import styles from './MainLayout.module.css'

export function MainLayout() {
  const [cmdOpen, setCmdOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setCmdOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div className={styles.layout} dir="rtl">
      <TopBar />
      <main id="mainC" className={styles.main} tabIndex={-1}>
        <ErrorBoundary resetKeys={[location.pathname]}>
          <Outlet />
        </ErrorBoundary>
      </main>
      <BottomNav />
      <CmdPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onNavigate={navigate} />
    </div>
  )
}
