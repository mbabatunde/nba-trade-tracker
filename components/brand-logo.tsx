import { cn } from '@/lib/utils'

/**
 * NBA Swaps emblem: a basketball ringed by two circulating "swap" arrows,
 * set on a rounded badge. Uses theme tokens so it reads correctly in light
 * and dark modes. Purely decorative — pair with a visible/`sr-only` label.
 */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-hidden="true"
      className={cn('size-full', className)}
    >
      {/* Badge background */}
      <rect width="48" height="48" rx="11" className="fill-primary" />
      <rect
        x="0.75"
        y="0.75"
        width="46.5"
        height="46.5"
        rx="10.25"
        fill="none"
        className="stroke-primary-foreground/25"
        strokeWidth="1.5"
      />

      {/* Circulating swap arrows around the ball */}
      <g
        fill="none"
        className="stroke-primary-foreground"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 18.5a13.5 13.5 0 0 1 22.4-4.2" />
        <path d="M35 8.6l.6 5.9-5.9.7" />
        <path d="M36 29.5a13.5 13.5 0 0 1-22.4 4.2" />
        <path d="M13 39.4l-.6-5.9 5.9-.7" />
      </g>

      {/* Basketball */}
      <g>
        <circle cx="24" cy="24" r="8.5" className="fill-primary-foreground" />
        <g
          fill="none"
          className="stroke-primary"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M24 15.5v17" />
          <path d="M15.5 24h17" />
          <path d="M17.2 18.3c2.4 1.9 3.9 4.8 3.9 8.2 0 2.1-.6 4.1-1.6 5.8" />
          <path d="M30.8 18.3c-2.4 1.9-3.9 4.8-3.9 8.2 0 2.1.6 4.1 1.6 5.8" />
        </g>
      </g>
    </svg>
  )
}
