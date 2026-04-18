'use client'

import { useEffect, useState } from 'react'
import { X, Truck, Flame, Package } from 'lucide-react'

const messages = [
  { icon: Flame, text: 'Buy 2, get 1 free on all candles — no code needed' },
  { icon: Truck, text: 'Complimentary shipping on orders over $65' },
  { icon: Package, text: 'New release: Ember & Oak is back in stock' },
]

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % messages.length)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  if (!isVisible) return null

  const msg = messages[idx]
  const Icon = msg.icon

  return (
    <div className="relative bg-ink text-primary-foreground">
      <div className="container-custom flex items-center justify-center py-2.5 text-xs tracking-[0.14em] uppercase">
        <div
          key={idx}
          className="flex items-center gap-2 whitespace-nowrap animate-fade-in"
        >
          <Icon className="h-3.5 w-3.5 flex-shrink-0 text-ember" strokeWidth={1.75} />
          <span>{msg.text}</span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 p-1 hover:opacity-70 transition-opacity"
          aria-label="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
