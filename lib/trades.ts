import { getTeam, TEAMS } from './teams'

// Every word that appears in a team city or nickname — used to reject
// candidate "player names" that are really team references (e.g. "The Lakers").
const TEAM_WORDS = new Set(
  TEAMS.flatMap((t) => [...t.aliases, t.city, t.name])
    .join(' ')
    .toLowerCase()
    .split(/\s+/),
)

export type AssetKind = 'player' | 'pick' | 'cash' | 'rights'

export interface TradeAsset {
  kind: AssetKind
  /** Player name, pick description, or cash amount. */
  label: string
  /** Optional secondary detail (position, contract, protections). */
  detail?: string
}

export interface TradeParty {
  teamId: string
  /** Assets this team RECEIVES in the deal. */
  receives: TradeAsset[]
}

export interface Trade {
  id: string
  /** ISO timestamp of the trade / report. */
  date: string
  /** Short auto-generated (or curated) one-line summary. */
  headline: string
  /** Full original report text, when the trade came from a live feed post. */
  fullText?: string
  parties: TradeParty[]
  /** "reported" = rumor / agreed, "official" = league-confirmed. */
  status: 'reported' | 'official'
  source: string
  sourceUrl?: string
  /** True when derived from a live feed post rather than curated data. */
  live?: boolean
}

/**
 * Curated recent trades with full asset detail. These power the visualization
 * board with reliable, richly-structured data. Live-parsed trades from the
 * BlueSky/Reddit feed are merged in on top of these.
 */
export const SEED_TRADES: Trade[] = [
  {
    id: 'seed-luka-ad',
    date: '2025-02-02T05:00:00.000Z',
    headline: 'Lakers land Luka Dončić in blockbuster with Mavericks',
    status: 'official',
    source: 'Curated',
    parties: [
      {
        teamId: 'LAL',
        receives: [
          { kind: 'player', label: 'Luka Dončić', detail: 'G · 5x All-NBA' },
          { kind: 'player', label: 'Maxi Kleber', detail: 'F/C' },
          { kind: 'player', label: 'Markieff Morris', detail: 'F' },
        ],
      },
      {
        teamId: 'DAL',
        receives: [
          { kind: 'player', label: 'Anthony Davis', detail: 'F/C · All-Star' },
          { kind: 'player', label: 'Max Christie', detail: 'G' },
          { kind: 'pick', label: '2029 1st-round pick', detail: 'Lakers' },
        ],
      },
    ],
  },
  {
    id: 'seed-kd-suns',
    date: '2025-07-06T14:00:00.000Z',
    headline: 'Rockets acquire Kevin Durant from Suns in seven-team deal',
    status: 'official',
    source: 'Curated',
    parties: [
      {
        teamId: 'HOU',
        receives: [{ kind: 'player', label: 'Kevin Durant', detail: 'F · 15x All-Star' }],
      },
      {
        teamId: 'PHX',
        receives: [
          { kind: 'player', label: 'Jalen Green', detail: 'G' },
          { kind: 'player', label: 'Dillon Brooks', detail: 'F' },
          { kind: 'pick', label: '2025 No. 10 pick', detail: 'Khaman Maluach' },
          { kind: 'pick', label: 'Five 2nd-round picks' },
        ],
      },
    ],
  },
  {
    id: 'seed-mikal-knicks',
    date: '2024-06-25T18:00:00.000Z',
    headline: 'Knicks acquire Mikal Bridges from Nets',
    status: 'official',
    source: 'Curated',
    parties: [
      {
        teamId: 'NYK',
        receives: [{ kind: 'player', label: 'Mikal Bridges', detail: 'F/G' }],
      },
      {
        teamId: 'BKN',
        receives: [
          { kind: 'player', label: 'Bojan Bogdanović', detail: 'F' },
          { kind: 'pick', label: '2025 1st (NYK)' },
          { kind: 'pick', label: '2027 1st (NYK)' },
          { kind: 'pick', label: '2029 1st (NYK)' },
          { kind: 'pick', label: '2031 1st (NYK)' },
          { kind: 'pick', label: '2025 1st (MIL, via NYK)' },
        ],
      },
    ],
  },
]

