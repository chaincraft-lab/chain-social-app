<template>
  <div class="text-center mb-8">
    <div class="flex items-center justify-center mb-4">
      <div class="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
        </svg>
      </div>
    </div>
    <h2 class="text-2xl font-bold text-white mb-2">{{ title }}</h2>
    <p class="text-gray-400 text-sm">{{ subtitle }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'NewsHub' },
  subtitle: { type: String, default: 'Haberin ve Bilginin Sosyal Medyası' }
})
</script>