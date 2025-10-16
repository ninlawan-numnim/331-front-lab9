<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuctionService from '@/services/AuctionService'
import type { AuctionItem, Bid } from '@/types'
import { useMessageStore } from '@/stores/message'
import BaseInput from '@/components/BaseInput.vue'

const route = useRoute()
const router = useRouter()
const messageStore = useMessageStore()

const auctionItem = ref<AuctionItem | null>(null)
const newBidAmount = ref<number>(0)
const loading = ref(false)

const auctionId = computed(() => parseInt(route.params.id as string))

const highestBid = computed(() => {
  if (!auctionItem.value || !auctionItem.value.bids || auctionItem.value.bids.length === 0) {
    return 0
  }
  return Math.max(...auctionItem.value.bids.map(bid => bid.amount))
})

const sortedBids = computed(() => {
  if (!auctionItem.value || !auctionItem.value.bids) return []
  return [...auctionItem.value.bids].sort((a, b) => b.amount - a.amount)
})

const isAuctionOpen = computed(() => {
  return auctionItem.value && !auctionItem.value.successfulBid
})

const minimumBid = computed(() => {
  return highestBid.value + 1
})

const fetchAuctionItem = async () => {
  try {
    const response = await AuctionService.getAuctionItem(auctionId.value)
    auctionItem.value = response.data
    newBidAmount.value = minimumBid.value
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      router.push({ name: '404-resource-view', params: { resource: 'auction' } })
    } else {
      router.push({ name: 'network-error-view' })
    }
  }
}

const placeBid = async () => {
  if (!auctionItem.value) return
  
  if (newBidAmount.value < minimumBid.value) {
    alert(`Bid must be at least $${minimumBid.value.toFixed(2)}`)
    return
  }

  loading.value = true

  try {
    const bid: Partial<Bid> = {
      amount: newBidAmount.value,
      datetime: new Date().toISOString(),
      itemId: auctionItem.value.id
    }

    await AuctionService.createBid(bid)
    messageStore.updateMessage(`Bid of $${newBidAmount.value.toFixed(2)} placed successfully!`)
    setTimeout(() => messageStore.resetMessage(), 3000)
    
    // Refresh auction data
    await fetchAuctionItem()
  } catch (error) {
    console.error(error)
    alert('Failed to place bid. Please try again.')
  } finally {
    loading.value = false
  }
}

const closeAuction = async () => {
  if (!auctionItem.value || !confirm('Are you sure you want to close this auction?')) return

  loading.value = true

  try {
    await AuctionService.updateAuctionItem(auctionItem.value.id, {
      successfulBid: highestBid.value
    })
    
    messageStore.updateMessage(`Auction closed! Winning bid: $${highestBid.value.toFixed(2)}`)
    setTimeout(() => messageStore.resetMessage(), 3000)
    
    await fetchAuctionItem()
  } catch (error) {
    console.error(error)
    alert('Failed to close auction.')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

onMounted(() => {
  fetchAuctionItem()
})
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <div v-if="auctionItem" class="bg-white rounded-lg shadow-lg p-6">
      <!-- Header -->
      <div class="border-b pb-4 mb-4">
        <h1 class="text-3xl font-bold mb-2">{{ auctionItem.description }}</h1>
        <p class="text-gray-600">Type: <span class="font-semibold">{{ auctionItem.type }}</span></p>
      </div>

      <!-- Status Badge -->
      <div class="mb-6">
        <span 
          v-if="isAuctionOpen"
          class="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold"
        >
          🔥 Open for Bidding
        </span>
        <span 
          v-else
          class="inline-block bg-red-100 text-red-800 px-4 py-2 rounded-full font-semibold"
        >
          ✓ Auction Closed - Sold for ${{ auctionItem.successfulBid?.toFixed(2) }}
        </span>
      </div>

      <!-- Current Highest Bid -->
      <div class="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 class="text-xl font-semibold mb-2">Current Highest Bid</h2>
        <p class="text-3xl font-bold text-blue-600">${{ highestBid.toFixed(2) }}</p>
        <p class="text-sm text-gray-600 mt-1">{{ sortedBids.length }} bid(s) placed</p>
      </div>

      <!-- Place Bid Form (only if auction is open) -->
      <div v-if="isAuctionOpen" class="mb-6 p-4 border-2 border-blue-200 rounded-lg">
        <h2 class="text-xl font-semibold mb-4">Place Your Bid</h2>
        <form @submit.prevent="placeBid" class="flex gap-4 items-end">
          <div class="flex-1">
            <BaseInput
              v-model.number="newBidAmount"
              type="number"
              label="Your Bid Amount"
              :min="minimumBid"
              step="0.01"
              required
            />
            <p class="text-sm text-gray-600 -mt-4">
              Minimum bid: ${{ minimumBid.toFixed(2) }}
            </p>
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg disabled:bg-gray-400 font-semibold h-12"
          >
            {{ loading ? 'Placing...' : 'Place Bid' }}
          </button>
        </form>
      </div>

      <!-- Close Auction Button (admin feature) -->
      <div v-if="isAuctionOpen && sortedBids.length > 0" class="mb-6">
        <button
          @click="closeAuction"
          :disabled="loading"
          class="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg disabled:bg-gray-400 font-semibold"
        >
          {{ loading ? 'Closing...' : 'Close Auction (Admin)' }}
        </button>
      </div>

      <!-- Bid History -->
      <div class="mt-6">
        <h2 class="text-2xl font-semibold mb-4">Bid History</h2>
        <div v-if="sortedBids.length > 0" class="space-y-2">
          <div
            v-for="(bid, index) in sortedBids"
            :key="bid.id"
            class="flex justify-between items-center p-3 rounded-lg"
            :class="index === 0 ? 'bg-yellow-50 border-2 border-yellow-400' : 'bg-gray-50'"
          >
            <div>
              <span v-if="index === 0" class="text-yellow-600 font-bold mr-2">👑 Leading</span>
              <span class="font-semibold text-lg">${{ bid.amount.toFixed(2) }}</span>
            </div>
            <div class="text-sm text-gray-600">
              {{ formatDate(bid.datetime) }}
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 py-8">
          <p>No bids yet. Be the first to bid!</p>
        </div>
      </div>

      <!-- Back Button -->
      <div class="mt-6">
        <button
          @click="router.push({ name: 'auction-list-view' })"
          class="text-blue-500 hover:text-blue-600 font-semibold"
        >
          ← Back to Auction List
        </button>
      </div>
    </div>

    <div v-else class="text-center py-8">
      <p>Loading auction details...</p>
    </div>
  </div>
</template>