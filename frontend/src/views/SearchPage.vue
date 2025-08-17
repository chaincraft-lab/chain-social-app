<template>
  <div class="search-page">
    <!-- Search Header -->
    <div class="search-header">
      <div class="bg-light rounded-lg p-6 mb-6">
        <div class="flex items-center mb-4">
          <v-icon class="mr-3" color="primary">mdi-magnify</v-icon>
          <h1 class="text-2xl md:text-3xl font-bold text-dark">
            Arama Sonuçları
          </h1>
        </div>
        
        <!-- Search Input -->
        <div class="relative mb-4">
          <form @submit.prevent="performSearch">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Haber ara..." 
              class="w-full py-3 pl-12 pr-4 text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-dark placeholder-gray-500"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-4">
              <v-icon color="gray">mdi-magnify</v-icon>
            </div>
            <button 
              type="submit"
              class="absolute inset-y-0 right-0 flex items-center pr-4 text-primary hover:text-primary/80"
            >
              <span class="text-sm font-medium">Ara</span>
            </button>
          </form>
        </div>
        
        <!-- Search Info -->
        <div class="text-dark/70">
          <span v-if="searchQuery">
            "<strong>{{ searchQuery }}</strong>" için {{ totalResults }} sonuç bulundu
          </span>
          <span v-else>
            Aramak istediğiniz kelimeyi yukarı giriniz.
          </span>
        </div>
      </div>
    </div>
    
    <!-- Search Results -->
    <div class="search-results">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-results">
        <div v-for="i in 5" :key="i" class="loading-result">
          <v-skeleton-loader type="article" class="mb-4"></v-skeleton-loader>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8">
        <v-alert type="error" class="mb-4">
          {{ error }}
        </v-alert>
        <v-btn @click="performSearch" color="primary">
          Tekrar Dene
        </v-btn>
      </div>
      
      <!-- Search Results -->
      <div v-else-if="searchResults.length > 0" class="results-container">
        <NewsPost 
          v-for="article in searchResults" 
          :key="article.id"
          :news="article"
        />
        
        <!-- Load More Button -->
        <div class="load-more-section" v-if="hasMoreResults">
          <v-btn 
            color="primary" 
            variant="outlined" 
            size="large"
            rounded="pill"
            @click="loadMoreResults"
            :loading="loadingMore"
          >
            <v-icon start>mdi-refresh</v-icon>
            Daha Fazla Sonuç
          </v-btn>
        </div>
        
        <!-- End of Results -->
        <div class="end-of-results" v-else>
          <v-icon size="large" color="grey">mdi-check-circle</v-icon>
          <p class="text-grey">Tüm sonuçlar gösterildi</p>
        </div>
      </div>
      
      <!-- No Results -->
      <div v-else-if="hasSearched" class="no-results">
        <div class="text-center py-12">
          <v-icon size="large" color="grey" class="mb-4">mdi-magnify-remove-outline</v-icon>
          <h3 class="text-xl font-semibold text-dark mb-2">Sonuç bulunamadı</h3>
          <p class="text-dark/70 mb-4">
            "<strong>{{ searchQuery }}</strong>" için herhangi bir sonuç bulunamadı.
          </p>
          <div class="text-sm text-dark/60">
            <p class="mb-2">Arama önerileri:</p>
            <ul class="list-disc list-inside space-y-1">
              <li>Farklı kelimeler deneyin</li>
              <li>Daha genel terimler kullanın</li>
              <li>Yazımı kontrol edin</li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- Welcome State -->
      <div v-else class="welcome-search">
        <div class="text-center py-12">
          <v-icon size="large" color="primary" class="mb-4">mdi-magnify</v-icon>
          <h3 class="text-xl font-semibold text-dark mb-2">Haber Arama</h3>
          <p class="text-dark/70">
            Aramak istediğiniz haberi yukarıdaki arama kutusuna yazın.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import NewsPost from '@/components/news/NewsPost.vue'

export default {
  name: 'SearchPage',
  components: {
    NewsPost
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    
    const searchQuery = ref('')
    const searchResults = ref([])
    const isLoading = ref(false)
    const loadingMore = ref(false)
    const error = ref(null)
    const hasSearched = ref(false)
    const currentPage = ref(1)
    const totalResults = ref(0)
    const limit = 10
    
    const hasMoreResults = computed(() => {
      return searchResults.value.length < totalResults.value
    })
    
    const performSearch = async (page = 1) => {
      if (!searchQuery.value.trim()) return
      
      try {
        if (page === 1) {
          isLoading.value = true
          searchResults.value = []
        } else {
          loadingMore.value = true
        }
        
        error.value = null
        hasSearched.value = true
        
        const response = await store.dispatch('news/searchNews', {
          query: searchQuery.value.trim(),
          filters: {
            page,
            limit
          }
        })
        
        if (page === 1) {
          searchResults.value = response || []
        } else {
          searchResults.value = [...searchResults.value, ...(response || [])]
        }
        
        // Backend'den total count alınabilirse
        totalResults.value = response?.length || searchResults.value.length
        currentPage.value = page
        
        // URL'yi güncelle
        if (route.query.q !== searchQuery.value.trim()) {
          router.replace({
            name: 'search',
            query: { q: searchQuery.value.trim() }
          })
        }
        
      } catch (err) {
        console.error('Error searching articles:', err)
        error.value = 'Arama sırasında hata oluştu'
      } finally {
        isLoading.value = false
        loadingMore.value = false
      }
    }
    
    const loadMoreResults = () => {
      performSearch(currentPage.value + 1)
    }
    
    // URL'den query'yi al
    const initializeFromQuery = () => {
      const query = route.query.q
      if (query) {
        searchQuery.value = query
        performSearch()
      }
    }
    
    // URL değişikliklerini izle
    watch(() => route.query.q, (newQuery) => {
      if (newQuery !== searchQuery.value) {
        searchQuery.value = newQuery || ''
        if (newQuery) {
          performSearch()
        } else {
          searchResults.value = []
          hasSearched.value = false
        }
      }
    })
    
    onMounted(() => {
      initializeFromQuery()
    })
    
    return {
      searchQuery,
      searchResults,
      isLoading,
      loadingMore,
      error,
      hasSearched,
      totalResults,
      hasMoreResults,
      performSearch,
      loadMoreResults
    }
  }
}
</script>

<style scoped>
/* Search Page Layout */
.search-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.search-header {
  margin-bottom: 1rem;
}

/* Search Results */
.search-results {
  margin-bottom: 2rem;
}

.results-container {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Loading States */
.loading-results {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loading-result {
  margin-bottom: 1rem;
}

/* Load More Section */
.load-more-section {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.end-of-results,
.no-results,
.welcome-search {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
}

.end-of-results {
  gap: 1rem;
  opacity: 0.7;
}

.end-of-results p {
  margin: 0;
  font-weight: 500;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .search-page {
    padding: 0 0.5rem;
  }
  
  .search-header {
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 480px) {
  .search-page {
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

.loading-results {
  animation: pulse 1.5s ease-in-out infinite;
}
</style>