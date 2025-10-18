<template>
  <div class="profile-bookmarks p-6">
    <!-- Section Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold theme-text-primary flex items-center gap-2">
          <Icon icon="heroicons:bookmark" class="w-6 h-6 text-blue-500" />
          Kaydettiklerim
        </h2>
        <p class="theme-text-secondary mt-1">Daha sonra okumak için kaydettiğiniz haberler</p>
      </div>
      
      <!-- Action Buttons -->
      <div class="hidden md:flex items-center gap-2">
        <button 
          @click="selectAll"
          class="px-3 py-2 text-sm theme-bg-secondary hover:theme-bg-primary rounded-lg transition-colors theme-text-secondary hover:theme-text-primary"
        >
          {{ allSelected ? 'Seçimi Kaldır' : 'Tümünü Seç' }}
        </button>
        
        <button 
          v-if="selectedPosts.length > 0"
          @click="removeSelected"
          class="px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Seçilenleri Kaldır ({{ selectedPosts.length }})
        </button>
        
        <select 
          v-model="selectedFilter"
          class="px-3 py-2 border theme-border-primary rounded-lg theme-bg-secondary theme-text-primary text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Tümü</option>
          <option value="recent">Son 7 Gün</option>
          <option value="month">Son 30 Gün</option>
          <option value="unread">Okunmamış</option>
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
    
    <!-- Mobile Actions -->
    <div class="md:hidden mb-4 space-y-2">
      <div class="flex gap-2">
        <select 
          v-model="selectedFilter"
          class="flex-1 px-3 py-2 border theme-border-primary rounded-lg theme-bg-secondary theme-text-primary text-sm"
        >
          <option value="all">Tümü</option>
          <option value="recent">Son 7 Gün</option>
          <option value="month">Son 30 Gün</option>
          <option value="unread">Okunmamış</option>
        </select>
        
        <button 
          @click="toggleView"
          class="p-2 theme-bg-secondary rounded-lg"
        >
          <Icon 
            :icon="viewMode === 'grid' ? 'heroicons:list-bullet' : 'heroicons:squares-2x2'" 
            class="w-5 h-5 theme-text-secondary"
          />
        </button>
      </div>
      
      <div class="flex gap-2">
        <button 
          @click="selectAll"
          class="flex-1 px-3 py-2 text-sm theme-bg-secondary rounded-lg theme-text-secondary"
        >
          {{ allSelected ? 'Seçimi Kaldır' : 'Tümünü Seç' }}
        </button>
        
        <button 
          v-if="selectedPosts.length > 0"
          @click="removeSelected"
          class="flex-1 px-3 py-2 text-sm bg-red-500 text-white rounded-lg"
        >
          Kaldır ({{ selectedPosts.length }})
        </button>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading && bookmarkedPosts.length === 0" class="space-y-4">
      <SkeletonLoader v-for="i in 6" :key="i" type="news" />
    </div>
    
    <!-- Empty State -->
    <EmptyState 
      v-else-if="!isLoading && filteredPosts.length === 0"
      icon="heroicons:bookmark"
      title="Henüz kaydettiğiniz haber yok"
      description="Haberları kaydetmeye başlayın, daha sonra burada bulabilirsiniz."
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
          class="group relative"
        >
          <!-- Selection Checkbox -->
          <div class="absolute top-3 left-3 z-10">
            <input 
              type="checkbox" 
              :checked="selectedPosts.includes(post.id)"
              @change="togglePostSelection(post.id)"
              class="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          
          <div 
            class="cursor-pointer theme-bg-secondary rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105"
            @click="navigateToPost(post.id)"
          >
            <!-- Post Image -->
            <div class="relative overflow-hidden">
              <img 
                :src="post.image" 
                :alt="post.title"
                class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                @error="handleImageError"
              />
              
              <!-- Category Badge -->
              <div class="absolute top-3 right-3">
                <CategoryBadge :category="post.category" />
              </div>
              
              <!-- Read Status -->
              <div v-if="!post.isRead" class="absolute bottom-3 left-3">
                <span class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  Okunmamış
                </span>
              </div>
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
                <span>{{ formatDate(post.bookmarkedAt) }}</span>
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-1">
                    <Icon icon="heroicons:bookmark" class="w-3 h-3 text-blue-500" />
                    <span>{{ formatDate(post.date) }}</span>
                  </div>
                  <button 
                    @click.stop="removeBookmark(post.id)"
                    class="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Kayıttan Çıkar"
                  >
                    <Icon icon="heroicons:trash" class="w-3 h-3" />
                  </button>
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
          class="flex gap-4 p-4 theme-bg-secondary rounded-lg hover:shadow-md transition-all duration-200 group"
        >
          <!-- Selection Checkbox -->
          <div class="flex-shrink-0 pt-2">
            <input 
              type="checkbox" 
              :checked="selectedPosts.includes(post.id)"
              @change="togglePostSelection(post.id)"
              class="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
          
          <!-- Post Image -->
          <div class="flex-shrink-0 cursor-pointer" @click="navigateToPost(post.id)">
            <img 
              :src="post.image" 
              :alt="post.title"
              class="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg"
              @error="handleImageError"
            />
          </div>
          
          <!-- Post Content -->
          <div class="flex-1 min-w-0 cursor-pointer" @click="navigateToPost(post.id)">
            <div class="flex items-start justify-between gap-2 mb-2">
              <h3 class="font-semibold theme-text-primary group-hover:text-blue-600 transition-colors line-clamp-2">
                {{ post.title }}
                <span v-if="!post.isRead" class="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
              </h3>
              <button 
                @click.stop="removeBookmark(post.id)"
                class="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Kayıttan Çıkar"
              >
                <Icon icon="heroicons:trash" class="w-4 h-4" />
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
                <Icon icon="heroicons:bookmark" class="w-3 h-3 text-blue-500" />
                <span>{{ formatDate(post.bookmarkedAt) }} tarihinde kaydedildi</span>
              </div>
              <div v-if="!post.isRead" class="flex items-center gap-1 text-blue-500">
                <Icon icon="heroicons:eye-slash" class="w-3 h-3" />
                <span>Okunmamış</span>
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
  bookmarkedPosts: {
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
const emit = defineEmits(['load-more', 'remove-bookmark', 'remove-multiple'])

// State
const selectedFilter = ref('all')
const viewMode = ref('grid')
const selectedPosts = ref([])

// Computed
const filteredPosts = computed(() => {
  let posts = [...props.bookmarkedPosts]
  
  switch (selectedFilter.value) {
    case 'recent':
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      posts = posts.filter(post => new Date(post.bookmarkedAt) >= weekAgo)
      break
    case 'month':
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      posts = posts.filter(post => new Date(post.bookmarkedAt) >= monthAgo)
      break
    case 'unread':
      posts = posts.filter(post => !post.isRead)
      break
  }
  
  return posts.sort((a, b) => new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt))
})

