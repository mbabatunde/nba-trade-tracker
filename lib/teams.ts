export interface Team {
  id: string
  abbr: string
  city: string
  name: string
  fullName: string
  conference: 'East' | 'West'
  /**
   * Brand colors. These are intentionally raw hex values: an NBA product must
   * render each franchise in its real identity color. They are only ever used
   * inside team badges / accent stripes — never for app chrome, which uses
   * Primer tokens exclusively.
   */
  primary: string
  secondary: string
  /** Lowercased strings used to detect this team inside free-text posts. */
  aliases: string[]
}

export const TEAMS: Team[] = [
  { id: 'ATL', abbr: 'ATL', city: 'Atlanta', name: 'Hawks', fullName: 'Atlanta Hawks', conference: 'East', primary: '#E03A3E', secondary: '#26282A', aliases: ['hawks', 'atlanta'] },
  { id: 'BOS', abbr: 'BOS', city: 'Boston', name: 'Celtics', fullName: 'Boston Celtics', conference: 'East', primary: '#007A33', secondary: '#BA9653', aliases: ['celtics', 'boston'] },
  { id: 'BKN', abbr: 'BKN', city: 'Brooklyn', name: 'Nets', fullName: 'Brooklyn Nets', conference: 'East', primary: '#000000', secondary: '#FFFFFF', aliases: ['nets', 'brooklyn'] },
  { id: 'CHA', abbr: 'CHA', city: 'Charlotte', name: 'Hornets', fullName: 'Charlotte Hornets', conference: 'East', primary: '#1D1160', secondary: '#00788C', aliases: ['hornets', 'charlotte'] },
  { id: 'CHI', abbr: 'CHI', city: 'Chicago', name: 'Bulls', fullName: 'Chicago Bulls', conference: 'East', primary: '#CE1141', secondary: '#000000', aliases: ['bulls', 'chicago'] },
  { id: 'CLE', abbr: 'CLE', city: 'Cleveland', name: 'Cavaliers', fullName: 'Cleveland Cavaliers', conference: 'East', primary: '#860038', secondary: '#FDBB30', aliases: ['cavaliers', 'cavs', 'cleveland'] },
  { id: 'DAL', abbr: 'DAL', city: 'Dallas', name: 'Mavericks', fullName: 'Dallas Mavericks', conference: 'West', primary: '#00538C', secondary: '#B8C4CA', aliases: ['mavericks', 'mavs', 'dallas'] },
  { id: 'DEN', abbr: 'DEN', city: 'Denver', name: 'Nuggets', fullName: 'Denver Nuggets', conference: 'West', primary: '#0E2240', secondary: '#FEC524', aliases: ['nuggets', 'denver'] },
  { id: 'DET', abbr: 'DET', city: 'Detroit', name: 'Pistons', fullName: 'Detroit Pistons', conference: 'East', primary: '#C8102E', secondary: '#1D42BA', aliases: ['pistons', 'detroit'] },
  { id: 'GSW', abbr: 'GSW', city: 'Golden State', name: 'Warriors', fullName: 'Golden State Warriors', conference: 'West', primary: '#1D428A', secondary: '#FFC72C', aliases: ['warriors', 'golden state', 'dubs', 'gsw'] },
  { id: 'HOU', abbr: 'HOU', city: 'Houston', name: 'Rockets', fullName: 'Houston Rockets', conference: 'West', primary: '#CE1141', secondary: '#C4CED4', aliases: ['rockets', 'houston'] },
  { id: 'IND', abbr: 'IND', city: 'Indiana', name: 'Pacers', fullName: 'Indiana Pacers', conference: 'East', primary: '#002D62', secondary: '#FDBB30', aliases: ['pacers', 'indiana'] },
  { id: 'LAC', abbr: 'LAC', city: 'LA', name: 'Clippers', fullName: 'LA Clippers', conference: 'West', primary: '#C8102E', secondary: '#1D428A', aliases: ['clippers', 'la clippers'] },
  { id: 'LAL', abbr: 'LAL', city: 'Los Angeles', name: 'Lakers', fullName: 'Los Angeles Lakers', conference: 'West', primary: '#552583', secondary: '#FDB927', aliases: ['lakers'] },
  { id: 'MEM', abbr: 'MEM', city: 'Memphis', name: 'Grizzlies', fullName: 'Memphis Grizzlies', conference: 'West', primary: '#5D76A9', secondary: '#12173F', aliases: ['grizzlies', 'memphis', 'grizz'] },
  { id: 'MIA', abbr: 'MIA', city: 'Miami', name: 'Heat', fullName: 'Miami Heat', conference: 'East', primary: '#98002E', secondary: '#F9A01B', aliases: ['heat', 'miami'] },
  { id: 'MIL', abbr: 'MIL', city: 'Milwaukee', name: 'Bucks', fullName: 'Milwaukee Bucks', conference: 'East', primary: '#00471B', secondary: '#EEE1C6', aliases: ['bucks', 'milwaukee'] },
  { id: 'MIN', abbr: 'MIN', city: 'Minnesota', name: 'Timberwolves', fullName: 'Minnesota Timberwolves', conference: 'West', primary: '#0C2340', secondary: '#236192', aliases: ['timberwolves', 'wolves', 'minnesota'] },
  { id: 'NOP', abbr: 'NOP', city: 'New Orleans', name: 'Pelicans', fullName: 'New Orleans Pelicans', conference: 'West', primary: '#0C2340', secondary: '#C8102E', aliases: ['pelicans', 'new orleans', 'pels'] },
  { id: 'NYK', abbr: 'NYK', city: 'New York', name: 'Knicks', fullName: 'New York Knicks', conference: 'East', primary: '#006BB6', secondary: '#F58426', aliases: ['knicks', 'new york'] },
  { id: 'OKC', abbr: 'OKC', city: 'Oklahoma City', name: 'Thunder', fullName: 'Oklahoma City Thunder', conference: 'West', primary: '#007AC1', secondary: '#EF3B24', aliases: ['thunder', 'oklahoma city', 'okc'] },
  { id: 'ORL', abbr: 'ORL', city: 'Orlando', name: 'Magic', fullName: 'Orlando Magic', conference: 'East', primary: '#0077C0', secondary: '#C4CED4', aliases: ['magic', 'orlando'] },
  { id: 'PHI', abbr: 'PHI', city: 'Philadelphia', name: '76ers', fullName: 'Philadelphia 76ers', conference: 'East', primary: '#006BB6', secondary: '#ED174C', aliases: ['76ers', 'sixers', 'philadelphia', 'philly'] },
  { id: 'PHX', abbr: 'PHX', city: 'Phoenix', name: 'Suns', fullName: 'Phoenix Suns', conference: 'West', primary: '#1D1160', secondary: '#E56020', aliases: ['suns', 'phoenix'] },
  { id: 'POR', abbr: 'POR', city: 'Portland', name: 'Trail Blazers', fullName: 'Portland Trail Blazers', conference: 'West', primary: '#E03A3E', secondary: '#000000', aliases: ['trail blazers', 'blazers', 'portland'] },
  { id: 'SAC', abbr: 'SAC', city: 'Sacramento', name: 'Kings', fullName: 'Sacramento Kings', conference: 'West', primary: '#5A2D81', secondary: '#63727A', aliases: ['kings', 'sacramento'] },
  { id: 'SAS', abbr: 'SAS', city: 'San Antonio', name: 'Spurs', fullName: 'San Antonio Spurs', conference: 'West', primary: '#C4CED4', secondary: '#000000', aliases: ['spurs', 'san antonio'] },
  { id: 'TOR', abbr: 'TOR', city: 'Toronto', name: 'Raptors', fullName: 'Toronto Raptors', conference: 'East', primary: '#CE1141', secondary: '#000000', aliases: ['raptors', 'toronto', 'raps'] },
  { id: 'UTA', abbr: 'UTA', city: 'Utah', name: 'Jazz', fullName: 'Utah Jazz', conference: 'West', primary: '#002B5C', secondary: '#00471B', aliases: ['jazz', 'utah'] },
  { id: 'WAS', abbr: 'WAS', city: 'Washington', name: 'Wizards', fullName: 'Washington Wizards', conference: 'East', primary: '#002B5C', secondary: '#E31837', aliases: ['wizards', 'washington', 'wiz'] },
]

const TEAM_BY_ID = new Map(TEAMS.map((t) => [t.id, t]))

export function getTeam(id: string): Team | undefined {
  return TEAM_BY_ID.get(id)
}

/**
 * Best-effort detection of team ids referenced in a chunk of free text.
 * Matches on nickname/city aliases. Returns ids in the order first mentioned.
 */
export function detectTeams(text: string): string[] {
  const lower = ` ${text.toLowerCase()} `
  const hits: { id: string; index: number }[] = []
  for (const team of TEAMS) {
    let best = -1
    for (const alias of team.aliases) {
      const idx = lower.indexOf(` ${alias} `)
      const idx2 = idx === -1 ? lower.indexOf(`${alias}`) : idx
      if (idx2 !== -1 && (best === -1 || idx2 < best)) best = idx2
    }
    if (best !== -1) hits.push({ id: team.id, index: best })
  }
  return hits.sort((a, b) => a.index - b.index).map((h) => h.id)
}
