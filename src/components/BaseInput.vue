<script setup lang="ts">
const modelValue = defineModel<string>()

interface BaseInputProps {
  label: string
}

// ตั้งค่า default props
const props = withDefaults(defineProps<BaseInputProps>(), {
  label: ''
})
</script>

<template>
  <label v-if="label" class="block mb-1 text-sm font-medium text-gray-700">
    {{ props.label }}
  </label>

  <input
    class="mb-6 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    v-bind="$attrs"
    v-model="modelValue"
    :placeholder="label"
  />
</template>
