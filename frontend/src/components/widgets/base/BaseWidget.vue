<template>
  <div class="theme-card rounded-lg shadow-sm mb-4">
    <!-- Header -->
    <SectionHeader :title="title">
      <template #icon v-if="icon">
        <Icon :icon="icon" class="w-6 h-6 mr-2 text-primary" />
      </template>
    </SectionHeader>

    <!-- Content -->
    <div class="p-4">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-8">
        <LoadingSpinner size="sm" />
        <span class="ml-2 text-sm theme-text-secondary">{{ loadingText || $t('common.actions.loading') }}</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-6">
        <Icon icon="heroicons:exclamation-triangle" class="w-12 h-12 mx-auto text-red-500 mb-3" />
        <p class="text-sm theme-text-secondary mb-3">{{ error }}</p>
        <button 
          v-if="allowRetry"
          @click="$emit('retry')"
          class="btn-sm btn-outline-primary"
        >
          <Icon icon="heroicons:arrow-path" class="w-4 h-4 mr-1" />
          {{ $t('common.ui.tryAgain') }}
        </button>
      </div>

      <!-- Content Slot -->
      <div v-else>
        <slot />
      </div>

      <!-- Footer Actions -->
      <div v-if="$slots.actions" class="mt-4 pt-3 border-t theme-border-primary">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import SectionHeader from '@/components/common/SectionHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps({
  title: { type: String, required: true },
  icon: { type: String, default: '' },
  isLoading: { type: Boolean, default: false },
  loadingText: { type: String, default: '' },
  error: { type: String, default: '' },
  allowRetry: { type: Boolean, default: true }
})

const emit = defineEmits(['retry'])
</script>

<style scoped>
.btn-sm {
  @apply px-3 py-1.5 text-sm font-medium rounded-md transition-colors;
}

.btn-outline-primary {
  @apply border border-primary text-primary hover:bg-primary hover:text-white;
}
</style>