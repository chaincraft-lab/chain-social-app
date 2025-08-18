<template>
  <div class="mb-6">
    <button
      @click="$emit('click')"
      :disabled="isLoading"
      class="w-full flex items-center justify-center px-4 py-2.5 border border-gray-700 rounded-lg text-white bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
    >
      <img :src="iconUrl" :alt="provider" class="w-5 h-5 mr-3">
      <span>{{ provider }} ile {{ actionText }}</span>
      <svg v-if="isLoading" class="animate-spin ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </button>
    
    <div class="relative my-6">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-700"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 text-gray-400 bg-gray-900">veya</span>
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