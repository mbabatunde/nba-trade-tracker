'use client'

import { useState } from 'react'
import { PageLayout, Stack, Heading, Text, Label } from '@primer/react'
import { BasketballLogo } from '@/components/basketball-logo'
import { NewsFeed } from '@/components/news-feed'
import { TradeBoard } from '@/components/trade-board'
import { TeamFilter } from '@/components/team-filter'

export default function Page() {
  const [activeTeam, setActiveTeam] = useState<string | null>(null)

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
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '16px 24px' }}>
          <Stack direction="horizontal" gap="condensed" align="center" justify="space-between" wrap="wrap">
            <Stack direction="horizontal" gap="condensed" align="center">
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: '#ee6730',
                  color: '#ffffff',
                }}
              >
                <BasketballLogo size={22} />
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
            <Label variant="success">Real-time</Label>
          </Stack>
        </div>
      </header>

      <PageLayout containerWidth="full" padding="normal" columnGap="normal" rowGap="normal">
        <PageLayout.Pane position="start" width={{ min: '300px', default: '360px', max: '440px' }} divider="line" sticky>
          <NewsFeed activeTeam={activeTeam} />
        </PageLayout.Pane>

        <PageLayout.Content width="full">
          <Stack direction="vertical" gap="spacious">
            <TeamFilter activeTeam={activeTeam} onSelect={setActiveTeam} />
            <hr style={{ border: 'none', borderTop: '1px solid var(--borderColor-muted)', margin: 0 }} />
            <TradeBoard activeTeam={activeTeam} onClearTeam={() => setActiveTeam(null)} />
          </Stack>
        </PageLayout.Content>
      </PageLayout>
    </div>
  )
}
