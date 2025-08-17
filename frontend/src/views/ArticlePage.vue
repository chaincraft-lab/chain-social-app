<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
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
        v-if="article.imageUrl || article.image"
        :image-url="article.imageUrl || article.image"
        :alt="article.title"
      />
      
      <!-- Article Content -->
      <ArticleContent :content="article.content" />
      
      <!-- Banner Ad - Leaderboard -->
      <div class="mb-8">
        <div class="w-full overflow-hidden rounded-lg">
          <a href="#" target="_blank" class="block">
            <div class="bg-gray-50 w-full h-[90px] flex items-center justify-center border border-gray-200 rounded-lg overflow-hidden">
              <div class="flex items-center justify-between w-full px-8">
                <div class="flex items-center">
                  <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                    R
                  </div>
                  <div>
                    <div class="text-xl font-bold text-primary">ROKETSAN</div>
                    <div class="text-sm text-primary/70">Füze ve Roket Sistemleri</div>
                  </div>
                </div>
                <div class="bg-primary text-white py-2 px-4 rounded-lg text-sm font-medium">
                  Daha Fazla Bilgi
                </div>
              </div>
            </div>
          </a>
          <div class="text-xs text-gray-500 mt-1 text-right">Reklam</div>
        </div>
      </div>
      
      <!-- Tags -->
      <TagsList :tags="article.tags" />
      
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
      <RelatedArticles :articles="relatedArticles" />
      
      <!-- Banner Ad - Medium Rectangle Grid -->
      <div class="mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="w-full overflow-hidden rounded-lg">
            <a href="#" target="_blank" class="block">
              <div class="bg-yellow-50 w-full h-[250px] flex flex-col items-center justify-center border border-yellow-100 rounded-lg overflow-hidden">
                <div class="w-24 h-24 bg-yellow-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                  T
                </div>
                <div class="text-xl font-bold text-yellow-800 mb-2">TUSAŞ</div>
                <div class="text-sm text-yellow-600 mb-4">Türk Havacılık ve Uzay Sanayii</div>
                <div class="bg-yellow-600 text-white py-2 px-6 rounded-full text-sm font-medium">
                  Ziyaret Et
                </div>
              </div>
            </a>
            <div class="text-xs text-gray-500 mt-1 text-right">Reklam</div>
          </div>
          
          <div class="w-full overflow-hidden rounded-lg">
            <a href="#" target="_blank" class="block">
              <div class="bg-purple-50 w-full h-[250px] flex flex-col items-center justify-center border border-purple-100 rounded-lg overflow-hidden">
                <div class="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                  H
                </div>
                <div class="text-xl font-bold text-purple-800 mb-2">HAVELSAN</div>
                <div class="text-sm text-purple-600 mb-4">Yazılım ve Bilişim</div>
                <div class="bg-purple-600 text-white py-2 px-6 rounded-full text-sm font-medium">
                  İncele
                </div>
              </div>
            </a>
            <div class="text-xs text-gray-500 mt-1 text-right">Reklam</div>
          </div>
        </div>
      </div>
      
      <!-- Comments Section -->
      <div class="border-t border-gray-200 pt-8">
        <!-- Comment Form -->
        <CommentForm @submit="handleCommentSubmit" />
        
        <!-- Comments List -->
        <CommentsList 
          :comments="comments"
          :comments-count="commentsCount"
        />
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-gray-500 text-lg">Makale bulunamadı</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Components
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import ShareButtons from '@/components/common/ShareButtons.vue'
import ArticleHeader from '@/components/ui/Articles/ArticleHeader.vue'
import AuthorInfo from '@/components/ui/Articles/AuthorInfo.vue'
import ArticleImage from '@/components/ui/Articles/ArticleImage.vue'
import ArticleContent from '@/components/ui/Articles/ArticleContent.vue'
import TagsList from '@/components/ui/Articles/TagsList.vue'
import RelatedArticles from '@/components/ui/Articles/RelatedArticles.vue'
import CommentForm from '@/components/ui/Articles/CommentForm.vue'
import CommentsList from '@/components/ui/Articles/CommentsList.vue'

const route = useRoute()

