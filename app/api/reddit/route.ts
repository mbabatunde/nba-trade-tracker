import { NextResponse } from 'next/server'
import type { FeedItem } from '@/lib/feed'
import { looksLikeTrade } from '@/lib/trades'
import { detectTeams } from '@/lib/teams'

// Reddit's JSON API blocks datacenter IPs, but the Atom RSS feed is served.
const ENDPOINT = 'https://www.reddit.com/r/nba/hot.rss?limit=40'

export const revalidate = 0

function decode(s: string): string {
  return s
    .replace(/<!\[CDATA\[/g, '')
    .replace(/\]\]>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tag(block: string, name: string): string {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))
  return m ? decode(m[1]) : ''
}

function attr(block: string, name: string, a: string): string {
  const m = block.match(new RegExp(`<${name}[^>]*${a}="([^"]+)"`))
  return m ? m[1] : ''
}

export async function GET() {
  try {
    const res = await fetch(ENDPOINT, {
      headers: {
        'User-Agent': 'web:nba-trade-tracker:1.0 (by /u/nbatracker)',
        Accept: 'application/atom+xml',
      },
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`Reddit responded ${res.status}`)
    const xml = await res.text()

    const entries = xml.split('<entry>').slice(1)
    const items: FeedItem[] = entries.map((entry) => {
      const title = tag(entry, 'title')
      const id = tag(entry, 'id')
      const url = attr(entry, 'link', 'href')
      const author = tag(entry, 'name') || 'r/NBA'
      const createdAt = tag(entry, 'updated') || tag(entry, 'published') || new Date().toISOString()
      return {
        id: id || url,
        source: 'reddit' as const,
        author,
        handle: 'r/nba',
        text: title,
        url,
        createdAt,
        isTrade: looksLikeTrade(title),
        teams: detectTeams(title),
      }
    })

    return NextResponse.json({ items }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    return NextResponse.json(
      { items: [], error: err instanceof Error ? err.message : 'Failed to load r/NBA feed' },
      { status: 200 },
    )
  }
}