// A capitalized word followed by 1–3 more capitalized words, joined by spaces
// or hyphens. Each part must start uppercase so trailing connective words
// ("from the", "and a") aren't swallowed. Unicode-aware so diacritics
// (Dončić, Jokić) and hyphenated surnames (Gilgeous-Alexander) stay whole.
const PLAYER_NAME =
  /\p{Lu}[\p{Ll}\p{M}'’]+(?:[-\s]+\p{Lu}[\p{Ll}\p{M}'’]+){1,3}/gu

const TRADE_KEYWORDS = [
  'trade',
  'traded',
  'trading',
  'acquire',
  'acquiring',
  'acquired',
  'in exchange',
  'sending',
  'deal',
  'agree',
  'agreed',
  'sign-and-trade',
]

const PICK_HINT = /(20\d\d)[^.,;]{0,24}?(first|second|1st|2nd)\s*[- ]?round(?:\s*pick)?/gi
const CASH_HINT = /\$[\d.]+\s*(million|m\b|k)?/gi

// Verbs whose subject team RECEIVES the assets that follow.
const RECEIVE_VERB = /\b(acquir\w*|land\w*|get\w*|receiv\w*|add\w*|nab\w*)\b/i
// Verbs whose subject team SENDS the assets that follow (the other team gets them).
const SEND_VERB = /\b(trad\w*|send\w*|sent|deal\w*|ship\w*|mov\w*|offload\w*)\b/i
// Splits the two halves of a swap.
const CONNECTOR = /\b(in exchange for|in return for|in exchange|in return)\b/i

export function looksLikeTrade(text: string): boolean {
  const lower = text.toLowerCase()
  return TRADE_KEYWORDS.some((k) => lower.includes(k))
}

const NON_NAME =
  /\b(NBA|ESPN|Athletic|Sources?|Breaking|Today|Free|Agency|Special|Joining|Star|All|Draft|Summer|League|Report|Update|Deal|Trade|Sign|Contract|Season|Finals|Playoffs|Western|Eastern|Conference|Bird|Rights|Player|Option|Team|Front|Office|President|General|Manager|Head|Coach|First|Second|Round|Pick|Selection|Million|Dollar|Year)\b/i

/** Locate the first mention of each team, keeping character positions. */
function teamPositions(text: string): { id: string; index: number }[] {
  const lower = ` ${text.toLowerCase()} `
  const hits: { id: string; index: number }[] = []
  for (const team of TEAMS) {
    let best = -1
    for (const alias of team.aliases) {
      const idx = lower.indexOf(` ${alias} `)
      if (idx !== -1 && (best === -1 || idx < best)) best = idx
    }
    if (best !== -1) hits.push({ id: team.id, index: best })
  }
  return hits.sort((a, b) => a.index - b.index)
}

interface PositionedAsset extends TradeAsset {
  index: number
}

/** Extract players / picks / cash with their character positions. */
function extractAssets(text: string): PositionedAsset[] {
  const assets: PositionedAsset[] = []
  const seen = new Set<string>()

  for (const m of text.matchAll(PLAYER_NAME)) {
    const raw = m[0].replace(/^The\s+/i, '').trim()
    // Require a first + last name (a space), and drop obvious non-players.
    if (!/\s/.test(raw)) continue
    if (NON_NAME.test(raw)) continue
    if (raw.toLowerCase().split(/[\s-]+/).some((w) => TEAM_WORDS.has(w))) continue
    const key = `player:${raw.toLowerCase()}`
    if (seen.has(key)) continue
    seen.add(key)
    assets.push({ kind: 'player', label: raw, index: m.index ?? 0 })
  }

  for (const m of text.matchAll(PICK_HINT)) {
    const label = m[0].replace(/\s+/g, ' ').trim()
    const key = `pick:${label.toLowerCase()}`
    if (seen.has(key)) continue
    seen.add(key)
    assets.push({ kind: 'pick', label, index: m.index ?? 0 })
  }

  for (const m of text.matchAll(CASH_HINT)) {
    const label = m[0].trim()
    const key = `cash:${label.toLowerCase()}`
    if (seen.has(key)) continue
    seen.add(key)
    assets.push({ kind: 'cash', label, index: m.index ?? 0 })
  }

  return assets.sort((a, b) => a.index - b.index)
}

