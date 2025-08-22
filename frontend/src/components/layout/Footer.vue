<template>
  <footer class="theme-bg-tertiary theme-text-primary">
    <div class="container mx-auto">
      <!-- Main Footer -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
        <!-- About -->
        <div>
          <h3 class="text-xl font-semibold mb-4 theme-text-primary">Hakkımızda</h3>
          <p class="text-light-200 mb-4">
            En güncel haberleri, en hızlı şekilde size ulaştırmak için çalışıyoruz. Tarafsız ve güvenilir habercilik anlayışımızla her zaman yanınızdayız.
          </p>
          <div class="flex space-x-3 mt-4">
            <a href="#" class="text-light-200 hover:text-primary transition-colors">
              <Icon icon="mdi:twitter" class="w-5 h-5" />
            </a>
            <a href="#" class="text-light-200 hover:text-primary transition-colors">
              <Icon icon="mdi:instagram" class="w-5 h-5" />
            </a>
            <a href="#" class="text-light-200 hover:text-primary transition-colors">
              <Icon icon="mdi:facebook" class="w-5 h-5" />
            </a>
            <a href="#" class="text-light-200 hover:text-primary transition-colors">
              <Icon icon="mdi:youtube" class="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <!-- Categories -->
        <div>
          <h3 class="text-xl font-semibold mb-4 theme-text-primary">Kategoriler</h3>
          <ul class="space-y-2">
            <li v-for="category in (categories || []).slice(0, 6)" :key="category?.id || Math.random()">
              <router-link 
                :to="{ name: 'category', params: { slug: category.slug } }"
                class="text-light-200 hover:text-primary transition-colors"
              >
                {{ category.name }}
              </router-link>
            </li>
          </ul>
        </div>
        
        <!-- Quick Links -->
        <div>
          <h3 class="text-xl font-semibold mb-4 theme-text-primary">Hızlı Linkler</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/" class="text-light-200 hover:text-primary transition-colors">
                Ana Sayfa
              </router-link>
            </li>
            <li>
              <a href="#" class="text-light-200 hover:text-primary transition-colors">
                Hakkımızda
              </a>
            </li>
            <li>
              <a href="#" class="text-light-200 hover:text-primary transition-colors">
                İletişim
              </a>
            </li>
            <li>
              <a href="#" class="text-light-200 hover:text-primary transition-colors">
                Künye
              </a>
            </li>
            <li>
              <a href="#" class="text-light-200 hover:text-primary transition-colors">
                Gizlilik Politikası
              </a>
            </li>
            <li>
              <a href="#" class="text-light-200 hover:text-primary transition-colors">
                Kullanım Şartları
              </a>
            </li>
          </ul>
        </div>
        
        <!-- Newsletter -->
        <div>
          <h3 class="text-xl font-semibold mb-4 theme-text-primary">Bülten</h3>
          <p class="text-light-200 mb-4">
            En son haberlerden haberdar olmak için bültenimize abone olun.
          </p>
          <form @submit.prevent="subscribeNewsletter" class="mt-4">
            <div class="flex">
              <input 
                type="email" 
                v-model="email" 
                placeholder="E-posta adresiniz" 
                class="w-full px-4 py-2 theme-input rounded-l-md focus:outline-none"
                required
              />
              <button 
                type="submit" 
                class="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-r-md focus:outline-none"
              >
                Abone Ol
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Bottom Footer -->
      <div class="py-4 border-t theme-border-primary text-center theme-text-muted text-sm">
        <p>© {{ new Date().getFullYear() }} Haber Sitesi. Tüm hakları saklıdır.</p>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SiteFooter',
  data() {
    return {
      email: ''
    }
  },
  computed: {
    ...mapState('categories', ['categories'])
  },
  methods: {
    subscribeNewsletter() {
      // Burada e-posta aboneliği işlemi yapılacak
      alert(`${this.email} adresi bültene kaydedildi!`)
      this.email = ''
    }
  }
}
</script> 