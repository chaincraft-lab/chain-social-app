<template>
  <div class="category-stories">
    <!-- Magazine Stories Container -->
    <div class="magazine-stories-container">
      <div class="magazine-stories-wrapper">
        <!-- Magazine Cover Cards -->
        <div 
          v-for="category in categoriesWithStories" 
          :key="category.id"
          class="magazine-card"
          @click="openCategoryStories(category)"
        >
          <!-- Background Image -->
          <div class="magazine-background">
            <img 
              v-if="getCategoryMainArticle(category)?.imageUrl" 
              :src="getCategoryMainArticle(category).imageUrl" 
              :alt="category.name"
              class="magazine-bg-image"
            />
            <div v-else class="magazine-placeholder">
              <Icon :icon="getCategoryIcon(category.name)" class="magazine-placeholder-icon" />
            </div>
          </div>
          
          <!-- Overlay Content -->
          <div class="magazine-overlay">
            <div class="magazine-content">
              <h3 class="magazine-title">{{ category.name }}</h3>
              <p class="magazine-subtitle">{{ getCategoryArticleCount(category) }} haber</p>
            </div>
            
            <!-- Viewed indicator -->
            <div v-if="isViewed(category.id)" class="viewed-indicator">
              <Icon icon="heroicons:check-circle" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Story Viewer Modal -->
    <Teleport to="body">
      <div 
        v-if="showStoryViewer" 
        class="story-viewer-overlay"
        @click="closeStories"
      >
        <div class="story-viewer" @click.stop>
          <!-- Story Header -->
          <div class="story-header">
            <!-- Progress bars -->
            <div class="story-progress">
              <div 
                v-for="(article, index) in currentCategoryArticles"
                :key="article.id"
                class="progress-bar"
                :class="{ 
                  'progress-bar--active': index === currentStoryIndex,
                  'progress-bar--completed': index < currentStoryIndex 
                }"
              >
                <div class="progress-fill"></div>
              </div>
            </div>

            <!-- Story info -->
            <div class="story-info">
              <div class="category-avatar">
                <img 
                  v-if="currentCategory?.image" 
                  :src="currentCategory.image" 
                  :alt="currentCategory.name"
                />
                <div v-else class="avatar-placeholder">
                  <Icon :icon="getCategoryIcon(currentCategory?.name)" />
                </div>
              </div>
              <div class="story-details">
                <h3 class="category-name">{{ currentCategory?.name }}</h3>
                <span class="story-time">{{ formatTime(currentArticle?.createdAt) }}</span>
              </div>
              <button class="close-button" @click="closeStories">
                <Icon icon="heroicons:x-mark" />
              </button>
            </div>
          </div>

          <!-- Story Content -->
          <div class="story-content" v-if="currentArticle">
            <!-- Article Image with Title Overlay -->
            <div class="story-image-container" v-if="currentArticle.imageUrl">
              <img 
                :src="currentArticle.imageUrl" 
                :alt="currentArticle.title"
                class="story-main-image"
              />
              
              <!-- Title Overlay on Image -->
              <div class="story-title-overlay">
                <h2 class="story-overlay-title">{{ currentArticle.title }}</h2>
                <p class="story-overlay-category">{{ currentCategory?.name }}</p>
              </div>
            </div>

            <!-- Article Content (fallback if no image) -->
            <div class="story-text-content" v-if="!currentArticle.imageUrl">
              <h2 class="article-title">{{ currentArticle.title }}</h2>
              <p class="article-excerpt" v-if="currentArticle.excerpt">
                {{ currentArticle.excerpt }}
              </p>
            </div>

            <!-- Action Button -->
            <div class="story-action-area">
              <button 
                class="read-more-btn"
                @click="goToArticle(currentArticle)"
              >
                Haberi Oku
              </button>
            </div>
          </div>

          <!-- Navigation Areas -->
          <div class="story-nav-left" @click="previousStory"></div>
          <div class="story-nav-right" @click="nextStory"></div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const props = defineProps({
  categories: { type: Array, default: () => [] },
  isLoading: { type: Boolean, default: false }
})

