<template>
  <div class="related-news-slider mb-6">
    <div class="relative mx-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold theme-text-primary flex items-center">
          <Icon icon="heroicons:newspaper" class="w-5 h-5 mr-2 text-primary" />
          İlgili Haberler
        </h3>
      </div>

      <!-- News Slider -->
      <div class="relative">
        <div 
          ref="scrollContainer"
          class="flex overflow-x-auto scrollbar-hide gap-4 pb-2"
          @scroll="updateScrollButtons"
          style="scroll-behavior: smooth;"
        >
          <!-- Related News Cards -->
          <div
            v-for="article in articles"
            :key="article.id"
            class="flex-shrink-0 news-card cursor-pointer"
            @click="goToArticle(article)"
          >
            <!-- Article Image -->
            <div class="relative mb-3">
              <img
                :src="article.imageUrl || article.image"
                :alt="article.title"
                class="w-full h-32 object-cover rounded-lg"
                @error="handleImageError"
              />
              <div v-if="article.category" class="absolute top-2 left-2">
                <span class="px-2 py-1 text-xs font-medium bg-primary text-white rounded-full">
                  {{ article.category.name || article.category }}
                </span>
              </div>
            </div>

            <!-- Article Content -->
            <div class="space-y-2">
              <h4 class="text-sm font-semibold theme-text-primary line-clamp-2 leading-tight">
                {{ article.title }}
              </h4>
              <p v-if="article.excerpt" class="text-xs theme-text-secondary line-clamp-2">
                {{ article.excerpt }}
              </p>
              <div class="flex items-center justify-between text-xs theme-text-muted">
                <span>{{ formatDate(article.publishedAt || article.createdAt) }}</span>
                <span v-if="article.likeCount" class="flex items-center">
                  <Icon icon="heroicons:heart" class="w-3 h-3 mr-1" />
                  {{ article.likeCount }}
                </span>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="flex gap-4">
            <div 
              v-for="i in 3" 
              :key="i"
              class="flex-shrink-0 w-48 animate-pulse"
            >
              <div class="w-full h-32 bg-gray-200 rounded-lg mb-3"></div>
              <div class="space-y-2">
                <div class="h-4 bg-gray-200 rounded"></div>
                <div class="h-3 bg-gray-200 rounded w-3/4"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Scroll Arrow -->
        <div 
          v-if="canScrollRight && !isLoading"
          class="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none"
        >
          <div class="w-8 h-full scroll-fade-gradient"></div>
          <button 
            @click="scrollRight"
            class="flex items-center justify-center w-8 h-full theme-bg-primary pointer-events-auto hover:bg-gray-50 transition-colors rounded-r-lg"
          >
            <Icon icon="heroicons:chevron-right" class="w-4 h-4 theme-text-secondary" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const props = defineProps({
  articles: { type: Array, required: true },
  isLoading: { type: Boolean, default: false }
})

const router = useRouter()
const scrollContainer = ref(null)
const canScrollRight = ref(false)

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 200, behavior: 'smooth' })
  }
}

const updateScrollButtons = () => {
  if (scrollContainer.value) {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value
    canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 1
  }
}

const goToArticle = (article) => {
  router.push({
    name: 'article',
    params: { slug: article.slug || article.id }
  })
}

const handleImageError = (event) => {
  event.target.src = 'https://picsum.photos/400/300'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short'
  })
}

onMounted(async () => {
  await nextTick()
  updateScrollButtons()
  
  window.addEventListener('resize', updateScrollButtons)
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.news-card {
  width: 200px;
  transition: transform 0.2s ease;
}

.news-card:hover {
  transform: translateY(-2px);
}

.scroll-fade-gradient {
  background: linear-gradient(to left, 
    var(--color-bg-primary) 0%,
    rgba(255, 255, 255, 0.8) 30%,
    rgba(255, 255, 255, 0.4) 60%,
    transparent 100%
  );
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .news-card {
    width: 180px;
  }
}

@media (max-width: 480px) {
  .news-card {
    width: 160px;
  }
  
  .news-card h4 {
    font-size: 0.8rem;
  }
  
  .news-card p {
    font-size: 0.7rem;
  }
}
</style>