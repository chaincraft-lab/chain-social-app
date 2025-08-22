<template>
  <div class="max-w-4xl mx-auto px-4 py-8 theme-bg-primary theme-text-primary rounded-lg">
    <!-- Loading State -->
    <LoadingSpinner 
      v-if="isLoading" 
      size="lg" 
      text="Makale yükleniyor..." 
      :fullScreen="false" 
    />
    
    <!-- Error State -->
    <ErrorState
      v-else-if="error"
      :title="errorTitle"
      :message="error"
      @retry="loadArticle"
    />
    
    <!-- Article Content -->
    <div v-else-if="article">
      <!-- Article Header -->
      <ArticleHeader
        :title="article.title"
        :excerpt="article.excerpt"
        :category="article.category?.name"
        :date="article.publishedAt || article.createdAt"
      />
      
      <!-- Author Info -->
      <AuthorInfo :author="article.author || { name: 'Editör' }" />
      
      <!-- Article Featured Image -->
      <ArticleImage
        v-if="article.image || article.imageUrl"
        :image-url="article.image || article.imageUrl"
        :alt="article.title"
      />
      
      <!-- Article Content -->
      <ArticleContent :content="article.content" />
      
      <!-- Tags -->
      <TagList :tags="article.tags" />
      
      <!-- Share Buttons -->
      <div class="mb-8">
        <div class="text-sm font-medium mb-3 text-gray-900">Paylaş:</div>
        <ShareButtons
          :url="currentUrl"
          :title="article.title"
          :description="article.excerpt"
          :platforms="['facebook', 'twitter', 'linkedin', 'whatsapp']"
        />
      </div>
      
      <!-- Related Articles -->
      <ArticleRelated :articles="relatedArticles" />
      
      <!-- Comments Section -->
      <div class="border-t border-gray-200 pt-8">
        <!-- Comment Form -->
        <ArticleCommentForms @submit="handleCommentSubmit" />
        
        <!-- Comments List -->
        <ArticleComments 
          :comments="comments"
          :comments-count="commentsCount"
        />
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <Icon icon="heroicons:document-text" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500 text-lg">Makale bulunamadı</p>
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
import ShareButtons from '@/components/common/ShareButtons.vue'
import ArticleHeader from '@/components/ui/Articles/ArticleHeader.vue'
import AuthorInfo from '@/components/ui/users/AuthorInfo.vue'
import ArticleImage from '@/components/ui/Articles/ArticleImage.vue'
import ArticleContent from '@/components/ui/Articles/ArticleContent.vue'
import TagList from '@/components/ui/Tags/TagList.vue'
import ArticleRelated from '@/components/ui/Articles/ArticleRelated.vue'
import ArticleCommentForms from '@/components/ui/Articles/ArticleCommentForms.vue'
import ArticleComments from '@/components/ui/Articles/ArticleComments.vue'

const route = useRoute()
const store = useStore()

// Reactive state
const article = ref(null)
const relatedArticles = ref([])
const comments = ref([])
const commentsCount = ref(0)
const isLoading = computed(() => store.getters['news/isLoading']('detail'))
const error = ref(null)

// Computed properties
const currentUrl = computed(() => {
  return window.location.href
})

const errorTitle = computed(() => {
  if (error.value?.includes('404') || error.value?.includes('bulunamadı')) {
    return 'Makale Bulunamadı'
  }
  return 'Bir Hata Oluştu'
})

// Methods
const loadArticle = async () => {
  error.value = null
  
  try {
    const slug = route.params.slug
    
    // Gerçek API çağrısı - makale detayını çek
    const articleData = await store.dispatch('news/fetchArticleBySlug', slug)
    article.value = articleData
    
    // İlgili makaleleri çek
    if (articleData && articleData.id) {
      const relatedData = await store.dispatch('news/fetchRelatedArticles', articleData.id)
      relatedArticles.value = relatedData || []
    }
    
    // Comment count'u backend'den al (eğer varsa)
    commentsCount.value = articleData?.commentCount || articleData?._count?.comments || 0
    
    // Mock comments - henüz backend comment sistemi yoksa
    comments.value = [
      {
        id: 1,
        author: 'Ahmet Yılmaz',
        text: 'Harika bir makale, çok bilgilendirici.',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 2,
        author: 'Ayşe Demir',
        text: 'Bu konuda daha fazla makale bekliyoruz.',
        createdAt: new Date(Date.now() - 7200000).toISOString()
      }
    ]
    
  } catch (err) {
    console.error('Article loading error:', err)
    error.value = err.message || 'Makale yüklenirken bir hata oluştu. Lütfen tekrar deneyin.'
  }
}

const handleCommentSubmit = async (commentData) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Add new comment
    const newComment = {
      id: Date.now(),
      author: commentData.name,
      text: commentData.text,
      createdAt: new Date().toISOString()
    }
    
    comments.value.unshift(newComment)
    commentsCount.value++
    
    console.log('Yorum başarıyla gönderildi!')
  } catch (error) {
    console.error('Comment submission error:', error)
  }
}

// Lifecycle
onMounted(() => {
  loadArticle()
})

// Watch route changes for different articles
watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    loadArticle()
  }
})
</script>