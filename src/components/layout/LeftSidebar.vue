<template>
  <aside class="bg-light rounded-lg p-4">
    <!-- Categories -->
    <div class="mb-6">
      <h3 class="text-lg font-bold mb-3 text-dark border-b border-primary pb-2">Kategoriler</h3>
      <ul>
        <li v-for="category in categories" :key="category.id" class="mb-2">
          <router-link 
            :to="{ name: 'category', params: { slug: category.slug }}"
            class="block px-3 py-2 rounded-md hover:bg-white transition-colors"
          >
            {{ category.name }}
          </router-link>
        </li>
      </ul>
    </div>
    
    <!-- Popular News -->
    <div>
      <h3 class="text-lg font-bold mb-3 text-dark border-b border-primary pb-2">Popüler Haberler</h3>
      <div v-for="(news, index) in popularNews.slice(0, 5)" :key="news.id" 
           class="mb-4 flex items-start">
        <span class="text-2xl font-bold text-primary mr-3 opacity-50">{{ index + 1 }}</span>
        <div>
          <router-link 
            :to="{ name: 'article', params: { slug: news.id }}"
            class="news-title text-base"
          >
            {{ news.title }}
          </router-link>
          <div class="text-xs text-dark/60">
            {{ formatDate(news.date) }} - {{ news.category.name }}
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'LeftSidebar',
  setup() {
    const store = useStore()
    
    const categories = computed(() => store.state.categories)
    const popularNews = computed(() => {
      // For now, we'll just use the latest news as popular news
      // In a real app, this would be a separate API call
      return store.state.latestNews
    })
    
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
    }
    
    return {
      categories,
      popularNews,
      formatDate
    }
  }
}
</script> 