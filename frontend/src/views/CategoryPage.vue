<template>
  <div class="category-page">
    <!-- Posts Feed -->
    <div class="posts-feed">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-posts">
        <div v-for="i in 3" :key="i" class="loading-post">
          <div class="modern-loading-card">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full shimmer"></div>
              <div class="flex flex-col gap-2">
                <div class="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-32 shimmer"></div>
                <div class="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20 shimmer"></div>
              </div>
            </div>
            <div class="h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl mb-4 shimmer"></div>
            <div class="space-y-2">
              <div class="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full shimmer"></div>
              <div class="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-3/4 shimmer"></div>
            </div>
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
          <div class="modern-load-more-card">
            <v-btn 
              color="primary" 
              variant="elevated" 
              size="large"
              rounded="pill"
              @click="loadMorePosts"
              :loading="loadingMore"
              class="modern-btn"
            >
              <v-icon start>mdi-refresh</v-icon>
              Daha Fazla Yükle
            </v-btn>
          </div>
        </div>
        
        <!-- End of Feed -->
        <StateMessage 
          v-else-if="categoryNews.length > 0"
          type="success"
          title="Tüm haberler yüklendi"
          message="Bu kategorideki tüm haberleri görüntülediniz"
          icon="mdi-check-circle"
        />
        
        <!-- No Posts Found -->
        <StateMessage 
          v-else
          type="empty"
          title="Henüz haber yok"
          message="Bu kategoride henüz haber bulunmuyor"
          icon="mdi-newspaper-variant-outline"
          :show-button="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import NewsPost from '@/components/news/NewsPost.vue'
import StateMessage from '@/components/ui/StateMessage.vue'

export default {
  name: 'CategoryPage',
  components: {
    NewsPost,
    StateMessage
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
        try {
          // Önce kategori bilgisini çek
          await store.dispatch('categories/fetchCategoryBySlug', route.params.slug)
          
          // Sonra o kategoriye ait haberleri çek
          await store.dispatch('news/fetchCategoryNews', {
            categorySlug: route.params.slug,
            limit: 50 // Load more posts to enable pagination
          })
        } catch (error) {
          console.error('Error loading category data:', error)
        }
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
  min-height: 100vh;
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

/* Modern Loading Cards */
.loading-posts {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.modern-loading-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* Shimmer Animation */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.shimmer {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 37%,
    #f0f0f0 63%
  );
  background-size: 400px 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

/* Load More Section */
.load-more-section {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.modern-load-more-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.modern-btn {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.modern-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}


/* Mobile Responsive */
@media (max-width: 768px) {
  .category-page {
    padding: 0 0.5rem;
  }
  
  .modern-load-more-card {
    padding: 2rem 1rem;
  }
}

@media (max-width: 480px) {
  .category-page {
    padding: 0 0.25rem;
  }
  
  .category-hero-card {
    padding: 1rem;
    border-radius: 16px;
  }
  
  .category-title {
    font-size: 1.5rem;
  }
  
  .modern-loading-card {
    padding: 1rem;
  }
}

/* Animations */
.category-hero-card {
  animation: slideInDown 0.6s ease-out;
}

.modern-loading-card {
  animation: fadeInUp 0.4s ease-out;
}

.end-state-card,
.empty-state-card {
  animation: bounceIn 0.6s ease-out;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style> 