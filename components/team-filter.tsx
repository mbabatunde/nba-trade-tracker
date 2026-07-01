'use client'

import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { TEAMS } from '@/lib/teams'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { TeamLogo } from './team-logo'

export function TeamFilter({
  activeTeam,
  onSelect,
}: {
  activeTeam: string | null
  onSelect: (teamId: string | null) => void
}) {
  const [query, setQuery] = useState('')

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = TEAMS.filter(
      (t) => !q || t.fullName.toLowerCase().includes(q) || t.abbr.toLowerCase().includes(q),
    )
    return {
      East: filtered.filter((t) => t.conference === 'East'),
      West: filtered.filter((t) => t.conference === 'West'),
    }
  }, [query])

  return (
    <section className="flex flex-col gap-4" aria-label="Filter trades by team">
      <div className="flex flex-col gap-2">
        <h2 className="text-base font-semibold">Filter by team</h2>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams"
            aria-label="Search teams"
            className="h-9 pl-8 pr-8"
          />
          {activeTeam ? (
            <button
              type="button"
              onClick={() => onSelect(null)}
              aria-label="Clear team filter"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
      </div>

      {(['East', 'West'] as const).map((conf) =>
        grouped[conf].length > 0 ? (
          <div key={conf} className="flex flex-col gap-2">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
              {conf}ern Conference
            </span>
            <div className="flex flex-wrap gap-2">
              {grouped[conf].map((team) => {
                const active = activeTeam === team.id
                return (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => onSelect(active ? null : team.id)}
                    title={team.fullName}
                    aria-pressed={active}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border py-1 pl-1 pr-2.5 text-xs font-semibold transition-colors',
                      active
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
                    )}
                  >
                    <TeamLogo teamId={team.id} size={20} />
                    {team.abbr}
                  </button>
                )
              })}
            </div>
          </div>
        ) : null,
      )}
    </section>
  )
}
