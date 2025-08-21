<template>
  <div class="text-center mb-8">
    <div class="flex items-center justify-center mb-4">
      <div class="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
        <Icon icon="heroicons:newspaper" class="w-6 h-6 text-white" />
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