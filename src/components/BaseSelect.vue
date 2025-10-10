<script setup lang="ts">
import type { Organizer } from '@/types'

const modelValue = defineModel<number | null>()

interface BaseSelectProps {
  label: string
  options: Organizer[]
}

const props = withDefaults(defineProps<BaseSelectProps>(), {
  label: ''
})
</script>

<template>
  <label v-if="label" class="block mb-1 text-sm font-medium text-gray-700">
    {{ props.label }}
  </label>
  
  <select 
    class="mb-6 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    v-model="modelValue"
    v-bind="$attrs"
  >
    <option 
      v-for="option in props.options"
      :key="option.id"
      :value="option.id"
      :selected="option.id === modelValue"
    >
      {{ option.name }}
    </option>
  </select>
</template>