'use client'

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

function PartyColumn({ party }: { party: TradeParty }) {
  const team = getTeam(party.teamId)
  return (
    <div
      className="trade-party-col"
      style={{
        background: 'var(--bgColor-muted)',
        border: '1px solid var(--borderColor-default)',
        borderTop: `3px solid ${team?.primary ?? 'var(--borderColor-emphasis)'}`,
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
        {trade.parties.map((party, i) => (
          <div
            key={party.teamId + i}
            style={{ display: 'contents' }}
          >
            <PartyColumn party={party} />
            {i < trade.parties.length - 1 ? (
              <div aria-hidden className="trade-connector">
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'var(--bgColor-muted)',
                    border: '1px solid var(--borderColor-default)',
                  }}
                >
                  {twoTeam ? <ArrowSwitchIcon size={16} /> : <ArrowRightIcon size={16} />}
                </span>
              </div>
            ) : null}
          </div>
        ))}
      </div>

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
