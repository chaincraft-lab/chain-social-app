<template>
  <div class="category-stories">
    <!-- Magazine Stories Container -->
    <div class="magazine-stories-container">
      <div class="magazine-stories-wrapper">
        <!-- Popular Stories Cards -->
        <div 
          v-for="article in storiesWithArticles" 
          :key="article.id"
          class="magazine-card"
          @click="openStory(article)"
        >
          <!-- Background Image -->
          <div class="magazine-background">
            <img 
              v-if="article.image" 
              :src="article.image" 
              :alt="article.title"
              class="magazine-bg-image"
            />
            <div v-else class="magazine-placeholder">
              <div class="magazine-no-image">
                <span class="magazine-no-image-text">{{ article.category?.name || 'Haber' }}</span>
              </div>
            </div>
          </div>
          
          <!-- Overlay Content -->
          <div class="magazine-overlay">
            <div class="magazine-content">
              <h3 class="magazine-title">{{ article.title }}</h3>
              <div class="magazine-subtitle-wrapper">
                <p class="magazine-subtitle">{{ article.category?.name || 'Popüler' }}</p>
                <div class="magazine-view-count">
                  <Icon icon="heroicons:eye" class="view-count-icon" />
                  <span class="view-count-text">{{ getStoryViewCount(article) }}</span>
                </div>
              </div>
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
                class="progress-bar progress-bar--active"
              >
                <div class="progress-fill"></div>
              </div>
            </div>

            <!-- Story info -->
            <div class="story-info">
              <div class="category-avatar">
                <div class="avatar-placeholder">
                  <span class="avatar-text">{{ currentArticle?.category?.name?.charAt(0) || 'P' }}</span>
                </div>
              </div>
              <div class="story-details">
                <h3 class="category-name">{{ currentArticle?.category?.name || 'Popüler Haber' }}</h3>
                <span class="story-time">{{ formatTime(currentArticle?.publishedAt) }}</span>
              </div>
              <button class="close-button" @click="closeStories">
                <Icon icon="heroicons:x-mark" />
              </button>
            </div>
          </div>

          <!-- Story Content -->
          <div class="story-content" v-if="currentArticle">
            <!-- Article Image with Title Overlay -->
            <div class="story-image-container" v-if="currentArticle.image">
              <img 
                :src="currentArticle.image" 
                :alt="currentArticle.title"
                class="story-main-image"
              />
              
              <!-- Title Overlay on Image -->
              <div class="story-title-overlay">
                <h2 class="story-overlay-title">{{ currentArticle.title }}</h2>
                <p class="story-overlay-category">{{ currentArticle.category?.name || 'Popüler Haber' }}</p>
              </div>
            </div>

            <!-- Article Content (fallback if no image) -->
            <div class="story-text-content" v-if="!currentArticle.image">
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
  categories: { type: Array, default: () => [] }, // Keep for compatibility but not used
  isLoading: { type: Boolean, default: false }
})

const store = useStore()
const router = useRouter()

// Reactive state
const showStoryViewer = ref(false)
const currentStory = ref(null)
const currentStoryIndex = ref(0)
const viewedStories = ref(new Set())
const popularArticles = ref([])

// Auto-progress timer
let storyTimer = null
const STORY_DURATION = 5000 // 5 seconds per story

// Computed
const storiesWithArticles = computed(() => {
  // Show popular news as stories
  return popularArticles.value || []
})

const currentStoryArticles = computed(() => {
  // For popular news, each article is its own story
  return currentStory.value ? [currentStory.value] : []
})

const currentArticle = computed(() => {
  return currentStory.value
})

// Methods

const getStoryArticle = (article) => {
  return article
}

const getStoryViewCount = (article) => {
  return article.viewCount || 0
}

const isViewed = (articleId) => {
  return viewedStories.value.has(articleId)
}

const openStory = async (article) => {
  // Open story directly with the article
  currentStory.value = article
  currentStoryIndex.value = 0
  showStoryViewer.value = true
  
  // Mark as viewed
  viewedStories.value.add(article.id)
  
  startStoryTimer()
}

