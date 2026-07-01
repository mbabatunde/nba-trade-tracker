'use client'

import { useState } from 'react'
import { Stack, Text, Label, Link } from '@primer/react'
import {
  IssueDraftIcon,
  ArrowSwitchIcon,
  ArrowRightIcon,
  LinkExternalIcon,
} from '@primer/octicons-react'
import type { Trade, TradeAsset, TradeParty } from '@/lib/trades'
import { getTeam } from '@/lib/teams'
import { headshotUrl, initials } from '@/lib/players'
import { TeamBadge } from './team-badge'
import { timeAgo } from '@/lib/format'

function PlayerAvatar({ name, accent }: { name: string; accent?: string }) {
  const url = headshotUrl(name)
  const size = 34
  const common = {
    width: size,
    height: size,
    borderRadius: '50%',
    flex: '0 0 auto',
    objectFit: 'cover' as const,
    background: 'var(--bgColor-muted)',
    border: '1px solid var(--borderColor-default)',
  }
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url || '/placeholder.svg'}
        alt={name}
        loading="lazy"
        style={{ ...common, objectPosition: 'top center' }}
      />
    )
  }
  return (
    <span
      aria-hidden
      style={{
        ...common,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 700,
        color: accent ?? 'var(--fgColor-accent)',
      }}
    >
      {initials(name)}
    </span>
  )
}

