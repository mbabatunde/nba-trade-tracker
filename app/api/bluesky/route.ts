import { NextResponse } from 'next/server'
import type { FeedItem } from '@/lib/feed'
import { looksLikeTrade } from '@/lib/trades'
import { detectTeams } from '@/lib/teams'

const ACTOR = 'shamsbot.bsky.social'
const ENDPOINT = `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${ACTOR}&limit=50&filter=posts_no_replies`

export const revalidate = 0

interface BskyPost {
  post: {
    uri: string
    author: { handle: string; displayName?: string; avatar?: string }
    record: { text?: string; createdAt?: string }
    indexedAt: string
  }
}

function uriToUrl(uri: string, handle: string): string {
  const rkey = uri.split('/').pop()
  return `https://bsky.app/profile/${handle}/post/${rkey}`
}

export async function GET() {
  try {
    const res = await fetch(ENDPOINT, {
      headers: { 'User-Agent': 'nba-trade-tracker/1.0', Accept: 'application/json' },
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`BlueSky responded ${res.status}`)
    const data = (await res.json()) as { feed: BskyPost[] }

    const items: FeedItem[] = (data.feed || [])
      .map(({ post }) => {
        const text = post.record?.text?.trim() || ''
        return {
          id: post.uri,
          source: 'bluesky' as const,
          author: post.author.displayName || 'Shams Charania',
          handle: post.author.handle,
          avatar: post.author.avatar,
          text,
          url: uriToUrl(post.uri, post.author.handle),
          createdAt: post.record?.createdAt || post.indexedAt,
          isTrade: looksLikeTrade(text),
          teams: detectTeams(text),
        }
      })
      .filter((i) => i.text.length > 0)

    return NextResponse.json({ items }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    return NextResponse.json(
      { items: [], error: err instanceof Error ? err.message : 'Failed to load BlueSky feed' },
      { status: 200 },
    )
  }
}
