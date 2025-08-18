<template>
  <div class="load-more-section py-8">
    <div v-if="hasMore" class="text-center">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 inline-block overflow-hidden">
        <button
          @click="$emit('loadMore')"
          :disabled="isLoading"
          class="flex items-center gap-3 px-8 py-4 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div v-if="isLoading" class="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <span class="font-medium">
            {{ isLoading ? 'Yükleniyor...' : buttonText }}
          </span>
        </button>
      </div>
    </div>
    
    <div v-else-if="showEndMessage" class="text-center py-6">
      <div class="inline-flex items-center gap-2 px-6 py-3 bg-green-50 border border-green-200 rounded-full text-green-700">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
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
  endMessage: { type: String, default: 'Tüm makaleler yüklendi' }
})

defineEmits(['loadMore'])
</script>