function AssetRow({ asset }: { asset: TradeAsset }) {
  const isPlayer = asset.kind === 'player'
  const icon =
    asset.kind === 'pick' ? (
      <IssueDraftIcon size={14} />
    ) : asset.kind === 'cash' ? (
      <span style={{ fontSize: 13, fontWeight: 700 }}>$</span>
    ) : (
      <ArrowSwitchIcon size={14} />
    )

  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: isPlayer ? '6px 10px' : '7px 10px',
        borderRadius: 8,
        background: 'var(--bgColor-default)',
        border: '1px solid var(--borderColor-muted)',
      }}
    >
      {isPlayer ? (
        <PlayerAvatar name={asset.label} />
      ) : (
        <span
          style={{
            color: asset.kind === 'pick' ? 'var(--fgColor-done)' : 'var(--fgColor-success)',
            display: 'inline-flex',
            width: 20,
            justifyContent: 'center',
          }}
        >
          {icon}
        </span>
      )}
      <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Text style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fgColor-default)' }}>
          {asset.label}
        </Text>
        {asset.detail ? (
          <Text style={{ fontSize: 11.5, color: 'var(--fgColor-muted)' }}>{asset.detail}</Text>
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
  const accent = team?.primary ?? 'var(--borderColor-emphasis)'
  return (
    <div
      className="trade-party-col"
      style={{
        background: 'var(--bgColor-muted)',
        border:
          state === 'focused'
            ? `1px solid ${accent}`
            : '1px solid var(--borderColor-default)',
        borderTop: `3px solid ${accent}`,
        boxShadow: state === 'focused' ? `0 0 0 1px ${accent}` : undefined,
        opacity: state === 'dimmed' ? 0.55 : 1,
        transition: 'opacity 0.15s ease, box-shadow 0.15s ease',
      }}
    >
      <Stack direction="horizontal" gap="condensed" align="center">
        <TeamBadge teamId={party.teamId} size={40} />
        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <Text style={{ fontSize: 14, fontWeight: 700, color: 'var(--fgColor-default)' }}>
            {team?.name ?? party.teamId}
          </Text>
          <Text style={{ fontSize: 11, color: 'var(--fgColor-muted)' }}>{team?.city}</Text>
        </span>
      </Stack>

      <Text
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--fgColor-muted)',
        }}
      >
        Receives
      </Text>

      {party.receives.length > 0 ? (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {party.receives.map((a, i) => (
            <AssetRow key={`${a.label}-${i}`} asset={a} />
          ))}
        </ul>
      ) : (
        <Text style={{ fontSize: 12, color: 'var(--fgColor-muted)', fontStyle: 'italic' }}>
          Details pending
        </Text>
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
  // What the focused team gives up = everything the other teams receive.
  const givesUp =
    view === null
      ? []
      : parties.filter((_, i) => i !== view).flatMap((p) => p.receives)

  return (
    <section
      className="trade-card"
      style={{
        borderRadius: 14,
        border: '1px solid var(--borderColor-default)',
        background: 'var(--bgColor-default)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '16px 18px',
          borderBottom: '1px solid var(--borderColor-muted)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
          <Label variant={trade.status === 'official' ? 'success' : 'attention'} size="small">
            {trade.status === 'official' ? 'Official' : 'Reported'}
          </Label>
          {trade.live ? (
            <Label variant="accent" size="small">
              Auto-parsed
            </Label>
          ) : null}
          <Text style={{ fontSize: 11.5, color: 'var(--fgColor-muted)' }}>
            {trade.source} · {timeAgo(trade.date)}
          </Text>
        </Stack>
        <Text style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.35, color: 'var(--fgColor-default)' }}>
          {trade.headline}
        </Text>
      </div>

      <div className="trade-parties" style={{ padding: 18 }}>
        {parties.map((party, i) => (
          <div
            key={party.teamId + i}
            style={{ display: 'contents' }}
          >
            <PartyColumn
              party={party}
              state={view === null ? 'normal' : view === i ? 'focused' : 'dimmed'}
            />
            {i < parties.length - 1 ? (
              <div className="trade-connector">
                <button
                  type="button"
                  onClick={cycleView}
                  title="Click to view the trade from each team's side"
                  aria-label={
                    view === null
                      ? 'View this trade from one team\u2019s perspective'
                      : `Viewing from ${focusedTeam?.name ?? 'a team'}\u2019s perspective. Click to change.`
                  }
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 38,
                    height: 38,
                    padding: 0,
                    cursor: 'pointer',
                    borderRadius: '50%',
                    color: view === null ? 'var(--fgColor-default)' : 'var(--fgColor-onEmphasis)',
                    background:
                      view === null ? 'var(--bgColor-muted)' : 'var(--bgColor-accent-emphasis)',
                    border:
                      view === null
                        ? '1px solid var(--borderColor-default)'
                        : '1px solid var(--bgColor-accent-emphasis)',
                    transition: 'background 0.15s ease, color 0.15s ease',
                  }}
                >
                  {twoTeam ? <ArrowSwitchIcon size={16} /> : <ArrowRightIcon size={16} />}
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {focusedTeam ? (
        <div
          style={{
            margin: '0 18px 16px',
            padding: 14,
            borderRadius: 12,
            background: 'var(--bgColor-muted)',
            border: '1px solid var(--borderColor-default)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
            <TeamBadge teamId={parties[view!].teamId} size={28} />
            <Text style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--fgColor-default)' }}>
              {focusedTeam.name}&apos;s side of the deal
            </Text>
          </Stack>
          <div className="trade-parties" style={{ padding: 0, gap: 12 }}>
            <div className="trade-party-col" style={{ background: 'var(--bgColor-default)', border: '1px solid var(--borderColor-muted)' }}>
              <Text style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fgColor-success)' }}>
                Gets
              </Text>
              {parties[view!].receives.length > 0 ? (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {parties[view!].receives.map((a, i) => (
                    <AssetRow key={`get-${a.label}-${i}`} asset={a} />
                  ))}
                </ul>
              ) : (
                <Text style={{ fontSize: 12, color: 'var(--fgColor-muted)', fontStyle: 'italic' }}>Details pending</Text>
              )}
            </div>
            <div className="trade-party-col" style={{ background: 'var(--bgColor-default)', border: '1px solid var(--borderColor-muted)' }}>
              <Text style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fgColor-danger)' }}>
                Gives up
              </Text>
              {givesUp.length > 0 ? (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {givesUp.map((a, i) => (
                    <AssetRow key={`give-${a.label}-${i}`} asset={a} />
                  ))}
                </ul>
              ) : (
                <Text style={{ fontSize: 12, color: 'var(--fgColor-muted)', fontStyle: 'italic' }}>Details pending</Text>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {trade.sourceUrl ? (
        <div style={{ padding: '0 18px 16px' }}>
          <Link
            href={trade.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            muted
            style={{ fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}
          >
            Source
            <LinkExternalIcon size={12} />
          </Link>
        </div>
      ) : null}
    </section>
  )
}
