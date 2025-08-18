<template>
  <button
    :type="type"
    :disabled="disabled || isLoading"
    :class="[
      'flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
      buttonClasses,
      disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '',
      fullWidth ? 'w-full' : ''
    ]"
    @click="$emit('click', $event)"
  >
    <!-- Loading Spinner -->
    <svg v-if="isLoading" class="animate-spin mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    
    <!-- Icon Slot -->
    <slot name="icon" />
    
    <!-- Button Text -->
    <span>{{ isLoading ? loadingText : text }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' },
  text: { type: String, default: '' },
  loadingText: { type: String, default: 'Yükleniyor...' },
  isLoading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  fullWidth: { type: Boolean, default: false }
})

defineEmits(['click'])

const buttonClasses = computed(() => {
  const variants = {
    primary: 'bg-indigo-500 text-white hover:bg-indigo-400 focus-visible:outline-indigo-500',
    secondary: 'bg-white/5 text-gray-300 border border-gray-600 hover:bg-white/10 focus-visible:outline-gray-500',
    success: 'bg-green-500 text-white hover:bg-green-400 focus-visible:outline-green-500',
    danger: 'bg-red-500 text-white hover:bg-red-400 focus-visible:outline-red-500',
    ghost: 'text-gray-400 hover:text-white focus-visible:outline-gray-500'
  }
  return variants[props.variant] || variants.primary
})
</script>