import { Flame } from 'lucide-react'

export interface ScentNote {
  label: string
  description: string
}

export default function ScentNotes({ notes }: { notes: ScentNote[] }) {
  return (
    <div className="space-y-1">
      {notes.map((n, i) => (
        <div
          key={n.label}
          className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-1 py-4 border-t border-foreground/10"
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground tabular-nums">
              0{i + 1}
            </span>
            <Flame className="h-3 w-3 text-ember" strokeWidth={1.75} />
          </div>
          <div>
            <p className="font-heading text-lg">{n.label}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{n.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
