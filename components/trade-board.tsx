'use client'

import useSWR from 'swr'
import { useMemo, useState } from 'react'
import { ArrowLeftRight, SearchX, X } from 'lucide-react'
import type { Trade } from '@/lib/trades'
import { getTeam } from '@/lib/teams'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { TradeCard } from './trade-card'
import { TeamLogo } from './team-logo'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function TradeBoard({
  activeTeam,
  onClearTeam,
}: {
  activeTeam: string | null
  onClearTeam: () => void
}) {
  const { data, error } = useSWR<{ trades: Trade[]; liveCount: number }>('/api/trades', fetcher, {
    refreshInterval: 30_000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshWhenHidden: true,
    keepPreviousData: true,
  })

  const loading = !data && !error

  const [year, setYear] = useState<string>('all')

  // Years present in the data (team-scoped), newest first, for the filter.
  const years = useMemo(() => {
    const list = data?.trades ?? []
    const scoped = activeTeam
      ? list.filter((t) => t.parties.some((p) => p.teamId === activeTeam))
      : list
    const set = new Set(scoped.map((t) => new Date(t.date).getFullYear().toString()))
    return Array.from(set).sort((a, b) => Number(b) - Number(a))
  }, [data, activeTeam])

  // Reset the year filter if the active team no longer has that year.
  const effectiveYear = year !== 'all' && !years.includes(year) ? 'all' : year

  const trades = useMemo(() => {
    let list = data?.trades ?? []
    if (activeTeam) list = list.filter((t) => t.parties.some((p) => p.teamId === activeTeam))
    if (effectiveYear !== 'all') {
      list = list.filter((t) => new Date(t.date).getFullYear().toString() === effectiveYear)
    }
    return list
  }, [data, activeTeam, effectiveYear])

  const team = activeTeam ? getTeam(activeTeam) : null

  return (
    <section className="flex flex-col gap-4" aria-label="Trade board">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {team ? (
              <TeamLogo teamId={team.id} size={26} />
            ) : (
              <ArrowLeftRight className="size-5 text-primary" aria-hidden />
            )}
            <h2 className="text-xl font-bold tracking-tight">
              {team ? `${team.fullName} trades` : 'Trade board'}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {team
              ? 'Every completed and reported deal involving this franchise.'
              : 'Who moved where, and what came back — newest first.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {data ? (
            <Badge variant="secondary" className="tabular-nums">
              {trades.length} {trades.length === 1 ? 'trade' : 'trades'}
            </Badge>
          ) : null}
          {team ? (
            <Button variant="outline" size="sm" onClick={onClearTeam}>
              <X data-icon="inline-start" />
              Clear filter
            </Button>
          ) : null}
        </div>
      </div>

      {years.length > 1 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Year</span>
          <ToggleGroup
            value={[effectiveYear]}
            onValueChange={(v: string[]) => setYear(v[0] ?? 'all')}
            variant="outline"
            size="sm"
          >
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            {years.map((y) => (
              <ToggleGroupItem key={y} value={y} className="tabular-nums">
                {y}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      ) : null}

      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      ) : trades.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-14 text-center">
          <SearchX className="size-7 text-muted-foreground" aria-hidden />
          <div className="flex flex-col gap-1">
            <p className="font-semibold">No trades found</p>
            <p className="text-sm text-muted-foreground">
              {effectiveYear !== 'all'
                ? `No ${team ? `${team.fullName} ` : ''}trades recorded in ${effectiveYear}.`
                : team
                  ? `No recorded trades for the ${team.fullName} in the current feed.`
                  : 'No trades available right now — check back soon.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {trades.map((trade) => (
            <TradeCard key={trade.id} trade={trade} />
          ))}
        </div>
      )}
    </section>
  )
}
