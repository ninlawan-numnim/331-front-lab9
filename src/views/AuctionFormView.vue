<script setup lang="ts">
import { ref } from 'vue'
import AuctionService from '@/services/AuctionService'
import BaseInput from '@/components/BaseInput.vue'
import { useRouter } from 'vue-router'
import { useMessageStore } from '@/stores/message'

const router = useRouter()
const messageStore = useMessageStore()

const auctionItem = ref({
  description: '',
  type: '',
  bids: [],
  successfulBid: null
})

const loading = ref(false)

const saveAuctionItem = async () => {
  if (!auctionItem.value.description || !auctionItem.value.type) {
    alert('Please fill in all required fields')
    return
  }

  loading.value = true

  try {
    const response = await AuctionService.createAuctionItem(auctionItem.value)
    messageStore.updateMessage(`Auction item "${response.data.description}" created successfully!`)
    setTimeout(() => messageStore.resetMessage(), 3000)
    router.push({ name: 'auction-detail-view', params: { id: response.data.id }})
  } catch (error) {
    console.error(error)
    router.push({ name: 'network-error-view' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h1 class="text-3xl font-bold mb-6">Create New Auction Item</h1>

      <form @submit.prevent="saveAuctionItem" class="space-y-6">
        <BaseInput 
          v-model="auctionItem.description"
          type="text"
          label="Item Description"
          placeholder="Enter item description"
          required
        />

        <BaseInput 
          v-model="auctionItem.type"
          type="text"
          label="Item Type"
          placeholder="e.g., Electronics, Art, Collectibles"
          required
        />

        <div class="bg-blue-50 p-4 rounded-lg">
          <p class="text-sm text-blue-800">
            <strong>Note:</strong> The auction will start with no bids. Users can place bids once the item is created.
          </p>
        </div>

        <div class="flex gap-4">
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg disabled:bg-gray-400 font-semibold"
          >
            {{ loading ? 'Creating...' : 'Create Auction Item' }}
          </button>
          
          <button
            type="button"
            @click="router.push({ name: 'auction-list-view' })"
            class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>

      <div class="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 class="font-semibold mb-2">Preview:</h3>
        <pre class="text-sm">{{ auctionItem }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>