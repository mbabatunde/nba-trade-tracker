import { ImageResponse } from 'next/og'

// Route segment config
export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

// Favicon: the NBA Swaps emblem — a basketball ringed by circulating swap
// arrows on a brand-orange badge. Colors are inlined (OG images can't use CSS
// tokens) to match the primary/primary-foreground theme.
const ORANGE = '#e8590c'
const CREAM = '#fff7ed'

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <svg width="64" height="64" viewBox="0 0 48 48">
          <rect width="48" height="48" rx="11" fill={ORANGE} />
          <g
            fill="none"
            stroke={CREAM}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 18.5a13.5 13.5 0 0 1 22.4-4.2" />
            <path d="M35 8.6l.6 5.9-5.9.7" />
            <path d="M36 29.5a13.5 13.5 0 0 1-22.4 4.2" />
            <path d="M13 39.4l-.6-5.9 5.9-.7" />
          </g>
          <circle cx="24" cy="24" r="8.5" fill={CREAM} />
          <g fill="none" stroke={ORANGE} strokeWidth="1.5" strokeLinecap="round">
            <path d="M24 15.5v17" />
            <path d="M15.5 24h17" />
            <path d="M17.2 18.3c2.4 1.9 3.9 4.8 3.9 8.2 0 2.1-.6 4.1-1.6 5.8" />
            <path d="M30.8 18.3c-2.4 1.9-3.9 4.8-3.9 8.2 0 2.1.6 4.1 1.6 5.8" />
          </g>
        </svg>
      </div>
    ),
    { ...size },
  )
}
