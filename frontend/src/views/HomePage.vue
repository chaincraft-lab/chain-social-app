<template>
  <div class="homepage-feed">
    <!-- Stories/Highlights Section -->
    <section class="stories-section">
      <v-card class="stories-card" elevation="1" rounded="xl">
        <div class="stories-container">
          <!-- Loading State for Stories -->
          <div v-if="$store.getters['news/isLoading']('featured')" class="stories-loading">
            <v-skeleton-loader
              v-for="n in 5"
              :key="n"
              type="avatar"
              class="story-skeleton"
            ></v-skeleton-loader>
          </div>
          
          <!-- Actual Stories -->
          <div v-else-if="featuredNews && featuredNews.length" class="story-item" v-for="story in featuredNews.slice(0, 5)" :key="story.id">
            <div class="story-avatar">
              <v-img 
                :src="story.image || story.imageUrl" 
                :alt="story.category?.name"
                cover
                class="story-image"
              ></v-img>
            </div>
            <div class="story-label">{{ story.category?.name || 'Haber' }}</div>
          </div>
          
          <!-- Empty State -->
          <div v-else class="stories-empty">
            <p class="text-grey">Öne çıkan haber bulunamadı</p>
          </div>
        </div>
      </v-card>
    </section>

    <!-- News Feed Posts -->
    <section class="news-feed">
      <div class="feed-header">
        <h2 class="feed-title">Son Haberler</h2>
        <div class="feed-filter">
          <v-chip-group v-model="selectedFilter" color="primary" variant="flat">
            <v-chip value="all">Tümü</v-chip>
            <v-chip value="trending">Trend</v-chip>
            <v-chip value="recent">Yeni</v-chip>
          </v-chip-group>
        </div>
      </div>
      
      <!-- Post Feed -->
      <div class="posts-container">
        <!-- Loading State -->
        <div v-if="isLoading" class="loading-container">
          <v-skeleton-loader
            v-for="n in 5"
            :key="n"
            type="card"
            class="mb-4"
          ></v-skeleton-loader>
        </div>
        
        <!-- Actual Posts -->
        <transition-group v-else name="news-post" tag="div" class="news-posts-list">
          <NewsPost 
            v-for="news in filteredNews" 
            :key="news?.id || Math.random()"
            :news="news"
          />
        </transition-group>
        
        <!-- Infinite Scroll Loading Indicator -->
        <div class="infinite-scroll-loading" v-if="loadingMore && hasMorePosts">
          <v-progress-circular 
            indeterminate 
            color="primary" 
            size="32"
          ></v-progress-circular>
          <p class="loading-text">Yükleniyor...</p>
        </div>
        
        <!-- End of Feed -->
        <StateMessage 
          v-else
          type="success"
          title="Tüm haberler yüklendi"
          message="Mevcut tüm haberleri görüntülediniz"
          icon="mdi-check-circle"
        />
      </div>
    </section>

    <!-- Banner Ad - Medium Rectangle (300x250) -->
    <section class="my-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- ROKETSAN -->
        <div class="w-full overflow-hidden rounded-lg">
          <a href="#" target="_blank" class="block">
            <div class="bg-red-50 w-full h-[250px] flex flex-col items-center justify-center border border-red-100 rounded-lg overflow-hidden">
              <div class="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                R
              </div>
              <div class="text-xl font-bold text-red-800 mb-2">ROKETSAN</div>
              <div class="text-sm text-red-600 mb-4">Füze ve Roket Sistemleri</div>
              <div class="bg-red-600 text-white py-2 px-6 rounded-full text-sm font-medium">
                Keşfet
              </div>
            </div>
          </a>
          <div class="text-xs text-gray-500 mt-1 text-right">Reklam</div>
        </div>

        <!-- HAVELSAN -->
        <div class="w-full overflow-hidden rounded-lg">
          <a href="#" target="_blank" class="block">
            <div class="bg-green-50 w-full h-[250px] flex flex-col items-center justify-center border border-green-100 rounded-lg overflow-hidden">
              <div class="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                H
              </div>
              <div class="text-xl font-bold text-green-800 mb-2">HAVELSAN</div>
              <div class="text-sm text-green-600 mb-4">Yazılım ve Bilişim</div>
              <div class="bg-green-600 text-white py-2 px-6 rounded-full text-sm font-medium">
                Detaylı Bilgi
              </div>
            </div>
          </a>
          <div class="text-xs text-gray-500 mt-1 text-right">Reklam</div>
        </div>
      </div>
    </section>

    <!-- Defense Categories Grid -->
    <!-- Kara / Hava / Deniz bölümleri -->
    <!-- ... (senin orijinal kodundaki gibi kalabilir, yukarı taşınması gerekmez) -->

    <!-- Technology and Projects -->
    <!-- Teknoloji / Projeler bölümleri -->

    <!-- Banner Ad - Wide Skyscraper (160x600) -->
    <section class="my-8">
      <div class="w-full overflow-hidden rounded-lg">
        <a href="#" target="_blank" class="block">
          <div class="bg-gray-50 w-full h-[120px] md:h-[90px] flex items-center justify-center border border-gray-200 rounded-lg overflow-hidden">
            <div class="flex flex-col md:flex-row items-center justify-between w-full px-4 md:px-8">
              <div class="flex items-center mb-3 md:mb-0">
                <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                  M
                </div>
                <div>
                  <div class="text-lg font-bold text-primary">MKE</div>
                  <div class="text-xs text-primary/70">Makina ve Kimya Endüstrisi</div>
                </div>
              </div>
              <div class="bg-primary text-white py-1.5 px-4 rounded-lg text-sm font-medium">
                Ziyaret Et
              </div>
            </div>
          </div>
        </a>
        <div class="text-xs text-gray-500 mt-1 text-right">Reklam</div>
      </div>
    </section>

  </div>
