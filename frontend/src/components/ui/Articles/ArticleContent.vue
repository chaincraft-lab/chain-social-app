<template>
  <div class="prose max-w-none mb-8 text-gray-900">
    <div v-if="content" v-html="content"></div>
    <div v-else class="text-center py-8 text-gray-500">
      <LoadingSpinner size="sm" text="Makale içeriği yükleniyor..." />
    </div>
  </div>
</template>

<script setup>
import LoadingSpinner from '../../common/LoadingSpinner.vue'

defineProps({
  content: { type: String, default: null }
})
</script>

<style scoped>
/* Prose styling for article content */
</style>