/** Build a compact "Team get X +N · Team get Y" summary from parsed parties. */
export function summarizeTrade(parties: TradeParty[]): string {
  const parts = parties
    .filter((p) => p.receives.length > 0)
    .map((p) => {
      const team = getTeam(p.teamId)
      const name = team?.name ?? p.teamId
      const head = p.receives[0].label
      const rest = p.receives.length - 1
      return rest > 0 ? `${name} get ${head} +${rest}` : `${name} get ${head}`
    })
  return parts.join(' · ')
}

/**
 * Heuristic parser: turn a free-text report into a best-effort structured
 * Trade with directionally-correct asset assignment. Returns null when we
 * can't confidently identify two teams or any moving assets.
 *
 * Strategy: find the primary verb (receive- vs send-type) and the subject
 * team that owns it, then split the assets at the swap connector
 * ("in exchange for"). The half before the connector belongs to the receiving
 * side; the half after belongs to the other side.
 */
export function parseTrade(opts: {
  id: string
  text: string
  date: string
  source: string
  sourceUrl?: string
}): Trade | null {
  const { id, text, date, source, sourceUrl } = opts
  if (!looksLikeTrade(text)) return null

  const teams = teamPositions(text)
  if (teams.length < 2) return null
  const teamA = teams[0]
  const teamB = teams[1]

  const assets = extractAssets(text)
  if (assets.length === 0) return null

  // Locate the primary verb and its type.
  const recvMatch = text.match(RECEIVE_VERB)
  const sendMatch = text.match(SEND_VERB)
  const recvIdx = recvMatch?.index ?? Infinity
  const sendIdx = sendMatch?.index ?? Infinity
  const verbIndex = Math.min(recvIdx, sendIdx)
  const isReceiveVerb = recvIdx <= sendIdx

  // Subject = the last team mentioned at or before the verb (the team acting).
  const before = teams.filter((t) => t.index <= verbIndex)
  const subjectId = (before.length > 0 ? before[before.length - 1] : teamA).id
  const otherId = subjectId === teamA.id ? teamB.id : teamA.id

  // Split assets at the swap connector.
  const conn = text.match(CONNECTOR)
  const connIndex = conn?.index ?? Infinity
  const side1 = assets.filter((a) => a.index < connIndex)
  const side2 = assets.filter((a) => a.index >= connIndex)

  // Direction: receive-verb → subject gets the first half; send-verb → the
  // other team gets the first half (the subject is giving it up).
  const firstHalfTeam = isReceiveVerb ? subjectId : otherId
  const secondHalfTeam = firstHalfTeam === subjectId ? otherId : subjectId

  const bucket = new Map<string, TradeAsset[]>([
    [subjectId, []],
    [otherId, []],
  ])
  const strip = ({ index: _i, ...rest }: PositionedAsset): TradeAsset => rest
  side1.forEach((a) => bucket.get(firstHalfTeam)!.push(strip(a)))
  side2.forEach((a) => bucket.get(secondHalfTeam)!.push(strip(a)))

  const parties: TradeParty[] = [
    { teamId: firstHalfTeam, receives: bucket.get(firstHalfTeam)! },
    { teamId: secondHalfTeam, receives: bucket.get(secondHalfTeam)! },
  ].filter((p) => p.receives.length > 0)

  if (parties.length === 0) return null

  const summary = summarizeTrade(parties)

  return {
    id,
    date,
    headline: summary || (text.length > 100 ? `${text.slice(0, 97)}…` : text),
    fullText: text,
    parties,
    status: /official|complete|finaliz/i.test(text) ? 'official' : 'reported',
    source,
    sourceUrl,
    live: true,
  }
}
