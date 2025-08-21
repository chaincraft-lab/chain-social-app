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
          <Icon v-else icon="heroicons:arrow-path" class="w-5 h-5" />
          <span class="font-medium">
            {{ isLoading ? 'Yükleniyor...' : buttonText }}
          </span>
        </button>
      </div>
    </div>
    
    <div v-else-if="showEndMessage" class="text-center py-6">
      <div class="inline-flex items-center gap-2 px-6 py-3 bg-green-50 border border-green-200 rounded-full text-green-700">
        <Icon icon="heroicons:check" class="w-5 h-5" />
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