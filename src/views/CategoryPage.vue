<template>
  <div>
    <!-- Category Header -->
    <div class="bg-light rounded-lg p-6 mb-6">
      <h1 class="text-2xl md:text-3xl font-bold mb-2 text-dark">{{ currentCategory?.name || 'Kategori' }}</h1>
      <p class="text-dark/70">
        {{ currentCategory?.description || 'Bu kategorideki tüm haberleri görüntülüyorsunuz.' }}
      </p>
    </div>
    
    <!-- Category News -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(news, index) in categoryNews" :key="news?.id || index" class="bg-white rounded-lg shadow-md p-4">
        <div class="aspect-[16/9] bg-gray-200 rounded-lg overflow-hidden mb-3">
          <img 
            :src="news?.image || `https://picsum.photos/id/${index + 50}/400/225`" 
            alt="News Image" 
            class="w-full h-full object-cover"
          >
        </div>
        <span class="text-xs text-primary font-medium mb-1 block">
          {{ currentCategory?.name || 'Kategori' }}
        </span>
        <h3 class="text-xl font-bold mb-2 text-dark">
          {{ news?.title || `${currentCategory?.name || 'Kategori'} Haberi ${index + 1}` }}
        </h3>
        <p class="text-sm text-dark/80 mb-3">
          {{ news?.excerpt || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.' }}
        </p>
        <div class="text-xs text-dark/60">
          {{ formatDate(news?.date) || '5 Tem 2025' }}
        </div>
      </div>
    </div>
    
    <!-- Pagination -->
    <div class="flex justify-center mt-8">
      <nav class="inline-flex rounded-md shadow">
        <a href="#" class="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-dark hover:bg-light">
          Önceki
        </a>
        <a href="#" class="px-3 py-2 border-t border-b border-gray-300 bg-primary text-sm font-medium text-white">
          1
        </a>
        <a href="#" class="px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-dark hover:bg-light">
          2
        </a>
        <a href="#" class="px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-dark hover:bg-light">
          3
        </a>
        <a href="#" class="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-dark hover:bg-light">
          Sonraki
        </a>
      </nav>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  name: 'CategoryPage',
  setup() {
    const store = useStore()
    const route = useRoute()
    
    const categories = computed(() => store.state.categories)
    const currentCategory = computed(() => {
      return categories.value.find(c => c.slug === route.params.slug) || null
    })
    
    const categoryNews = ref([])
    
    const loadCategoryNews = () => {
      // This would be an API call in a real app
      // For now, we'll generate mock data
      categoryNews.value = Array(12).fill().map((_, i) => ({
        id: i + 100,
        title: `${currentCategory.value?.name || 'Kategori'} Haberi ${i + 1}`,
        excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.',
        image: `https://picsum.photos/id/${i + 50}/400/225`,
        date: new Date().toISOString(),
        category: currentCategory.value
      }))
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
    }
    
    onMounted(() => {
      loadCategoryNews()
    })
    
    watch(() => route.params.slug, () => {
      loadCategoryNews()
    })
    
    return {
      currentCategory,
      categoryNews,
      formatDate
    }
  }
}
</script> 