const store = useStore()
const router = useRouter()

// Reactive state
const showStoryViewer = ref(false)
const currentCategory = ref(null)
const currentStoryIndex = ref(0)
const viewedCategories = ref(new Set())
const categoryArticles = ref({})

// Auto-progress timer
let storyTimer = null
const STORY_DURATION = 5000 // 5 seconds per story

// Computed
const categoriesWithStories = computed(() => {
  // Show all categories, not just ones with articles loaded
  // This allows users to see and click categories immediately
  return props.categories || []
})

const currentCategoryArticles = computed(() => {
  return currentCategory.value ? 
    categoryArticles.value[currentCategory.value.slug] || [] : []
})

const currentArticle = computed(() => {
  return currentCategoryArticles.value[currentStoryIndex.value]
})

// Methods
const getCategoryIcon = (categoryName) => {
  const iconMap = {
    'Spor': 'heroicons:trophy',
    'Teknoloji': 'heroicons:cpu-chip',
    'Siyaset': 'heroicons:building-office',
    'Ekonomi': 'heroicons:chart-bar',
    'Kültür': 'heroicons:academic-cap',
    'Sağlık': 'heroicons:heart',
    'Dünya': 'heroicons:globe-alt',
    'Magazin': 'heroicons:star'
  }
  return iconMap[categoryName] || 'heroicons:newspaper'
}

const getCategoryMainArticle = (category) => {
  const articles = categoryArticles.value[category.slug]
  return articles && articles.length > 0 ? articles[0] : null
}

const getCategoryArticleCount = (category) => {
  const articles = categoryArticles.value[category.slug]
  return articles ? articles.length : category.articleCount || 0
}

const isViewed = (categoryId) => {
  return viewedCategories.value.has(categoryId)
}

const openCategoryStories = async (category) => {
  // Fetch articles for this category on click using slug
  await fetchCategoryArticles(category.slug)
  
  // Check if we have articles to show
  if (!categoryArticles.value[category.slug] || categoryArticles.value[category.slug].length === 0) {
    console.log('No articles found for category:', category.name)
    return
  }
  
  currentCategory.value = category
  currentStoryIndex.value = 0
  showStoryViewer.value = true
  
  // Mark as viewed
  viewedCategories.value.add(category.id)
  
  startStoryTimer()
}

const closeStories = () => {
  showStoryViewer.value = false
  currentCategory.value = null
  currentStoryIndex.value = 0
  stopStoryTimer()
}

const nextStory = async () => {
  if (currentStoryIndex.value < currentCategoryArticles.value.length - 1) {
    currentStoryIndex.value++
    resetStoryTimer()
  } else {
    // Move to next category or close
    console.log('Current category finished, moving to next...')
    const currentCategoryIndex = categoriesWithStories.value.findIndex(
      cat => cat.id === currentCategory.value.id
    )
    console.log('Current category index:', currentCategoryIndex, 'Total categories:', categoriesWithStories.value.length)
    
    if (currentCategoryIndex < categoriesWithStories.value.length - 1) {
      const nextCategory = categoriesWithStories.value[currentCategoryIndex + 1]
      console.log('Moving to next category:', nextCategory.name)
      
      // Try to open next category stories, if it fails try the next one
      let success = false
      let nextIndex = currentCategoryIndex + 1
      
      while (nextIndex < categoriesWithStories.value.length && !success) {
        const categoryToTry = categoriesWithStories.value[nextIndex]
        console.log('Trying category:', categoryToTry.name)
        
        // Fetch articles for this category
        await fetchCategoryArticles(categoryToTry.slug)
        
        // Check if we have articles to show
        if (categoryArticles.value[categoryToTry.slug] && categoryArticles.value[categoryToTry.slug].length > 0) {
          currentCategory.value = categoryToTry
          currentStoryIndex.value = 0
          viewedCategories.value.add(categoryToTry.id)
          startStoryTimer()
          success = true
          console.log('Successfully moved to category:', categoryToTry.name)
        } else {
          console.log('No articles in category:', categoryToTry.name, 'trying next...')
          nextIndex++
        }
      }
      
      if (!success) {
        console.log('No more categories with articles, closing stories')
        closeStories()
      }
    } else {
      console.log('No more categories, closing stories')
      closeStories()
    }
  }
}

