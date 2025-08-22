<template>
  <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center">
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-black/80 backdrop-blur-sm" 
      @click="closeOnBackdrop && $emit('close')"
    ></div>
    
    <!-- Modal Content -->
    <div 
      :class="[
        'relative theme-bg-primary rounded-2xl shadow-2xl w-full mx-4 theme-border',
        sizeClasses,
        customClass
      ]"
    >
      <!-- Close Button -->
      <button
        v-if="showCloseButton"
        @click="$emit('close')"
        class="absolute top-4 right-4 theme-text-muted hover:theme-text-primary transition-colors z-10"
      >
        <Icon icon="heroicons:x-mark" class="w-6 h-6" />
      </button>

      <!-- Modal Content Slot -->
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  size: { type: String, default: 'md' },
  closeOnBackdrop: { type: Boolean, default: true },
  showCloseButton: { type: Boolean, default: true },
  customClass: { type: String, default: '' }
})

defineEmits(['close'])

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  }
  return sizes[props.size] || sizes.md
})
</script>