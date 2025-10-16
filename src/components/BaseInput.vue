<script setup lang="ts">
const modelValue = defineModel<string | number>()

interface BaseInputProps {
  label?: string
  type?: string
}

const props = withDefaults(defineProps<BaseInputProps>(), {
  label: '',
  type: 'text'
})

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  modelValue.value = props.type === 'number'
    ? Number(target.value)
    : target.value
}
</script>

<template>
  <label
    v-if="props.label"
    class="block mb-1 text-sm font-medium text-gray-700"
  >
    {{ props.label }}
  </label>

  <input
    class="mb-6 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    :type="props.type"
    v-bind="$attrs"
    :placeholder="props.label"
    :value="modelValue"
    @input="onInput"
  />
</template>
