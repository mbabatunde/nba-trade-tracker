import { detectTeams, TEAMS } from './teams'

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
  headline: string
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

const PLAYER_NAME = /\b([A-Z][a-zç'’.-]+(?:\s+[A-Z][a-zç'’.-]+){1,2})\b/g

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

const PICK_HINT = /(20\d\d).{0,24}?(first|second|1st|2nd)\s*[- ]?round(?:\s*pick)?/gi
const CASH_HINT = /\$[\d.]+\s*(million|m\b|k)?/gi

export function looksLikeTrade(text: string): boolean {
  const lower = text.toLowerCase()
  return TRADE_KEYWORDS.some((k) => lower.includes(k))
}

/**
 * Heuristic parser: turn a free-text report into a best-effort structured
 * Trade. Returns null when we can't confidently identify two teams.
 * Real trade wording is messy, so this favors a clean two-team summary and
 * always keeps the raw text visible in the source card.
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

  const teamIds = detectTeams(text)
  const unique = Array.from(new Set(teamIds))
  if (unique.length < 2) return null

  const [teamA, teamB] = unique

  // Extract candidate player names, dropping obvious non-players.
  const NON_NAME =
    /\b(NBA|ESPN|Athletic|Sources?|Breaking|Today|Free|Agency|Special|Joining|Star|All|Draft|Summer|League|Report|Update|Deal|Trade|Sign|Contract|Season|Finals|Playoffs|Western|Eastern|Conference|Bird|Rights|Player|Option|Team|Front|Office|President|General|Manager|Head|Coach|First|Second|Round|Pick|Selection|Million|Dollar|Year|Season)\b/i
  const names = Array.from(new Set((text.match(PLAYER_NAME) || []).map((n) => n.trim())))
    .map((n) => n.replace(/^The\s+/i, '').trim())
    .filter((n) => n.split(' ').length >= 2)
    .filter((n) => !NON_NAME.test(n))
    // Reject if any word in the candidate is a team city/nickname word.
    .filter((n) => !n.toLowerCase().split(/\s+/).some((w) => TEAM_WORDS.has(w)))
    .slice(0, 6)

  const picks = Array.from(new Set(text.match(PICK_HINT) || [])).slice(0, 4)
  const cash = Array.from(new Set(text.match(CASH_HINT) || [])).slice(0, 2)

  // Without deep NL understanding we can't reliably split who-gets-what, so we
  // present detected players as the headline movers going to the second team
  // and picks/cash as the return. This is clearly labeled as an auto-summary.
  const parties: TradeParty[] = [
    {
      teamId: teamB,
      receives: names.slice(0, 3).map((label) => ({ kind: 'player' as const, label })),
    },
    {
      teamId: teamA,
      receives: [
        ...names.slice(3).map((label) => ({ kind: 'player' as const, label })),
        ...picks.map((label) => ({ kind: 'pick' as const, label: label.replace(/\s+/g, ' ') })),
        ...cash.map((label) => ({ kind: 'cash' as const, label })),
      ],
    },
  ]

  if (parties[0].receives.length === 0 && parties[1].receives.length === 0) return null

  return {
    id,
    date,
    headline: text.length > 120 ? `${text.slice(0, 117)}…` : text,
    parties,
    status: /official|complete|finaliz/i.test(text) ? 'official' : 'reported',
    source,
    sourceUrl,
    live: true,
  }
}