const allSelected = computed(() => {
  return filteredPosts.value.length > 0 && selectedPosts.value.length === filteredPosts.value.length
})

// Methods
const toggleView = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

const togglePostSelection = (postId) => {
  const index = selectedPosts.value.indexOf(postId)
  if (index > -1) {
    selectedPosts.value.splice(index, 1)
  } else {
    selectedPosts.value.push(postId)
  }
}

const selectAll = () => {
  if (allSelected.value) {
    selectedPosts.value = []
  } else {
    selectedPosts.value = filteredPosts.value.map(post => post.id)
  }
}

const removeSelected = () => {
  if (confirm(`Seçili ${selectedPosts.value.length} haberi kayıtlarınızdan kaldırmak istediğinizden emin misiniz?`)) {
    emit('remove-multiple', selectedPosts.value)
    selectedPosts.value = []
  }
}

const navigateToPost = (postId) => {
  console.log('Navigate to post:', postId)
  // Mark as read
  const post = props.bookmarkedPosts.find(p => p.id === postId)
  if (post) {
    post.isRead = true
  }
  // this.$router.push(`/article/${postId}`)
}

const removeBookmark = (postId) => {
  if (confirm('Bu haberi kayıtlarınızdan kaldırmak istediğinizden emin misiniz?')) {
    emit('remove-bookmark', postId)
    // Remove from selection if selected
    const index = selectedPosts.value.indexOf(postId)
    if (index > -1) {
      selectedPosts.value.splice(index, 1)
    }
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
  .profile-bookmarks {
    padding: 1rem;
  }
}
</style>