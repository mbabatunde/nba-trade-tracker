import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

/**
 * Proxies official NBA headshots so they load reliably from the browser
 * (the CDN blocks some cross-origin browser fetches). Only numeric IDs are
 * allowed, and responses are cached aggressively since headshots rarely change.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id') ?? ''

  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const upstream = `https://cdn.nba.com/headshots/nba/latest/1040x760/${id}.png`

  try {
    const res = await fetch(upstream, {
      headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://www.nba.com/' },
      cache: 'no-store',
    })
    if (!res.ok) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    const buf = await res.arrayBuffer()
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': res.headers.get('content-type') ?? 'image/png',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Fetch failed' }, { status: 502 })
  }
}
