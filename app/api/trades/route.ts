import { NextResponse } from 'next/server'
import { SEED_TRADES, parseTrade, type Trade } from '@/lib/trades'

const ACTOR = 'shamsbot.bsky.social'
const ENDPOINT = `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${ACTOR}&limit=80&filter=posts_no_replies`

export const revalidate = 0

interface BskyPost {
  post: {
    uri: string
    author: { handle: string }
    record: { text?: string; createdAt?: string }
    indexedAt: string
  }
}

export async function GET() {
  let live: Trade[] = []
  try {
    const res = await fetch(ENDPOINT, {
      headers: { 'User-Agent': 'nba-trade-tracker/1.0', Accept: 'application/json' },
      cache: 'no-store',
    })
    if (res.ok) {
      const data = (await res.json()) as { feed: BskyPost[] }
      live = (data.feed || [])
        .map(({ post }) => {
          const text = post.record?.text?.trim() || ''
          const rkey = post.uri.split('/').pop()
          return parseTrade({
            id: post.uri,
            text,
            date: post.record?.createdAt || post.indexedAt,
            source: 'Shams Charania · BlueSky',
            sourceUrl: `https://bsky.app/profile/${post.author.handle}/post/${rkey}`,
          })
        })
        .filter((t): t is Trade => t !== null)
    }
  } catch {
    // fall back to seed data only
  }

  // Merge live-parsed trades ahead of curated seeds, newest first.
  const all = [...live, ...SEED_TRADES].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return NextResponse.json(
    { trades: all, liveCount: live.length },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
