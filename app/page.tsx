'use client'

import { useState } from 'react'
import { Heart, PanelLeftClose, PanelLeftOpen, Radio } from 'lucide-react'
import { NewsFeed } from '@/components/news-feed'
import { TradeBoard } from '@/components/trade-board'
import { TeamFilter } from '@/components/team-filter'
import { ThemeToggle } from '@/components/theme-toggle'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

export default function Page() {
  const [activeTeam, setActiveTeam] = useState<string | null>(null)
  const [paneOpen, setPaneOpen] = useState(true)

  return (
    <div className="flex min-h-dvh flex-col bg-muted/30">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            {/* Desktop sidebar toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:inline-flex"
              onClick={() => setPaneOpen((o) => !o)}
              aria-label={paneOpen ? 'Collapse live wire' : 'Expand live wire'}
            >
              {paneOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
            </Button>

            {/* Mobile: live wire in a Sheet */}
            <Sheet>
              <SheetTrigger
                render={<Button variant="ghost" size="icon" aria-label="Open live wire" />}
                className="lg:hidden"
              >
                <Radio />
              </SheetTrigger>
              <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto p-5">
                <SheetHeader className="sr-only">
                  <SheetTitle>Latest wire</SheetTitle>
                </SheetHeader>
                <NewsFeed activeTeam={activeTeam} />
              </SheetContent>
            </Sheet>

            <span className="inline-flex size-10 shrink-0 overflow-hidden rounded-lg border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/basketball-court.jpg"
                alt="Basketball resting on a hardwood court"
                width={40}
                height={40}
                className="size-full object-cover"
                style={{ objectPosition: '72% 45%' }}
              />
            </span>
            <div className="flex min-w-0 flex-col">
              <h1 className="truncate text-lg font-bold leading-tight tracking-tight">
                NBA Swaps
              </h1>
              <p className="hidden truncate text-xs text-muted-foreground sm:block">
                Live player movement, powered by Shams Charania
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="hidden bg-success text-success-foreground sm:inline-flex">
              Real-time
            </Badge>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 gap-6 px-4 py-6 sm:px-6">
        {/* Desktop live wire sidebar */}
        {paneOpen ? (
          <aside className="hidden w-[340px] shrink-0 lg:block xl:w-[380px]">
            <div className="sticky top-[84px] max-h-[calc(100dvh-104px)] overflow-y-auto pr-1">
              <NewsFeed activeTeam={activeTeam} />
            </div>
          </aside>
        ) : null}

        <main className="flex min-w-0 flex-1 flex-col gap-6">
          <TeamFilter activeTeam={activeTeam} onSelect={setActiveTeam} />
          <Separator />
          <TradeBoard activeTeam={activeTeam} onClearTeam={() => setActiveTeam(null)} />
        </main>
      </div>

      <footer className="border-t bg-background">
        <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-5 text-sm text-muted-foreground sm:px-6">
          <span>
            Powered through{' '}
            <a
              href="https://v0.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              v0 by Vercel
            </a>
          </span>
          <span aria-hidden>·</span>
          <span>
            Created by{' '}
            <a
              href="https://markbabatunde.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Mark Babatunde
            </a>
          </span>
          <span aria-hidden>·</span>
          <a
            href="https://buymeacoffee.com/markbabatunde"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-foreground underline-offset-4 hover:underline"
          >
            <Heart className="size-3.5" aria-hidden />
            Buy me a coffee
          </a>
        </div>
      </footer>
    </div>
  )
}
