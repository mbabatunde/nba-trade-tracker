'use client'

import useSWR from 'swr'
import { useMemo } from 'react'
import { Stack, Text, Heading, Spinner, Label } from '@primer/react'
import { Blankslate } from '@primer/react/experimental'
import { ArrowSwitchIcon, SearchIcon } from '@primer/octicons-react'
import type { Trade } from '@/lib/trades'
import { getTeam } from '@/lib/teams'
import { TradeCard } from './trade-card'

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

  const trades = useMemo(() => {
    const list = data?.trades ?? []
    if (!activeTeam) return list
    return list.filter((t) => t.parties.some((p) => p.teamId === activeTeam))
  }, [data, activeTeam])

  const team = activeTeam ? getTeam(activeTeam) : null

  return (
    <Stack direction="vertical" gap="normal">
      <Stack direction="horizontal" gap="condensed" align="center" justify="space-between" wrap="wrap">
        <Stack direction="vertical" gap="none">
          <Stack direction="horizontal" gap="condensed" align="center">
            <ArrowSwitchIcon size={20} />
            <Heading as="h2" style={{ fontSize: 20, fontWeight: 700 }}>
              {team ? `${team.fullName} trades` : 'Trade board'}
            </Heading>
          </Stack>
          <Text style={{ fontSize: 13, color: 'var(--fgColor-muted)' }}>
            {team
              ? 'Every completed and reported deal involving this franchise.'
              : 'Who moved where, and what came back — newest first.'}
          </Text>
        </Stack>

        <Stack direction="horizontal" gap="condensed" align="center">
          {data ? (
            <Label variant="accent" size="small">
              {trades.length} {trades.length === 1 ? 'trade' : 'trades'}
            </Label>
          ) : null}
          {team ? (
            <button
              type="button"
              onClick={onClearTeam}
              style={{
                cursor: 'pointer',
                border: '1px solid var(--borderColor-default)',
                background: 'var(--bgColor-default)',
                color: 'var(--fgColor-muted)',
                padding: '4px 12px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Clear filter
            </button>
          ) : null}
        </Stack>
      </Stack>

      {loading ? (
        <Stack direction="horizontal" gap="condensed" align="center" style={{ padding: '48px 0' }} justify="center">
          <Spinner size="medium" />
          <Text style={{ color: 'var(--fgColor-muted)' }}>Loading the latest deals…</Text>
        </Stack>
      ) : trades.length === 0 ? (
        <div style={{ padding: '24px 0' }}>
          <Blankslate border>
            <Blankslate.Visual>
              <SearchIcon size={24} />
            </Blankslate.Visual>
            <Blankslate.Heading>No trades found</Blankslate.Heading>
            <Blankslate.Description>
              {team
                ? `No recorded trades for the ${team.fullName} in the current feed.`
                : 'No trades available right now — check back soon.'}
            </Blankslate.Description>
          </Blankslate>
        </div>
      ) : (
        <Stack direction="vertical" gap="normal">
          {trades.map((trade) => (
            <TradeCard key={trade.id} trade={trade} />
          ))}
        </Stack>
      )}
    </Stack>
  )
}
