import axios, { AxiosResponse } from 'axios'
import type { AuctionItem, Bid } from '@/types'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default {
  // Get all auction items
  getAuctionItems(): Promise<AxiosResponse<AuctionItem[]>> {
    return apiClient.get<AuctionItem[]>('/auctionItems?_embed=bids')
  },

  // Get auction item by ID with bids embedded
  getAuctionItem(id: number): Promise<AxiosResponse<AuctionItem>> {
    return apiClient.get<AuctionItem>(`/auctionItems/${id}?_embed=bids`)
  },

  // Query auction item by description
  getAuctionItemByDescription(description: string): Promise<AxiosResponse<AuctionItem[]>> {
    return apiClient.get<AuctionItem[]>(`/auctionItems?description_like=${description}&_embed=bids`)
  },

  // Query auction items where successfulBid is less than specific value
  getAuctionItemsBySuccessfulBid(maxBid: number): Promise<AxiosResponse<AuctionItem[]>> {
    return apiClient.get<AuctionItem[]>(`/auctionItems?successfulBid_lte=${maxBid}&_embed=bids`)
  },

  // Create new auction item
  createAuctionItem(auctionItem: Partial<AuctionItem>): Promise<AxiosResponse<AuctionItem>> {
    return apiClient.post<AuctionItem>('/auctionItems', auctionItem)
  },

  // Create new bid for an auction item
  createBid(bid: Partial<Bid>): Promise<AxiosResponse<Bid>> {
    return apiClient.post<Bid>('/bids', bid)
  },

  // Update auction item (for setting successfulBid)
  updateAuctionItem(id: number, data: Partial<AuctionItem>): Promise<AxiosResponse<AuctionItem>> {
    return apiClient.patch<AuctionItem>(`/auctionItems/${id}`, data)
  },

  // Search auction items by description and type
  searchAuctionItems(description?: string, type?: string): Promise<AxiosResponse<AuctionItem[]>> {
    let url = '/auctionItems?_embed=bids'
    if (description) {
      url += `&description_like=${description}`
    }
    if (type) {
      url += `&type=${type}`
    }
    return apiClient.get<AuctionItem[]>(url)
  }
}