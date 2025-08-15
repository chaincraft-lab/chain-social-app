<template>
  <div class="homepage-feed">
    <!-- Stories/Highlights Section -->
    <section class="stories-section" v-if="featuredNews && featuredNews.length">
      <v-card class="stories-card" elevation="1" rounded="xl">
        <div class="stories-container">
          <div class="story-item" v-for="story in featuredNews.slice(0, 5)" :key="story.id">
            <div class="story-avatar">
              <v-img 
                :src="story.image" 
                :alt="story.category?.name"
                cover
                class="story-image"
              ></v-img>
            </div>
            <div class="story-label">{{ story.category?.name || 'Haber' }}</div>
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
        <NewsPost 
          v-for="news in filteredNews" 
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
        <div class="end-of-feed" v-else>
          <v-icon size="large" color="grey">mdi-check-circle</v-icon>
          <p class="text-grey">Tüm haberler yüklendi</p>
        </div>
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

    <!-- International News -->
    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-dark">Uluslararası</h2>
        <router-link 
          :to="{ name: 'category', params: { slug: 'uluslararasi' } }"
          class="text-sm text-primary hover:text-secondary transition-colors"
        >
          Tümünü Gör
        </router-link>
      </div>
      
      <!-- <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NewsCard 
          v-for="news in getCategoryNewsBySlug('uluslararasi').slice(0, 3)" 
          :key="news?.id || Math.random()" 
          :news="news"
          :show-excerpt="true"
          excerpt-length="100"
        />
      </div> -->
    </section>
  </div>
</template>


<script>
import { mapState } from 'vuex'
import NewsPost from '@/components/news/NewsPost.vue'

export default {
  name: 'HomePage',
  components: {
    NewsPost
  },
  data() {
    return {
      selectedFilter: 'all',
      loadingMore: false,
      hasMorePosts: true,
      displayedPostsCount: 10
    }
  },
  computed: {
    ...mapState('categories', ['categories']),
    ...mapState('news', ['latestNews', 'popularNews', 'featuredNews']),
    
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
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
    },
    
    loadMorePosts() {
      this.loadingMore = true
      
      // Simulate API call delay
      setTimeout(() => {
        this.displayedPostsCount += 5
        
        // Check if we've reached the end
        if (this.displayedPostsCount >= this.latestNews.length) {
          this.hasMorePosts = false
        }
        
        this.loadingMore = false
      }, 1000)
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
  border: 3px solid #1976d2;
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
}

/* Load More Section */
.load-more-section {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.end-of-feed {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 0;
  gap: 1rem;
  opacity: 0.7;
}

.end-of-feed p {
  margin: 0;
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