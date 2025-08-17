<template>
  <button
    @click="$emit('click')"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center transition-colors duration-200',
      sizeClasses,
      colorClasses,
      disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
    ]"
  >
    <div v-if="loading" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <!-- Heart Icon -->
      <path v-if="icon === 'heart'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            :d="filled ? 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' : 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'"
            :fill="filled ? 'currentColor' : 'none'" />
      
      <!-- Comment Icon -->
      <path v-else-if="icon === 'comment'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      
      <!-- Share Icon -->
      <path v-else-if="icon === 'share'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
      
      <!-- Bookmark Icon -->
      <path v-else-if="icon === 'bookmark'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            :d="filled ? 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' : 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'"
            :fill="filled ? 'currentColor' : 'none'" />
      
      <!-- Dots Icon -->
      <path v-else-if="icon === 'dots'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: { type: String, required: true }, // heart, comment, share, bookmark, dots
  filled: { type: Boolean, default: false },
  color: { type: String, default: 'gray' }, // gray, red, primary
  size: { type: String, default: 'md' }, // sm, md, lg
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

defineEmits(['click'])

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  }
  return sizes[props.size] || sizes.md
})

const colorClasses = computed(() => {
  const colors = {
    gray: 'text-gray-600',
    red: props.filled ? 'text-red-500' : 'text-gray-600',
    primary: props.filled ? 'text-primary' : 'text-gray-600'
  }
  return colors[props.color] || colors.gray
})
</script>