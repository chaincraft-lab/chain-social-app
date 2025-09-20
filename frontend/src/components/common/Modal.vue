<template>
  <div v-if="isOpen" class="fixed inset-0 z-[99999] flex items-start sm:items-center justify-center p-4">
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-black/80 backdrop-blur-sm" 
      @click="closeOnBackdrop && $emit('close')"
    ></div>
    
    <!-- Modal Content -->
    <div 
      :class="[
        'relative theme-bg-primary rounded-2xl shadow-2xl w-full theme-border',
        'max-h-[95vh] sm:max-h-[90vh] overflow-y-auto',
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
import { computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  size: { type: String, default: 'md' },
  closeOnBackdrop: { type: Boolean, default: true },
  showCloseButton: { type: Boolean, default: true },
  customClass: { type: String, default: '' }
})

const emit = defineEmits(['close'])

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md sm:max-w-lg',
    lg: 'max-w-lg sm:max-w-xl',
    xl: 'max-w-xl sm:max-w-2xl',
    '2xl': 'max-w-2xl sm:max-w-4xl'
  }
  return sizes[props.size] || sizes.md
})

// Prevent body scroll when modal is open
onMounted(() => {
  if (props.isOpen) {
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

// Watch for isOpen changes
import { watch } from 'vue'
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>