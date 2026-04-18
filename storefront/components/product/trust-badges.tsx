import { ShieldCheck, Truck, RotateCcw, Lock } from 'lucide-react'

const badges = [
  {
    icon: Truck,
    title: 'Free shipping over $65',
    subtitle: 'Worldwide · 2–5 business days',
  },
  {
    icon: RotateCcw,
    title: '30-day love-it guarantee',
    subtitle: 'Return it even if it\'s been lit',
  },
  {
    icon: ShieldCheck,
    title: 'Clean-burn promise',
    subtitle: '100% soy · Phthalate-free',
  },
  {
    icon: Lock,
    title: 'Secure checkout',
    subtitle: 'Stripe · 256-bit SSL',
  },
]

export default function TrustBadges() {
  return (
    <ul className="grid grid-cols-2 gap-3 py-4">
      {badges.map(({ icon: Icon, title, subtitle }) => (
        <li
          key={title}
          className="flex items-start gap-2.5 rounded-sm border border-foreground/10 bg-background px-3 py-3"
        >
          <Icon className="h-5 w-5 flex-shrink-0 text-ember mt-0.5" strokeWidth={1.5} />
          <div className="min-w-0">
            <p className="text-xs font-semibold leading-tight">{title}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{subtitle}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
