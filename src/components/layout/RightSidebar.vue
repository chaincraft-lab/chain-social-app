<template>
  <aside>
    <!-- Advertisement -->
    <div class="bg-white rounded-lg shadow-md mb-6">
      <div class="p-2 bg-secondary text-white text-xs font-bold uppercase tracking-wider rounded-t-lg">
        Sponsorlu İçerik
      </div>
      <div class="p-4">
        <!-- Leaderboard Banner (728x90) -->
        <div class="mb-6 w-full overflow-hidden rounded-lg">
          <a href="#" target="_blank" class="block">
            <img src="@/assets/reklam/reklam_1.jpeg" alt="Savunma Sanayii Reklamı" class="w-full h-auto" />
          </a>
          <div class="text-xs text-gray-500 mt-1 text-right">Reklam</div>
        </div>
        
        <!-- Medium Rectangle Banner (300x250) -->
        <div class="mb-6 w-full overflow-hidden rounded-lg">
          <a href="#" target="_blank" class="block">
            <img src="@/assets/reklam/reklam_2.jpg" alt="Savunma Sanayii Reklamı" class="w-full h-auto" />
          </a>
          <div class="text-xs text-gray-500 mt-1 text-right">Reklam</div>
        </div>
        
        <!-- Skyscraper Banner (160x600) - Only visible on larger screens -->
        <div class="hidden lg:block mb-6 w-full overflow-hidden rounded-lg">
          <a href="#" target="_blank" class="block">
            <img src="@/assets/reklam/reklam_3.jpg" alt="Savunma Sanayii Reklamı" class="w-full h-auto" />
          </a>
          <div class="text-xs text-gray-500 mt-1 text-right">Reklam</div>
        </div>
      </div>
    </div>
    
    <!-- Popular News -->
    <div class="bg-white rounded-lg shadow-md mb-6">
      <div class="p-2 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-t-lg">
        Çok Okunanlar
      </div>
      <div class="p-4">
        <div v-for="(news, index) in popularNews" :key="news.id" 
             :class="{'border-b mb-3 pb-3': index < popularNews.length - 1}">
          <div class="flex items-start">
            <div class="flex-shrink-0 w-16 h-16 mr-3">
              <img :src="news.image" :alt="news.title" class="w-full h-full object-cover rounded" />
            </div>
            <div>
              <h3 class="text-sm font-medium line-clamp-2 mb-1">
                <router-link :to="{ name: 'article', params: { slug: news.id } }" class="hover:text-primary">
                  {{ news.title }}
                </router-link>
              </h3>
              <div class="text-xs text-dark/60">{{ formatDate(news.date) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Defense Industry Events -->
    <div class="bg-white rounded-lg shadow-md mb-6">
      <div class="p-2 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-t-lg">
        Yaklaşan Etkinlikler
      </div>
      <div class="p-4">
        <div class="mb-3 pb-3 border-b">
          <div class="text-sm font-medium mb-1">IDEF 2024</div>
          <div class="text-xs text-dark/70 mb-1">İstanbul, Türkiye</div>
          <div class="text-xs text-dark/60">23-26 Mayıs 2024</div>
        </div>
        <div class="mb-3 pb-3 border-b">
          <div class="text-sm font-medium mb-1">Eurosatory 2024</div>
          <div class="text-xs text-dark/70 mb-1">Paris, Fransa</div>
          <div class="text-xs text-dark/60">17-21 Haziran 2024</div>
        </div>
        <div>
          <div class="text-sm font-medium mb-1">SAHA EXPO 2024</div>
          <div class="text-xs text-dark/70 mb-1">İstanbul, Türkiye</div>
          <div class="text-xs text-dark/60">22-25 Ekim 2024</div>
        </div>
      </div>
    </div>
    
    <!-- Defense Industry Stats -->
    <div class="bg-white rounded-lg shadow-md mb-6">
      <div class="p-2 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-t-lg">
        Savunma Sanayii İstatistikleri
      </div>
      <div class="p-4">
        <div class="flex justify-between items-center mb-2 pb-2 border-b">
          <span class="font-medium text-sm">İhracat (2023)</span>
          <span class="text-green-600">5.5 Milyar $</span>
        </div>
        <div class="flex justify-between items-center mb-2 pb-2 border-b">
          <span class="font-medium text-sm">Yerlilik Oranı</span>
          <span class="text-green-600">%80</span>
        </div>
        <div class="flex justify-between items-center mb-2 pb-2 border-b">
          <span class="font-medium text-sm">Firma Sayısı</span>
          <span>1.500+</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="font-medium text-sm">Ar-Ge Harcaması</span>
          <span class="text-green-600">2.1 Milyar $</span>
        </div>
      </div>
    </div>
    
    <!-- Newsletter -->
    <div class="bg-white rounded-lg shadow-md">
      <div class="p-2 bg-secondary text-white text-xs font-bold uppercase tracking-wider rounded-t-lg">
        Savunma Bülteni
      </div>
      <div class="p-4">
        <p class="text-sm mb-3">Savunma sanayii haberlerini e-posta kutunuza alın</p>
        <form @submit.prevent="subscribeNewsletter">
          <input 
            type="email" 
            v-model="email"
            placeholder="E-posta adresiniz" 
            class="w-full mb-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
          <button 
            type="submit" 
            class="w-full bg-primary text-white py-2 rounded-md hover:bg-opacity-90 transition-colors"
          >
            Abone Ol
          </button>
        </form>
      </div>
    </div>
  </aside>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'RightSidebar',
  setup() {
    const email = ref('')
    const store = useStore()
    
    const popularNews = computed(() => store.state.popularNews.slice(0, 4))
    
    const subscribeNewsletter = () => {
      // This would be an API call in a real app
      alert(`${email.value} adresine savunma bülteni aboneliği başarıyla oluşturuldu!`)
      email.value = ''
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
    }
    
    return {
      email,
      popularNews,
      subscribeNewsletter,
      formatDate
    }
  }
}
</script> 