const previousStory = async () => {
  if (currentStoryIndex.value > 0) {
    currentStoryIndex.value--
    resetStoryTimer()
  } else {
    // Move to previous category
    const currentCategoryIndex = categoriesWithStories.value.findIndex(
      cat => cat.id === currentCategory.value.id
    )
    if (currentCategoryIndex > 0) {
      const prevCategory = categoriesWithStories.value[currentCategoryIndex - 1]
      // First fetch articles for previous category if not already loaded
      if (!categoryArticles.value[prevCategory.slug] || categoryArticles.value[prevCategory.slug].length === 0) {
        await fetchCategoryArticles(prevCategory.slug)
      }
      currentCategory.value = prevCategory
      currentStoryIndex.value = (categoryArticles.value[prevCategory.slug]?.length || 1) - 1
      resetStoryTimer()
    }
  }
}

const startStoryTimer = () => {
  stopStoryTimer()
  storyTimer = setTimeout(async () => {
    await nextStory()
  }, STORY_DURATION)
}

const stopStoryTimer = () => {
  if (storyTimer) {
    clearTimeout(storyTimer)
    storyTimer = null
  }
}

const resetStoryTimer = () => {
  startStoryTimer()
}

const fetchCategoryArticles = async (categorySlug, limit = 50) => {
  try {
    console.log(`Fetching ${limit} articles for category ${categorySlug}`)
    
    // Use the same API logic as CategoryPage - through Vuex store
    const articles = await store.dispatch('news/fetchCategoryNews', {
      categorySlug: categorySlug,
      limit: limit
    })
    
    // Get articles from store after dispatch
    const storeArticles = store.getters['news/getCategoryNews'](categorySlug) || []
    
    categoryArticles.value[categorySlug] = storeArticles
    console.log(`Fetched ${storeArticles.length} articles for category ${categorySlug}`)
    
    return storeArticles
  } catch (error) {
    console.error('Failed to fetch category articles:', error)
    categoryArticles.value[categorySlug] = []
    return []
  }
}

const formatTime = (date) => {
  if (!date) return ''
  const now = new Date()
  const storyDate = new Date(date)
  const diffHours = Math.floor((now - storyDate) / (1000 * 60 * 60))
  
  if (diffHours < 1) return 'Az önce'
  if (diffHours < 24) return `${diffHours} saat önce`
  return `${Math.floor(diffHours / 24)} gün önce`
}

const goToArticle = (article) => {
  closeStories()
  router.push({
    name: 'article',
    params: { slug: article.slug || article.id }
  })
}

// Initialize articles when categories are loaded - fetch just the first article for each category for preview
const initializeCategoryPreviews = async () => {
  if (!props.categories || props.categories.length === 0) return
  
  console.log('Initializing category previews for:', props.categories)
  
  // Load just 1 article per category for magazine cover preview
  for (const category of props.categories.slice(0, 8)) {
    if (category.slug) {
      await fetchCategoryArticles(category.slug, 1) // Just 1 article for preview
    }
  }
}

// Watch for categories changes
watch(() => props.categories, async (newCategories) => {
  if (newCategories && newCategories.length > 0) {
    await initializeCategoryPreviews()
  }
}, { immediate: true })

onMounted(async () => {
  // If categories are already loaded on mount
  await initializeCategoryPreviews()
})

// Cleanup
onUnmounted(() => {
  stopStoryTimer()
})

