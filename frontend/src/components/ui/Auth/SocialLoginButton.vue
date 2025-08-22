<template>
  <div class="mb-6">
    <button
      @click="$emit('click')"
      :disabled="isLoading"
      class="w-full flex items-center justify-center px-4 py-2.5 theme-border rounded-lg theme-text-primary theme-bg-secondary hover:theme-bg-tertiary transition-colors disabled:opacity-50"
    >
      <img :src="iconUrl" :alt="provider" class="w-5 h-5 mr-3">
      <span>{{ provider }} ile {{ actionText }}</span>
      <Icon v-if="isLoading" icon="heroicons:arrow-path" class="animate-spin ml-2 w-4 h-4" />
    </button>
    
    <div class="relative my-6">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t theme-border"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 theme-text-muted theme-bg-primary">veya</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  provider: { type: String, default: 'Google' },
  iconUrl: { type: String, default: 'https://developers.google.com/identity/images/g-logo.png' },
  actionText: { type: String, default: 'Giriş Yap' },
  isLoading: { type: Boolean, default: false }
})

defineEmits(['click'])
</script>