const closeStories = () => {
  showStoryViewer.value = false
  currentStory.value = null
  currentStoryIndex.value = 0
  stopStoryTimer()
}

const nextStory = async () => {
  // Move to next popular article or close
  const currentArticleIndex = storiesWithArticles.value.findIndex(
    article => article.id === currentStory.value.id
  )
  
  if (currentArticleIndex < storiesWithArticles.value.length - 1) {
    const nextArticle = storiesWithArticles.value[currentArticleIndex + 1]
    await openStory(nextArticle)
  } else {
    closeStories()
  }
}

const previousStory = async () => {
  // Move to previous popular article
  const currentArticleIndex = storiesWithArticles.value.findIndex(
    article => article.id === currentStory.value.id
  )
  
  if (currentArticleIndex > 0) {
    const prevArticle = storiesWithArticles.value[currentArticleIndex - 1]
    await openStory(prevArticle)
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

const fetchPopularArticles = async (limit = 10) => {
  try {
    console.log(`Fetching ${limit} popular articles for stories`)
    
    // Fetch popular news through Vuex store
    await store.dispatch('news/fetchPopularNews', limit)
    
    // Get articles from store after dispatch
    const storeArticles = store.state.news.popularNews || []
    
    popularArticles.value = storeArticles
    console.log(`Fetched ${storeArticles.length} popular articles for stories`)
    
    return storeArticles
  } catch (error) {
    console.error('Failed to fetch popular articles:', error)
    popularArticles.value = []
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

// Initialize popular articles for stories
const initializePopularStories = async () => {
  console.log('Initializing popular stories')
  await fetchPopularArticles(10) // Fetch 10 popular articles
}

onMounted(async () => {
  // Load popular articles on mount
  await initializePopularStories()
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
  width: 100%;
  padding: 8px 0;
  background: var(--color-bg-primary);
}

.magazine-stories-container {
  overflow-x: auto;
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
  object-position: center top;
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

.magazine-no-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  text-align: center;
}

.magazine-no-image-text {
  color: var(--color-light);
  font-size: 14px;
  font-weight: 600;
  opacity: 0.9;
  padding: 12px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
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
  color: var(--color-light);
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 6px 0;
  line-height: 1.3;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.magazine-subtitle-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.magazine-subtitle {
  color: var(--color-light-100);
  font-size: 12px;
  font-weight: 500;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  opacity: 0.9;
}

.magazine-view-count {
  display: flex;
  align-items: center;
  gap: 3px;
}

.view-count-icon {
  width: 14px;
  height: 14px;
  color: var(--color-light-100);
  opacity: 0.8;
}

.view-count-text {
  color: var(--color-light-100);
  font-size: 11px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  opacity: 0.9;
}

/* Viewed Indicator */
.viewed-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: var(--color-success-500);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  opacity: 0.9;
}

.viewed-indicator svg {
  width: 14px;
  height: 14px;
  color: var(--color-light);
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
  background: var(--color-dark-950);
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
  background: var(--color-light);
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
  border: 2px solid var(--color-light);
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

.avatar-text {
  color: var(--color-light);
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
}

.story-details {
  flex: 1;
}

.category-name {
  color: var(--color-light);
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.story-time {
  color: var(--color-light-200);
  font-size: 12px;
}

.close-button {
  background: none;
  border: none;
  color: var(--color-light);
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
  background: var(--color-dark-950);
  position: relative;
}

.story-main-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

/* Title Overlay on Image */
.story-title-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px 24px 80px 24px;
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
  color: var(--color-light);
}

.story-overlay-category {
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  color: var(--color-light-100);
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
  background: var(--color-accent-500);
  color: var(--color-light);
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
  background: var(--color-accent-600);
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
  .category-stories {
    padding: 6px 0;
  }
  
  .story-viewer {
    max-width: 100%;
  }
  
  .magazine-stories-wrapper {
    gap: 10px;
  }
  
  .magazine-card {
    width: 120px;
    height: 180px;
  }
}

@media (max-width: 480px) {
  .category-stories {
    padding: 4px 0;
  }
  
  .magazine-stories-wrapper {
    gap: 8px;
  }
  
  .magazine-card {
    width: 110px;
    height: 160px;
  }
}
</style>