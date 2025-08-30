<template>
  <div class="user-content-list-page">
    <!-- Page Header -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <Icon :icon="config.icon" class="w-8 h-8" :class="config.iconClass" />
        <h1 class="text-3xl font-bold theme-text-primary">{{ config.title }}</h1>
      </div>
      <p class="theme-text-secondary text-lg">
        {{ config.description }}
      </p>
    </div>

    <!-- Filter Bar -->
    <div class="theme-card rounded-lg p-4 mb-6">
      <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <!-- Sort Options -->
        <div class="flex items-center gap-3">
          <span class="theme-text-secondary text-sm font-medium">Sırala:</span>
          <select 
            v-model="sortBy" 
            @change="handleSortChange"
            class="theme-input rounded-md px-3 py-1 text-sm border theme-border-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option 
              v-for="option in config.sortOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Stats -->
        <div class="flex items-center gap-2 theme-text-secondary text-sm">
          <Icon :icon="config.statsIcon" class="w-4 h-4" />
          <span>{{ items?.length || 0 }} {{ config.statsText }}</span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <SkeletonLoader v-for="i in 5" :key="i" class="h-48" />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else-if="!loading && (!items || items.length === 0)"
      :icon="config.emptyState.icon"
      :title="config.emptyState.title"
      :description="config.emptyState.description"
      :show-action="true"
      action-text="Ana Sayfaya Git"
      @action="$router.push('/')"
    />

    <!-- Items List -->
    <div v-else class="space-y-6">
      <!-- Content Item with Remove Option -->
      <div 
        v-for="(item, index) in sortedItems" 
        :key="item.id"
        class="theme-card rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 group"
      >
        <div class="relative">
          <!-- Remove Button -->
          <button
            @click="removeItem(item.article.id)"
            class="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            :title="config.removeButtonTitle"
          >
            <Icon 
              :icon="config.removeIcon" 
              class="w-5 h-5 text-red-500 hover:text-red-600" 
            />
          </button>

          <!-- News Item -->
          <NewsItem
            :news="item.article"
            :index="index"
            :title-size="'lg'"
            :show-like="config.type !== 'likes'"
            :show-bookmark="config.type !== 'bookmarks'"
            @click="goToArticle(item.article.slug || item.article.id)"
          />

          <!-- Item Info -->
          <div class="px-4 pb-3 flex items-center justify-between">
            <div class="flex items-center gap-2 theme-text-secondary text-sm">
              <Icon :icon="config.dateIcon" class="w-4 h-4" />
              <span>{{ formatDate(item.createdAt) }} tarihinde {{ config.actionText }}</span>
            </div>
            
            <!-- Additional Stats (for likes page) -->
            <div 
              v-if="config.type === 'likes'" 
              class="flex items-center gap-4 theme-text-secondary text-sm"
            >
              <div class="flex items-center gap-1">
                <Icon icon="mdi-heart" class="w-4 h-4 text-red-500" />
                <span>{{ item.article.likeCount || 0 }}</span>
              </div>
              <div class="flex items-center gap-1">
                <Icon icon="mdi-eye" class="w-4 h-4" />
                <span>{{ item.article.viewCount || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Load More Button -->
    <div v-if="hasMore && !loading" class="flex justify-center mt-8">
      <LoadMoreButton @click="loadMore" :loading="loadingMore" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Icon } from '@iconify/vue'
import NewsItem from '@/components/ui/News/NewsItem.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import SkeletonLoader from '@/components/common/SkeletonLoader.vue'
import LoadMoreButton from '@/components/common/LoadMoreButton.vue'

const props = defineProps({
  config: {
    type: Object,
    required: true,
    validator: (config) => {
      return config.type && config.service && config.title
    }
  }
})

const router = useRouter()
const store = useStore()

// Reactive state
const items = ref([])
const loading = ref(true)
const loadingMore = ref(false)
const sortBy = ref('newest')
const currentPage = ref(1)
const hasMore = ref(true)

// Computed
const sortedItems = computed(() => {
  if (!items.value || !Array.isArray(items.value)) {
    return []
  }
  
  const sorted = [...items.value]
  
  switch (sortBy.value) {
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    case 'title':
      return sorted.sort((a, b) => a.article?.title?.localeCompare(b.article?.title, 'tr') || 0)
    case 'popular':
      return sorted.sort((a, b) => (b.article?.likeCount || 0) - (a.article?.likeCount || 0))
    case 'newest':
    default:
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
})

// Methods
const loadItems = async (page = 1, reset = true) => {
  try {
    if (reset) {
      loading.value = true
    } else {
      loadingMore.value = true
    }

    const response = await props.config.service.getMyItems({
      page,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
    
    const responseData = response.data?.data || response.data || []
    
    if (reset) {
      items.value = Array.isArray(responseData) ? responseData : []
    } else {
      items.value.push(...(Array.isArray(responseData) ? responseData : []))
    }
    
    hasMore.value = response.data?.hasNext || false
    currentPage.value = page

  } catch (error) {
    console.error(`Error loading ${props.config.type}:`, error)
    items.value = []
    
    // Safe notification dispatch
    try {
      store.dispatch('notifications/addNotification', {
        type: 'error',
        message: props.config.errorMessage
      })
    } catch (notificationError) {
      console.error('Notification error:', notificationError)
    }
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const loadMore = () => {
  if (!hasMore.value || loadingMore.value) return
  loadItems(currentPage.value + 1, false)
}

const handleSortChange = () => {
  // Sorting is handled by computed property
}

const removeItem = async (articleId) => {
  try {
    await props.config.service.toggleItem(articleId)
    
    // Remove from local state
    if (items.value && Array.isArray(items.value)) {
      items.value = items.value.filter(item => item.article?.id !== articleId)
    }
    
    // Safe notification dispatch
    try {
      store.dispatch('notifications/addNotification', {
        type: 'success',
        message: props.config.successMessage
      })
    } catch (notificationError) {
      console.error('Notification error:', notificationError)
    }

  } catch (error) {
    console.error(`Error removing ${props.config.type}:`, error)
    try {
      store.dispatch('notifications/addNotification', {
        type: 'error',
        message: props.config.removeErrorMessage
      })
    } catch (notificationError) {
      console.error('Notification error:', notificationError)
    }
  }
}

const goToArticle = (slug) => {
  router.push({
    name: 'article',
    params: { slug }
  })
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(() => {
  // Check if user is authenticated
  if (!store.getters['user/isAuthenticated']) {
    router.push('/')
    return
  }
  
  loadItems()
})
</script>

<style scoped>
.user-content-list-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (max-width: 768px) {
  .user-content-list-page {
    padding: 0 0.5rem;
  }
}
</style>