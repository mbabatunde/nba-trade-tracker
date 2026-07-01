export function BasketballLogo({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      aria-hidden="true"
      role="img"
    >
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 2.5v19" />
      <path d="M2.5 12h19" />
      <path d="M5.05 5.05C9 9 9 15 5.05 18.95" />
      <path d="M18.95 5.05C15 9 15 15 18.95 18.95" />
    </svg>
  )
}
