import { useEffect, useRef } from 'react'

interface UseFocusTrapOptions { active: boolean; onClose?: () => void }

export function useFocusTrap<T extends HTMLElement = HTMLDivElement>({ active, onClose }: UseFocusTrapOptions) {
  const containerRef = useRef<T>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return
    previousFocusRef.current = document.activeElement as HTMLElement
    const container = containerRef.current
    if (!container) return

    const focusable = container.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (first) first.focus()

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose?.(); return }
      if (e.key !== 'Tab') return
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last?.focus() } }
      else { if (document.activeElement === last) { e.preventDefault(); first?.focus() } }
    }

    container.addEventListener('keydown', handleKey)
    return () => { container.removeEventListener('keydown', handleKey); previousFocusRef.current?.focus() }
  }, [active, onClose])

  return containerRef
}
