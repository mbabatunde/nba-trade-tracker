import { cn } from '@/lib/utils'

/**
 * NBA Swaps emblem — an homage to the league's iconic silhouette mark:
 * a vertically split badge (brand orange | deep navy) with a white dribbling
 * player, an orange basketball, and two "swap" arrows across the divider to
 * signify trades. Brand colors are held constant (like real league marks) so
 * it reads correctly in both light and dark themes. Purely decorative — pair
 * with a visible or `sr-only` label.
 */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-hidden="true"
      className={cn('size-full', className)}
    >
      <defs>
        <clipPath id="nbaswaps-badge">
          <rect width="48" height="48" rx="11" />
        </clipPath>
      </defs>

      <g clipPath="url(#nbaswaps-badge)">
        {/* Split background: orange left, navy right */}
        <rect width="48" height="48" fill="#E35205" />
        <rect x="24" width="24" height="48" fill="#17233F" />

        {/* Swap arrows straddling the divider (trade motif) */}
        <g
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.32"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 12.5h16.5a5 5 0 0 1 5 5" />
          <path d="M31 9l4 3.5-4 3.5" />
          <path d="M34 35.5H17.5a5 5 0 0 1-5-5" />
          <path d="M17 39l-4-3.5 4-3.5" />
        </g>

        {/* Dribbling player silhouette (NBA-logo homage) */}
        <path
          fill="#FFFFFF"
          d="M29.6 9.1c1.5 0 2.7 1.2 2.7 2.7s-1.2 2.7-2.7 2.7-2.7-1.2-2.7-2.7 1.2-2.7 2.7-2.7Z
             M26.9 15.1c1.2-.5 2.5-.3 3.4.5l3.8 3.3c.5.4.8 1 .9 1.7l.7 4.6c.1.9-.5 1.7-1.4 1.8-.9.1-1.7-.5-1.8-1.4l-.6-3.9-2-1.7-1.9 5.6 3.1 3.4c.4.4.6.9.6 1.5l-.2 8.2c0 1-.9 1.8-1.9 1.7-1-.1-1.7-.9-1.6-1.9l.2-7.2-4.4-4.3c-.7-.7-1-1.7-.7-2.7l1.9-6.9-2.6 1.5-2.4 4.2c-.5.8-1.5 1.1-2.3.6-.8-.5-1.1-1.5-.6-2.3l2.7-4.7c.2-.4.6-.7 1-.9l4.4-2.9Z
             M23.7 30.4l-3.8 6.4c-.5.9-1.6 1.1-2.4.6-.8-.5-1.1-1.6-.6-2.4l3.4-5.7 3.4 1.1Z"
        />

        {/* Basketball at the lead hand */}
        <g>
          <circle cx="36.2" cy="14" r="3.6" fill="#E35205" stroke="#17233F" strokeWidth="0.6" />
          <g fill="none" stroke="#17233F" strokeWidth="0.7" strokeLinecap="round">
            <path d="M36.2 10.4v7.2" />
            <path d="M32.6 14h7.2" />
            <path d="M33.7 11.5c1 .7 1.6 1.8 1.6 3.1 0 .9-.3 1.7-.8 2.4" />
            <path d="M38.7 11.5c-1 .7-1.6 1.8-1.6 3.1 0 .9.3 1.7.8 2.4" />
          </g>
        </g>

        {/* Inner border */}
        <rect
          x="0.75"
          y="0.75"
          width="46.5"
          height="46.5"
          rx="10.25"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.18"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  )
}
