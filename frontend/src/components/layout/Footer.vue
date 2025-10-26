<template>
  <footer class="theme-bg-secondary theme-text-primary hidden md:block">
    <div class="container mx-auto">
      <!-- Main Footer -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
        <!-- About -->
        <div>
          <h3 class="text-xl font-semibold mb-4 theme-text-primary">{{ $t('footer.sections.about') }}</h3>
          <p class="text-light-200 mb-4">
            {{ $t('footer.aboutDescription') }}
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
          <h3 class="text-xl font-semibold mb-4 theme-text-primary">{{ $t('footer.sections.categories') }}</h3>
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
          <h3 class="text-xl font-semibold mb-4 theme-text-primary">{{ $t('footer.sections.quickLinks') }}</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/" class="text-light-200 hover:text-primary transition-colors">
                {{ $t('footer.links.home') }}
              </router-link>
            </li>
            <li>
              <a href="#" class="text-light-200 hover:text-primary transition-colors">
                {{ $t('footer.links.about') }}
              </a>
            </li>
            <li>
              <a href="#" class="text-light-200 hover:text-primary transition-colors">
                {{ $t('footer.links.contact') }}
              </a>
            </li>
            <li>
              <a href="#" class="text-light-200 hover:text-primary transition-colors">
                {{ $t('footer.links.imprint') }}
              </a>
            </li>
            <li>
              <a href="#" class="text-light-200 hover:text-primary transition-colors">
                {{ $t('footer.links.privacy') }}
              </a>
            </li>
            <li>
              <a href="#" class="text-light-200 hover:text-primary transition-colors">
                {{ $t('footer.links.terms') }}
              </a>
            </li>
          </ul>
        </div>
        
        <!-- Newsletter -->
        <div>
          <h3 class="text-xl font-semibold mb-4 theme-text-primary">{{ $t('footer.sections.newsletter') }}</h3>
          <p class="text-light-200 mb-4">
            {{ $t('footer.newsletter.description') }}
          </p>
          <form @submit.prevent="subscribeNewsletter" class="mt-4">
            <div class="flex">
              <input 
                type="email" 
                v-model="email" 
:placeholder="$t('footer.newsletter.emailPlaceholder')" 
                class="w-full px-4 py-2 theme-input rounded-l-md focus:outline-none"
                required
              />
              <button 
                type="submit" 
                class="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-r-md focus:outline-none"
              >
                {{ $t('footer.newsletter.subscribe') }}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Bottom Footer -->
      <div class="py-4 border-t theme-border-primary text-center theme-text-muted text-sm">
        <p>{{ $t('footer.copyright', { year: new Date().getFullYear(), appName: $config.name }) }}</p>
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
      alert(this.$t('footer.newsletter.successMessage', { email: this.email }))
      this.email = ''
    }
  }
}
</script> 