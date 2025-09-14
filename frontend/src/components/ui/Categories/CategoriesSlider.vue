<template>
  <div class="categories-bar md:hidden mb-6">
    <div class="relative mx-4">
      <div class="flex items-center theme-bg-primary theme-border rounded-lg shadow-sm overflow-hidden">
        <!-- Left Section (Trending or Back Button) -->
        <div class="flex items-center flex-shrink-0 px-4 py-3 border-r theme-border">
          <!-- Category Mode -->
          <template v-if="mode === 'category'">
            <Icon icon="heroicons:folder" class="w-4 h-4 text-red-500 mr-2" />
            <span class="text-sm font-medium theme-text-primary whitespace-nowrap">Caregories</span>
          </template>
          
          <!-- Back Button Mode -->
          <template v-else-if="mode === 'back'">
            <button 
              @click="goBack"
              class="flex items-center text-sm font-medium theme-text-primary hover:theme-text-secondary transition-colors"
            >
              <Icon icon="heroicons:arrow-left" class="w-4 h-4 mr-2" />
              <span class="whitespace-nowrap">{{ backTitle || 'Geri' }}</span>
            </button>
          </template>
        </div>

        <!-- Categories Scrollable Container -->
        <div class="flex-1 relative overflow-hidden">
          <div 
            ref="scrollContainer"
            class="flex items-center overflow-x-auto scrollbar-hide px-4 py-3"
            @scroll="updateScrollButtons"
            style="scroll-behavior: smooth;"
          >
            <!-- All Categories Button -->
            <router-link
              :to="{ name: 'home' }"
              class="category-link flex-shrink-0"
              :class="{ 'active': !selectedCategory }"
            >
              <span class="whitespace-nowrap">Tümü</span>
              <span v-if="totalArticleCount" class="article-count ml-2">{{ totalArticleCount }}</span>
            </router-link>

            <!-- Category/Tag Links -->
            <router-link
              v-for="category in categories"
              :key="category.id"
              :to="{ name: linkType, params: { slug: category.slug } }"
              class="category-link flex-shrink-0 ml-6"
              :class="{ 'active': selectedCategory === category.slug }"
            >
              <span class="whitespace-nowrap">{{ category.name }}</span>
              <span v-if="category.articleCount" class="article-count ml-2">{{ category.articleCount }}</span>
            </router-link>
          </div>

          <!-- Right Scroll Indicator & Button -->
          <div 
            v-if="canScrollRight"
            class="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none"
          >
            <div class="w-6 h-full scroll-fade-gradient"></div>
            <button 
              @click="scrollRight"
              class="flex items-center justify-center w-6 h-full theme-bg-primary pointer-events-auto hover:bg-gray-50 transition-colors border-l theme-border"
            >
              <Icon icon="heroicons:chevron-right" class="w-3 h-3 theme-text-secondary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

const props = defineProps({
  categories: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
  mode: { type: String, default: 'category' }, // 'category' or 'back'
  backTitle: { type: String, default: '' },
  linkType: { type: String, default: 'category' } // 'category' or 'tag'
})

const emit = defineEmits(['back'])

const route = useRoute()
const scrollContainer = ref(null)
const canScrollRight = ref(false)

const selectedCategory = computed(() => {
  return route.params.slug || null
})

const goBack = () => {
  emit('back')
}

const totalArticleCount = computed(() => {
  return props.categories.reduce((total, category) => total + (category.articleCount || 0), 0)
})

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 150, behavior: 'smooth' })
  }
}

const updateScrollButtons = () => {
  if (scrollContainer.value) {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value
    canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 1
  }
}

onMounted(async () => {
  await nextTick()
  updateScrollButtons()
  
  // Add resize listener to update scroll buttons
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

.category-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
}

.category-link:hover {
  color: var(--color-text-primary);
}

.category-link.active {
  color: var(--color-primary);
  font-weight: 600;
}

.article-count {
  background: var(--color-primary);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.category-link.active .article-count {
  background: var(--color-primary-600);
}

/* Mobile responsive */
@media (max-width: 480px) {
  .category-link {
    font-size: 0.8rem;
  }
  
  .article-count {
    font-size: 0.65rem;
    min-width: 16px;
    height: 16px;
    padding: 1px 4px;
  }
}
</style>