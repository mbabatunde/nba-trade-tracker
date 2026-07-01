'use client'

import { useState } from 'react'
import { PageLayout, Stack, Heading, Text, Label, IconButton, Link } from '@primer/react'
import { SunIcon, MoonIcon, SidebarCollapseIcon, SidebarExpandIcon, HeartIcon } from '@primer/octicons-react'
import { NewsFeed } from '@/components/news-feed'
import { TradeBoard } from '@/components/trade-board'
import { TeamFilter } from '@/components/team-filter'
import { useColorMode } from '@/components/providers'

export default function Page() {
  const [activeTeam, setActiveTeam] = useState<string | null>(null)
  const [paneOpen, setPaneOpen] = useState(true)
  const { mode, toggle } = useColorMode()

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bgColor-inset)' }}>
      <header
        style={{
          borderBottom: '1px solid var(--borderColor-default)',
          background: 'var(--bgColor-default)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div className="app-container" style={{ paddingTop: 14, paddingBottom: 14 }}>
          <Stack direction="horizontal" gap="condensed" align="center" justify="space-between" wrap="wrap">
            <Stack direction="horizontal" gap="condensed" align="center">
              <IconButton
                icon={paneOpen ? SidebarCollapseIcon : SidebarExpandIcon}
                aria-label={paneOpen ? 'Collapse live wire' : 'Expand live wire'}
                variant="invisible"
                onClick={() => setPaneOpen((o) => !o)}
              />
              <span
                style={{
                  display: 'inline-flex',
                  overflow: 'hidden',
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  border: '1px solid var(--borderColor-default)',
                  flex: '0 0 auto',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/basketball-court.jpg"
                  alt="Basketball resting on a hardwood court"
                  width={40}
                  height={40}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '72% 45%' }}
                />
              </span>
              <Stack direction="vertical" gap="none">
                <Heading as="h1" style={{ fontSize: 18, fontWeight: 700 }}>
                  NBA Trade Tracker
                </Heading>
                <Text style={{ fontSize: 12, color: 'var(--fgColor-muted)' }}>
                  Live player movement, powered by Shams Charania &amp; r/NBA
                </Text>
              </Stack>
            </Stack>
            <Stack direction="horizontal" gap="condensed" align="center">
              <Label variant="success">Real-time</Label>
              <IconButton
                icon={mode === 'dark' ? SunIcon : MoonIcon}
                aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                variant="invisible"
                onClick={toggle}
              />
            </Stack>
          </Stack>
        </div>
      </header>

      <PageLayout containerWidth="full" padding="normal" columnGap="normal" rowGap="normal">
        {paneOpen ? (
          <PageLayout.Pane position="start" width={{ min: '300px', default: '360px', max: '440px' }} divider="line" sticky>
            <NewsFeed activeTeam={activeTeam} />
          </PageLayout.Pane>
        ) : null}

        <PageLayout.Content width="full">
          <Stack direction="vertical" gap="spacious">
            <TeamFilter activeTeam={activeTeam} onSelect={setActiveTeam} />
            <hr style={{ border: 'none', borderTop: '1px solid var(--borderColor-muted)', margin: 0 }} />
            <TradeBoard activeTeam={activeTeam} onClearTeam={() => setActiveTeam(null)} />
          </Stack>
        </PageLayout.Content>
      </PageLayout>

      <footer
        style={{
          borderTop: '1px solid var(--borderColor-default)',
          background: 'var(--bgColor-default)',
          marginTop: 24,
        }}
      >
        <div className="app-container" style={{ paddingTop: 20, paddingBottom: 20 }}>
          <Stack direction="horizontal" gap="condensed" align="center" justify="center" wrap="wrap">
            <Text style={{ fontSize: 13, color: 'var(--fgColor-muted)' }}>
              Powered through{' '}
              <Link href="https://v0.app/" target="_blank" rel="noopener noreferrer">
                v0 by Vercel
              </Link>
            </Text>
            <Text style={{ fontSize: 13, color: 'var(--fgColor-muted)' }} aria-hidden>
              ·
            </Text>
            <Text style={{ fontSize: 13, color: 'var(--fgColor-muted)' }}>
              Created by{' '}
              <Link href="https://markbabatunde.com/" target="_blank" rel="noopener noreferrer">
                Mark Babatunde
              </Link>
            </Text>
            <Text style={{ fontSize: 13, color: 'var(--fgColor-muted)' }} aria-hidden>
              ·
            </Text>
            <Link
              href="https://buymeacoffee.com/markbabatunde"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 5 }}
            >
              <HeartIcon size={14} />
              Buy me a coffee
            </Link>
          </Stack>
        </div>
      </footer>
    </div>
  )
}
