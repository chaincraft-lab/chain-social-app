<template>
  <div>
    <!-- Article Header -->
    <div class="mb-6">
      <div class="flex items-center mb-3">
        <span class="text-xs text-primary font-medium mr-2">
          {{ article?.category?.name || 'Kategori' }}
        </span>
        <span class="text-xs text-dark/60">
          {{ formatDate(article?.date) || '5 Tem 2025' }}
        </span>
      </div>
      <h1 class="text-3xl md:text-4xl font-bold mb-4">
        {{ article?.title || 'Haber Başlığı' }}
      </h1>
      <p class="text-lg text-dark/80 mb-6">
        {{ article?.excerpt || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.' }}
      </p>
      
      <!-- Author Info -->
      <div class="flex items-center mb-6">
        <div class="w-12 h-12 rounded-full bg-gray-300 mr-3 overflow-hidden">
          <img 
            :src="article?.author?.avatar || 'https://i.pravatar.cc/100'" 
            alt="Author" 
            class="w-full h-full object-cover"
          >
        </div>
        <div>
          <div class="font-medium">{{ article?.author?.name || 'Yazar Adı' }}</div>
          <div class="text-sm text-dark/60">{{ article?.author?.title || 'Editör' }}</div>
        </div>
      </div>
    </div>
    
    <!-- Article Featured Image -->
    <div class="aspect-[16/9] bg-gray-200 rounded-lg overflow-hidden mb-8">
      <img 
        :src="article?.image || 'https://picsum.photos/id/1015/1200/675'" 
        alt="Article Image" 
        class="w-full h-full object-cover"
      >
    </div>
    
    <!-- Article Content -->
    <div class="prose max-w-none mb-8">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
      </p>
      <p>
        Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
      </p>
      <h2>Alt Başlık</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
      </p>
      <blockquote>
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl."
      </blockquote>
      <p>
        Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
      </p>
      <h2>Diğer Alt Başlık</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
      </p>
      <ul>
        <li>Liste öğesi 1</li>
        <li>Liste öğesi 2</li>
        <li>Liste öğesi 3</li>
      </ul>
      <p>
        Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
      </p>
    </div>
    
    <!-- Tags -->
    <div class="mb-8">
      <div class="text-sm font-medium mb-2">Etiketler:</div>
      <div class="flex flex-wrap gap-2">
        <span 
          v-for="(tag, index) in article?.tags || ['Etiket 1', 'Etiket 2', 'Etiket 3']" 
          :key="index"
          class="bg-light px-3 py-1 rounded-full text-sm"
        >
          {{ tag }}
        </span>
      </div>
    </div>
    
    <!-- Share -->
    <div class="mb-8">
      <div class="text-sm font-medium mb-2">Paylaş:</div>
      <div class="flex space-x-3">
        <a href="#" class="text-dark hover:text-primary">
          <span class="sr-only">Facebook</span>
          <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
          </svg>
        </a>
        <a href="#" class="text-dark hover:text-primary">
          <span class="sr-only">Twitter</span>
          <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        </a>
        <a href="#" class="text-dark hover:text-primary">
          <span class="sr-only">LinkedIn</span>
          <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </a>
        <a href="#" class="text-dark hover:text-primary">
          <span class="sr-only">WhatsApp</span>
          <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>
    </div>
    
    <!-- Related News -->
    <div class="mb-8">
      <h3 class="text-xl font-bold mb-4">İlgili Haberler</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="index in 3" :key="index" class="card">
          <div class="aspect-[16/9] bg-gray-200 rounded-lg overflow-hidden mb-3">
            <img 
              :src="`https://picsum.photos/id/${index + 80}/400/225`" 
              alt="News Image" 
              class="w-full h-full object-cover"
            >
          </div>
          <h4 class="news-title text-base">
            İlgili Haber {{ index }}
          </h4>
          <div class="text-xs text-dark/60">
            {{ formatDate(new Date()) }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Comments -->
    <div>
      <h3 class="text-xl font-bold mb-4">Yorumlar (5)</h3>
      
      <!-- Comment Form -->
      <div class="bg-light rounded-lg p-4 mb-6">
        <h4 class="text-lg font-medium mb-3">Yorum Yap</h4>
        <form @submit.prevent="submitComment">
          <div class="mb-4">
            <textarea 
              v-model="commentText"
              rows="4" 
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Yorumunuzu yazın..."
            ></textarea>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input 
              type="text" 
              v-model="commentName"
              placeholder="Adınız" 
              class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
            <input 
              type="email" 
              v-model="commentEmail"
              placeholder="E-posta adresiniz" 
              class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
          </div>
          <button 
            type="submit" 
            class="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
          >
            Yorum Gönder
          </button>
        </form>
      </div>
      
      <!-- Comments List -->
      <div class="space-y-4">
        <div v-for="index in 5" :key="index" class="border-b pb-4">
          <div class="flex items-start">
            <div class="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
              <img 
                :src="`https://i.pravatar.cc/100?img=${index + 10}`" 
                alt="Commenter" 
                class="w-full h-full object-cover"
              >
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <div class="font-medium">Yorum Yapan {{ index }}</div>
                <div class="text-xs text-dark/60">{{ formatDate(new Date(Date.now() - index * 86400000)) }}</div>
              </div>
              <p class="text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'ArticlePage',
  setup() {
    const route = useRoute()
    
    const article = ref(null)
    const commentText = ref('')
    const commentName = ref('')
    const commentEmail = ref('')
    
    const loadArticle = () => {
      // This would be an API call in a real app
      // For now, we'll use mock data
      article.value = {
        id: route.params.slug,
        title: 'Örnek Haber Başlığı - Detaylı ve İlgi Çekici',
        excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.',
        image: 'https://picsum.photos/id/1015/1200/675',
        date: new Date().toISOString(),
        category: { id: 1, name: 'Gündem', slug: 'gundem' },
        author: {
          name: 'Adil Pamuk',
          title: 'Baş Editör',
          avatar: 'https://i.pravatar.cc/100?img=1'
        },
        tags: ['Gündem', 'Politika', 'Ekonomi']
      }
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
    }
    
    const submitComment = () => {
      // This would be an API call in a real app
      alert('Yorumunuz gönderildi ve onay bekliyor!')
      commentText.value = ''
      commentName.value = ''
      commentEmail.value = ''
    }
    
    onMounted(() => {
      loadArticle()
    })
    
    return {
      article,
      commentText,
      commentName,
      commentEmail,
      formatDate,
      submitComment
    }
  }
}
</script>

<style scoped>
.prose {
  @apply text-dark;
}
.prose h2 {
  @apply text-2xl font-bold mt-6 mb-4;
}
.prose p {
  @apply mb-4;
}
.prose blockquote {
  @apply border-l-4 border-primary pl-4 italic my-6;
}
.prose ul {
  @apply list-disc pl-6 mb-4;
}
</style> 