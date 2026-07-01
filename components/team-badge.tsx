'use client'

import { getTeam } from '@/lib/teams'

/**
 * Circular franchise badge. Team brand colors are used here intentionally —
 * a trade product must render each team in its real identity color. All
 * surrounding chrome uses Primer tokens.
 */
export function TeamBadge({ teamId, size = 40 }: { teamId: string; size?: number }) {
  const team = getTeam(teamId)
  const label = team?.fullName ?? teamId
  const primary = team?.primary ?? '#57606a'
  const secondary = team?.secondary ?? '#ffffff'

  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        background: primary,
        color: secondary,
        border: `2px solid ${secondary}`,
        boxShadow: 'var(--shadow-resting-medium, 0 1px 3px rgba(0,0,0,0.3))',
        fontWeight: 700,
        fontSize: size * 0.32,
        letterSpacing: '0.02em',
        lineHeight: 1,
      }}
    >
      {team?.abbr ?? teamId}
    </span>
  )
}
