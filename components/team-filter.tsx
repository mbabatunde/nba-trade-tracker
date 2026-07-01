'use client'

import { useMemo, useState } from 'react'
import { Stack, Text, Heading, TextInput } from '@primer/react'
import { SearchIcon, XCircleFillIcon } from '@primer/octicons-react'
import { TEAMS } from '@/lib/teams'
import { TeamBadge } from './team-badge'

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
    <Stack direction="vertical" gap="normal">
      <Stack direction="vertical" gap="condensed">
        <Heading as="h2" style={{ fontSize: 16, fontWeight: 600 }}>
          Filter by team
        </Heading>
        <TextInput
          leadingVisual={SearchIcon}
          placeholder="Search teams"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          block
          size="small"
          aria-label="Search teams"
          trailingAction={
            activeTeam ? (
              <TextInput.Action
                onClick={() => onSelect(null)}
                icon={XCircleFillIcon}
                aria-label="Clear team filter"
              />
            ) : undefined
          }
        />
      </Stack>

      {(['East', 'West'] as const).map((conf) =>
        grouped[conf].length > 0 ? (
          <Stack direction="vertical" gap="condensed" key={conf}>
            <Text
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--fgColor-muted)',
              }}
            >
              {conf}ern Conference
            </Text>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {grouped[conf].map((team) => {
                const active = activeTeam === team.id
                return (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => onSelect(active ? null : team.id)}
                    title={team.fullName}
                    aria-pressed={active}
                    style={{
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 10px 4px 4px',
                      borderRadius: 999,
                      border: '1px solid',
                      borderColor: active
                        ? 'var(--borderColor-accent-emphasis)'
                        : 'var(--borderColor-default)',
                      background: active ? 'var(--bgColor-accent-muted)' : 'var(--bgColor-default)',
                      color: active ? 'var(--fgColor-accent)' : 'var(--fgColor-default)',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    <TeamBadge teamId={team.id} size={22} />
                    {team.abbr}
                  </button>
                )
              })}
            </div>
          </Stack>
        ) : null,
      )}
    </Stack>
  )
}
