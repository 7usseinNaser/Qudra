import { useEffect, useRef, useState } from 'react'

interface UseAnimateNumOptions { from: number; to: number; duration?: number; autoStart?: boolean }

export function useAnimateNum({ from, to, duration = 900, autoStart = true }: UseAnimateNumOptions) {
  const [value, setValue] = useState(from)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!autoStart) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setValue(to); return }
    const startTime = performance.now()
    const animate = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(from + (to - from) * eased))
      if (t < 1) rafRef.current = requestAnimationFrame(animate)
      else setValue(to)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [from, to, duration, autoStart])

  return value
}
