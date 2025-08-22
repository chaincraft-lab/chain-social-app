<template>
  <div :class="containerClasses">
    <div :class="spinnerClasses">
      <div :class="circleClasses"></div>
    </div>
    <p v-if="text" :class="textClasses">{{ text }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: { type: String, default: 'md' }, // sm, md, lg
  text: { type: String, default: null },
  variant: { type: String, default: 'primary' }, // primary, gray
  fullScreen: { type: Boolean, default: false }
})

const containerClasses = computed(() => [
  'flex flex-col items-center justify-center',
  props.fullScreen ? 'fixed inset-0 bg-white/80 z-50' : 'py-8'
])

const spinnerClasses = computed(() => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }
  return ['relative', sizes[props.size] || sizes.md]
})

const circleClasses = computed(() => {
  const variants = {
    primary: 'border-primary border-t-transparent',
    gray: 'border-gray-300 border-t-transparent'
  }
  return [
    'w-full h-full border-4 rounded-full animate-spin',
    variants[props.variant] || variants.primary
  ]
})

const textClasses = computed(() => {
  const sizes = {
    sm: 'text-xs mt-2',
    md: 'text-sm mt-3',
    lg: 'text-base mt-4'
  }
  return [
    'text-gray-600 font-medium',
    sizes[props.size] || sizes.md
  ]
})
</script>