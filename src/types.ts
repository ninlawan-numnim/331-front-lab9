export interface Event {
  id: number
  category: string
  title: string
  description: string
  location: string
  date: string
  time: string
  petAllowed: boolean
  organizer: Organizer
}

export interface Organizer {
  id: number
 name: string
}

export interface MessageState {
  message: string
}

export interface EventState {
  event: Event | null
}

export interface OrganizerState {
  organizer: Organizer | null
}
export type EventItem = Event  // alias ของ Event
export interface AuctionItem {
  id: number
  description: string
  type: string
  bids: Bid[]
  successfulBid?: number | null
}
export interface Bid {
  id: number
  amount: number
  datetime: string
  itemId: number
}

export interface AuctionItemState {
  auctionItem: AuctionItem | null
}