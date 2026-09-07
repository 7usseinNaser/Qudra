import { useCallback, useEffect, useRef, useState } from 'react'

interface UseTimerOptions { initialSeconds: number; onExpire?: () => void; autoStart?: boolean }

export function useTimer({ initialSeconds, onExpire, autoStart = false }: UseTimerOptions) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(autoStart)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  const clear = useCallback(() => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null } }, [])
  const start = useCallback(() => { clear(); setIsRunning(true) }, [clear])
  const stop = useCallback(() => { clear(); setIsRunning(false) }, [clear])
  const pause = useCallback(() => { clear(); setIsRunning(false) }, [clear])
  const resume = useCallback(() => { if (secondsLeft > 0) setIsRunning(true) }, [secondsLeft])
  const reset = useCallback((newSeconds?: number) => { clear(); setSecondsLeft(newSeconds ?? initialSeconds); setIsRunning(false) }, [clear, initialSeconds])

  useEffect(() => {
    if (!isRunning) return
    if (secondsLeft <= 0) { clear(); setIsRunning(false); onExpireRef.current?.(); return }
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) { clear(); setIsRunning(false); onExpireRef.current?.(); return 0 }
        return prev - 1
      })
    }, 1000)
    return clear
  }, [isRunning, clear])

  useEffect(() => () => clear(), [clear])

  const minutes = Math.floor(secondsLeft / 60)
  const remainingSeconds = secondsLeft % 60
  const formatted = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  const isLow = secondsLeft <= 60

  return { secondsLeft, formatted, isLow, isRunning, start, stop, pause, resume, reset }
}