</template>


<script>
import { mapState } from 'vuex'
import NewsPost from '@/components/news/NewsPost.vue'
import StateMessage from '@/components/common/StateMessage.vue'

export default {
  name: 'HomePage',
  components: {
    NewsPost,
    StateMessage
  },
  data() {
    return {
      selectedFilter: 'all',
      loadingMore: false,
      hasMorePosts: true,
      displayedPostsCount: 10
    }
  },
  async mounted() {
    // HomePage yüklendiğinde veri varsa tekrar çekme
    if (!this.latestNews || this.latestNews.length === 0) {
      await this.fetchInitialData()
    }
    
    // Infinite scroll listener ekle
    this.setupInfiniteScroll()
  },
  
  beforeUnmount() {
    // Listener'ı temizle
    this.removeInfiniteScroll()
  },
  computed: {
    ...mapState('categories', ['categories']),
    ...mapState('news', ['latestNews', 'popularNews', 'featuredNews']),
    
    isLoading() {
      return this.$store.getters['news/isLoading']('latest') || 
             this.$store.getters['news/isLoading']('featured') ||
             this.$store.getters['categories/isLoading']('categories')
    },
    
    filteredNews() {
      if (!this.latestNews || !Array.isArray(this.latestNews)) {
        return []
      }
      
      let filtered = [...this.latestNews]
      
      switch (this.selectedFilter) {
        case 'trending':
          // Sort by engagement (likes + comments) - simulated
          filtered.sort(() => (Math.random() * 1000) - (Math.random() * 1000))
          break
        case 'recent':
          // Sort by date (most recent first)
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
          break
        default:
          // Default: mix of recent and trending
          break
      }
      
      return filtered.slice(0, this.displayedPostsCount)
    }
  },
  methods: {
    async fetchInitialData() {
      try {
        // Paralel olarak tüm verileri çek
        await Promise.all([
          this.$store.dispatch('news/fetchLatestNews', 20),
          this.$store.dispatch('news/fetchFeaturedNews', 5),
          this.$store.dispatch('news/fetchPopularNews', 5),
          this.$store.dispatch('categories/fetchCategories')
        ])
      } catch (error) {
        console.error('Error fetching homepage data:', error)
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
    },
    
    async loadMorePosts() {
      if (this.loadingMore || !this.hasMorePosts) return
      
      this.loadingMore = true
      
      try {
        // Daha fazla makale yükle
        const currentCount = this.displayedPostsCount
        await this.$store.dispatch('news/fetchLatestNews', currentCount + 10)
        
        this.displayedPostsCount += 10
        
        // Eğer gelen veri sayısı istediğimizden azsa, daha fazla veri yok demektir
        if (this.latestNews.length < this.displayedPostsCount) {
          this.hasMorePosts = false
        }
      } catch (error) {
        console.error('Error loading more posts:', error)
      } finally {
        this.loadingMore = false
      }
    },
    
    setupInfiniteScroll() {
      this.scrollHandler = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const windowHeight = window.innerHeight
        const documentHeight = document.documentElement.scrollHeight
        
        // Sayfa sonuna 200px yaklaştığında yeni veri yükle
        if (scrollTop + windowHeight >= documentHeight - 200) {
          this.loadMorePosts()
        }
      }
      
      // Throttle scroll event for performance
      this.throttledScrollHandler = this.throttle(this.scrollHandler, 300)
      window.addEventListener('scroll', this.throttledScrollHandler)
    },
    
    removeInfiniteScroll() {
      if (this.throttledScrollHandler) {
        window.removeEventListener('scroll', this.throttledScrollHandler)
      }
    },
    
    throttle(func, delay) {
      let timeoutId
      let lastExecTime = 0
      
      return function (...args) {
        const currentTime = Date.now()
        
        if (currentTime - lastExecTime > delay) {
          func.apply(this, args)
          lastExecTime = currentTime
        } else {
          clearTimeout(timeoutId)
          timeoutId = setTimeout(() => {
            func.apply(this, args)
            lastExecTime = Date.now()
          }, delay - (currentTime - lastExecTime))
        }
      }
    }
  },
  
  watch: {
    selectedFilter() {
      // Reset displayed posts when filter changes
      this.displayedPostsCount = 10
      this.hasMorePosts = true
    }
  }
}
</script>

