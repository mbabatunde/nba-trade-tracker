import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { headshotUrl, initials } from '@/lib/players'

/**
 * Player headshot pulled from the NBA CDN (proxied through /api/headshot). When
 * we don't have a person id, or the image fails, the Avatar shows the player's
 * initials instead.
 */
export function PlayerAvatar({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const src = headshotUrl(name)
  return (
    <Avatar className={cn('size-9 border bg-muted', className)}>
      {src ? <AvatarImage src={src} alt={name} className="object-cover object-top" /> : null}
      <AvatarFallback className="text-[11px] font-semibold">
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  )
}
