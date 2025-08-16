<template>
  <div class="category-page">
    <!-- Category Header -->
    <div class="category-header">
      <div class="category-hero-card">
        <div class="category-hero-content">
          <div class="category-badge">
            <v-icon class="mr-2" size="small">mdi-folder-open</v-icon>
            <span>{{ currentCategory?.name || 'Kategori' }}</span>
          </div>
          <h1 class="category-title">{{ currentCategory?.name || 'Kategori' }}</h1>
          <p class="category-description">
            {{ currentCategory?.description || 'Bu kategorideki tüm haberleri görüntülüyorsunuz.' }}
          </p>
          <div class="category-stats">
            <div class="stat-item">
              <v-icon size="small" class="mr-1">mdi-newspaper</v-icon>
              <span>{{ categoryNews.length }} haber</span>
            </div>
          </div>
        </div>
        <div class="category-hero-bg"></div>
      </div>
    </div>
    
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
        <div class="modern-end-state" v-else-if="categoryNews.length > 0">
          <div class="end-state-card">
            <div class="end-state-icon">
              <v-icon size="48" color="success">mdi-check-circle</v-icon>
            </div>
            <h3 class="end-state-title">Tüm haberler yüklendi</h3>
            <p class="end-state-text">Bu kategorideki tüm haberleri görüntülediniz</p>
          </div>
        </div>
        
        <!-- No Posts Found -->
        <div class="modern-empty-state" v-else>
          <div class="empty-state-card">
            <div class="empty-state-icon">
              <v-icon size="64" color="grey-lighten-1">mdi-newspaper-variant-outline</v-icon>
            </div>
            <h3 class="empty-state-title">Henüz haber yok</h3>
            <p class="empty-state-text">Bu kategoride henüz haber bulunmuyor</p>
            <v-btn 
              color="primary" 
              variant="outlined" 
              rounded="pill"
              @click="$router.push('/')"
              class="mt-4"
            >
              <v-icon start>mdi-home</v-icon>
              Ana Sayfaya Dön
            </v-btn>
          </div>
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

/* Category Hero Card */
.category-hero-card {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.category-hero-bg {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.category-hero-content {
  position: relative;
  z-index: 2;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 0.5rem 1rem;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.category-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.75rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.category-description {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.category-stats {
  display: flex;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 0.5rem 1rem;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
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

/* Modern End States */
.modern-end-state,
.modern-empty-state {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}

.end-state-card,
.empty-state-card {
  background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
  border-radius: 20px;
  padding: 3rem 2rem;
  text-align: center;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(76, 175, 80, 0.1);
}

.empty-state-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.end-state-icon,
.empty-state-icon {
  margin-bottom: 1.5rem;
}

.end-state-title,
.empty-state-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.75rem;
}

.end-state-text,
.empty-state-text {
  color: #6c757d;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .category-page {
    padding: 0 0.5rem;
  }
  
  .category-hero-card {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .category-title {
    font-size: 1.75rem;
  }
  
  .category-stats {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .modern-load-more-card,
  .end-state-card,
  .empty-state-card {
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