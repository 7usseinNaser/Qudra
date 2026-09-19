import { useMemo } from 'react'

const CIRCUMFERENCE = 2 * Math.PI * 86

interface UseRingOptions { value: number; radius?: number }

export function useRing({ value, radius = 86 }: UseRingOptions) {
  const clampedValue = Math.max(0, Math.min(100, value))
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius])
  const dasharray = useMemo(() => {
    const filled = (clampedValue / 100) * circumference
    return `${filled} ${circumference}`
  }, [clampedValue, circumference])
  return { dasharray, circumference: CIRCUMFERENCE }
}
