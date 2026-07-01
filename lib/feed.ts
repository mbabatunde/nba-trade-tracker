export interface FeedItem {
  id: string
  source: 'bluesky' | 'reddit'
  author: string
  handle?: string
  avatar?: string
  text: string
  url: string
  createdAt: string
  isTrade: boolean
  /** Team ids referenced in the post. */
  teams: string[]
}
