<template>
  <div v-if="message" :class="[
    'p-4 rounded-lg border flex items-center',
    alertClasses
  ]">
    <!-- Alert Icon -->
    <svg :class="['w-5 h-5 mr-2', iconClasses]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path v-if="type === 'success'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      <path v-else-if="type === 'info'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      <path v-else-if="type === 'warning'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z"/>
      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
    
    <!-- Alert Message -->
    <span class="flex-1">{{ message }}</span>
    
    <!-- Close Button -->
    <button 
      v-if="dismissible" 
      @click="$emit('dismiss')" 
      class="ml-2 text-gray-400 hover:text-white"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: { type: String, default: '' },
  type: { type: String, default: 'error' },
  dismissible: { type: Boolean, default: true }
})

defineEmits(['dismiss'])

const alertClasses = computed(() => {
  const classes = {
    success: 'bg-green-900/20 border-green-500 text-green-400',
    info: 'bg-blue-900/20 border-blue-500 text-blue-400',
    warning: 'bg-yellow-900/20 border-yellow-500 text-yellow-400',
    error: 'bg-red-900/20 border-red-500 text-red-400'
  }
  return classes[props.type] || classes.error
})

const iconClasses = computed(() => {
  const classes = {
    success: 'text-green-400',
    info: 'text-blue-400',
    warning: 'text-yellow-400',
    error: 'text-red-400'
  }
  return classes[props.type] || classes.error
})
</script>