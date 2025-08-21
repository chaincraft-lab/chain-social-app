<template>
  <div v-if="articles && articles.length > 0" class="mb-8">
    <h3 class="text-xl font-bold mb-4 theme-text-primary">İlgili Haberler</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <router-link 
        v-for="article in articles.slice(0, 3)" 
        :key="article.id"
        :to="{ name: 'article', params: { slug: article.slug } }"
        class="theme-card rounded-lg shadow-sm theme-border overflow-hidden hover:shadow-md transition-all duration-200 hover:theme-bg-secondary"
      >
        <div class="aspect-[16/9] theme-bg-tertiary overflow-hidden">
          <img 
            :src="article.imageUrl || article.image || 'https://picsum.photos/400/225'" 
            :alt="article.title" 
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
        </div>
        
        <div class="p-4">
          <h4 class="text-base font-semibold mb-2 theme-text-primary line-clamp-2">
            {{ article.title }}
          </h4>
          <div class="text-xs theme-text-muted">
            {{ formatDate(article.publishedAt || article.createdAt) }}
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  articles: { type: Array, default: () => [] }
})

const handleImageError = (event) => {
  event.target.src = 'https://picsum.photos/400/225'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>