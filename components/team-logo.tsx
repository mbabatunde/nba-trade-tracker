'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { getTeam, teamLogoUrl, type Team } from '@/lib/teams'

/**
 * Official NBA team logo (ESPN CDN, transparent PNG). Falls back to a colored
 * disc with the team abbreviation if the image can't load, so the UI never
 * shows a broken image.
 */
export function TeamLogo({
  teamId,
  size = 40,
  className,
}: {
  teamId: string
  size?: number
  className?: string
}) {
  const team = getTeam(teamId)
  const [failed, setFailed] = useState(false)

  if (!team) {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold',
          className,
        )}
        style={{ width: size, height: size, fontSize: size * 0.32 }}
        aria-hidden
      >
        ?
      </span>
    )
  }

  if (failed) return <TeamFallback team={team} size={size} className={className} />

  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={teamLogoUrl(team) || '/placeholder.svg'}
        alt={`${team.fullName} logo`}
        width={size}
        height={size}
        loading="lazy"
        onError={() => setFailed(true)}
        className="size-full object-contain"
      />
    </span>
  )
}

function TeamFallback({
  team,
  size,
  className,
}: {
  team: Team
  size: number
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white',
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.3,
        backgroundColor: team.primary,
        boxShadow: `inset 0 0 0 2px ${team.secondary}`,
      }}
      aria-label={`${team.fullName} logo`}
    >
      {team.abbr}
    </span>
  )
}
