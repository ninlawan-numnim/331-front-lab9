<script setup lang="ts">
import EventCard from '@/components/EventCard.vue'
import { type Event } from '@/types'
import { ref, computed, watch } from 'vue'
import EventService from '@/services/EventService'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/BaseInput.vue'

const router = useRouter()

const events = ref<Event[]>([])
const totalEvents = ref(0)
const keyword = ref('')

const props = defineProps({
  page: {
    type: Number,
    required: true
  }
})

const page = computed(() => props.page)
const hasNextPage = computed(() => {
  const totalPages = Math.ceil(totalEvents.value / 3)
  return page.value < totalPages
})

// Function to fetch events based on keyword or page
const fetchEvents = () => {
  const queryFunction = keyword.value.trim() === ''
    ? EventService.getEvents(3, page.value)
    : EventService.getEventsByKeyword(keyword.value.trim(), 3, page.value)
  
  queryFunction
    .then((response) => {
      events.value = response.data
      totalEvents.value = Number(response.headers['x-total-count'])
      console.log('events', events.value)
      console.log('totalEvents', totalEvents.value)
    })
    .catch(() => {
      router.push({ name: 'network-error-view' })
    })
}

// Watch for page changes
watch(page, () => {
  fetchEvents()
}, { immediate: true })

// Watch for keyword changes
watch(keyword, () => {
  fetchEvents()
})
</script>

<template>
  <h1>Events For Good</h1>

  <div class="flex flex-col items-center">
    <div class="w-64">
      <BaseInput 
        v-model="keyword"
        type="text"
        label="Search events..." 
      />
    </div>
    
    <div v-if="events.length > 0">
      <EventCard
        v-for="event in events"
        :key="event.id"
        :event="event"
      />
    </div>
    <div v-else>
      <p>Loading events...</p>
    </div>

    <!-- Pagination -->
    <div class="pagination mt-4">
      <RouterLink
        id="page-prev"
        :to="{ name: 'event-list-view', query: { page: page - 1 } }"
        rel="prev"
        v-if="page > 1"
      >
        &#60; Prev Page
      </RouterLink>

      <RouterLink
        id="page-next"
        :to="{ name: 'event-list-view', query: { page: page + 1 } }"
        rel="next"
        v-if="hasNextPage"
      >
        Next Page &#62;
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  width: 290px;
}
.pagination a {
  flex: 1;
  text-decoration: none;
  color: #2c3e50;
}
#page-prev {
  text-align: left;
}
#page-next {
  text-align: right;
}
</style>