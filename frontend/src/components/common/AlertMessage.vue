<template>
  <div v-if="message" :class="[
    'p-4 rounded-lg border flex items-center',
    alertClasses
  ]">
    <!-- Alert Icon -->
    <Icon :icon="getAlertIcon()" :class="['w-5 h-5 mr-2', iconClasses]" />
    
    <!-- Alert Message -->
    <span class="flex-1">{{ message }}</span>
    
    <!-- Close Button -->
    <button 
      v-if="dismissible" 
      @click="$emit('dismiss')" 
      class="ml-2 text-gray-400 hover:text-white"
    >
      <Icon icon="heroicons:x-mark" class="w-4 h-4" />
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

const getAlertIcon = () => {
  const icons = {
    success: 'heroicons:check-circle',
    info: 'heroicons:information-circle',
    warning: 'heroicons:exclamation-triangle',
    error: 'heroicons:exclamation-circle'
  }
  return icons[props.type] || icons.error
}
</script>