<template>
  <div 
    :class="[
      'flex items-center justify-center rounded-full text-white font-semibold',
      sizeClasses,
      backgroundColor
    ]"
  >
    <span :class="textSizeClasses">{{ initials }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: String, default: 'md' }, // sm, md, lg
  color: { type: String, default: 'primary' }
})

const initials = computed(() => {
  return props.name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }
  return sizes[props.size] || sizes.md
})

const textSizeClasses = computed(() => {
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm', 
    lg: 'text-base'
  }
  return sizes[props.size] || sizes.md
})

const backgroundColor = computed(() => {
  const colors = {
    primary: 'bg-primary',
    gray: 'bg-gray-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  }
  return colors[props.color] || colors.primary
})
</script>