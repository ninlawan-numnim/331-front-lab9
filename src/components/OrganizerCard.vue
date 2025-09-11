<script setup lang="ts">
import { type Organizer } from '@/types'

const props = defineProps<{
  organizer: Organizer
}>()
</script>

<template>
  <RouterLink class="organizer-link" :to="{ name: 'organizer-detail-view', params: { id: props.organizer.id } }">
    <div class="cursor-pointer border border-gray-600 p-[20px] w-[250px] mb-[18px] hover:scale-101 hover:shadow-sp">
      <h2>{{ props.organizer.organizationName }}</h2>
      <span>{{ props.organizer.address }}</span>
    </div>
  </RouterLink>
</template>

<style scoped>
.organizer-link {
  text-decoration: none;
  color: #2c3e50;
}
</style>