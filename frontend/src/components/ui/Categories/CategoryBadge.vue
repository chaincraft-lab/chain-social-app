<template>
  <span 
    :class="[
      'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
      colorClasses
    ]"
  >
    {{ category }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  category: { type: String, required: true },
  variant: { type: String, default: 'primary' } // primary, secondary, outline
})

const colorClasses = computed(() => {
  const categoryColors = {
    'Kara': 'bg-amber-100 text-amber-800',
    'Hava': 'bg-blue-100 text-blue-800', 
    'Deniz': 'bg-cyan-100 text-cyan-800',
    'Teknoloji': 'bg-purple-100 text-purple-800',
    'Siber': 'bg-orange-100 text-orange-800',
    'Uzay': 'bg-indigo-100 text-indigo-800'
  }
  
  if (categoryColors[props.category]) {
    return categoryColors[props.category]
  }
  
  // Default colors by variant
  const variants = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-gray-100 text-gray-800',
    outline: 'border border-gray-300 text-gray-700 bg-transparent'
  }
  
  return variants[props.variant] || variants.primary
})
</script>