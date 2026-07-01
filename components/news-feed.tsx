'use client'

import useSWR from 'swr'
import { useEffect, useMemo, useState } from 'react'
import { Radio, ExternalLink, TriangleAlert } from 'lucide-react'
import type { FeedItem } from '@/lib/feed'
import { timeAgo } from '@/lib/format'
import { getTeam } from '@/lib/teams'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { TeamLogo } from './team-logo'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function NewsFeed({ activeTeam }: { activeTeam: string | null }) {
  const bsky = useSWR<{ items: FeedItem[] }>('/api/bluesky', fetcher, {
    refreshInterval: 30_000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshWhenHidden: true,
    keepPreviousData: true,
  })

  const loading = !bsky.data && !bsky.error
  const isValidating = bsky.isValidating

  const [lastUpdatedAt, setLastUpdatedAt] = useState(0)
  useEffect(() => {
    if (bsky.data) setLastUpdatedAt(Date.now())
  }, [bsky.data])

  const [, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 15_000)
    return () => clearInterval(t)
  }, [])

  const items = useMemo(() => {
    return (bsky.data?.items ?? [])
      .filter((i) => (activeTeam ? i.teams.includes(activeTeam) : true))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 60)
  }, [bsky.data, activeTeam])

  return (
    <section className="flex flex-col gap-4" aria-label="Latest NBA wire">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Radio className="size-4 text-primary" aria-hidden />
          <h2 className="text-base font-semibold">Latest wire</h2>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdatedAt ? (
            <span className="whitespace-nowrap text-[11px] text-muted-foreground">
              {`Updated ${timeAgo(new Date(lastUpdatedAt).toISOString())}`}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-success">
            <span
              className={cn(
                'size-2 rounded-full bg-success ring-2 ring-success/25',
                isValidating && 'animate-nba-pulse',
              )}
              aria-hidden
            />
            LIVE
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        {loading ? (
          <div className="flex flex-col gap-4 py-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="py-3 text-sm text-muted-foreground">No posts match this view yet.</p>
        ) : (
          items.map((item) => <FeedRow key={item.id} item={item} />)
        )}
      </div>
    </section>
  )
}

function FeedRow({ item }: { item: FeedItem }) {
  return (
    <article className="flex flex-col gap-2 border-t py-3.5 first:border-t-0">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-chart-2">Shams · BlueSky</span>
          {item.isTrade ? (
            <Badge variant="destructive" className="gap-1 px-1.5 py-0 text-[10px]">
              <TriangleAlert className="size-3" aria-hidden />
              Trade
            </Badge>
          ) : null}
        </div>
        <span className="whitespace-nowrap text-[11px] text-muted-foreground">
          {timeAgo(item.createdAt)}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-foreground/90">{item.text}</p>

      {item.teams.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5">
          {item.teams.slice(0, 5).map((id) => (
            <span
              key={id}
              className="inline-flex items-center gap-1 rounded-full border bg-muted/50 py-0.5 pl-0.5 pr-2 text-[11px] font-medium"
              title={getTeam(id)?.fullName ?? id}
            >
              <TeamLogo teamId={id} size={16} />
              {getTeam(id)?.abbr ?? id}
            </span>
          ))}
        </div>
      ) : null}

      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-fit items-center gap-1 text-[11.5px] text-muted-foreground transition-colors hover:text-foreground"
      >
        View on BlueSky
        <ExternalLink className="size-3" aria-hidden />
      </a>
    </article>
  )
}
