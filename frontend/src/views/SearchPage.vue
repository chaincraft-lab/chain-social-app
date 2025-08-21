<template>
  <div class="search-page theme-bg-primary theme-text-primary">
    <!-- Search Header -->
    <SearchHeader
      v-model:query="searchQuery"
      :total-results="totalResults"
      @search="performSearch"
    />
    
    <!-- Search Results -->
    <div class="search-results">
      <!-- Loading State -->
      <LoadingSpinner 
        v-if="isLoading" 
        size="lg" 
        text="Arama sonuçları yükleniyor..." 
        :fullScreen="false" 
      />
      
      <!-- Error State -->
      <ErrorState
        v-else-if="error"
        title="Arama Hatası"
        :message="error"
        @retry="performSearch"
      />
      
      <!-- Search Results -->
      <div v-else-if="searchResults.length > 0" class="results-container">
        <NewsPost 
          v-for="article in searchResults" 
          :key="article.id"
          :news="article"
        />
        
        <!-- Load More Button -->
        <LoadMoreButton
          :has-more="hasMoreResults"
          :is-loading="loadingMore"
          :show-end-message="!hasMoreResults && searchResults.length > 0"
          button-text="Daha Fazla Sonuç"
          end-message="Tüm arama sonuçları görüntülediniz"
          @loadMore="loadMoreResults"
        />
      </div>
      
      <!-- No Results -->
      <StateMessage
        v-if="hasSearched"
        type="empty"
        title="Sonuç bulunamadı"
        :message="`\"${searchQuery}\" için herhangi bir sonuç bulunamadı. Farklı kelimeler deneyin.`"
        icon="mdi-magnify-remove-outline"
      />
 
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import NewsPost from '@/components/news/NewsPost.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import LoadMoreButton from '@/components/common/LoadMoreButton.vue'
import StateMessage from '@/components/common/StateMessage.vue'
import SearchHeader from '@/components/ui/Search/SearchHeader.vue'

export default {
  name: 'SearchPage',
  components: {
    NewsPost,
    LoadingSpinner,
    ErrorState,
    LoadMoreButton,
    StateMessage,
    SearchHeader
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    
    const searchQuery = ref('')
    const searchResults = ref([])
    const loadingMore = ref(false)
    const error = ref(null)
    const hasSearched = ref(false)
    const currentPage = ref(1)
    const totalResults = ref(0)
    const limit = 10
    
    const isLoading = computed(() => store.getters['news/isLoading']('search'))
    
    const hasMoreResults = computed(() => {
      return searchResults.value.length < totalResults.value
    })
    
    const performSearch = async (page = 1) => {
      if (!searchQuery.value.trim()) return
      
      try {
        if (page === 1) {
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
        error.value = err.message || 'Arama sırasında hata oluştu'
      } finally {
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


/* Search Results */
.search-results {
  margin-bottom: 2rem;
}

.results-container {
  display: flex;
  flex-direction: column;
  gap: 0;
}


/* Mobile Responsive */
@media (max-width: 768px) {
  .search-page {
    padding: 0 0.5rem;
  }
}

@media (max-width: 480px) {
  .search-page {
    padding: 0 0.25rem;
  }
}

</style>