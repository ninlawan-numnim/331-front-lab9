<script setup lang="ts">
import { toRefs, defineProps } from 'vue'
import { type Organizer } from '@/types'

const props = defineProps<{
  organizer: Organizer
  id: String
}>()
const { organizer } = toRefs(props)
</script>
<template>
  <div>
    <h2>{{ organizer.name }}</h2>
    <p><strong>Organization ID:</strong> {{ organizer.id }}</p>
  </div>
</template>