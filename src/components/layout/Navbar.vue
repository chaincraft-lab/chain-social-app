<template>
  <nav class="bg-dark text-light shadow-sm">
    <div class="container mx-auto">
      <!-- Top Bar -->
      <div class="flex items-center justify-between py-3 border-b border-dark-700">
        <!-- Logo -->
        <router-link to="/" class="flex items-center">
          <img src="@/assets/logo.png" alt="Logo" class="h-10" />
        </router-link>
        
        <!-- Search and Actions -->
        <div class="flex items-center space-x-4">
          <!-- Search -->
          <div class="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Haber ara..." 
              class="w-64 py-2 pl-10 pr-4 text-sm bg-dark-700 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 text-light placeholder-light/70"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-light/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <!-- Abone Ol Butonu -->
          <v-btn 
            @click="showSubscribeModal = true"
            color="secondary"
            variant="flat"
            rounded="pill"
            size="small"
            class="hidden md:flex text-none"
            prepend-icon="mdi-bell"
          >
            Abone Ol
          </v-btn>
          
          <!-- Mobile Menu Button -->
          <!-- <v-btn 
            @click="isMobileMenuOpen = !isMobileMenuOpen" 
            :icon="isMobileMenuOpen ? 'mdi-close' : 'mdi-menu'"
            variant="text"
            color="white"
            class="md:hidden"
          ></v-btn> -->
          
          <!-- Social Icons -->
          <div class="hidden md:flex items-center space-x-3">
            <a href="#" class="text-light/80 hover:text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" class="text-light/80 hover:text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" class="text-light/80 hover:text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <!-- Main Navigation -->
      <div class="relative">
        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center justify-between py-3">
          <ul class="flex items-center space-x-6">
            <li v-for="(menuItem, index) in menu" :key="index" class="relative group">
              <router-link 
                :to="menuItem.title === 'Savunma Ligleri' ? { name: 'defense-leagues' } : { name: 'category', params: { slug: slugify(menuItem.title) } }"
                class="text-light hover:text-secondary font-medium flex items-center"
                @click="toggleDropdown(index)"
              >
                {{ menuItem.title }}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </router-link>
              
              <!-- Dropdown Menu -->
              <div 
                v-show="activeDropdown === index" 
                class="absolute left-0 mt-2 w-56 bg-altmenu text-light shadow-lg rounded-md py-2 z-50"
              >
                <router-link 
                  v-for="(subtitle, subIndex) in menuItem.subtitles" 
                  :key="subIndex" 
                  :to="menuItem.title === 'Savunma Ligleri' ? 
                    { name: 'defense-leagues-category', params: { category: slugify(subtitle) } } : 
                    { name: 'category', params: { slug: slugify(subtitle) } }"
                  class="block px-4 py-2 text-sm text-light hover:bg-altmenu-700 hover:text-secondary"
                >
                  {{ subtitle }}
                </router-link>
              </div>
            </li>
          </ul>
          
          <div class="flex items-center">
            <span class="text-sm font-medium text-light/90">{{ currentDate }}</span>
          </div>
        </div>
        
        <!-- Mobile Navigation -->
        <div 
          v-show="isMobileMenuOpen" 
          class="md:hidden fixed inset-0 z-50 flex flex-col bg-dark mobile-menu-container"
        >
          <!-- Mobile Menu Header -->
          <div class="flex items-center justify-between px-4 py-3 border-b border-dark-700">
            <router-link to="/" class="flex items-center" @click="isMobileMenuOpen = false">
              <img src="@/assets/logo.png" alt="Logo" class="h-8" />
            </router-link>
            <button 
              @click="isMobileMenuOpen = false" 
              class="p-2 text-light focus:outline-none rounded-full hover:bg-dark-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Mobile Search -->
          <div class="relative px-4 py-3 border-b border-dark-700">
            <div class="flex items-center gap-2">
              <div class="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Haber ara..." 
                  class="w-full py-2 pl-10 pr-4 text-sm bg-dark-700 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 text-light placeholder-light/70"
                />
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-light/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <!-- Mobil Abone Ol Butonu -->
              <v-btn 
                @click="showSubscribeModal = true"
                color="secondary"
                variant="flat"
                rounded="pill"
                size="small"
                icon="mdi-bell"
                class="flex-shrink-0"
              ></v-btn>
            </div>
          </div>
          
          <!-- Mobile Menu Content -->
          <div class="flex-1 overflow-y-auto">
            <ul class="px-2 py-2 space-y-1">
              <li v-for="(menuItem, index) in menu" :key="index" class="rounded-lg overflow-hidden">
                <div class="bg-dark-800 rounded-lg mb-1">
                  <button 
                    @click="toggleMobileSubmenu(index)"
                    class="flex items-center justify-between w-full text-left text-light hover:text-secondary font-medium py-3 px-4 rounded-lg"
                    :class="{'bg-primary text-white': mobileActiveSubmenu === index}"
                  >
                    <div class="flex items-center">
                      <!-- <span class="mr-3 text-lg">
                        {{ menuItem.icon || getMenuIcon(menuItem.title) }}
                      </span> -->
                      <span>{{ menuItem.title }}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-200" :class="{'transform rotate-180': mobileActiveSubmenu === index}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div 
                    v-show="mobileActiveSubmenu === index" 
                    class="bg-dark-700 rounded-b-lg overflow-hidden transition-all duration-300 ease-in-out"
                    :style="{ maxHeight: mobileActiveSubmenu === index ? `${menuItem.subtitles.length * 40 + 16}px` : '0px' }"
                  >
                    <div class="grid grid-cols-2 gap-1 p-2">
                      <router-link 
                        v-for="(subtitle, subIndex) in menuItem.subtitles" 
                        :key="subIndex" 
                        :to="menuItem.title === 'Savunma Ligleri' ? 
                          { name: 'defense-leagues-category', params: { category: slugify(subtitle) } } : 
                          { name: 'category', params: { slug: slugify(subtitle) } }"
                        class="block text-sm text-light/90 hover:text-secondary py-2 px-3 rounded-md hover:bg-dark-600"
                        @click="isMobileMenuOpen = false"
                      >
                        {{ subtitle }}
                      </router-link>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          
          <!-- Mobile Footer -->
          <div class="px-4 py-3 border-t border-dark-700">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-medium text-light/90">{{ currentDate }}</span>
              <div class="flex items-center space-x-4">
                <a href="#" class="text-light/80 hover:text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" class="text-light/80 hover:text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" class="text-light/80 hover:text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <router-link to="/iletisim" class="bg-primary text-white py-2 px-4 rounded-lg text-center text-sm font-medium hover:bg-primary-dark transition-colors" @click="isMobileMenuOpen = false">
                İletişim
              </router-link>
              <button 
                @click="toggleLanguage" 
                class="bg-secondary text-white py-2 px-4 rounded-lg text-center text-sm font-medium hover:bg-secondary-dark transition-colors flex items-center justify-center"
              >
                <span class="mr-1">🌐</span>
                <span>{{ currentLanguage }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
  
  <!-- Abonelik Modal -->
  <v-dialog v-model="showSubscribeModal" max-width="500px">
    <v-card>
      <!-- Modal Header -->
      <v-card-title class="bg-secondary text-white">
        <span class="text-lg font-semibold">Savunma Bültenine Abone Ol</span>
        <v-spacer></v-spacer>
        <v-btn 
          @click="showSubscribeModal = false" 
          icon="mdi-close"
          variant="text"
          color="white"
          size="small"
        ></v-btn>
      </v-card-title>
      
      <!-- Modal Body -->
      <v-card-text class="pt-6">
        <p class="text-gray-700 mb-4">
          Savunma sanayii ile ilgili en güncel haberleri, analizleri ve etkinlikleri içeren haftalık bültenimize abone olun.
        </p>
        
        <v-form @submit.prevent="subscribeNewsletter">
          <v-text-field
            v-model="subscribeEmail"
            label="E-posta Adresiniz"
            placeholder="ornek@mail.com"
            type="email"
            variant="outlined"
            required
            class="mb-4"
          ></v-text-field>
          
          <v-checkbox
            v-model="subscribeConsent"
            required
            class="mb-4"
          >
            <template #label>
              <span class="text-sm text-gray-600">
                Kişisel verilerimin işlenmesine ve tarafıma elektronik ileti gönderilmesine izin veriyorum.
              </span>
            </template>
          </v-checkbox>
        </v-form>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn 
          @click="showSubscribeModal = false"
          variant="outlined"
          color="grey"
        >
          İptal
        </v-btn>
        <v-btn 
          @click="subscribeNewsletter"
          color="secondary"
          variant="flat"
        >
          Abone Ol
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SiteNavbar',
  data() {
    return {
      isMobileMenuOpen: false,
      currentDate: '',
      activeDropdown: null,
      mobileActiveSubmenu: null,
      currentLanguage: 'Türkçe',
      showSubscribeModal: false,
      subscribeEmail: '',
      subscribeConsent: false,
      menu: [
        { 
          title: "Haberler", 
          subtitles: [
            "Gündem", 
            "Uluslararası", 
            "Uzay", 
            "Siber"
          ] 
        },
        { 
          title: "Kara", 
          subtitles: [
            "Tank", 
            "Zırhlı Araçlar", 
            "Topçu Sistemleri", 
            "Füze Sistemleri", 
            "Hafif Silahlar", 
            "Kara Savunma Sistemleri"
          ] 
        },
        { 
          title: "Deniz", 
          subtitles: [
            "Fırkateyn", 
            "Denizaltı", 
            "Korvet", 
            "Amfibi Gemiler", 
            "Hücumbot", 
            "Deniz Savunma Sistemleri"
          ] 
        },
        { 
          title: "Hava", 
          subtitles: [
            "Savaş Uçakları", 
            "Helikopterler", 
            "İHA/SİHA", 
            "Nakliye Uçakları", 
            "Hava Savunma Sistemleri", 
            "Aviyonik Sistemler"
          ] 
        },
        { 
          title: "Teknoloji", 
          subtitles: [
            "Yeni Gelişmeler", 
            "Yapay Zeka", 
            "Elektronik Harp", 
            "İncelemeler"
          ] 
        },
        { 
          title: "Projeler", 
          subtitles: [
            "Milli Projeler", 
            "İhaleler", 
            "Firma Ortaklıkları", 
            "Ar-Ge Çalışmaları"
          ] 
        },
        { 
          title: "Analiz", 
          subtitles: [
            "Stratejik Yorum", 
            "Uzman Görüşü", 
            "Röportajlar", 
            "Sektör Analizi"
          ] 
        },
        { 
          title: "Galeri", 
          subtitles: [
            "Fotoğraf", 
            "Video", 
            "3D ve Animasyonlar"
          ] 
        },
        { 
          title: "Savunma Ligleri", 
          subtitles: [
            "Kara Güvenlik Ligi", 
            "Hava Güvenlik Ligi", 
            "Deniz Güvenlik Ligi", 
            "Siber Güvenlik Ligi",
            "Uzay Güvenlik Ligi"
          ] 
        },
        { 
          title: "Hakkımızda", 
          subtitles: [
            "Ekibimiz", 
            "İletişim", 
            "Reklam"
          ] 
        },
        { 
          title: "Dil Seçimi", 
          subtitles: [
            "Türkçe", 
            "English"
          ] 
        }
      ]
    }
  },
  computed: {
    ...mapState(['categories'])
  },
  mounted() {
    this.updateCurrentDate()
    
    // Update date every minute
    setInterval(this.updateCurrentDate, 60000)
    
    // Close mobile menu on route change
    this.$router.afterEach(() => {
      this.isMobileMenuOpen = false
    })
    
    // Close dropdown when clicking outside
    document.addEventListener('click', this.closeDropdownOnClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdownOnClickOutside)
  },
  methods: {
    updateCurrentDate() {
      const now = new Date()
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      this.currentDate = now.toLocaleDateString('tr-TR', options)
    },
    toggleDropdown(index) {
      if (this.activeDropdown === index) {
        this.activeDropdown = null
      } else {
        this.activeDropdown = index
      }
    },
    toggleMobileSubmenu(index) {
      if (this.mobileActiveSubmenu === index) {
        this.mobileActiveSubmenu = null
      } else {
        this.mobileActiveSubmenu = index
      }
    },
    closeDropdownOnClickOutside(event) {
      if (!event.target.closest('.group')) {
        this.activeDropdown = null
      }
    },
    toggleLanguage() {
      this.currentLanguage = this.currentLanguage === 'Türkçe' ? 'English' : 'Türkçe'
    },
    slugify(text) {
      return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    },
    subscribeNewsletter() {
      // Gerçek uygulamada burada API çağrısı yapılır
      alert(`${this.subscribeEmail} adresi savunma bültenine başarıyla abone oldu!`);
      this.subscribeEmail = '';
      this.subscribeConsent = false;
      this.showSubscribeModal = false;
    },

  }
}
</script>

<style>
.slide-in-up {
  animation: slideInUp 0.3s ease-out forwards;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobil menü animasyonları */
.md\:hidden {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.mobile-menu-container {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.bg-dark-800 {
  background-color: rgba(26, 32, 44, 0.8);
}

.bg-dark-700 {
  background-color: rgba(45, 55, 72, 0.8);
}

.bg-dark-600 {
  background-color: rgba(74, 85, 104, 0.8);
}

/* Alt menü animasyonu */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Mobil menü kaydırma stili */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: var(--color-primary) rgba(45, 55, 72, 0.5);
}

.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(45, 55, 72, 0.5);
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: var(--color-primary);
  border-radius: 10px;
}
</style> 