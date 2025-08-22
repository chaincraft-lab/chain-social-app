<template>
  <div class="mb-6">
    <div class="flex items-center mb-3">
      <CategoryBadge v-if="category" :category="category" />
      <span class="text-xs text-gray-500 ml-2">{{ formattedDate }}</span>
    </div>
    
    <h1 class="text-3xl md:text-4xl font-bold mb-4 text-gray-900 leading-tight">
      {{ title }}
    </h1>
    
    <p v-if="excerpt" class="text-lg text-gray-700 leading-relaxed">
      {{ excerpt }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import CategoryBadge from '../Categories/CategoryBadge.vue'

const props = defineProps({
  title: { type: String, required: true },
  excerpt: { type: String, default: null },
  category: { type: String, default: null },
  date: { type: [String, Date], required: true }
})

const formattedDate = computed(() => {
  if (!props.date) return ''
  const date = new Date(props.date)
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})
</script>