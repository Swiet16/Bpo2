import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface CounterProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
  format?: boolean
}

export function AnimatedCounter({
  value,
  duration = 1200,
  className,
  prefix = '',
  suffix = '',
  format = true,
}: CounterProps) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number | undefined>(undefined)
  const startTimeRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    startTimeRef.current = undefined

    const step = (ts: number) => {
      if (startTimeRef.current === undefined) startTimeRef.current = ts
      const progress = Math.min(1, (ts - startTimeRef.current) / duration)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.floor(eased * value))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        setDisplay(value)
      }
    }

    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value, duration])

  return (
    <span className={cn('tabular-nums', className)}>
      {prefix}
      {format ? display.toLocaleString() : display}
      {suffix}
    </span>
  )
}
