<template>
  <div v-if="tags && tags.length > 0" class="mb-8">
    <div class="text-sm font-medium mb-3 text-gray-900">Etiketler:</div>
    <div class="flex flex-wrap gap-2">
      <router-link
        v-for="tag in tags" 
        :key="tag.id"
        :to="{ name: 'tag', params: { slug: tag.slug } }"
        class="inline-flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full border border-gray-200 transition-colors duration-200"
      >
        #{{ tag.name }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tags: { type: Array, default: () => [] }
})
</script>