'use client'

import useSWR from 'swr'
import { useMemo, useState } from 'react'
import { Stack, Text, Heading, Label, Link, Spinner, Token } from '@primer/react'
import { BroadcastIcon, LinkExternalIcon, AlertIcon } from '@primer/octicons-react'
import type { FeedItem } from '@/lib/feed'
import { timeAgo } from '@/lib/format'
import { getTeam } from '@/lib/teams'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type SourceFilter = 'all' | 'bluesky' | 'reddit'

export function NewsFeed({ activeTeam }: { activeTeam: string | null }) {
  const [filter, setFilter] = useState<SourceFilter>('all')

  const bsky = useSWR<{ items: FeedItem[] }>('/api/bluesky', fetcher, {
    refreshInterval: 60_000,
    revalidateOnFocus: true,
  })
  const reddit = useSWR<{ items: FeedItem[] }>('/api/reddit', fetcher, {
    refreshInterval: 120_000,
    revalidateOnFocus: true,
  })

  const loading = (!bsky.data && !bsky.error) || (!reddit.data && !reddit.error)

  const items = useMemo(() => {
    const merged = [...(bsky.data?.items ?? []), ...(reddit.data?.items ?? [])]
    return merged
      .filter((i) => (filter === 'all' ? true : i.source === filter))
      .filter((i) => (activeTeam ? i.teams.includes(activeTeam) : true))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 60)
  }, [bsky.data, reddit.data, filter, activeTeam])

  const tabs: { key: SourceFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'bluesky', label: 'Shams' },
    { key: 'reddit', label: 'r/NBA' },
  ]

  return (
    <Stack direction="vertical" gap="normal">
      <Stack direction="horizontal" gap="condensed" align="center" justify="space-between">
        <Stack direction="horizontal" gap="condensed" align="center">
          <BroadcastIcon size={16} />
          <Heading as="h2" style={{ fontSize: 16, fontWeight: 600 }}>
            Latest wire
          </Heading>
        </Stack>
        {loading ? (
          <Spinner size="small" />
        ) : (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              color: 'var(--fgColor-success)',
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--bgColor-success-emphasis)',
                boxShadow: '0 0 0 3px var(--bgColor-success-muted)',
              }}
            />
            LIVE
          </span>
        )}
      </Stack>

      <Stack direction="horizontal" gap="condensed">
        {tabs.map((t) => {
          const active = filter === t.key
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setFilter(t.key)}
              style={{
                cursor: 'pointer',
                border: '1px solid',
                borderColor: active ? 'var(--borderColor-accent-emphasis)' : 'var(--borderColor-default)',
                background: active ? 'var(--bgColor-accent-muted)' : 'var(--bgColor-default)',
                color: active ? 'var(--fgColor-accent)' : 'var(--fgColor-muted)',
                padding: '4px 12px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {t.label}
            </button>
          )
        })}
      </Stack>

      <Stack direction="vertical" gap="none">
        {items.length === 0 && !loading ? (
          <Text style={{ color: 'var(--fgColor-muted)', fontSize: 13, padding: '12px 0' }}>
            No posts match this view yet.
          </Text>
        ) : null}
        {items.map((item) => (
          <FeedRow key={item.id} item={item} />
        ))}
      </Stack>
    </Stack>
  )
}

function FeedRow({ item }: { item: FeedItem }) {
  return (
    <article
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '14px 0',
        borderTop: '1px solid var(--borderColor-muted)',
      }}
    >
      <Stack direction="horizontal" gap="condensed" align="center" justify="space-between">
        <Stack direction="horizontal" gap="condensed" align="center">
          <SourceChip source={item.source} />
          {item.isTrade ? (
            <Label variant="danger" size="small">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <AlertIcon size={12} /> Trade
              </span>
            </Label>
          ) : null}
        </Stack>
        <Text style={{ fontSize: 11, color: 'var(--fgColor-muted)', whiteSpace: 'nowrap' }}>
          {timeAgo(item.createdAt)}
        </Text>
      </Stack>

      <Text style={{ fontSize: 13.5, lineHeight: 1.5, color: 'var(--fgColor-default)' }}>
        {item.text}
      </Text>

      {item.teams.length > 0 ? (
        <Stack direction="horizontal" gap="condensed" wrap="wrap">
          {item.teams.slice(0, 4).map((id) => (
            <Token key={id} text={getTeam(id)?.abbr ?? id} size="small" />
          ))}
        </Stack>
      ) : null}

      <Link
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        muted
        style={{ fontSize: 11.5, display: 'inline-flex', alignItems: 'center', gap: 4 }}
      >
        {item.source === 'bluesky' ? 'View on BlueSky' : 'View on Reddit'}
        <LinkExternalIcon size={11} />
      </Link>
    </article>
  )
}

function SourceChip({ source }: { source: FeedItem['source'] }) {
  const isBsky = source === 'bluesky'
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: isBsky ? 'var(--fgColor-accent)' : 'var(--fgColor-attention)',
      }}
    >
      {isBsky ? 'Shams · BlueSky' : 'r/NBA'}
    </span>
  )
}
