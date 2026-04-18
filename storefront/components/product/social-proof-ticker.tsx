'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag } from 'lucide-react'

/**
 * Simulated real-time social proof ticker — rotates through recent
 * hypothetical purchase notifications. Keep generic (no personal details)
 * and use ambient copy, not fake names, to stay honest.
 */
const events = [
  { city: 'Warsaw',   minutes: 3 },
  { city: 'New York', minutes: 7 },
  { city: 'Berlin',   minutes: 12 },
  { city: 'London',   minutes: 18 },
  { city: 'Kraków',   minutes: 24 },
  { city: 'Portland', minutes: 31 },
]

export default function SocialProofTicker({ productTitle }: { productTitle: string }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % events.length)
    }, 4500)
    return () => clearInterval(id)
  }, [])

  const e = events[idx]

  return (
    <div
      key={idx}
      className="flex items-center gap-2.5 text-xs text-muted-foreground animate-fade-in"
    >
      <ShoppingBag className="h-3.5 w-3.5 text-ember flex-shrink-0" strokeWidth={1.75} />
      <span>
        Someone in <span className="font-medium text-foreground">{e.city}</span> ordered{' '}
        <span className="font-medium text-foreground">{productTitle}</span> · {e.minutes} min ago
      </span>
    </div>
  )
}
