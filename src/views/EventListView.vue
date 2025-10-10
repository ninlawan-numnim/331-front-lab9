<script setup lang="ts">
import EventCard from '@/components/EventCard.vue'
import { type Event } from '@/types'
import { ref, computed, watchEffect } from 'vue'
import EventService from '@/services/EventService'
import { useRouter } from 'vue-router'

const router = useRouter()

// ✅ ให้ค่าเริ่มต้นเป็น array ว่าง ป้องกัน null error ตอน render
const events = ref<Event[]>([])
const totalEvents = ref(0)

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

// ✅ watchEffect จะทำงานอัตโนมัติเมื่อ page เปลี่ยน
watchEffect(() => {
  EventService.getEvents(3, page.value)
    .then((response) => {
      events.value = response.data
      totalEvents.value = Number(response.headers['x-total-count'])
    })
    .catch(() => {
      router.push({ name: 'network-error-view' })
    })
})
</script>

<template>
  <h1>Events For Good</h1>

  <!-- ✅ ตรวจว่ามี events ก่อน render -->
  <div class="flex flex-col items-center">
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
