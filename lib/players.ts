/**
 * Name -> NBA person ID lookup. Official headshots are served from the NBA CDN
 * at https://cdn.nba.com/headshots/nba/latest/1040x760/{personId}.png and do
 * not require auth. We keep a map of notable current/recent players so both the
 * curated seed trades and live-parsed feed names can show real profile photos.
 */
const PLAYER_IDS: Record<string, number> = {
  // Seed-trade players
  'luka doncic': 1629029,
  'maxi kleber': 1628467,
  'markieff morris': 202693,
  'anthony davis': 203076,
  'max christie': 1631108,
  'kevin durant': 201142,
  'jalen green': 1630224,
  'dillon brooks': 1628415,
  'mikal bridges': 1628969,
  'bojan bogdanovic': 202711,
  // Notable stars likely to appear in live reports
  'lebron james': 2544,
  'stephen curry': 201939,
  'giannis antetokounmpo': 203507,
  'nikola jokic': 203999,
  'joel embiid': 203954,
  'jayson tatum': 1628369,
  'jaylen brown': 1627759,
  'devin booker': 1626164,
  'damian lillard': 203081,
  'kyrie irving': 202681,
  'james harden': 201935,
  'kawhi leonard': 202695,
  'paul george': 202331,
  'jimmy butler': 202710,
  'bam adebayo': 1628389,
  'donovan mitchell': 1628378,
  'darius garland': 1629636,
  'trae young': 1629027,
  'ja morant': 1629630,
  'zion williamson': 1629627,
  'brandon ingram': 1627742,
  'de’aaron fox': 1628368,
  "de'aaron fox": 1628368,
  'domantas sabonis': 1627734,
  'shai gilgeous-alexander': 1628983,
  'anthony edwards': 1630162,
  'karl-anthony towns': 1626157,
  'rudy gobert': 203497,
  'lauri markkanen': 1628374,
  'pascal siakam': 1627783,
  'tyrese haliburton': 1630169,
  'victor wembanyama': 1641705,
  'chet holmgren': 1631096,
  'paolo banchero': 1631094,
  'franz wagner': 1630532,
  'jalen brunson': 1628973,
  'julius randle': 203944,
  'og anunoby': 1628384,
  'zach lavine': 203897,
  'demar derozan': 201942,
  'brook lopez': 201572,
  'khris middleton': 203114,
  'cj mccollum': 203468,
  'zach edey': 1642268,
  'khaman maluach': 1642349,
}

function normalize(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[.]/g, '')
    .trim()
}

/**
 * Return a same-origin URL for a player's official NBA headshot, or null if we
 * don't know the player. The image is proxied through /api/headshot because the
 * NBA CDN blocks direct cross-origin browser requests.
 */
export function headshotUrl(name: string): string | null {
  const id = PLAYER_IDS[normalize(name)]
  return id ? `/api/headshot?id=${id}` : null
}

/** Up to two uppercase initials from a name, for the fallback avatar. */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}
