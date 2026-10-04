/**
 * CmdPalette — لوحة الأوامر السريعة (Ctrl+K).
 *
 * مطابق لـ #cmdk في prototype.html:3393-3407.
 * تعرض بحث + قائمة مجمّعة + اختصارات لوحة المفاتيح.
 * تدعم: تنقّل بالأسهم، فتح بـ Enter، إغلاق بـ Escape.
 *
 * راجع PROJECT_MAP.md → src/components/overlays/CmdPalette.tsx
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { useFocusTrap } from '../../hooks'
import { demoCommands } from '../../data'
import type { CommandEntry } from '../../data/demo-commands'
import styles from './CmdPalette.module.css'

interface CmdPaletteProps {
  open: boolean
  onClose: () => void
  onNavigate: (route: string) => void
}

export function CmdPalette({ open, onClose, onNavigate }: CmdPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useFocusTrap<HTMLDivElement>({ active: open, onClose })

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIdx(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const filtered = useMemo(() => {
    if (!query.trim()) return demoCommands
    const q = query.toLowerCase()
    return demoCommands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
    )
  }, [query])

  const groups = useMemo(() => {
    const map = new Map<string, CommandEntry[]>()
    filtered.forEach((c) => {
      if (!map.has(c.group)) map.set(c.group, [])
      map.get(c.group)!.push(c)
    })
    return Array.from(map.entries())
  }, [filtered])

  useEffect(() => {
    setSelectedIdx(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIdx((p) => Math.min(p + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIdx((p) => Math.max(p - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const cmd = filtered[selectedIdx]
      if (cmd) {
        onNavigate(cmd.route)
        onClose()
      }
    }
  }

  if (!open) return null

  let runningIdx = -1

  return (
    <div className={styles.overlay} ref={containerRef} dir="rtl" role="dialog" aria-modal="true" aria-label="لوحة الأوامر">
      <div className={styles.sheet}>
        <div className={styles.top}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="اذهب إلى… أو اكتب اسم شاشة"
            autoComplete="off"
            aria-label="ابحث عن شاشة"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <kbd>ESC</kbd>
        </div>
        <div className={styles.list} role="listbox">
          {filtered.length === 0 ? (
            <div className={styles.empty}>لا نتائج</div>
          ) : (
            groups.map(([group, items]) => (
              <div key={group}>
                <div className={styles.group}>{group}</div>
                {items.map((cmd) => {
                  runningIdx++
                  const isSelected = runningIdx === selectedIdx
                  return (
                    <button
                      key={cmd.code}
                      className={`${styles.item} ${isSelected ? styles.selected : ''}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onNavigate(cmd.route)
                        onClose()
                      }}
                    >
                      <span className={styles.code}>{cmd.code}</span>
                      <span className={styles.label}>{cmd.label}</span>
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>
        <div className={styles.footer}>
          <span><kbd>↑</kbd><kbd>↓</kbd> تنقّل</span>
          <span><kbd>↵</kbd> افتح</span>
          <span className={styles.hint}>Ctrl + K</span>
        </div>
      </div>
    </div>
  )
}
