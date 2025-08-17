<template>
  <div class="text-center py-8">
    <div class="mb-4">
      <svg class="w-16 h-16 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
    
    <h3 class="text-lg font-medium text-gray-900 mb-2">{{ title }}</h3>
    <p class="text-gray-600 mb-6 max-w-md mx-auto">{{ message }}</p>
    
    <button
      v-if="showRetry"
      @click="$emit('retry')"
      class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      {{ retryText }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Bir Hata Oluştu' },
  message: { type: String, default: 'Sayfa yüklenirken bir hata oluştu. Lütfen tekrar deneyin.' },
  showRetry: { type: Boolean, default: true },
  retryText: { type: String, default: 'Tekrar Dene' }
})

defineEmits(['retry'])
</script>