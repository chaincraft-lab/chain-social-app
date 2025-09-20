<template>
  <div class="load-more-section py-2">
    <div v-if="hasMore && !showSkeleton" class="text-center">
      <div class="theme-card rounded-xl shadow-sm theme-border inline-block overflow-hidden">
        <button
          @click="$emit('loadMore')"
          :disabled="isLoading"
          class="flex items-center gap-3 px-8 py-4 theme-text-primary hover:theme-bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div v-if="isLoading" class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <Icon v-else icon="heroicons:arrow-path" class="w-5 h-5 text-primary" />
          <span class="font-medium">
            {{ isLoading ? 'Yükleniyor...' : buttonText }}
          </span>
        </button>
      </div>
    </div>
    
    <div v-else-if="showEndMessage" class="text-center py-6">
      <div class="inline-flex items-center gap-2 px-6 py-3 theme-bg-tertiary theme-border rounded-full theme-text-secondary">
        <Icon icon="heroicons:check" class="w-5 h-5 text-green-500" />
        <span class="text-sm font-medium">{{ endMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  hasMore: { type: Boolean, default: false },
  isLoading: { type: Boolean, default: false },
  showEndMessage: { type: Boolean, default: false },
  buttonText: { type: String, default: 'Daha Fazla Yükle' },
  endMessage: { type: String, default: 'Tüm makaleler yüklendi' },
  showSkeleton: { type: Boolean, default: false }
})

defineEmits(['loadMore'])
</script>