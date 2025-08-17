<template>
  <div class="news-post mb-8">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PostHeader from '../ui/Post/PostHeader.vue'
import PostImage from '../ui/Post/PostImage.vue'
import PostActions from '../ui/Post/PostActions.vue'
import PostContent from '../ui/Post/PostContent.vue'
import PostComment from '../ui/Post/PostComment.vue'
import { likeService, bookmarkService } from '@/services'

const props = defineProps({
  news: { type: Object, required: true }
})

const router = useRouter()

// Reactive state
const isLiked = ref(false)
const isBookmarked = ref(false)
const likesCount = ref(props.news.likeCount || 0)
const commentsCount = ref(props.news.commentCount || 0)
const showComments = ref(false)
const loadingLike = ref(false)
const loadingBookmark = ref(false)

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
      console.error('Bu işlem için giriş yapmanız gerekiyor.')
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
      console.error('Bu işlem için giriş yapmanız gerekiyor.')
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
</script>

<style scoped>
.news-post {
  max-width: 600px;
  margin: 0 auto;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .news-post {
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 480px) {
  .news-post {
    margin-bottom: 1rem;
  }
}
</style>