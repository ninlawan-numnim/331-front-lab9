<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { AuctionItem } from '@/types'
import AuctionService from '@/services/AuctionService'
import BaseInput from '@/components/BaseInput.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const auctionItems = ref<AuctionItem[]>([])
const searchDescription = ref('')
const searchType = ref('')
const maxBid = ref<number | undefined>(undefined)

// ✅ Helper: safely get the highest bid
const getHighestBid = (item: AuctionItem): number => {
  if (!item.bids || item.bids.length === 0) return 0
  return Math.max(...item.bids.map(bid => bid.amount))
}

// ✅ Filtered items
const filteredItems = computed(() => {
  return auctionItems.value.filter(item => {
    const matchDescription =
      !searchDescription.value ||
      item.description.toLowerCase().includes(searchDescription.value.toLowerCase())

    const matchType =
      !searchType.value ||
      item.type.toLowerCase().includes(searchType.value.toLowerCase())

    const matchBid =
      !maxBid.value ||
      (item.successfulBid !== undefined &&
        item.successfulBid !== null &&
        item.successfulBid <= maxBid.value)

    return matchDescription && matchType && matchBid
  })
})

// ✅ Fetch auctions
const fetchAuctionItems = async () => {
  try {
    const response = await AuctionService.getAuctionItems()
    auctionItems.value = response.data
  } catch (error) {
    console.error('Error loading auctions:', error)
    router.push({ name: 'network-error-view' })
  }
}

onMounted(() => {
  fetchAuctionItems()
})
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-center mb-6">Auction Items</h1>

    <!-- 🔍 Search Filters -->
    <div class="mb-6 flex flex-wrap gap-4 justify-center">
      <BaseInput
        v-model="searchDescription"
        type="text"
        label="Search by description"
        class="w-64"
      />
      <BaseInput
        v-model="searchType"
        type="text"
        label="Search by type"
        class="w-64"
      />
      <BaseInput
        v-model.number="maxBid"
        type="number"
        label="Max Successful Bid"
        placeholder="e.g., 500"
        class="w-64"
      />
    </div>

    <!-- 🧾 Auction Items Grid -->
    <div
      v-if="filteredItems.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        @click="router.push({ name: 'auction-detail-view', params: { id: item.id } })"
      >
        <h3 class="text-xl font-semibold mb-2">{{ item.description }}</h3>
        <p class="text-gray-600 mb-2">Type: {{ item.type }}</p>

        <div class="mt-4 pt-4 border-t">
          <p class="text-sm text-gray-700">
            <strong>Bids:</strong> {{ item.bids?.length || 0 }}
          </p>
          <p class="text-sm text-gray-700">
            <strong>Highest Bid:</strong> ${{ getHighestBid(item).toFixed(2) }}
          </p>

          <p
            v-if="item.successfulBid"
            class="text-green-600 font-semibold mt-2"
          >
            ✓ Sold for ${{ item.successfulBid.toFixed(2) }}
          </p>
          <p v-else class="text-blue-600 mt-2">
            🔥 Open for bidding
          </p>
        </div>
      </div>
    </div>

    <!-- ❌ No Results -->
    <div v-else class="text-center text-gray-500 py-8">
      <p>No auction items found</p>
    </div>
  </div>
</template>
