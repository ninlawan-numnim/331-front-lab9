<script setup lang="ts">
import { type Event } from '@/types'

const props = defineProps<{
  event: Event
}>()
</script>

<template>
  <div v-if="event">
    <RouterLink
      v-if="event.id"
      class="event-link block border rounded-lg p-4 shadow hover:shadow-md transition"
      :to="{ name: 'event-detail-view', params: { id: event.id } }"
    >
      <h2 class="text-xl font-bold mb-2">{{ event.title }}</h2>
      <p class="text-gray-700">{{ event.description }}</p>

      <!-- ✅ ตรวจ organizer ก่อนอ่าน -->
      <p class="text-sm text-gray-500 mt-2">
        Organizer:
        <span v-if="event.organizer && event.organizer.name">
          {{ event.organizer.name }}
        </span>
        <span v-else>
          Unknown
        </span>
      </p>
    </RouterLink>
  </div>
  <div v-else>
    <p>Loading event...</p>
  </div>
</template>

<style scoped>
.event-link {
  text-decoration: none;
  color: inherit;
}
</style>
