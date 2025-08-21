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
    <Icon v-else-if="icon === 'heart'" :icon="filled ? 'heroicons:heart-solid' : 'heroicons:heart'" class="w-5 h-5" />
    <Icon v-else-if="icon === 'comment'" icon="heroicons:chat-bubble-left-right" class="w-5 h-5" />
    <Icon v-else-if="icon === 'share'" icon="heroicons:share" class="w-5 h-5" />
    <Icon v-else-if="icon === 'bookmark'" :icon="filled ? 'heroicons:bookmark-solid' : 'heroicons:bookmark'" class="w-5 h-5" />
    <Icon v-else-if="icon === 'dots'" icon="heroicons:ellipsis-vertical" class="w-5 h-5" />
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