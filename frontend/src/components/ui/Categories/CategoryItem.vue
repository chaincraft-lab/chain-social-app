<template>
  <router-link
    :to="{ name: 'category', params: { slug: category.slug } }"
    class="flex items-center justify-between px-4 py-3 mx-2 my-1 rounded-lg text-gray-700 transition-all duration-200 hover:bg-gray-50"
  >
    <span class="text-base font-medium">{{ category.name }}</span>
    <span 
      v-if="category.articleCount"
      class="inline-flex items-center px-2.5 py-1 text-sm font-medium bg-gray-100 text-gray-600 rounded-full transition-all duration-200"
    >
      {{ category.articleCount }}
    </span>
  </router-link>
</template>

<script setup>
defineProps({
  category: { type: Object, required: true }
})
</script>
