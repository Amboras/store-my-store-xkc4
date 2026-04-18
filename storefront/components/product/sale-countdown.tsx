'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

/**
 * Sale countdown that resets daily at midnight (local time).
 * Shown as a persistent "sale ends tonight" urgency cue on product pages.
 */
export default function SaleCountdown({
  label = 'Bundle pricing ends in',
}: {
  label?: string
}) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const end = new Date()
      end.setHours(23, 59, 59, 999)
      const diff = Math.max(0, end.getTime() - now.getTime())
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)
      setTimeLeft({ hours, minutes, seconds })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  if (!timeLeft) return null

  const pad = (n: number) => n.toString().padStart(2, '0')

  return (
    <div className="flex items-center gap-3 rounded-sm bg-ink text-primary-foreground px-4 py-3">
      <Clock className="h-4 w-4 flex-shrink-0 text-ember" strokeWidth={1.75} />
      <p className="text-xs sm:text-sm flex-1">
        <span className="text-primary-foreground/70">{label}</span>
      </p>
      <div className="flex items-center gap-1 font-mono tabular-nums text-sm font-semibold">
        <span>{pad(timeLeft.hours)}</span>
        <span className="text-primary-foreground/40">:</span>
        <span>{pad(timeLeft.minutes)}</span>
        <span className="text-primary-foreground/40">:</span>
        <span className="text-ember">{pad(timeLeft.seconds)}</span>
      </div>
    </div>
  )
}
