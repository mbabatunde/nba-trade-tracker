'use client'

import { useState } from 'react'
import { ArrowLeftRight, ArrowRight, CircleDot, DollarSign, ExternalLink } from 'lucide-react'
import type { Trade, TradeAsset, TradeParty } from '@/lib/trades'
import { getTeam } from '@/lib/teams'
import { timeAgo } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { PlayerAvatar } from './player-avatar'
import { TeamLogo } from './team-logo'

function AssetRow({ asset }: { asset: TradeAsset }) {
  const isPlayer = asset.kind === 'player'
  return (
    <li className="flex items-center gap-2.5 rounded-md border bg-background px-2.5 py-1.5">
      {isPlayer ? (
        <PlayerAvatar name={asset.label} className="size-8" />
      ) : (
        <span
          className={cn(
            'inline-flex size-8 shrink-0 items-center justify-center rounded-md',
            asset.kind === 'pick' && 'bg-chart-2/15 text-chart-2',
            asset.kind === 'cash' && 'bg-success/15 text-success',
            asset.kind === 'rights' && 'bg-chart-4/15 text-chart-4',
          )}
          aria-hidden
        >
          {asset.kind === 'pick' ? (
            <CircleDot className="size-4" />
          ) : asset.kind === 'cash' ? (
            <DollarSign className="size-4" />
          ) : (
            <ArrowLeftRight className="size-4" />
          )}
        </span>
      )}
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-semibold">{asset.label}</span>
        {asset.detail ? (
          <span className="truncate text-[11.5px] text-muted-foreground">{asset.detail}</span>
        ) : null}
      </span>
    </li>
  )
}

function PartyColumn({
  party,
  state = 'normal',
}: {
  party: TradeParty
  state?: 'normal' | 'focused' | 'dimmed'
}) {
  const team = getTeam(party.teamId)
  const accent = team?.primary ?? 'hsl(var(--border))'
  return (
    <div
      className={cn(
        'flex min-w-0 flex-1 basis-52 flex-col gap-3 rounded-xl border bg-muted/40 p-3.5 transition-all',
        state === 'focused' && 'ring-2 ring-offset-1 ring-offset-card',
        state === 'dimmed' && 'opacity-55',
      )}
      style={{
        borderTop: `3px solid ${accent}`,
        ...(state === 'focused' ? ({ '--tw-ring-color': accent } as React.CSSProperties) : {}),
      }}
    >
      <div className="flex items-center gap-2.5">
        <TeamLogo teamId={party.teamId} size={40} />
        <span className="flex flex-col">
          <span className="text-sm font-bold leading-tight">{team?.name ?? party.teamId}</span>
          <span className="text-[11px] text-muted-foreground">{team?.city}</span>
        </span>
      </div>

      <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
        Receives
      </span>

      {party.receives.length > 0 ? (
        <ul className="flex flex-col gap-1.5">
          {party.receives.map((a, i) => (
            <AssetRow key={`${a.label}-${i}`} asset={a} />
          ))}
        </ul>
      ) : (
        <p className="text-xs italic text-muted-foreground">Details pending</p>
      )}
    </div>
  )
}

export function TradeCard({ trade }: { trade: Trade }) {
  const twoTeam = trade.parties.length === 2
  const parties = trade.parties

  // Which team's perspective is being viewed. null = neutral (both sides).
  // Clicking the swap button cycles: neutral -> team 0 -> team 1 -> ... -> neutral.
  const [view, setView] = useState<number | null>(null)

  const cycleView = () =>
    setView((v) => {
      if (v === null) return 0
      if (v + 1 >= parties.length) return null
      return v + 1
    })

  const focusedTeam = view === null ? null : getTeam(parties[view].teamId)
  const givesUp =
    view === null ? [] : parties.filter((_, i) => i !== view).flatMap((p) => p.receives)

  return (
    <Card className="@container overflow-hidden gap-0 py-0">
      <CardHeader className="flex flex-col gap-2 border-b p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={trade.status === 'official' ? 'default' : 'secondary'}
            className={cn(
              trade.status === 'official' && 'bg-success text-success-foreground',
            )}
          >
            {trade.status === 'official' ? 'Official' : 'Reported'}
          </Badge>
          {trade.live ? <Badge variant="outline">Auto-parsed</Badge> : null}
          <span className="text-[11.5px] text-muted-foreground">
            {trade.source} · {timeAgo(trade.date)}
          </span>
        </div>
        <h3 className="text-pretty text-base font-bold leading-snug">{trade.headline}</h3>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex flex-col items-stretch justify-center gap-3 @md:flex-row">
          {parties.map((party, i) => (
            <div key={party.teamId + i} className="contents">
              <PartyColumn
                party={party}
                state={view === null ? 'normal' : view === i ? 'focused' : 'dimmed'}
              />
              {i < parties.length - 1 ? (
                <div className="flex shrink-0 items-center justify-center self-center">
                  <Tooltip>
                    <TooltipTrigger
                      onClick={cycleView}
                      className={cn(
                        'inline-flex size-9 items-center justify-center rounded-full border transition-colors',
                        view === null
                          ? 'bg-muted text-foreground hover:bg-accent'
                          : 'border-primary bg-primary text-primary-foreground hover:bg-primary/90',
                      )}
                      aria-label={
                        view === null
                          ? "View this trade from one team's perspective"
                          : `Viewing from ${focusedTeam?.name ?? 'a team'}'s perspective. Click to change.`
                      }
                    >
                      {twoTeam ? (
                        <ArrowLeftRight className="size-4 @md:rotate-0 rotate-90" />
                      ) : (
                        <ArrowRight className="size-4 @md:rotate-0 rotate-90" />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>Click to view each team&apos;s side</TooltipContent>
                  </Tooltip>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {focusedTeam && view !== null ? (
          <div className="mt-4 flex flex-col gap-3 rounded-xl border bg-muted/40 p-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <TeamLogo teamId={parties[view].teamId} size={28} />
              <span className="text-sm font-bold">
                {focusedTeam.name}&apos;s side of the deal
              </span>
            </div>
            <div className="flex flex-col gap-3 @md:flex-row">
              <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-lg border bg-background p-3">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-success">
                  Gets
                </span>
                {parties[view].receives.length > 0 ? (
                  <ul className="flex flex-col gap-1.5">
                    {parties[view].receives.map((a, i) => (
                      <AssetRow key={`get-${a.label}-${i}`} asset={a} />
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs italic text-muted-foreground">Details pending</p>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-lg border bg-background p-3">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-destructive">
                  Gives up
                </span>
                {givesUp.length > 0 ? (
                  <ul className="flex flex-col gap-1.5">
                    {givesUp.map((a, i) => (
                      <AssetRow key={`give-${a.label}-${i}`} asset={a} />
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs italic text-muted-foreground">Details pending</p>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {trade.sourceUrl ? (
          <a
            href={trade.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-fit items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Source
            <ExternalLink className="size-3" aria-hidden />
          </a>
        ) : null}
      </CardContent>
    </Card>
  )
}
