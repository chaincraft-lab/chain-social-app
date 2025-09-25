<template>
  <div class="profile-likes p-6">
    <!-- Section Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold theme-text-primary flex items-center gap-2">
          <Icon icon="heroicons:heart" class="w-6 h-6 text-red-500" />
          Beğendiklerim
        </h2>
        <p class="theme-text-secondary mt-1">Beğendiğiniz haberler ve makaleler</p>
      </div>
      
      <!-- Filter Options -->
      <div class="hidden md:flex items-center gap-2">
        <select 
          v-model="selectedFilter"
          class="px-3 py-2 border theme-border-primary rounded-lg theme-bg-secondary theme-text-primary text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Tümü</option>
          <option value="recent">Son 7 Gün</option>
          <option value="month">Son 30 Gün</option>
          <option value="category">Kategoriye Göre</option>
        </select>
        
        <button 
          @click="toggleView"
          class="p-2 theme-bg-secondary hover:theme-bg-primary rounded-lg transition-colors"
          :title="viewMode === 'grid' ? 'Liste Görünümü' : 'Kart Görünümü'"
        >
          <Icon 
            :icon="viewMode === 'grid' ? 'heroicons:list-bullet' : 'heroicons:squares-2x2'" 
            class="w-5 h-5 theme-text-secondary"
          />
        </button>
      </div>
    </div>
    
    <!-- Mobile Filters -->
    <div class="md:hidden mb-4 space-y-2">
      <select 
        v-model="selectedFilter"
        class="w-full px-3 py-2 border theme-border-primary rounded-lg theme-bg-secondary theme-text-primary text-sm"
      >
        <option value="all">Tümü</option>
        <option value="recent">Son 7 Gün</option>
        <option value="month">Son 30 Gün</option>
        <option value="category">Kategoriye Göre</option>
      </select>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading && likedPosts.length === 0" class="space-y-4">
      <SkeletonLoader v-for="i in 6" :key="i" type="news" />
    </div>
    
    <!-- Empty State -->
    <EmptyState 
      v-else-if="!isLoading && filteredPosts.length === 0"
      icon="heroicons:heart"
      title="Henüz beğendiğiniz haber yok"
      description="Haberları beğenmeye başlayın, burada görüntüleyin."
      action-text="Haberleri Keşfet"
      @action="$router.push('/')"
    />
    
    <!-- Posts Grid/List -->
    <div v-else>
      <!-- Grid View -->
      <div 
        v-if="viewMode === 'grid'"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div 
          v-for="post in filteredPosts" 
          :key="post.id"
          class="group cursor-pointer"
          @click="navigateToPost(post.id)"
        >
          <div class="theme-bg-secondary rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105">
            <!-- Post Image -->
            <div class="relative overflow-hidden">
              <img 
                :src="post.image" 
                :alt="post.title"
                class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                @error="handleImageError"
              />
              
              <!-- Category Badge -->
              <div class="absolute top-3 left-3">
                <CategoryBadge :category="post.category" />
              </div>
              
              <!-- Unlike Button -->
              <button 
                @click.stop="unlikePost(post.id)"
                class="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                title="Beğeniyi Kaldır"
              >
                <Icon icon="heroicons:heart-solid" class="w-4 h-4" />
              </button>
            </div>
            
            <!-- Post Content -->
            <div class="p-4">
              <h3 class="font-semibold theme-text-primary mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {{ post.title }}
              </h3>
              <p class="theme-text-secondary text-sm mb-3 line-clamp-2">
                {{ post.excerpt }}
              </p>
              
              <!-- Post Meta -->
              <div class="flex items-center justify-between text-xs theme-text-secondary">
                <span>{{ formatDate(post.likedAt) }}</span>
                <div class="flex items-center gap-1">
                  <Icon icon="heroicons:heart" class="w-3 h-3 text-red-500" />
                  <span>{{ formatDate(post.date) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- List View -->
      <div v-else class="space-y-4">
        <div 
          v-for="post in filteredPosts" 
          :key="post.id"
          class="flex gap-4 p-4 theme-bg-secondary rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer group"
          @click="navigateToPost(post.id)"
        >
          <!-- Post Image -->
          <div class="flex-shrink-0">
            <img 
              :src="post.image" 
              :alt="post.title"
              class="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg"
              @error="handleImageError"
            />
          </div>
          
          <!-- Post Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2 mb-2">
              <h3 class="font-semibold theme-text-primary group-hover:text-blue-600 transition-colors line-clamp-2">
                {{ post.title }}
              </h3>
              <button 
                @click.stop="unlikePost(post.id)"
                class="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Beğeniyi Kaldır"
              >
                <Icon icon="heroicons:heart-solid" class="w-4 h-4" />
              </button>
            </div>
            
            <p class="theme-text-secondary text-sm mb-3 line-clamp-2">
              {{ post.excerpt }}
            </p>
            
            <!-- Post Meta -->
            <div class="flex flex-wrap items-center gap-4 text-xs theme-text-secondary">
              <CategoryBadge :category="post.category" size="sm" />
              <div class="flex items-center gap-1">
                <Icon icon="heroicons:calendar" class="w-3 h-3" />
                <span>{{ formatDate(post.date) }}</span>
              </div>
              <div class="flex items-center gap-1">
                <Icon icon="heroicons:heart" class="w-3 h-3 text-red-500" />
                <span>{{ formatDate(post.likedAt) }} tarihinde beğenildi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Load More Button -->
      <LoadMoreButton
        v-if="hasMore"
        :is-loading="isLoading"
        button-text="Daha Fazla Yükle"
        @load-more="$emit('load-more')"
        class="mt-8"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import CategoryBadge from '@/components/ui/Categories/CategoryBadge.vue'
import SkeletonLoader from '@/components/common/SkeletonLoader.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import LoadMoreButton from '@/components/common/LoadMoreButton.vue'

// Props
const props = defineProps({
  likedPosts: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  hasMore: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['load-more', 'unlike-post'])

// State
const selectedFilter = ref('all')
const viewMode = ref('grid') // 'grid' or 'list'

// Computed
const filteredPosts = computed(() => {
  let posts = [...props.likedPosts]
  
  switch (selectedFilter.value) {
    case 'recent':
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      posts = posts.filter(post => new Date(post.likedAt) >= weekAgo)
      break
    case 'month':
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      posts = posts.filter(post => new Date(post.likedAt) >= monthAgo)
      break
    case 'category':
      // Group by category - could be expanded
      break
  }
  
  return posts.sort((a, b) => new Date(b.likedAt) - new Date(a.likedAt))
})

// Methods
const toggleView = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

const navigateToPost = (postId) => {
  // Navigate to post detail
  console.log('Navigate to post:', postId)
  // this.$router.push(`/article/${postId}`)
}

const unlikePost = (postId) => {
  if (confirm('Bu haberi beğenmeyi kaldırmak istediğinizden emin misiniz?')) {
    emit('unlike-post', postId)
  }
}

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/300x200/f0f0f0/666666?text=Görsel+Yüklenemedi'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return 'Dün'
  if (diffDays < 7) return `${diffDays} gün önce`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`
  
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .profile-likes {
    padding: 1rem;
  }
}
</style>