<style scoped>
/* Homepage Feed Layout */
.homepage-feed {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Stories Section */
.stories-section {
  margin-bottom: 2rem;
}

.stories-card {
  padding: 1rem;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.stories-container {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0;
}

.story-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
  cursor: pointer;
}

.story-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid var(--color-info-600);
  padding: 2px;
  margin-bottom: 0.5rem;
  transition: transform 0.2s ease;
}

.story-avatar:hover {
  transform: scale(1.05);
}

.story-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.story-label {
  font-size: 0.75rem;
  text-align: center;
  color: rgba(0, 0, 0, 0.7);
  font-weight: 500;
}

/* News Feed */
.news-feed {
  margin-bottom: 2rem;
}

.feed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
}

.feed-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.87);
  margin: 0;
}

.feed-filter {
  display: flex;
  gap: 0.5rem;
}

/* Posts Container */
.posts-container {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-height: 100vh; /* Prevent layout shift */
  transition: opacity 0.3s ease;
}

/* Prevent content jump during loading */
.posts-container.loading {
  opacity: 0.9;
}

.news-posts-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Infinite Scroll Loading */
.infinite-scroll-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 0;
  margin: 1rem 0;
}

.loading-text {
  margin: 0;
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
}


/* Mobile Responsive */
@media (max-width: 768px) {
  .homepage-feed {
    padding: 0 0.5rem;
  }
  
  .feed-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .feed-title {
    font-size: 1.25rem;
  }
  
  .stories-container {
    gap: 0.75rem;
  }
  
  .story-item {
    min-width: 70px;
  }
  
  .story-avatar {
    width: 50px;
    height: 50px;
  }
  
  .story-label {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .homepage-feed {
    padding: 0 0.25rem;
  }
  
  .feed-header {
    padding: 0 0.25rem;
  }
  
  .stories-card {
    padding: 0.75rem;
  }
}

/* Scrollbar for stories */
.stories-container::-webkit-scrollbar {
  height: 4px;
}

.stories-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.stories-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 2px;
}

.stories-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
}

/* Loading States */
.loading-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stories-loading {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0;
}

.story-skeleton {
  min-width: 60px;
  height: 60px;
}

.stories-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80px;
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

@keyframes slideInUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.loading-posts {
  animation: pulse 1.5s ease-in-out infinite;
}

/* New posts animation */
.news-post-enter-active {
  animation: slideInUp 0.6s ease-out;
}

.news-post-enter-from {
  transform: translateY(30px);
  opacity: 0;
}

</style> 