// Reactive state
const article = ref(null)
const relatedArticles = ref([])
const comments = ref([])
const commentsCount = ref(5)
const isLoading = ref(true)
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
  isLoading.value = true
  error.value = null
  
  try {
    const slug = route.params.slug
    
    // Simulate API call - Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock article data
    article.value = {
      id: 1,
      slug: slug,
      title: 'Türkiye\'nin Yeni Nesil Savunma Teknolojileri: Geleceğin Savaş Alanında Stratejik Üstünlük',
      excerpt: 'Türk savunma sanayii, yerli ve milli teknolojilerle dünya çapında rekabet edebilir seviyeye ulaştı. Bu makalede, en son geliştirilen savunma sistemlerini ve gelecekteki projeksiyonları inceliyoruz.',
      content: `
        <p>Türkiye'nin savunma sanayii, son yıllarda kaydettiği büyük atılımlarla dünya çapında dikkat çekiyor. Yerli ve milli üretim kapasitelerinin artmasıyla birlikte, ülkemiz savunma teknolojilerinde stratejik bağımsızlığını güçlendiriyor.</p>
        
        <h2>Havacılık ve Uzay Teknolojileri</h2>
        <p>TUSAŞ tarafından geliştirilen yeni nesil uçak sistemleri, Türkiye'nin hava savunma kapasitelerini önemli ölçüde artırıyor. Milli Muharip Uçak (MMU) projesi, bu alandaki en önemli gelişmelerden biri olarak öne çıkıyor.</p>
        
        <h2>Füze ve Roket Sistemleri</h2>
        <p>ROKETSAN'ın geliştirdiği ileri teknoloji füze sistemleri, hem kara hem de deniz platformları için stratejik önem taşıyor. Bu sistemler, Türkiye'nin savunma kapasitelerini güçlendirirken, ihracat potansiyelini de artırıyor.</p>
        
        <h2>Siber Güvenlik ve Elektronik Harp</h2>
        <p>HAVELSAN öncülüğünde geliştirilen siber güvenlik çözümleri, modern savaşın en kritik alanlarından birinde Türkiye'ye stratejik avantaj sağlıyor.</p>
      `,
      category: { name: 'Teknoloji' },
      author: {
        name: 'Dr. Mehmet Özkan',
        role: 'Savunma Teknolojileri Uzmanı',
        profileImage: 'https://i.pravatar.cc/100?img=1'
      },
      publishedAt: new Date().toISOString(),
      imageUrl: 'https://picsum.photos/id/1015/1200/675',
      tags: [
        { id: 1, name: 'Savunma Sanayi', slug: 'savunma-sanayi' },
        { id: 2, name: 'Teknoloji', slug: 'teknoloji' },
        { id: 3, name: 'Milli Teknoloji', slug: 'milli-teknoloji' },
        { id: 4, name: 'İnovasyon', slug: 'inovasyon' }
      ]
    }
    
    // Mock related articles
    relatedArticles.value = [
      {
        id: 2,
        title: 'Türk Savunma Sanayii İhracatında Yeni Rekor',
        slug: 'turk-savunma-sanayii-ihracatinda-yeni-rekor',
        imageUrl: 'https://picsum.photos/400/225?random=1',
        publishedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 3,
        title: 'Milli Muharip Uçak Projesinde Son Durum',
        slug: 'milli-muharip-ucak-projesinde-son-durum',
        imageUrl: 'https://picsum.photos/400/225?random=2',
        publishedAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 4,
        title: 'Siber Güvenlikte Yerli Çözümler',
        slug: 'siber-guvenlikte-yerli-cozumler',
        imageUrl: 'https://picsum.photos/400/225?random=3',
        publishedAt: new Date(Date.now() - 259200000).toISOString()
      }
    ]
    
    // Mock comments
    comments.value = [
      {
        id: 1,
        author: 'Ahmet Yılmaz',
        text: 'Türk savunma sanayii gerçekten çok önemli mesafeler kat etti. Bu gelişmeleri takip etmek çok heyecan verici.',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 2,
        author: 'Ayşe Demir',
        text: 'Milli teknoloji geliştirme konusunda yapılan çalışmalar gerçekten takdire şayan. Devamını bekliyoruz.',
        createdAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 3,
        author: 'Mehmet Kaya',
        text: 'Bu makalede verilen bilgiler çok kapsamlı. Teşekkürler!',
        createdAt: new Date(Date.now() - 10800000).toISOString()
      }
    ]
    
  } catch (err) {
    console.error('Article loading error:', err)
    error.value = 'Makale yüklenirken bir hata oluştu. Lütfen tekrar deneyin.'
  } finally {
    isLoading.value = false
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
</script>