// Keyboard navigation
const handleKeydown = async (event) => {
  if (!showStoryViewer.value) return
  
  switch (event.key) {
    case 'ArrowLeft':
      await previousStory()
      break
    case 'ArrowRight':
    case ' ':
      event.preventDefault()
      await nextStory()
      break
    case 'Escape':
      closeStories()
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Magazine Stories Container */
.category-stories {
  padding: 20px 0;
  background: var(--color-bg-primary);
}

.magazine-stories-container {
  overflow-x: auto;
  padding: 0 16px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.magazine-stories-container::-webkit-scrollbar {
  display: none;
}

.magazine-stories-wrapper {
  display: flex;
  gap: 12px;
  padding-bottom: 8px;
}

/* Magazine Card */
.magazine-card {
  position: relative;
  width: 140px;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.magazine-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.magazine-card:active {
  transform: translateY(-2px) scale(0.98);
}

/* Magazine Background */
.magazine-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.magazine-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.magazine-card:hover .magazine-bg-image {
  transform: scale(1.05);
}

.magazine-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-800) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.magazine-placeholder-icon {
  width: 48px;
  height: 48px;
  color: white;
  opacity: 0.8;
}

/* Magazine Overlay */
.magazine-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 40%,
    rgba(0, 0, 0, 0.3) 70%,
    rgba(0, 0, 0, 0.8) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;
}

.magazine-content {
  margin-top: auto;
}

.magazine-title {
  color: white;
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 4px 0;
  line-height: 1.2;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.magazine-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  font-weight: 500;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* Viewed Indicator */
.viewed-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: rgba(34, 197, 94, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.viewed-indicator svg {
  width: 14px;
  height: 14px;
  color: white;
}

/* Story Viewer Overlay */
.story-viewer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.story-viewer {
  width: 100%;
  max-width: 400px;
  height: 100vh;
  background: #000;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Story Header */
.story-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 16px;
  background: linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%);
}

.story-progress {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
}

.progress-bar {
  flex: 1;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 1px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: #fff;
  width: 0%;
  transition: width 0.1s linear;
}

.progress-bar--active .progress-fill {
  animation: progressFill 5s linear forwards;
}

.progress-bar--completed .progress-fill {
  width: 100%;
}

@keyframes progressFill {
  from { width: 0%; }
  to { width: 100%; }
}

.story-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #fff;
}

.category-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: var(--color-bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-placeholder svg {
  width: 20px;
  height: 20px;
  color: #fff;
}

.story-details {
  flex: 1;
}

.category-name {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.story-time {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
}

.close-button {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.close-button svg {
  width: 24px;
  height: 24px;
}

/* Story Content */
.story-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.story-image-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  position: relative;
}

.story-main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Title Overlay on Image */
.story-title-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
  background: linear-gradient(
    transparent 0%, 
    rgba(0, 0, 0, 0.3) 40%, 
    rgba(0, 0, 0, 0.7) 70%, 
    rgba(0, 0, 0, 0.9) 100%
  );
  color: #fff;
  z-index: 2;
}

.story-overlay-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px 0;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

.story-overlay-category {
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}

.story-text-content {
  padding: 24px;
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.article-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.article-excerpt {
  font-size: 14px;
  line-height: 1.4;
  margin: 0 0 16px 0;
  color: rgba(255, 255, 255, 0.9);
}

/* Action Area */
.story-action-area {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}

.read-more-btn {
  background: rgba(255, 255, 255, 0.95);
  color: #000;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.read-more-btn:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.05);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
}

/* Navigation Areas */
.story-nav-left,
.story-nav-right {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 30%;
  z-index: 5;
  cursor: pointer;
}

.story-nav-left {
  left: 0;
}

.story-nav-right {
  right: 0;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .story-viewer {
    max-width: 100%;
  }
  
  .stories-wrapper {
    gap: 12px;
  }
  
  .story-ring {
    width: 60px;
    height: 60px;
  }
  
  .story-label {
    font-size: 11px;
    max-width: 70px;
  }
}
</style>