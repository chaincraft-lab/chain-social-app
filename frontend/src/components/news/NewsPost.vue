<template>
  <div class="news-post">
    <div class="overflow-hidden">
      <!-- Post Header -->
      <PostHeader
        :author="news.author || { name: 'Editör' }"
        :date="news.publishedAt || news.createdAt || news.date"
        @menuClick="handleMenuClick"
      />

      <!-- Post Image -->
      <PostImage
        :image-url="news.imageUrl || news.image"
        :alt="news.title"
        :category="news.category?.name"
        @imageClick="goToArticle"
      />

      <!-- Post Actions -->
      <PostActions
        :is-liked="isLiked"
        :is-bookmarked="isBookmarked"
        :loading-like="loadingLike"
        :loading-bookmark="loadingBookmark"
        @toggleLike="toggleLike"
        @toggleComments="toggleComments"
        @sharePost="sharePost"
        @toggleBookmark="bookmarkPost"
      />

      <!-- Post Content -->
      <PostContent
        :author-name="getAuthorName()"
        :title="news.title"
        :excerpt="news.excerpt"
        :tags="news.tags"
        :likes-count="likesCount"
        @contentClick="goToArticle"
      />

      <!-- Comments Section -->
      <PostComment
        :comments="sampleComments"
        :comments-count="commentsCount"
        :show-comments="showComments"
        @toggleComments="toggleComments"
        @addComment="addComment"
      />
    </div>

    <!-- Auth Dialog -->
    <Teleport to="body">
      <AuthDialog 
        v-model="showAuthDialog" 
        @success="handleAuthSuccess" 
      />
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import PostHeader from '../ui/Post/PostHeader.vue'
import PostImage from '../ui/Post/PostImage.vue'
import PostActions from '../ui/Post/PostActions.vue'
import PostContent from '../ui/Post/PostContent.vue'
import PostComment from '../ui/Post/PostComment.vue'
import AuthDialog from '../auth/AuthDialog.vue'
import { likeService, bookmarkService } from '@/services'

const props = defineProps({
  news: { type: Object, required: true }
})

const router = useRouter()
const store = useStore()

// Reactive state
const isLiked = ref(props.news.isLikedByUser || false)
const isBookmarked = ref(props.news.isBookmarkedByUser || false)
const likesCount = ref(props.news.likeCount || 0)
const commentsCount = ref(props.news.commentCount || 0)
const showComments = ref(false)
const loadingLike = ref(false)
const loadingBookmark = ref(false)
const showAuthDialog = ref(false)

// Auth state
const isAuthenticated = computed(() => store.getters['user/isAuthenticated'])

const sampleComments = ref([
  { id: 1, author: 'Ahmet Yılmaz', text: 'Çok önemli bir gelişme! 👍' },
  { id: 2, author: 'Ayşe Demir', text: 'Bu konuda daha fazla detay bekliyoruz.' },
  { id: 3, author: 'Mehmet Kaya', text: 'Harika analiz, teşekkürler!' }
])

// Methods
const getAuthorName = () => {
  if (props.news.author?.name) {
    return props.news.author.name
  }
  if (props.news.author?.firstName && props.news.author?.lastName) {
    return `${props.news.author.firstName} ${props.news.author.lastName}`
  }
  return 'Editör'
}

const toggleLike = async () => {
  // Check if user is authenticated
  if (!isAuthenticated.value) {
    showAuthDialog.value = true
    return
  }

  if (loadingLike.value) return

  try {
    loadingLike.value = true
    const response = await likeService.toggleLike(props.news.id)

    isLiked.value = response.data.action === 'liked'
    likesCount.value = response.data.likesCount

    // Success message (optional)
    const message = isLiked.value ? 'Makale beğenildi!' : 'Beğeni kaldırıldı!'
    console.log(message) // Replace with toast notification
  } catch (error) {
    console.error('Like toggle error:', error)
    
    if (error.response?.status === 401) {
      showAuthDialog.value = true
    } else {
      console.error('Bir hata oluştu. Lütfen tekrar deneyin.')
    }
  } finally {
    loadingLike.value = false
  }
}

const toggleComments = () => {
  showComments.value = !showComments.value
}

const sharePost = () => {
  if (navigator.share) {
    navigator.share({
      title: props.news.title,
      text: props.news.excerpt,
      url: window.location.href
    })
  } else {
    // Fallback copy to clipboard
    navigator.clipboard.writeText(window.location.href)
    console.log('Link kopyalandı!')
  }
}

const bookmarkPost = async () => {
  // Check if user is authenticated
  if (!isAuthenticated.value) {
    showAuthDialog.value = true
    return
  }

  if (loadingBookmark.value) return

  try {
    loadingBookmark.value = true
    const response = await bookmarkService.toggleBookmark(props.news.id)

    isBookmarked.value = response.data.action === 'bookmarked'

    // Success message
    const message = isBookmarked.value ? 'Makale kaydedildi!' : 'Kayıt kaldırıldı!'
    console.log(message) // Replace with toast notification
  } catch (error) {
    console.error('Bookmark toggle error:', error)
    
    if (error.response?.status === 401) {
      showAuthDialog.value = true
    } else {
      console.error('Bir hata oluştu. Lütfen tekrar deneyin.')
    }
  } finally {
    loadingBookmark.value = false
  }
}

const addComment = (commentText) => {
  sampleComments.value.unshift({
    id: Date.now(),
    author: 'Sen',
    text: commentText
  })
  commentsCount.value++
}

const goToArticle = () => {
  router.push({
    name: 'article',
    params: { slug: props.news.slug || props.news.id }
  })
}

const handleMenuClick = () => {
  // Handle post menu (report, etc.)
  console.log('Post menu clicked')
}

const handleAuthSuccess = (type) => {
  // Auth dialog'dan başarılı giriş/kayıt bilgisi geldiğinde
  showAuthDialog.value = false
  console.log('Auth success:', type)
  // Başarılı giriş bildirimi gösterilebilir
  
  // Sayfayı yenile - backend'den user-specific data gelecek
  window.location.reload()
}

// Auth durumu değiştiğinde beğeni durumunu sıfırla
watch(isAuthenticated, (newVal) => {
  if (!newVal) {
    // Logout olduğunda beğeni durumunu sıfırla
    isLiked.value = false
    isBookmarked.value = false
  }
})
</script>

<style scoped>
.news-post {
  width: 100%;
  border-bottom: 1px solid var(--color-border-primary);
  background-color: var(--color-bg-primary);
  margin-bottom: 1rem;
  border-radius: 12px;
  box-shadow: 0 7px 14px 0 rgba(65, 69, 88, 0.1), 0 3px 6px 0 rgba(0, 0, 0, 0.07);
  transition: all 0.2s ease;
}

.news-post:hover {
  box-shadow: 0 10px 25px -5px rgba(65, 69, 88, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.news-post:last-child {
  border-bottom: none;
}

/* Dark theme adjustments */
.dark .news-post {
  box-shadow: 0 7px 14px 0 rgba(0, 0, 0, 0.3), 0 3px 6px 0 rgba(0, 0, 0, 0.2);
}

.dark .news-post:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .news-post {
    padding: 1.25rem 0;
  }
}

@media (max-width: 480px) {
  .news-post {
    padding: 1rem 0;
  }
}
</style>