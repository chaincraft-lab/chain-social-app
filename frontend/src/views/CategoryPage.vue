<template>
  <div class="category-page">
    <!-- Category Header -->
    <div class="category-header">
      <div class="bg-light rounded-lg p-6 mb-6">
        <h1 class="text-2xl md:text-3xl font-bold mb-2 text-dark">{{ currentCategory?.name || 'Kategori' }}</h1>
        <p class="text-dark/70">
          {{ currentCategory?.description || 'Bu kategorideki tüm haberleri görüntülüyorsunuz.' }}
        </p>
      </div>
    </div>
    
    <!-- Posts Feed -->
    <div class="posts-feed">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-posts">
        <div v-for="i in 3" :key="i" class="loading-post">
          <div class="bg-white rounded-xl shadow-sm p-4 mb-4 animate-pulse">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div class="flex flex-col gap-1">
                <div class="h-4 bg-gray-200 rounded w-24"></div>
                <div class="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div class="h-64 bg-gray-200 rounded-lg mb-4"></div>
            <div class="h-4 bg-gray-200 rounded mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>

      <!-- Category Posts -->
      <div v-else class="posts-container">
        <NewsPost 
          v-for="news in categoryNews" 
          :key="news?.id || Math.random()"
          :news="news"
        />
        
        <!-- Load More Button -->
        <div class="load-more-section" v-if="hasMorePosts">
          <v-btn 
            color="primary" 
            variant="outlined" 
            size="large"
            rounded="pill"
            @click="loadMorePosts"
            :loading="loadingMore"
          >
            <v-icon start>mdi-refresh</v-icon>
            Daha Fazla Yükle
          </v-btn>
        </div>
        
        <!-- End of Feed -->
        <div class="end-of-feed" v-else-if="categoryNews.length > 0">
          <v-icon size="large" color="grey">mdi-check-circle</v-icon>
          <p class="text-grey">Tüm haberler yüklendi</p>
        </div>
        
        <!-- No Posts Found -->
        <div class="no-posts" v-else>
          <v-icon size="large" color="grey">mdi-newspaper-variant-outline</v-icon>
          <p class="text-grey">Bu kategoride henüz haber bulunmuyor</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import NewsPost from '@/components/news/NewsPost.vue'

export default {
  name: 'CategoryPage',
  components: {
    NewsPost
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    
    const displayedPostsCount = ref(10)
    const loadingMore = ref(false)
    
    const categories = computed(() => store.state.categories.categories || [])
    const currentCategory = computed(() => {
      const cats = categories.value
      if (!Array.isArray(cats)) return null
      return cats.find(c => c && c.slug === route.params.slug) || null
    })
    
    const allCategoryNews = computed(() => {
      return store.getters['news/getCategoryNews'](route.params.slug)
    })
    
    const categoryNews = computed(() => {
      return allCategoryNews.value.slice(0, displayedPostsCount.value)
    })
    
    const hasMorePosts = computed(() => {
      return allCategoryNews.value.length > displayedPostsCount.value
    })
    
    const isLoading = computed(() => store.getters['news/isLoading']('category'))
    
    const loadCategoryNews = async () => {
      if (route.params.slug) {
        await store.dispatch('news/fetchCategoryNews', {
          categorySlug: route.params.slug,
          limit: 50 // Load more posts to enable pagination
        })
      }
    }
    
    const loadMorePosts = () => {
      loadingMore.value = true
      
      // Simulate loading delay
      setTimeout(() => {
        displayedPostsCount.value += 10
        loadingMore.value = false
      }, 1000)
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
    }
    
    onMounted(() => {
      loadCategoryNews()
    })
    
    watch(() => route.params.slug, () => {
      displayedPostsCount.value = 10 // Reset pagination when category changes
      loadCategoryNews()
    })
    
    return {
      currentCategory,
      categoryNews,
      hasMorePosts,
      isLoading,
      loadingMore,
      loadMorePosts,
      formatDate
    }
  }
}
</script>

<style scoped>
/* Category Page Layout */
.category-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
}

.category-header {
  margin-bottom: 1rem;
}

/* Posts Feed */
.posts-feed {
  margin-bottom: 2rem;
}

.posts-container {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Loading States */
.loading-posts {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loading-post {
  margin-bottom: 1rem;
}

/* Load More Section */
.load-more-section {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.end-of-feed,
.no-posts {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 0;
  gap: 1rem;
  opacity: 0.7;
}

.end-of-feed p,
.no-posts p {
  margin: 0;
  font-weight: 500;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .category-page {
    padding: 0 0.5rem;
  }
  
  .category-header {
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 480px) {
  .category-page {
    padding: 0 0.25rem;
  }
}

/* Loading animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.loading-posts {
  animation: pulse 1.5s ease-in-out infinite;
}
</style> 