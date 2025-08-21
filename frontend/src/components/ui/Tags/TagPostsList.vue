<template>
  <div class="tag-posts-list">
    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-6">
      <div v-for="i in 3" :key="i" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 bg-gray-200 rounded-full animate-pulse mr-4"></div>
          <div class="flex-1 space-y-2">
            <div class="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            <div class="h-2 bg-gray-200 rounded w-1/6 animate-pulse"></div>
          </div>
        </div>
        <div class="h-48 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
        <div class="space-y-2">
          <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>
      </div>
    </div>

    <!-- Posts List -->
    <div v-else-if="posts && posts.length > 0" class="space-y-6">
      <NewsPost
        v-for="post in posts"
        :key="post.id"
        :news="post"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        <Icon icon="heroicons:tag" class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Henüz makale yok</h3>
      <p class="text-gray-600">Bu etiketle henüz makale bulunmuyor.</p>
    </div>
  </div>
</template>

<script setup>
import NewsPost from '../../news/NewsPost.vue'

defineProps({
  posts: { type: Array, default: () => [] },
  isLoading: { type: Boolean, default: false }
})
</script>