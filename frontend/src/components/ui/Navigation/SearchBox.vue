<template>
  <div class="relative">
    <form @submit.prevent="$emit('search', query)">
      <input
        v-model="query"
        type="text"
        :placeholder="placeholder"
        :class="[
          'py-2 pl-10 pr-4 text-sm border-none rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors',
          inputClass
        ]"
        @keyup.enter="$emit('search', query)"
      />
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          class="w-4 h-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Ara...' },
  inputClass: { type: String, default: 'w-64 bg-gray-700 text-white placeholder-gray-400' }
})

const emit = defineEmits(['search', 'update:modelValue'])

const query = ref(props.modelValue)

watch(query, (newValue) => {
  emit('update:modelValue', newValue)
})

watch(() => props.modelValue, (newValue) => {
  query.value = newValue
})
</script>