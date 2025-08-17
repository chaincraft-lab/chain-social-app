<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Loading State -->
    <LoadingSpinner
      v-if="isLoading"
      size="lg"
      text="Etiket bilgileri yükleniyor..."
      :fullScreen="false"
    />

    <!-- Error State -->
    <ErrorState
      v-else-if="error"
      :title="errorTitle"
      :message="error"
      @retry="loadTagData"
    />

    <!-- Tag Content -->
    <div v-else-if="currentTag">
      <!-- Tag Posts List -->
      <TagPostsList
        :posts="tagArticles"
        :is-loading="articlesLoading"
      />

      <!-- Load More Button -->
      <LoadMoreButton
        :has-more="hasMorePosts"
        :is-loading="loadingMore"
        :show-end-message="tagArticles.length > 0 && !hasMorePosts"
        @loadMore="loadMorePosts"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a4 4 0 01-4-4V7a4 4 0 014-4z"/>
      </svg>
      <p class="text-gray-500 text-lg">Etiket bulunamadı</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

// Components
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import TagPostsList from '@/components/ui/Tags/TagPostsList.vue'
import LoadMoreButton from '@/components/ui/Tags/LoadMoreButton.vue'

const route = useRoute()
const store = useStore()

// Reactive state
const currentTag = ref(null)
const tagArticles = ref([])
const totalArticles = ref(0)
const isLoading = ref(true)
const articlesLoading = ref(false)
const loadingMore = ref(false)
const hasMorePosts = ref(true)
const error = ref(null)
const currentPage = ref(1)
const postsPerPage = 10

// Computed properties
const errorTitle = computed(() => {
  if (error.value?.includes('404') || error.value?.includes('bulunamadı')) {
    return 'Etiket Bulunamadı'
  }
  return 'Bir Hata Oluştu'
})

// Methods
const loadTagData = async () => {
  try {
    isLoading.value = true
    error.value = null

    const slug = route.params.slug

    // Tag bilgisini çek ve articles'ları ondan al
    const tagData = await store.dispatch("tags/fetchTagBySlug", slug)
    currentTag.value = tagData
    
    if (tagData && tagData.articles) {
      tagArticles.value = tagData.articles
      totalArticles.value = tagData.articles.length
    }
    
    // HasMorePosts logic - eğer sayfalama varsa
    hasMorePosts.value = false // Store'dan gelen veri full list ise false

  } catch (err) {
    console.error("Error loading tag data:", err)
    error.value = "Etiket bilgileri yüklenirken hata oluştu"
  } finally {
    isLoading.value = false
  }
}

const loadTagInfo = async (tagSlug) => {
  // Bu function artık kullanılmıyor, loadTagData içinde birleştirildi
}

const loadMorePosts = async () => {
  if (loadingMore.value || !hasMorePosts.value) return
  
  loadingMore.value = true
  
  try {
    // Eğer sayfalama gerekirse buraya sayfalama logic'i eklenebilir
    // Şimdilik store'dan gelen veri full list olduğu için boş
    console.log('Load more posts - implement if pagination needed')
  } catch (err) {
    console.error('Load more error:', err)
  } finally {
    loadingMore.value = false
  }
}

// Lifecycle and watchers
onMounted(() => {
  loadTagData()
})

// Watch route changes
watch(() => route.params.slug, () => {
  if (route.name === 'tag') {
    loadTagData()
  }
})
</script>

<style scoped>
/* Tag page specific styles */
.tag-page {
  min-height: 100vh;
}

/* Responsive */
@media (max-width: 768px) {
  .tag-page {
    padding: 1rem 0.5rem;
  }
}
</style>