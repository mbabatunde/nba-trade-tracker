import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: 'NBA Trade Tracker — Live Player Movement',
  description:
    'Track NBA trades in real time. See how players move between teams and what each side gets back, with a live wire from Shams Charania and r/NBA.',
}

export const viewport = {
  themeColor: '#0d1117',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      data-color-mode="dark"
      data-light-theme="light"
      data-dark-theme="dark"
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
