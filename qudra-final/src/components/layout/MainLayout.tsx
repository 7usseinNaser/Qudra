import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { CmdPalette } from '../overlays'
import styles from './MainLayout.module.css'

export function MainLayout() {
  const [cmdOpen, setCmdOpen] = useState(false)
  const navigate = useNavigate()

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
        <Outlet />
      </main>
      <BottomNav />
      <CmdPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onNavigate={navigate} />
    </div>
  )
}
