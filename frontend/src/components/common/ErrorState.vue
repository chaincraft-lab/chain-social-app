<template>
  <div class="text-center py-8">
    <div class="mb-4">
      <Icon icon="heroicons:exclamation-triangle" class="w-16 h-16 text-red-400 mx-auto" />
    </div>
    
    <h3 class="text-lg font-medium theme-text-primary mb-2">{{ title }}</h3>
    <p class="theme-text-secondary mb-6 max-w-md mx-auto">{{ message }}</p>
    
    <button
      v-if="showRetry"
      @click="$emit('retry')"
      class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
    >
      <Icon icon="heroicons:arrow-path" class="w-4 h-4 mr-2" />
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