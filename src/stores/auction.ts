import { defineStore } from 'pinia'
import type { AuctionItem, AuctionItemState } from '@/types'

export const useAuctionItemStore = defineStore('auctionItem', {
  state: (): AuctionItemState => ({
    auctionItem: null
  }),
  
  actions: {
    setAuctionItem(auctionItem: AuctionItem) {
      this.auctionItem = auctionItem
    },
    
    clearAuctionItem() {
      this.auctionItem = null
    }
  }
})